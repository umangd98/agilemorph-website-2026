"""
Test frame for the Agilemorph teardown: the Sales module taken apart, with the
green AI layer arcing into its slot, the AI hub behind, two assembled teams in
soft focus. Run: Blender -b -P testframe.py -- out.png [samples]
"""
import bpy, bmesh, math, os, sys, random
from mathutils import Vector, Euler

HERE = os.path.dirname(os.path.abspath(__file__))
argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT = argv[0] if argv else os.path.join(HERE, "testframe.png")
SAMPLES = int(argv[1]) if len(argv) > 1 else 160
RES = (int(argv[2]), int(argv[3])) if len(argv) > 3 else (1920, 1080)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

# ---------------------------------------------------------------- render
scene.render.engine = "CYCLES"
prefs = bpy.context.preferences.addons["cycles"].preferences
try:
    prefs.compute_device_type = "METAL"
    prefs.get_devices()
    for d in prefs.devices:
        d.use = True
    scene.cycles.device = "GPU"
except Exception as e:
    print("GPU setup failed, using CPU:", e)
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 8
scene.render.resolution_x, scene.render.resolution_y = RES
scene.render.film_transparent = False
try:
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.look = "AgX - Medium High Contrast"
except Exception:
    scene.view_settings.view_transform = "Filmic"
scene.view_settings.exposure = 0.0

# ---------------------------------------------------------------- world
world = bpy.data.worlds.new("World"); scene.world = world
world.use_nodes = True
wn = world.node_tree.nodes; wl = world.node_tree.links
wn.clear()
env = wn.new("ShaderNodeTexEnvironment"); env.image = bpy.data.images.load(os.path.join(HERE, "studio.hdr"))
bg_light = wn.new("ShaderNodeBackground"); bg_light.inputs[1].default_value = 0.35
bg_dark = wn.new("ShaderNodeBackground"); bg_dark.inputs[0].default_value = (0.006, 0.008, 0.011, 1); bg_dark.inputs[1].default_value = 1
lp = wn.new("ShaderNodeLightPath"); mixn = wn.new("ShaderNodeMixShader"); outn = wn.new("ShaderNodeOutputWorld")
wl.new(env.outputs[0], bg_light.inputs[0])
mx = wn.new("ShaderNodeMath"); mx.operation = "MAXIMUM"
wl.new(lp.outputs["Is Camera Ray"], mx.inputs[0]); wl.new(lp.outputs["Is Glossy Ray"], mx.inputs[1])
wl.new(mx.outputs[0], mixn.inputs[0])
wl.new(bg_light.outputs[0], mixn.inputs[1]); wl.new(bg_dark.outputs[0], mixn.inputs[2])
wl.new(mixn.outputs[0], outn.inputs[0])

# ---------------------------------------------------------------- materials
def mat(name, color, metal=0.0, rough=0.5, emit=None, strength=0.0, transmission=0.0, coat=0.0, alpha=1.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Metallic"].default_value = metal
    b.inputs["Roughness"].default_value = rough
    if transmission: b.inputs["Transmission Weight"].default_value = transmission
    if coat: b.inputs["Coat Weight"].default_value = coat
    if emit:
        b.inputs["Emission Color"].default_value = (*emit, 1)
        b.inputs["Emission Strength"].default_value = strength
    if alpha < 1: b.inputs["Alpha"].default_value = alpha
    return m

def hexc(h):
    h = h.lstrip("#"); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c)

M_BODY = mat("Body", hexc("#2a3038"), metal=0.85, rough=0.32)
M_BODY_DARK = mat("BodyDark", hexc("#14181d"), metal=0.6, rough=0.42)
M_ALU = mat("Alu", hexc("#8a939d"), metal=1.0, rough=0.22)
M_TRIM = mat("Trim", hexc("#0c0e11"), emit=hexc("#d7e2ee"), strength=2.2)
M_TRIM_G = mat("TrimGreen", hexc("#0c0e11"), emit=hexc("#2fd06a"), strength=6)
M_DB_RING = mat("DbRing", hexc("#0c0e11"), emit=hexc("#8fb8ff"), strength=4)
M_CLAY = mat("Clay", hexc("#c9ced4"), rough=0.55)
M_FLOOR = mat("Floor", hexc("#07080a"), metal=0.1, rough=0.62)
M_GLASS_AI = mat("AIGlass", hexc("#1e8a4c"), rough=0.18, transmission=0.65, emit=hexc("#2fd06a"), strength=2.4, coat=1.0)
M_AI_CORE = mat("AICore", hexc("#0b2a18"), emit=hexc("#7dffb0"), strength=14)
M_HUB = mat("Hub", hexc("#1e252c"), metal=0.9, rough=0.3)
M_TEXT = mat("Text", hexc("#e9ece8"), emit=hexc("#e9ece8"), strength=1.6)
M_TEXT_SUB = mat("TextSub", hexc("#8d96a1"), emit=hexc("#8d96a1"), strength=0.8)
M_DUST = mat("Dust", (1, 1, 1), emit=hexc("#a9bccf"), strength=2.2)
M_DUST_G = mat("DustG", (1, 1, 1), emit=hexc("#7dffb0"), strength=5)

def screen_mat(i):
    m = bpy.data.materials.new(f"Screen{i}"); m.use_nodes = True
    nt = m.node_tree; b = nt.nodes["Principled BSDF"]
    tex = nt.nodes.new("ShaderNodeTexImage"); tex.image = bpy.data.images.load(os.path.join(HERE, f"screen{i % 4}.png"))
    nt.links.new(tex.outputs[0], b.inputs["Base Color"]); nt.links.new(tex.outputs[0], b.inputs["Emission Color"])
    b.inputs["Emission Strength"].default_value = 3.0; b.inputs["Roughness"].default_value = 0.15
    return m

# ---------------------------------------------------------------- helpers
def link(obj, parent=None):
    bpy.context.scene.collection.objects.link(obj)
    if parent: obj.parent = parent
    return obj

def box(name, size, loc, material, bevel=0.02, segs=4, parent=None, rot=(0, 0, 0)):
    me = bpy.data.meshes.new(name); bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts: v.co = Vector((v.co.x * size[0], v.co.y * size[1], v.co.z * size[2]))
    bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me); link(ob, parent)
    ob.location = loc; ob.rotation_euler = rot
    me.materials.append(material)
    if bevel:
        mod = ob.modifiers.new("Bevel", "BEVEL"); mod.width = bevel; mod.segments = segs; mod.limit_method = "ANGLE"
        mod.harden_normals = True
    for p in me.polygons: p.use_smooth = True
    return ob

def cyl(name, r, h, loc, material, verts=64, parent=None, bevel=0.01, rot=(0, 0, 0)):
    me = bpy.data.meshes.new(name); bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=verts, radius1=r, radius2=r, depth=h)
    bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me); link(ob, parent); ob.location = loc; ob.rotation_euler = rot
    me.materials.append(material)
    if bevel:
        mod = ob.modifiers.new("Bevel", "BEVEL"); mod.width = bevel; mod.segments = 3; mod.limit_method = "ANGLE"; mod.harden_normals = True
    for p in me.polygons: p.use_smooth = True
    return ob

def torus(name, R, r, loc, material, parent=None, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, major_segments=128, minor_segments=16, location=loc, rotation=rot)
    ob = bpy.context.active_object; ob.name = name
    if parent: ob.parent = parent
    ob.data.materials.append(material); bpy.ops.object.shade_smooth()
    return ob

def sphere(name, r, loc, material, parent=None):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc, segments=32, ring_count=16)
    ob = bpy.context.active_object; ob.name = name
    if parent: ob.parent = parent
    ob.data.materials.append(material); bpy.ops.object.shade_smooth(); return ob

def text(name, body, size, loc, material, parent=None, rot=(0, 0, 0), extrude=0.004, align="CENTER", font="InterTight.ttf"):
    cu = bpy.data.curves.new(name, "FONT"); cu.body = body; cu.size = size; cu.extrude = extrude; cu.align_x = align; cu.align_y = "CENTER"
    fp = os.path.join(HERE, font)
    if os.path.exists(fp): cu.font = bpy.data.fonts.load(fp)
    ob = bpy.data.objects.new(name, cu); link(ob, parent); ob.location = loc; ob.rotation_euler = rot
    cu.materials.append(material); return ob

def empty(name, loc=(0, 0, 0), rot=(0, 0, 0)):
    e = bpy.data.objects.new(name, None); link(e); e.location = loc; e.rotation_euler = rot; return e

# ---------------------------------------------------------------- one team module
W, D = 2.0, 1.4

def person(parent, x, y, z):
    box("body", (0.13, 0.11, 0.17), (x, y, z + 0.11), M_CLAY, bevel=0.05, segs=6, parent=parent)
    sphere("head", 0.058, (x, y, z + 0.26), M_CLAY, parent=parent)

def module(name, origin, explode=0.0, ai_open=0.0, label="Sales", sub="Leads, deals, follow-ups", twist=0.0):
    root = empty(name, origin)
    gaps = [0.0, 0.0, 0.0, 0.0, 0.0]
    z = 0.0
    def lift(k):
        return explode * (0.18 + k * 0.16)
    parts = {}
    # base
    base = empty(name + "_base"); base.parent = root; base.location = (0, 0, z)
    box("plate", (W, D, 0.14), (0, 0, 0.07), M_BODY, bevel=0.035, parent=base)
    for sx, sy, w, d in [(0, D / 2 + 0.002, W - 0.12, 0.012), (0, -D / 2 - 0.002, W - 0.12, 0.012), (W / 2 + 0.002, 0, 0.012, D - 0.12), (-W / 2 - 0.002, 0, 0.012, D - 0.12)]:
        box("trim", (w, d, 0.018), (sx, sy, 0.085), M_TRIM, bevel=0, parent=base)
    for k in range(9):
        box("vent", (0.11, 0.012, 0.03), (-0.7 + k * 0.175, -D / 2 - 0.004, 0.04), M_BODY_DARK, bevel=0.004, parent=base)
    z = 0.14
    # data
    data = empty(name + "_data"); data.parent = root; data.location = (0, 0, z + lift(1)); data.rotation_euler = (0, 0, twist * -0.6)
    box("slab", (W - 0.16, D - 0.14, 0.2), (0, 0, 0.1), M_BODY_DARK, bevel=0.03, parent=data)
    for k in range(3):
        x = -0.55 + k * 0.55
        cyl("db", 0.17, 0.22, (x, 0.05, 0.31), M_ALU, parent=data)
        torus("dbring", 0.172, 0.007, (x, 0.05, 0.36), M_DB_RING, parent=data)
        torus("dbring2", 0.172, 0.007, (x, 0.05, 0.27), M_DB_RING, parent=data)
    z += 0.44 + lift(1)
    parts["slot_z"] = z
    z += 0.17 * ai_open + 0.08 * explode
    # tools
    tools = empty(name + "_tools"); tools.parent = root; tools.location = (0, 0, z + lift(3) - lift(1)); tools.rotation_euler = (0, 0, twist * 0.5)
    box("slab", (W - 0.16, D - 0.14, 0.06), (0, 0, 0.03), M_BODY, bevel=0.025, parent=tools)
    for k in range(3):
        x = -0.6 + k * 0.6
        s = box("screen", (0.54, 0.035, 0.34), (x, 0.28 + (0.06 if k == 1 else 0), 0.27), M_BODY_DARK, bevel=0.015, parent=tools, rot=(math.radians(-12), 0, math.radians((1 - k) * 14)))
        bpy.ops.mesh.primitive_plane_add(size=1, location=(0, -0.019, 0), rotation=(math.radians(90), 0, 0))
        face = bpy.context.active_object; face.scale = (0.49, 0.29, 1); face.parent = s
        face.data.materials.append(screen_mat(k + (1 if name != "Sales" else 0)))
        box("stand", (0.05, 0.05, 0.12), (x, 0.3 + (0.06 if k == 1 else 0), 0.09), M_ALU, bevel=0.01, parent=tools)
    tz = z + lift(3) - lift(1) + 0.48
    # people
    people = empty(name + "_people"); people.parent = root; people.location = (0, 0, tz + lift(4) - lift(3)); people.rotation_euler = (0, 0, twist * -0.35)
    box("slab", (W - 0.16, D - 0.14, 0.06), (0, 0, 0.03), M_BODY, bevel=0.025, parent=people)
    for k, (x, y) in enumerate([(-0.6, -0.15), (0, -0.2), (0.6, -0.15), (-0.32, 0.25), (0.3, 0.27), (0.75, 0.3)]):
        person(people, x, y, 0.06)
    pz = tz + lift(4) - lift(3) + 0.38
    # name plate
    plate = empty(name + "_plate"); plate.parent = root; plate.location = (0, 0, pz + lift(5) - lift(4)); plate.rotation_euler = (0, 0, twist * 0.25)
    box("plate", (W, D, 0.09), (0, 0, 0.045), M_BODY_DARK, bevel=0.03, parent=plate)
    box("rim", (W - 0.04, D - 0.04, 0.012), (0, 0, 0.002), M_TRIM, bevel=0, parent=plate)
    text("name", label, 0.34, (0, 0.08, 0.092), M_TEXT, parent=plate)
    text("sub", sub, 0.11, (0, -0.22, 0.092), M_TEXT_SUB, parent=plate, font="InterTight.ttf")
    parts.update(root=root, base=base, data=data, tools=tools, people=people, plate=plate)
    return parts

# ---------------------------------------------------------------- scene
floor = box("floor", (400, 400, 0.02), (0, 0, -0.01), M_FLOOR, bevel=0)
# faint rings on the floor around the hub
for r in (2.4, 4.6, 6.8):
    torus("floorring", r, 0.006, (6.4, 4.4, 0.002), mat("FloorRing", hexc("#0b0d10"), emit=hexc("#2a3440"), strength=1.2), rot=(0, 0, 0))

SALES = Vector((-2.2, -1.6, 0))
sales = module("Sales", SALES, explode=1.0, ai_open=1.0, twist=0.55)
module("Finance", (10.6, 8.2, 0), label="Finance", sub="Invoices, payments, month-end")
module("Marketing", (-5.4, 5.4, 0), label="Marketing", sub="Campaigns, content, enquiries")
module("Support", (11.4, 2.0, 0), label="Customer support", sub="Tickets, calls, refunds")

# The hub
HUBP = Vector((6.4, 4.4, 0))
hub = empty("Hub", HUBP)
cyl("hubbase", 1.15, 0.24, (0, 0, 0.12), M_HUB, parent=hub, bevel=0.03, verts=96)
torus("hubrim", 1.16, 0.022, (0, 0, 0.245), M_TRIM_G, parent=hub)
cyl("column", 0.36, 1.7, (0, 0, 1.0), M_GLASS_AI, parent=hub, bevel=0.02, verts=96)
cyl("columncore", 0.09, 1.7, (0, 0, 1.0), M_AI_CORE, parent=hub, bevel=0, verts=32)
for k, (r, tilt) in enumerate([(0.72, 7), (0.98, -5), (1.24, 3)]):
    torus("hubring", r, 0.028, (0, 0, 0.95 + k * 0.32), M_TRIM_G, parent=hub, rot=(math.radians(tilt), math.radians(tilt * 0.6), 0))

# The AI layer, mid-flight from the hub into Sales' open slot
slot_world = SALES + Vector((0, 0, sales["slot_z"]))
hub_top = HUBP + Vector((0, 0, 1.9))
t = 0.5
mid = (hub_top + slot_world) / 2 + Vector((0, 0, 3.4))
p = (1 - t) ** 2 * hub_top + 2 * (1 - t) * t * mid + t ** 2 * slot_world
ai = empty("AILayer", p, (math.radians(6), math.radians(-5), math.radians(28)))
box("glass", (W - 0.16, D - 0.14, 0.16), (0, 0, 0.08), M_GLASS_AI, bevel=0.03, parent=ai)
box("core", (W - 0.5, 0.05, 0.03), (0, 0, 0.08), M_AI_CORE, bevel=0.01, parent=ai)
box("core2", (0.05, D - 0.5, 0.03), (0, 0, 0.08), M_AI_CORE, bevel=0.01, parent=ai)
# a ribbon of light behind it along the arc, fading towards the hub
M_TRAIL = bpy.data.materials.new("Trail"); M_TRAIL.use_nodes = True
nt = M_TRAIL.node_tree; nt.nodes.clear()
em = nt.nodes.new("ShaderNodeEmission"); em.inputs[0].default_value = (*hexc("#7dffb0"), 1); em.inputs[1].default_value = 6
tr = nt.nodes.new("ShaderNodeBsdfTransparent"); mixs = nt.nodes.new("ShaderNodeMixShader"); outm = nt.nodes.new("ShaderNodeOutputMaterial")
tc = nt.nodes.new("ShaderNodeTexCoord"); sep = nt.nodes.new("ShaderNodeSeparateXYZ")
mixs.inputs[0].default_value = 0.75
nt.links.new(tr.outputs[0], mixs.inputs[1]); nt.links.new(em.outputs[0], mixs.inputs[2]); nt.links.new(mixs.outputs[0], outm.inputs[0])
pts = []
for k in range(40):
    tt = t * k / 39
    pts.append((1 - tt) ** 2 * hub_top + 2 * (1 - tt) * tt * mid + tt ** 2 * slot_world + Vector((0, 0, 0.08)))
cu = bpy.data.curves.new("trail", "CURVE"); cu.dimensions = "3D"; cu.bevel_depth = 0.03; cu.bevel_resolution = 3
sp = cu.splines.new("POLY"); sp.points.add(len(pts) - 1)
for i, q in enumerate(pts): sp.points[i].co = (q.x, q.y, q.z, 1); sp.points[i].radius = 0.05 + 0.95 * (i / 39) ** 1.5
ob = bpy.data.objects.new("trail", cu); link(ob); cu.materials.append(M_TRAIL)
# the empty slot's glowing edges
sz = sales["slot_z"]
for sx, sy, w, d in [(0, (D - 0.14) / 2, W - 0.16, 0.012), (0, -(D - 0.14) / 2, W - 0.16, 0.012), ((W - 0.16) / 2, 0, 0.012, D - 0.14), (-(W - 0.16) / 2, 0, 0.012, D - 0.14)]:
    box("slotedge", (w, d, 0.01), (SALES.x + sx, SALES.y + sy, sz + 0.005), M_TRIM_G, bevel=0)

# Cables from the hub to the assembled teams
def cable(a, b, lift=0.9):
    cu = bpy.data.curves.new("cable", "CURVE"); cu.dimensions = "3D"; cu.bevel_depth = 0.022; cu.bevel_resolution = 4
    sp = cu.splines.new("BEZIER"); sp.bezier_points.add(1)
    for bp, co in zip(sp.bezier_points, (a, b)):
        bp.co = co; bp.handle_left_type = bp.handle_right_type = "AUTO"
    sp.bezier_points[0].handle_right = a + Vector((0, 0, lift)); sp.bezier_points[1].handle_left = b + Vector((0, 0, lift))
    sp.bezier_points[0].handle_right_type = sp.bezier_points[1].handle_left_type = "FREE"
    ob = bpy.data.objects.new("cable", cu); link(ob); cu.materials.append(M_TRIM_G); return ob
for target in [(10.6, 8.2, 0.6), (11.4, 2.0, 0.6), (-5.4, 5.4, 0.6)]:
    cable(HUBP + Vector((0, 0, 0.3)), Vector(target))

# Floating dust for depth
random.seed(4)
for i in range(140):
    pos = Vector((random.uniform(-10, 12), random.uniform(-7, 12), random.uniform(0.3, 6)))
    sphere("dust", random.uniform(0.005, 0.014), pos, M_DUST_G if random.random() < 0.25 else M_DUST)

# ---------------------------------------------------------------- lights
def area(name, loc, rot, size, energy, color):
    l = bpy.data.lights.new(name, "AREA"); l.size = size; l.energy = energy; l.color = color
    ob = bpy.data.objects.new(name, l); link(ob); ob.location = loc; ob.rotation_euler = rot; return ob
area("Key", (-6, -7, 8), (math.radians(50), 0, math.radians(-40)), 6, 2200, (1.0, 0.93, 0.85))
area("Rim", (6, 8, 5), (math.radians(-60), 0, math.radians(150)), 5, 1500, (0.62, 0.78, 1.0))
area("Top", (0, 0, 10), (0, 0, 0), 8, 500, (1, 1, 1))
gl = bpy.data.lights.new("HubGlow", "POINT"); gl.energy = 900; gl.color = (0.3, 1.0, 0.55); gl.shadow_soft_size = 0.6
g = bpy.data.objects.new("HubGlow", gl); link(g); g.location = HUBP + Vector((0, 0, 1.3))
gl2 = bpy.data.lights.new("AIGlow", "POINT"); gl2.energy = 140; gl2.color = (0.3, 1.0, 0.55); gl2.shadow_soft_size = 0.4
g2 = bpy.data.objects.new("AIGlow", gl2); link(g2); g2.location = p + Vector((0, 0, -0.45))

# ---------------------------------------------------------------- camera
cam_data = bpy.data.cameras.new("Cam"); cam_data.lens = 36
cam_data.dof.use_dof = True; cam_data.dof.aperture_fstop = 2.2
cam = bpy.data.objects.new("Cam", cam_data); link(cam); scene.camera = cam
cam.location = (-6.0, -12.8, 4.6)
target = empty("CamTarget", (1.9, 1.8, 2.0))
con = cam.constraints.new("TRACK_TO"); con.target = target; con.track_axis = "TRACK_NEGATIVE_Z"; con.up_axis = "UP_Y"
cam_data.dof.focus_object = empty("Focus", SALES + Vector((0, 0, 1.3)))

bpy.context.view_layer.update()
scene.render.filepath = OUT
scene.render.image_settings.file_format = "PNG"
bpy.ops.render.render(write_still=True)
# Where the labels go: project anchor points to the image
from bpy_extras.object_utils import world_to_camera_view
import json
def px(v):
    c = world_to_camera_view(scene, cam, Vector(v)); return [c.x * RES[0], (1 - c.y) * RES[1]]
mw = lambda ob: ob.matrix_world.translation
anchors = {
  "people": px(mw(sales["people"]) + Vector((W / 2, 0, 0.15))),
  "tools": px(mw(sales["tools"]) + Vector((W / 2, 0, 0.1))),
  "slot": px(SALES + Vector((W / 2 - 0.08, 0, sales["slot_z"] + 0.02))),
  "data": px(mw(sales["data"]) + Vector((W / 2 - 0.08, 0, 0.12))),
  "plate": px(mw(sales["plate"]) + Vector((0, 0, 0.1))),
  "hub": px(HUBP + Vector((0, -1.2, 0.1))),
  "ai": px(p + Vector((0, 0, 0.35))),
}
json.dump(anchors, open(os.path.splitext(OUT)[0] + ".json", "w"))
print("WROTE", OUT)
