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
RES = (1600, 900) if VARIANT == "desktop" else (960, 1200)
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
def text(name, body, size, loc, m, parent=None, rot=(0, 0, 0), font="InterTight.ttf"):
    cu = bpy.data.curves.new(name, "FONT"); cu.body = body; cu.size = size; cu.extrude = 0.006; cu.align_x = "CENTER"; cu.align_y = "CENTER"
    cu.space_line = 0.9
    cu.font = bpy.data.fonts.load(os.path.join(HERE, font), check_existing=True)
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
label_mats = []
LABELS = os.environ.get("LABELS", "iconring")
TEAM_TINT = {"Sales": "#6aa9ff", "Finance": "#c3a6ff", "Customer support": "#ff9f80", "Operations": "#7fe3e0", "Marketing": "#ff86bd", "People and HR": "#e9d27a"}

def ring_label(team, am, m, rad=3.97, size=0.3):
    """Set a name flat on the floor along a circle, so it follows the dial's curve."""
    fnt = bpy.data.fonts.load(os.path.join(HERE, "latin-700-normal.ttf"), check_existing=True)
    letters = []
    for ch in team:
        cu = bpy.data.curves.new("rc", "FONT"); cu.body = ch if ch != " " else "i"; cu.size = size; cu.extrude = 0.003; cu.font = fnt
        cu.align_x = "CENTER"; cu.align_y = "CENTER"
        ob = bpy.data.objects.new("rc", cu); link(ob, engine); cu.materials.append(m)
        bpy.context.view_layer.update()
        letters.append((ob, max(ob.dimensions.x, size * 0.3) + size * 0.025, ch == " "))
    total = sum(w for _, w, _ in letters)
    ang = am - (total / rad) / 2
    for ob, w, space in letters:
        mid = ang + (w / 2) / rad
        ob.location = (math.cos(mid) * rad, math.sin(mid) * rad, 0.012)
        ob.rotation_euler = (0, 0, mid + math.pi / 2)
        if space: ob.hide_render = True
        ang += w / rad

def wall_label(team, a0, a1, parent, m):
    """Lay a name letter by letter round the outer face of a wedge's base."""
    fnt = bpy.data.fonts.load(os.path.join(HERE, "latin-700-normal.ttf"), check_existing=True)
    size, rad, zc = 0.21, R2 + 0.012, -0.17
    letters = []
    for ch in team:
        cu = bpy.data.curves.new("ch", "FONT"); cu.body = ch if ch != " " else "i"; cu.size = size; cu.extrude = 0.004; cu.font = fnt
        cu.align_x = "CENTER"; cu.align_y = "CENTER"
        ob = bpy.data.objects.new("ch", cu); link(ob, parent); cu.materials.append(m)
        bpy.context.view_layer.update()
        letters.append((ob, max(ob.dimensions.x, size * 0.28) + size * 0.06, ch == " "))
    total = sum(w for _, w, _ in letters)
    am = (a0 + a1) / 2
    ang = am - (total / rad) / 2
    for ob, w, space in letters:
        mid = ang + (w / 2) / rad
        ob.location = (math.cos(mid) * rad, math.sin(mid) * rad, zc)
        ob.rotation_euler = (math.radians(90), 0, mid + math.pi / 2)
        if space: ob.hide_render = True
        ang += w / rad

def icon_sales(p, m):
    for k, hh in enumerate((0.1, 0.17, 0.26)):
        box("bar", (0.07, 0.07, hh), (-0.1 + k * 0.1, 0, hh / 2), m, bevel=0.01, parent=p)
def icon_finance(p, m):
    box("slip", (0.22, 0.3, 0.025), (0, 0, 0.02), m, bevel=0.008, parent=p)
    for k in range(3): box("line", (0.14 - (k % 2) * 0.04, 0.02, 0.012), (0, 0.08 - k * 0.07, 0.04), M["dark"], bevel=0, parent=p)
def icon_support(p, m):
    torus("band", 0.12, 0.016, (0, 0, 0.12), m, parent=p, rot=(math.radians(90), 0, 0), minor=8)
    for sx in (-1, 1): cyl("cup", 0.05, 0.05, (sx * 0.12, 0, 0.1), m, parent=p, rot=(0, math.radians(90), 0), bevel=0.008)
def icon_ops(p, m):
    box("parcel", (0.22, 0.22, 0.2), (0, 0, 0.1), m, bevel=0.015, parent=p)
    box("tape", (0.225, 0.05, 0.205), (0, 0, 0.1), M["dark"], bevel=0, parent=p)
def icon_marketing(p, m):
    cyl("horn", 0.11, 0.24, (0, 0, 0.11), m, parent=p, rot=(0, math.radians(90), 0), r2=0.035, bevel=0.005)
def icon_people(p, m):
    box("badge", (0.2, 0.26, 0.025), (0, 0, 0.02), m, bevel=0.01, parent=p)
    cyl("head", 0.045, 0.012, (0, 0.04, 0.04), M["dark"], parent=p, bevel=0)
    box("name", (0.12, 0.025, 0.012), (0, -0.06, 0.04), M["dark"], bevel=0, parent=p)
ICONS = {"Operations": icon_ops, "Finance": icon_finance, "Customer support": icon_support, "Sales": icon_sales, "Marketing": icon_marketing, "People and HR": icon_people}
trims = []
for i, team in enumerate(TEAMS):
    a0 = math.radians(i * 60) + GAP; a1 = math.radians((i + 1) * 60) - GAP; am = (a0 + a1) / 2
    segm = empty(team, (0, 0, 0), engine)
    tm = trim_mat(0); trims.append(tm)
    for k, (layer, h) in enumerate(LAYERS):
        grp = empty(f"{team}_{layer}", (0, 0, REST[k]), segm); groups[(i, k)] = grp
        if layer == "base": grp_base = grp
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
            lm = mat(f"Label{i}", "#f2f4f1", emit="#f2f4f1", strength=1.2); label_mats.append(lm)
            if LABELS == "colour":
                tint = TEAM_TINT[team]
                lm.node_tree.nodes["Principled BSDF"].inputs["Emission Color"].default_value = (*hexc(tint), 1)
                tmb = tm.node_tree.nodes["Principled BSDF"]; tmb.inputs["Emission Color"].default_value = (*hexc(tint), 1)
            name = {"Customer support": "Customer\nsupport", "People and HR": "People\nand HR"}.get(team, team)
            if LABELS in ("top", "colour"):
                # One bold name per wedge, upright when the wedge faces the viewer, with a small icon inside it
                p = Vector((math.cos(am), math.sin(am), 0)) * 2.55
                texts.append(text("name", name, 0.27 if "\n" in name else 0.33, (p.x, p.y, h + 0.012), lm, grp, rot=(0, 0, am + math.pi / 2), font="latin-700-normal.ttf"))
            icon_r, icon_s = (2.25, 2.3) if LABELS in ("icons", "iconring") else (1.72, 1.0)
            ic = empty(f"{team}_icon", (math.cos(am) * icon_r, math.sin(am) * icon_r, h), grp); ic.rotation_euler = (0, 0, am + math.pi / 2)
            ic.scale = (icon_s, icon_s, icon_s)
            ICONS[team](ic, lm)
            if LABELS == "wall":
                # A band hangs from the outer edge of the top plate, and the name runs round it like lettering on a lens barrel
                sector("band", R2 - 0.05, R2, a0, a1, 0.34, -0.34, M["cap"], grp, bevel=0.01)
                wall_label(team, a0, a1, grp, lm)
            if LABELS == "iconring":
                # Names set along the curve of a dial ring on the floor, letter by letter, centred on each wedge
                ring_label(team, am, lm)
                if i == 0:
                    torus("dial", 3.62, 0.008, (0, 0, 0.004), M["band"], engine)
                    torus("dial2", 4.32, 0.006, (0, 0, 0.004), M["band"], engine)
                for edge in (a0 - GAP, a1 + GAP):
                    box("tick", (0.5, 0.02, 0.01), (math.cos(edge) * 3.97, math.sin(edge) * 3.97, 0.006), M["band"], bevel=0, parent=engine, rot=(0, 0, edge))
            if LABELS == "ring":
                # A fine dial ring on the floor just outside the engine, with each name lined up with its wedge
                fp = Vector((math.cos(am), math.sin(am), 0)) * 3.85
                text("ringname", team, 0.34, (fp.x, fp.y, 0.012), lm, engine, rot=(0, 0, am + math.pi / 2), font="latin-700-normal.ttf")
                if i == 0:
                    torus("dial", 3.55, 0.008, (0, 0, 0.004), M["band"], engine)
                    torus("dial2", 4.2, 0.006, (0, 0, 0.004), M["band"], engine)
                for edge in (a0 - GAP, a1 + GAP):
                    box("tick", (0.5, 0.02, 0.01), (math.cos(edge) * 3.85, math.sin(edge) * 3.85, 0.006), M["band"], bevel=0, parent=engine, rot=(0, 0, edge))
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
    apply_blueprint(scene, thickness=1.1 if VARIANT == "desktop" else 1.5)

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

def pose(t, spin=None):
    spin = 8 + 46 * t if spin is None else spin
    engine.rotation_euler = (0, 0, math.radians(spin))
    # The wedge facing the viewer gets the spotlight
    spots = []
    for i in range(6):
        world = math.radians(i * 60 + 30 + spin)
        spots.append(max(0.0, math.cos(world - math.radians(270))) ** 10)
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
        w, gr = (hexc(TEAM_TINT[TEAMS[i]]) if LABELS == "colour" else hexc("#d7e2ee")), hexc("#2fd06a")
        b.inputs["Emission Color"].default_value = (*[w[j] * (1 - g) + gr[j] * g for j in range(3)], 1)
        b.inputs["Emission Strength"].default_value = 2.0 + 4.0 * g + 4.0 * spots[i] * (1 - g)
        lb = label_mats[i].node_tree.nodes["Principled BSDF"]
        lw, lg = (hexc(TEAM_TINT[TEAMS[i]]) if LABELS == "colour" else hexc("#f2f4f1")), hexc("#3ee07a")
        lb.inputs["Emission Color"].default_value = (*[lw[j] * (1 - spots[i]) + lg[j] * spots[i] for j in range(3)], 1)
        lb.inputs["Emission Strength"].default_value = 1.0 + 1.8 * spots[i]
    pos, tg = cam_at(t)
    cam.location = pos; tgt.location = tg
    return dict(lift=lift, core=c, greens=greens, spin=spin, spots=spots)

from bpy_extras.object_utils import world_to_camera_view
def px(v):
    q = world_to_camera_view(scene, cam, Vector(v)); return [round(q.x * RES[0], 1), round((1 - q.y) * RES[1], 1)]

# The blueprint is only shown for the middle of the story
if MODE == "still":
    # A single preview frame: argv frames=t*1000, samples, then spin in degrees
    t = FRAMES / 1000; spin = float(argv[5]) if len(argv) > 5 else None
    if len(argv) > 6 and argv[6] == "blue":
        from bp import apply_blueprint
        floor.hide_render = True
        for r_ in floor_rings: r_.hide_render = True
        apply_blueprint(scene, thickness=1.1 if VARIANT == "desktop" else 1.5)
    else:
        scene.cycles.samples = SAMPLES
    st = pose(t, spin); bpy.context.view_layer.update()
    scene.render.filepath = os.path.join(OUTDIR, "still.png"); bpy.ops.render.render(write_still=True)
    lift = st["lift"]
    layer_z = [REST[k] + lift * k * 0.34 + LAYERS[k][1] * 0.6 for k in range(len(LAYERS))]
    sp = st["spin"]
    wedges = {tm_: dict(top=px((math.cos(math.radians(i_ * 60 + 30 + sp)) * 2.3, math.sin(math.radians(i_ * 60 + 30 + sp)) * 2.3, TOP + 0.05)),
                        rim=px((math.cos(math.radians(i_ * 60 + 30 + sp)) * R2, math.sin(math.radians(i_ * 60 + 30 + sp)) * R2, TOP * 0.6)),
                        spot=round(st["spots"][i_], 3)) for i_, tm_ in enumerate(TEAMS)}
    json.dump(dict(layers=[px((R2 * 0.98, -0.5, zz)) for zz in layer_z], left=[px((-R2 * 0.98, -0.5, zz)) for zz in layer_z], hollow=px((0, 0, 0.12)), res=RES, wedges=wedges, bottom=px((0, -R2, 0))), open(os.path.join(OUTDIR, "still.json"), "w"))
    print("DONE"); raise SystemExit
if MODE == "glb":
    # The closed engine for three.js: one rigid mesh with baked contact shading,
    # plus a floor with its light and shadow baked in. The engine is round, so the
    # floor bake stays true while it turns. Lights and glow are added live.
    pose(0.0, 0.0); engine.rotation_euler = (0, 0, 0); bpy.context.view_layer.update()
    for o in [core, *core.children_recursive, dashes, *dashes.children, glow_ob]:
        bpy.data.objects.remove(o, do_unlink=True)
    bpy.ops.object.select_all(action="DESELECT")
    parts = [o for o in engine.children_recursive if o.type in ("MESH", "FONT")]
    for o in parts:
        o.select_set(True)
        if o.type == "MESH" and "UVMap" not in o.data.uv_layers: o.data.uv_layers.new(name="UVMap")
    bpy.context.view_layer.objects.active = parts[0]
    bpy.ops.object.convert(target="MESH")
    parts = [o for o in bpy.context.selected_objects]
    for o in parts:
        if "UVMap" not in o.data.uv_layers: o.data.uv_layers.new(name="UVMap")
        if o.hide_render: o.select_set(False)
    hidden = [o for o in parts if o.hide_render]
    for o in hidden: bpy.data.objects.remove(o, do_unlink=True)
    parts = [o for o in bpy.context.selected_objects]
    bpy.context.view_layer.objects.active = parts[0]
    bpy.ops.object.join()
    eng = bpy.context.active_object; eng.name = "Engine"
    mw = eng.matrix_world.copy(); eng.parent = None; eng.matrix_world = mw
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    eng.data.uv_layers.new(name="AO"); eng.data.uv_layers.active = eng.data.uv_layers["AO"]
    bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.smart_project(angle_limit=math.radians(60), island_margin=0.002)
    bpy.ops.object.mode_set(mode="OBJECT")
    print("ENGINE TRIS", sum(len(p.vertices) - 2 for p in eng.data.polygons), flush=True)

    def bake_into(ob, img, kind, samples, **kw):
        for slot in ob.material_slots:
            nt = slot.material.node_tree
            n = nt.nodes.new("ShaderNodeTexImage"); n.image = img; n.name = "BAKE"; nt.nodes.active = n
        bpy.ops.object.select_all(action="DESELECT"); ob.select_set(True); bpy.context.view_layer.objects.active = ob
        scene.cycles.samples = samples
        bpy.ops.object.bake(type=kind, margin=4, **kw)
        for slot in ob.material_slots:
            nt = slot.material.node_tree; nt.nodes.remove(nt.nodes["BAKE"])

    world.light_settings.distance = 0.5
    ao = bpy.data.images.new("ao", 4096, 4096)
    bake_into(eng, ao, "AO", 96)
    ao.filepath_raw = os.path.join(OUTDIR, "ao.png"); ao.file_format = "PNG"; ao.save()
    eng.data.uv_layers.active = eng.data.uv_layers["UVMap"]
    print("AO DONE", flush=True)

    # Floor: a disc with planar UVs, lit only (no colour) so the page can tint it
    FR = 16.0
    bpy.data.objects.remove(floor, do_unlink=True)
    bpy.ops.mesh.primitive_circle_add(vertices=128, radius=FR, fill_type="TRIFAN")
    fl = bpy.context.active_object; fl.name = "Floor"; fl.data.materials.append(M["floor"])
    fl.data.uv_layers.new(name="UVMap")
    for loop in fl.data.loops:
        v = fl.data.vertices[loop.vertex_index].co
        fl.data.uv_layers["UVMap"].data[loop.index].uv = (v.x / (2 * FR) + 0.5, v.y / (2 * FR) + 0.5)
    for r_ in floor_rings: r_.hide_render = True
    lightmap = bpy.data.images.new("floor", 2048, 2048, float_buffer=True)
    scene.render.bake.use_pass_color = False
    bake_into(fl, lightmap, "DIFFUSE", 256, pass_filter={"DIRECT", "INDIRECT"})
    lightmap.filepath_raw = os.path.join(OUTDIR, "floor.exr"); lightmap.file_format = "OPEN_EXR"; lightmap.save()
    for r_ in floor_rings: r_.hide_render = False
    print("FLOOR DONE", flush=True)

    # Floor rings join into one, then export everything but lights and the floor plane
    bpy.ops.object.select_all(action="DESELECT")
    for r_ in floor_rings: r_.select_set(True)
    bpy.context.view_layer.objects.active = floor_rings[0]; bpy.ops.object.join(); rings = bpy.context.active_object; rings.name = "FloorRings"
    bpy.ops.object.select_all(action="DESELECT")
    eng.select_set(True); rings.select_set(True)
    bpy.ops.export_scene.gltf(filepath=os.path.join(OUTDIR, "engine.glb"), use_selection=True, export_apply=True,
        export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=7, export_lights=False, export_cameras=False,
        export_image_format="WEBP")
    print("DONE"); raise SystemExit
if MODE == "loop":
    # The opening turn: one full revolution at the hero pose, played on a loop until the visitor scrolls
    for i in range(FRAMES):
        pose(0.0, 8 + 360 * i / FRAMES); bpy.context.view_layer.update()
        scene.cycles.samples = SAMPLES
        scene.render.filepath = os.path.join(OUTDIR, f"{i:04d}.png"); bpy.ops.render.render(write_still=True)
        print("FRAME", i, flush=True)
    print("DONE"); raise SystemExit
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
        left=[px((-R2 * 0.98, -0.5, zz)) for zz in layer_z],
        hollow=px((0, 0, 0.12)),
        core=px((0, 0, 1.9 * st["core"] + 0.2)),
        centre=centre,
        rim=round(abs(px((R2 + 0.12, 0, REST[-1] + 0.12))[0] - px((0, 0, REST[-1] + 0.12))[0]), 1),
    )
    print("FRAME", i, flush=True)
if MODE == "solid":
    json.dump(dict(frames=FRAMES, res=RES, anchors=anchors), open(os.path.join(OUTDIR, "anchors.json"), "w"))
print("DONE")
