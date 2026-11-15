"""
The department engine as a scroll film. Builds the scene once, then renders
every frame of the story (or the blueprint stretch of it) and writes the
anchor points the page needs for labels and the process ring.

Run: Blender -b -P film.py -- <desktop|mobile> <solid|blue> <outdir> [frames] [samples]
"""
import bpy, bmesh, math, os, sys, json
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
argv = sys.argv[sys.argv.index("--") + 1:]
VARIANT, MODE, OUTDIR = argv[0], argv[1], argv[2]
FRAMES = int(argv[3]) if len(argv) > 3 else 160
SAMPLES = int(argv[4]) if len(argv) > 4 else 64
RES = (1600, 900) if VARIANT == "desktop" else (720, 900)
os.makedirs(OUTDIR, exist_ok=True)
S = dict(spin=0, green=[0] * 6, out=0, lift=0)
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "CYCLES"
prefs = bpy.context.preferences.addons["cycles"].preferences
try:
    prefs.compute_device_type = "METAL"; prefs.get_devices()
    for d in prefs.devices: d.use = True
    scene.cycles.device = "GPU"
except Exception as e:
    print("GPU setup failed:", e)
scene.cycles.samples = SAMPLES; scene.cycles.use_denoising = True
scene.render.resolution_x, scene.render.resolution_y = RES
try:
    scene.view_settings.view_transform = "AgX"; scene.view_settings.look = "AgX - Medium High Contrast"
except Exception:
    pass

# World: studio light for reflections, black to the camera and in reflections
world = bpy.data.worlds.new("W"); scene.world = world; world.use_nodes = True
wn, wl = world.node_tree.nodes, world.node_tree.links; wn.clear()
env = wn.new("ShaderNodeTexEnvironment"); env.image = bpy.data.images.load(os.path.join(HERE, "studio.hdr"))
bgL = wn.new("ShaderNodeBackground"); bgL.inputs[1].default_value = 0.3
bgD = wn.new("ShaderNodeBackground"); bgD.inputs[0].default_value = (0.004, 0.005, 0.007, 1)
lp = wn.new("ShaderNodeLightPath"); mx = wn.new("ShaderNodeMath"); mx.operation = "MAXIMUM"
mix = wn.new("ShaderNodeMixShader"); out = wn.new("ShaderNodeOutputWorld")
wl.new(env.outputs[0], bgL.inputs[0]); wl.new(lp.outputs["Is Camera Ray"], mx.inputs[0]); wl.new(lp.outputs["Is Glossy Ray"], mx.inputs[1])
wl.new(mx.outputs[0], mix.inputs[0]); wl.new(bgL.outputs[0], mix.inputs[1]); wl.new(bgD.outputs[0], mix.inputs[2]); wl.new(mix.outputs[0], out.inputs[0])

def hexc(h):
    h = h.lstrip("#"); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c)

def mat(name, color, metal=0.0, rough=0.5, emit=None, strength=0.0, alpha=1.0, transmission=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*hexc(color), 1); b.inputs["Metallic"].default_value = metal; b.inputs["Roughness"].default_value = rough
    if transmission: b.inputs["Transmission Weight"].default_value = transmission
    if emit: b.inputs["Emission Color"].default_value = (*hexc(emit), 1); b.inputs["Emission Strength"].default_value = strength
    if alpha < 1: b.inputs["Alpha"].default_value = alpha
    return m

M = dict(
    body=mat("Body", "#2a3038", 0.85, 0.32), cap=mat("Cap", "#171b21", 0.25, 0.5), band=mat("Band", "#0c0e11", emit="#5d6874", strength=1.2), dark=mat("Dark", "#14181d", 0.6, 0.42), alu=mat("Alu", "#8a939d", 1.0, 0.24),
    clay=mat("Clay", "#c9ced4", 0, 0.55), floor=mat("Floor", "#07080a", 0.1, 0.62),
    dbring=mat("DbRing", "#0c0e11", emit="#8fb8ff", strength=3), text=mat("Text", "#e9ece8", emit="#e9ece8", strength=1.4),
    aiglass=mat("AIGlass", "#1e8a4c", 0.1, 0.18, emit="#2fd06a", strength=2.0, transmission=0.6),
    aicore=mat("AICore", "#0b2a18", emit="#7dffb0", strength=12), green=mat("Green", "#0c0e11", emit="#2fd06a", strength=6),
    amber=mat("Amber", "#0c0e11", emit="#e0a24a", strength=8), amberbody=mat("AmberBody", "#2a2116", 0.4, 0.4),
    hub=mat("Hub", "#1e252c", 0.9, 0.3), slot=mat("Slot", "#0c0e11", emit="#2fd06a", strength=2.5),
)
def trim_mat(g):
    w, gr = hexc("#d7e2ee"), hexc("#2fd06a")
    c = tuple(w[k] * (1 - g) + gr[k] * g for k in range(3))
    m = bpy.data.materials.new("Trim"); m.use_nodes = True; b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (0.01, 0.01, 0.01, 1); b.inputs["Emission Color"].default_value = (*c, 1)
    b.inputs["Emission Strength"].default_value = 2.0 + 4.0 * g
    return m
def screen_mat(i):
    m = bpy.data.materials.new(f"Screen{i}"); m.use_nodes = True; nt = m.node_tree; b = nt.nodes["Principled BSDF"]
    t = nt.nodes.new("ShaderNodeTexImage"); t.image = bpy.data.images.load(os.path.join(HERE, f"screen{i % 4}.png"), check_existing=True)
    nt.links.new(t.outputs[0], b.inputs["Base Color"]); nt.links.new(t.outputs[0], b.inputs["Emission Color"]); b.inputs["Emission Strength"].default_value = 2.4
    return m

def link(ob, parent=None):
    scene.collection.objects.link(ob)
    if parent: ob.parent = parent
    return ob
def empty(name, loc=(0, 0, 0), parent=None, rot=(0, 0, 0)):
    e = bpy.data.objects.new(name, None); link(e, parent); e.location = loc; e.rotation_euler = rot; return e
def finish(ob, m, bevel=0.0, segs=3):
    ob.data.materials.append(m)
    if bevel:
        mod = ob.modifiers.new("B", "BEVEL"); mod.width = bevel; mod.segments = segs; mod.limit_method = "ANGLE"; mod.harden_normals = True
    for p in ob.data.polygons: p.use_smooth = True
    return ob
def box(name, size, loc, m, bevel=0.02, parent=None, rot=(0, 0, 0)):
    me = bpy.data.meshes.new(name); bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts: v.co = Vector((v.co.x * size[0], v.co.y * size[1], v.co.z * size[2]))
    bm.to_mesh(me); bm.free(); ob = bpy.data.objects.new(name, me); link(ob, parent); ob.location = loc; ob.rotation_euler = rot
    return finish(ob, m, bevel)
def cyl(name, r, h, loc, m, parent=None, verts=48, bevel=0.01, r2=None, rot=(0, 0, 0)):
    me = bpy.data.meshes.new(name); bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=verts, radius1=r, radius2=r if r2 is None else r2, depth=h)
    bm.to_mesh(me); bm.free(); ob = bpy.data.objects.new(name, me); link(ob, parent); ob.location = loc; ob.rotation_euler = rot
    return finish(ob, m, bevel)
def torus(name, R, r, loc, m, parent=None, rot=(0, 0, 0), major=128, minor=12):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, major_segments=major, minor_segments=minor)
    ob = bpy.context.active_object; ob.name = name
    if parent: ob.parent = parent
    ob.location = loc; ob.rotation_euler = rot; ob.data.materials.append(m); bpy.ops.object.shade_smooth(); return ob
def sphere(name, r, loc, m, parent=None):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, segments=24, ring_count=12)
    ob = bpy.context.active_object; ob.name = name
    if parent: ob.parent = parent
    ob.location = loc; ob.data.materials.append(m); bpy.ops.object.shade_smooth(); return ob
def sector(name, r1, r2, a0, a1, h, loc_z, m, parent=None, bevel=0.03, steps=40):
    """An annular slice of a ring, from angle a0 to a1, between radii r1 and r2."""
    me = bpy.data.meshes.new(name); bm = bmesh.new()
    inner = [bm.verts.new((r1 * math.cos(a0 + (a1 - a0) * i / steps), r1 * math.sin(a0 + (a1 - a0) * i / steps), 0)) for i in range(steps + 1)]
    outer = [bm.verts.new((r2 * math.cos(a0 + (a1 - a0) * i / steps), r2 * math.sin(a0 + (a1 - a0) * i / steps), 0)) for i in range(steps + 1)]
    face = bm.faces.new(outer + inner[::-1])
    ext = bmesh.ops.extrude_face_region(bm, geom=[face])
    for v in [e for e in ext["geom"] if isinstance(e, bmesh.types.BMVert)]: v.co.z += h
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me); link(ob, parent); ob.location = (0, 0, loc_z)
    return finish(ob, m, bevel)
def text(name, body, size, loc, m, parent=None, rot=(0, 0, 0)):
    cu = bpy.data.curves.new(name, "FONT"); cu.body = body; cu.size = size; cu.extrude = 0.006; cu.align_x = "CENTER"; cu.align_y = "CENTER"
    cu.font = bpy.data.fonts.load(os.path.join(HERE, "InterTight.ttf"), check_existing=True)
    ob = bpy.data.objects.new(name, cu); link(ob, parent); ob.location = loc; ob.rotation_euler = rot; cu.materials.append(m); return ob


def clamp01(v): return max(0.0, min(1.0, v))
def ease(t): return 4 * t * t * t if t < 0.5 else 1 - (-2 * t + 2) ** 3 / 2
def seg(t, a, b): return ease(clamp01((t - a) / (b - a)))
def lerp(a, b, u): return a + (b - a) * u

# ---------------------------------------------------------------- build once
R1, R2 = 1.3, 3.2
TEAMS = ["Operations", "Finance", "Customer support", "Sales", "Marketing", "People and HR"]
GAP = math.radians(2.2)
LAYERS = [("base", 0.22), ("data", 0.42), ("tools", 0.5), ("people", 0.4), ("cap", 0.12)]
REST = []
z = 0.0
for layer, h in LAYERS:
    REST.append(z); z += h + (0.06 if layer in ("data", "tools") else 0.0)
TOP = z

engine = empty("Engine")
floor = box("floor", (400, 400, 0.02), (0, 0, -0.01), M["floor"], bevel=0)
floor_rings = [torus("fr", r, 0.006, (0, 0, 0.002), mat("FR", "#07080a", emit="#2a3440", strength=1.0)) for r in (4.6, 6.4, 8.8)]
groups = {}   # (team, layer) -> empty
texts = []
trims = []
for i, team in enumerate(TEAMS):
    a0 = math.radians(i * 60) + GAP; a1 = math.radians((i + 1) * 60) - GAP; am = (a0 + a1) / 2
    segm = empty(team, (0, 0, 0), engine)
    tm = trim_mat(0); trims.append(tm)
    for k, (layer, h) in enumerate(LAYERS):
        grp = empty(f"{team}_{layer}", (0, 0, REST[k]), segm); groups[(i, k)] = grp
        if layer == "base":
            sector("plate", R1, R2, a0, a1, h, 0, M["body"], grp)
            sector("trim", R2 - 0.02, R2 + 0.012, a0 + 0.02, a1 - 0.02, 0.02, h * 0.55, tm, grp, bevel=0)
        elif layer == "data":
            sector("slab", R1 + 0.08, R2 - 0.08, a0 + 0.01, a1 - 0.01, 0.16, 0, M["dark"], grp)
            for t in (0.3, 0.5, 0.7):
                ang = a0 + (a1 - a0) * t; p = Vector((math.cos(ang), math.sin(ang), 0)) * ((R1 + R2) / 2)
                cyl("drum", 0.2, 0.16, (p.x, p.y, 0.24), M["alu"], grp)
                torus("ring", 0.202, 0.007, (p.x, p.y, 0.28), M["dbring"], grp, minor=8)
        elif layer == "tools":
            sector("slab", R1 + 0.08, R2 - 0.08, a0 + 0.01, a1 - 0.01, 0.05, 0, M["body"], grp)
            for n, t in enumerate((0.28, 0.5, 0.72)):
                ang = a0 + (a1 - a0) * t; p = Vector((math.cos(ang), math.sin(ang), 0)) * ((R1 + R2) / 2 + 0.25)
                s = box("screen", (0.5, 0.035, 0.3), (p.x, p.y, 0.24), M["dark"], 0.015, grp, rot=(math.radians(-10), 0, ang - math.pi / 2))
                bpy.ops.mesh.primitive_plane_add(size=1); f = bpy.context.active_object; f.parent = s; f.location = (0, -0.019, 0); f.rotation_euler = (math.radians(90), 0, 0); f.scale = (0.45, 0.25, 1)
                f.data.materials.append(screen_mat(n + i))
        elif layer == "people":
            sector("slab", R1 + 0.08, R2 - 0.08, a0 + 0.01, a1 - 0.01, 0.05, 0, M["body"], grp)
            for n in range(6):
                t = 0.2 + 0.6 * ((n % 3) / 2); rr = (R1 + R2) / 2 + (0.35 if n > 2 else -0.3)
                ang = a0 + (a1 - a0) * t; p = Vector((math.cos(ang), math.sin(ang), 0)) * rr
                box("body", (0.12, 0.1, 0.16), (p.x, p.y, 0.14), M["clay"], 0.045, grp)
                sphere("head", 0.055, (p.x, p.y, 0.28), M["clay"], grp)
        elif layer == "cap":
            sector("cap", R1, R2, a0, a1, h, 0, M["cap"], grp)
            sector("rimo", R2 - 0.07, R2 - 0.045, a0 + 0.02, a1 - 0.02, 0.01, h, tm, grp, bevel=0)
            sector("rimi", R1 + 0.045, R1 + 0.07, a0 + 0.03, a1 - 0.03, 0.01, h, tm, grp, bevel=0)
            p = Vector((math.cos(am), math.sin(am), 0)) * ((R1 + R2) / 2)
            texts.append(text("name", team, 0.19 if len(team) > 12 else 0.24, (p.x, p.y, h + 0.02), M["text"], grp))
        if layer in ("data", "tools", "people"):
            sector("band", R2 - 0.1, R2 - 0.07, a0 + 0.02, a1 - 0.02, 0.012, 0.02, tm, grp, bevel=0)

dashes = empty("Dashes")
for k in range(36):
    if k % 2: continue
    a = k / 36 * 2 * math.pi
    box("dash", (0.16, 0.025, 0.02), (math.cos(a) * 1.15, math.sin(a) * 1.15, 0.02), M["slot"], bevel=0, parent=dashes, rot=(0, 0, a + math.pi / 2))

core = empty("Core")
cyl("base", 1.1, 0.22, (0, 0, 0.11), M["hub"], core, verts=96, bevel=0.03)
torus("rim", 1.11, 0.02, (0, 0, 0.225), M["green"], core)
column = empty("ColumnPivot", (0, 0, 0.22), core)
cyl("column", 0.55, 1.5, (0, 0, 0.75), M["aiglass"], column, verts=96, bevel=0.03)
cyl("corel", 0.12, 1.5, (0, 0, 0.75), M["aicore"], column, verts=24, bevel=0)
for k, (r, zz) in enumerate([(0.78, 0.4), (0.95, 0.85), (0.7, 1.3)]):
    torus("ring", r, 0.025, (0, 0, zz), M["green"], column)
glow = bpy.data.lights.new("CoreGlow", "POINT"); glow.color = (0.3, 1.0, 0.55); glow.shadow_soft_size = 0.5
glow_ob = link(bpy.data.objects.new("CoreGlow", glow)); glow_ob.location = (0, 0, 1.0)

def area(name, loc, rot, size, energy, color):
    l = bpy.data.lights.new(name, "AREA"); l.size = size; l.energy = energy; l.color = color
    ob = link(bpy.data.objects.new(name, l)); ob.location = loc; ob.rotation_euler = rot; return ob
area("Key", (-7, -8, 9), (math.radians(48), 0, math.radians(-40)), 7, 2600, (1, 0.93, 0.85))
area("Rim", (7, 9, 5), (math.radians(-60), 0, math.radians(150)), 6, 1600, (0.62, 0.78, 1.0))
area("Top", (0, 0, 11), (0, 0, 0), 9, 220, (1, 1, 1))

cd = bpy.data.cameras.new("Cam"); cd.lens = 38 if VARIANT == "desktop" else 36
cd.sensor_fit = "HORIZONTAL" if VARIANT == "desktop" else "VERTICAL"
cd.dof.use_dof = MODE == "solid"; cd.dof.aperture_fstop = 4.0
cam = link(bpy.data.objects.new("Cam", cd)); scene.camera = cam
tgt = empty("T"); con = cam.constraints.new("TRACK_TO"); con.target = tgt; con.track_axis = "TRACK_NEGATIVE_Z"; con.up_axis = "UP_Y"
cd.dof.focus_object = tgt

if MODE == "blue":
    from bp import apply_blueprint
    floor.hide_render = True
    for r in floor_rings: r.hide_render = True
    apply_blueprint(scene, thickness=1.1 if VARIANT == "desktop" else 0.9)

# ---------------------------------------------------------------- the story as a function of t
# t 0..0.14 hero, ..0.38 lift apart, ..0.63 hold (blueprint on the page), ..0.84 core rises and it closes, ..1 crane to top-down
D = 1.0 if VARIANT == "desktop" else 1.0
CAM = [
    (0.00, (0, -12.8, 6.4), (0, 0, 0.7)),
    (0.14, (0, -13.4, 6.8), (0, 0, 0.9)),
    (0.38, (0, -19.5, 7.6), (0, 0, 2.7)),
    (0.63, (0, -19.5, 7.6), (0, 0, 2.7)),
    (0.84, (0, -14.4, 7.6), (0, 0, 1.2)),
    (1.00, (0, -0.02, 18.5), (0, 0, 0.0)),
]
def cam_at(t):
    k = 0
    while k < len(CAM) - 2 and t > CAM[k + 1][0]: k += 1
    (ta, pa, ga), (tb, pb, gb) = CAM[k], CAM[k + 1]
    u = ease(clamp01((t - ta) / (tb - ta)))
    pos = Vector([lerp(pa[j], pb[j], u) for j in range(3)]); tg = Vector([lerp(ga[j], gb[j], u) for j in range(3)])
    return tg + (pos - tg) * D, tg

def pose(t):
    spin = 8 + 46 * t
    engine.rotation_euler = (0, 0, math.radians(spin))
    for tx in texts: tx.rotation_euler = (0, 0, -math.radians(spin))
    lift = 2.7 * seg(t, 0.14, 0.38) * (1 - seg(t, 0.66, 0.84))
    for (i, k), g in groups.items():
        g.location.z = REST[k] + lift * k * 0.34
    c = seg(t, 0.63, 0.8)
    core.hide_render = c < 0.01
    for o in core.children_recursive: o.hide_render = c < 0.01
    core.scale = (max(c, 0.001), max(c, 0.001), 1)
    column.scale = (1, 1, max(c, 0.001))
    glow.energy = 700 * c
    slot = seg(t, 0.2, 0.28) * (1 - seg(t, 0.6, 0.66))
    dashes.hide_render = slot < 0.5
    for o in dashes.children: o.hide_render = slot < 0.5
    greens = []
    for i, tm in enumerate(trims):
        g = seg(t, 0.74, 0.84) if TEAMS[i] == "Sales" else seg(t, 0.88 + i * 0.015, 0.95 + i * 0.015)
        greens.append(g)
        b = tm.node_tree.nodes["Principled BSDF"]
        w, gr = hexc("#d7e2ee"), hexc("#2fd06a")
        b.inputs["Emission Color"].default_value = (*[w[j] * (1 - g) + gr[j] * g for j in range(3)], 1)
        b.inputs["Emission Strength"].default_value = 2.0 + 4.0 * g
    pos, tg = cam_at(t)
    cam.location = pos; tgt.location = tg
    return dict(lift=lift, core=c, greens=greens, spin=spin)

from bpy_extras.object_utils import world_to_camera_view
def px(v):
    q = world_to_camera_view(scene, cam, Vector(v)); return [round(q.x * RES[0], 1), round((1 - q.y) * RES[1], 1)]

# The blueprint is only shown for the middle of the story
indices = list(range(FRAMES))
if MODE == "blue":
    indices = [i for i in indices if 0.36 <= i / (FRAMES - 1) <= 0.66]
anchors = {}
scene.cycles.samples = SAMPLES if MODE == "solid" else 12
for i in indices:
    t = i / (FRAMES - 1)
    st = pose(t)
    bpy.context.view_layer.update()
    scene.render.filepath = os.path.join(OUTDIR, f"{i:04d}.png")
    scene.render.image_settings.file_format = "PNG"
    bpy.ops.render.render(write_still=True)
    lift = st["lift"]
    layer_z = [REST[k] + lift * k * 0.34 + LAYERS[k][1] * 0.6 for k in range(len(LAYERS))]
    centre = px((0, 0, REST[-1] + lift * 4 * 0.34 + 0.12))
    anchors[i] = dict(
        layers=[px((R2 * 0.98, -0.5, zz)) for zz in layer_z],
        hollow=px((0, 0, 0.12)),
        core=px((0, 0, 1.9 * st["core"] + 0.2)),
        centre=centre,
        rim=round(abs(px((R2 + 0.12, 0, REST[-1] + 0.12))[0] - px((0, 0, REST[-1] + 0.12))[0]), 1),
    )
    print("FRAME", i, flush=True)
if MODE == "solid":
    json.dump(dict(frames=FRAMES, res=RES, anchors=anchors), open(os.path.join(OUTDIR, "anchors.json"), "w"))
print("DONE")
