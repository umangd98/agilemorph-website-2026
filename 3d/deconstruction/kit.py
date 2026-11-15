"""
The Agilemorph teardown kit: six team modules (each split into base, data,
tools, people and plate, with a signature object per team), the AI hub, the
AI layer, the leadership plate and three leak objects. Exported as one GLB
with every part named, for the scroll-driven page at /deconstruction-v2.

Run: Blender -b -P kit.py -- out.glb
Names in the GLB:
  M{i}            module root          M{i}_base / _data / _tools / _people / _plate
  HubBase HubRim HubColumn HubCore HubRing0..2 SkillRing
  AILayer         LeaderPlate          SinkChat SinkSheet SinkMail
"""
import bpy, bmesh, math, os, sys
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT = argv[0] if argv else os.path.join(HERE, "kit.glb")

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

def hexc(h):
    h = h.lstrip("#"); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c)

def mat(name, color, metal=0.0, rough=0.5, emit=None, strength=0.0, alpha=1.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*hexc(color), 1)
    b.inputs["Metallic"].default_value = metal
    b.inputs["Roughness"].default_value = rough
    if emit:
        b.inputs["Emission Color"].default_value = (*hexc(emit), 1)
        b.inputs["Emission Strength"].default_value = strength
    if alpha < 1:
        b.inputs["Alpha"].default_value = alpha
        try: m.surface_render_method = "BLENDED"
        except Exception: pass
    return m

M = {
    "body": mat("Body", "#2a3038", 0.85, 0.34),
    "dark": mat("BodyDark", "#14181d", 0.6, 0.42),
    "alu": mat("Alu", "#8a939d", 1.0, 0.24),
    "trim": mat("Trim", "#0c0e11", emit="#d7e2ee", strength=2.0),
    "dbring": mat("DbRing", "#0c0e11", emit="#8fb8ff", strength=3.0),
    "clay": mat("Clay", "#c9ced4", 0.0, 0.55),
    "text": mat("Text", "#e9ece8", emit="#e9ece8", strength=1.2),
    "textsub": mat("TextSub", "#8d96a1", emit="#8d96a1", strength=0.6),
    "paper": mat("Paper", "#e8e6df", 0.0, 0.7),
    "card": mat("Card", "#d9dde2", 0.0, 0.45),
    "tape": mat("Tape", "#b9a27a", 0.0, 0.6),
    "box": mat("Parcel", "#7a6248", 0.0, 0.75),
    "aiglass": mat("AIGlass", "#1e8a4c", 0.1, 0.2, emit="#2fd06a", strength=2.2, alpha=0.88),
    "aicore": mat("AICore", "#0b2a18", emit="#7dffb0", strength=8.0),
    "hub": mat("Hub", "#1e252c", 0.9, 0.3),
    "green": mat("GreenTrim", "#0c0e11", emit="#2fd06a", strength=5.0),
    "amber": mat("AmberTrim", "#0c0e11", emit="#e0a24a", strength=4.0),
    "amberbody": mat("AmberBody", "#2a2116", 0.4, 0.4),
}

def screen_mat(i):
    m = bpy.data.materials.new(f"Screen{i}"); m.use_nodes = True
    nt = m.node_tree; b = nt.nodes["Principled BSDF"]
    tex = nt.nodes.new("ShaderNodeTexImage"); tex.image = SCREEN_IMAGES[i % 4]
    nt.links.new(tex.outputs[0], b.inputs["Base Color"]); nt.links.new(tex.outputs[0], b.inputs["Emission Color"])
    b.inputs["Emission Strength"].default_value = 2.2; b.inputs["Roughness"].default_value = 0.2
    return m
SCREEN_IMAGES = [bpy.data.images.load(os.path.join(HERE, f"screen{i}.png")) for i in range(4)]
SCREENS = [screen_mat(i) for i in range(4)]

def link(ob, parent=None):
    scene.collection.objects.link(ob)
    if parent: ob.parent = parent
    return ob

def empty(name, loc=(0, 0, 0), parent=None):
    e = bpy.data.objects.new(name, None); link(e, parent); e.location = loc; return e

def finish(ob, material, bevel=0.0, segs=3):
    ob.data.materials.append(material)
    if bevel:
        mod = ob.modifiers.new("Bevel", "BEVEL"); mod.width = bevel; mod.segments = segs; mod.limit_method = "ANGLE"; mod.harden_normals = True
    for p in ob.data.polygons: p.use_smooth = True
    return ob

def box(name, size, loc, material, bevel=0.02, segs=3, parent=None, rot=(0, 0, 0)):
    me = bpy.data.meshes.new(name); bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts: v.co = Vector((v.co.x * size[0], v.co.y * size[1], v.co.z * size[2]))
    bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me); link(ob, parent); ob.location = loc; ob.rotation_euler = rot
    return finish(ob, material, bevel, segs)

def cyl(name, r, h, loc, material, verts=48, parent=None, bevel=0.01, rot=(0, 0, 0), r2=None):
    me = bpy.data.meshes.new(name); bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=verts, radius1=r, radius2=r if r2 is None else r2, depth=h)
    bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me); link(ob, parent); ob.location = loc; ob.rotation_euler = rot
    return finish(ob, material, bevel)

def torus(name, R, r, loc, material, parent=None, rot=(0, 0, 0), major=96, minor=12, arc=None):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, major_segments=major, minor_segments=minor, location=(0, 0, 0))
    ob = bpy.context.active_object; ob.name = name
    if arc is not None:
        bm = bmesh.new(); bm.from_mesh(ob.data)
        kill = [v for v in bm.verts if math.atan2(v.co.y, v.co.x) % (2 * math.pi) > arc]
        bmesh.ops.delete(bm, geom=kill, context="VERTS"); bm.to_mesh(ob.data); bm.free()
    if parent: ob.parent = parent
    ob.location = loc; ob.rotation_euler = rot
    ob.data.materials.append(material); bpy.ops.object.shade_smooth(); return ob

def sphere(name, r, loc, material, parent=None):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=(0, 0, 0), segments=24, ring_count=12)
    ob = bpy.context.active_object; ob.name = name
    if parent: ob.parent = parent
    ob.location = loc
    ob.data.materials.append(material); bpy.ops.object.shade_smooth(); return ob

def text(name, body, size, loc, material, parent=None, align="LEFT", extrude=0.006):
    cu = bpy.data.curves.new(name, "FONT"); cu.body = body; cu.size = size; cu.extrude = extrude
    cu.align_x = align; cu.align_y = "CENTER"
    cu.font = bpy.data.fonts.load(os.path.join(HERE, "InterTight.ttf"), check_existing=True)
    ob = bpy.data.objects.new(name, cu); link(ob); ob.location = loc
    cu.materials.append(material)
    bpy.context.view_layer.objects.active = ob; ob.select_set(True)
    bpy.ops.object.convert(target="MESH"); ob.select_set(False)
    if parent:
        ob.parent = parent; ob.location = loc
    return ob

def screen_face(parent, idx):
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, 0))
    f = bpy.context.active_object; f.name = "face"
    f.parent = parent; f.location = (0, -0.019, 0); f.rotation_euler = (math.radians(90), 0, 0); f.scale = (0.49, 0.29, 1)
    f.data.materials.append(SCREENS[idx % 4]); return f

# ---------------------------------------------------------------- signature objects
def sig_sales(p):
    for k, h in enumerate([0.08, 0.14, 0.2, 0.28]):
        box("bar", (0.07, 0.07, h), (k * 0.1 - 0.15, 0, h / 2), M["alu"], bevel=0.012, parent=p)
    box("baseline", (0.42, 0.1, 0.012), (0, 0, 0.006), M["dark"], bevel=0.004, parent=p)

def sig_finance(p):
    box("printer", (0.3, 0.22, 0.12), (0, 0, 0.06), M["dark"], bevel=0.025, parent=p)
    box("slot", (0.22, 0.02, 0.01), (0, -0.04, 0.122), M["trim"], bevel=0, parent=p)
    box("receipt", (0.18, 0.006, 0.22), (0, -0.04, 0.2), M["paper"], bevel=0.002, parent=p, rot=(math.radians(-14), 0, 0))
    for k in range(4):
        box("line", (0.12 - (k % 2) * 0.04, 0.002, 0.008), (0, -0.05 - k * 0.0, 0.14 + k * 0.04), M["dark"], bevel=0, parent=p, rot=(math.radians(-14), 0, 0))

def sig_support(p):
    torus("band", 0.13, 0.016, (0, 0, 0.13), M["alu"], parent=p, rot=(math.radians(90), 0, 0), arc=math.pi, minor=10)
    for s in (-1, 1):
        cyl("cup", 0.055, 0.05, (s * 0.13, 0, 0.11), M["dark"], parent=p, rot=(0, math.radians(90), 0), bevel=0.01)
    cyl("boom", 0.008, 0.14, (-0.09, -0.06, 0.06), M["alu"], parent=p, rot=(math.radians(60), 0, math.radians(-30)), bevel=0)
    sphere("mic", 0.018, (-0.05, -0.12, 0.03), M["dark"], parent=p)

def sig_ops(p):
    for (x, y, z, s) in [(-0.07, 0, 0.06, 0.12), (0.08, 0.02, 0.05, 0.1), (0, 0.01, 0.17, 0.1)]:
        b = box("parcel", (s, s, s), (x, y, z), M["box"], bevel=0.008, parent=p)
        box("tape", (s + 0.004, 0.025, s + 0.004), (x, y, z), M["tape"], bevel=0, parent=p)

def sig_marketing(p):
    cyl("horn", 0.11, 0.24, (0, 0, 0.14), M["alu"], parent=p, rot=(math.radians(90), 0, math.radians(25)), r2=0.035, bevel=0.006)
    cyl("handle", 0.022, 0.12, (0.02, 0.04, 0.06), M["dark"], parent=p, bevel=0.005)

def sig_hr(p):
    box("badge", (0.2, 0.012, 0.27), (0, 0, 0.16), M["card"], bevel=0.012, parent=p, rot=(math.radians(-10), 0, 0))
    box("photo", (0.08, 0.004, 0.09), (0, -0.012, 0.2), M["dark"], bevel=0.004, parent=p, rot=(math.radians(-10), 0, 0))
    box("nameline", (0.12, 0.004, 0.018), (0, -0.012, 0.12), M["body"], bevel=0, parent=p, rot=(math.radians(-10), 0, 0))
    torus("lanyard", 0.1, 0.008, (0, 0.02, 0.3), M["dark"], parent=p, rot=(math.radians(80), 0, 0), arc=math.pi, minor=8)

TEAMS = [
    ("Operations", "Orders, inventory, field updates", sig_ops),
    ("Finance", "Invoices, payments, month-end", sig_finance),
    ("Customer support", "Tickets, calls, refunds", sig_support),
    ("Sales", "Leads, deals, follow-ups", sig_sales),
    ("Marketing", "Campaigns, content, enquiries", sig_marketing),
    ("People and HR", "Hiring, onboarding, policies", sig_hr),
]

# ---------------------------------------------------------------- module
W, D = 2.0, 1.4

def plate(name, label, sub, parent, sig=None):
    pl = empty(name, (0, 0, 0), parent)
    box("plate", (W, D, 0.09), (0, 0, 0.045), M["dark"], bevel=0.03, parent=pl)
    box("rim", (W - 0.04, D - 0.04, 0.012), (0, 0, 0.002), M["trim"], bevel=0, parent=pl)
    tx = -W / 2 + 0.16
    text("name", label, 0.2 if len(label) > 12 else 0.24, (tx, -0.08, 0.093), M["text"], parent=pl)
    if sub: text("sub", sub, 0.085, (tx, -0.36, 0.093), M["textsub"], parent=pl)
    if sig:
        s = empty(name + "_sig", (0.62, 0.3, 0.09), pl); sig(s)
    return pl

def module(i, label, sub, sig):
    root = empty(f"M{i}", (i * 3.0, 0, 0))
    base = empty(f"M{i}_base", (0, 0, 0), root)
    box("plate", (W, D, 0.14), (0, 0, 0.07), M["body"], bevel=0.035, parent=base)
    for sx, sy, w, d in [(0, D / 2 + 0.002, W - 0.12, 0.012), (0, -D / 2 - 0.002, W - 0.12, 0.012), (W / 2 + 0.002, 0, 0.012, D - 0.12), (-W / 2 - 0.002, 0, 0.012, D - 0.12)]:
        box("trim", (w, d, 0.018), (sx, sy, 0.085), M["trim"], bevel=0, parent=base)
    for k in range(9):
        box("vent", (0.11, 0.012, 0.03), (-0.7 + k * 0.175, -D / 2 - 0.004, 0.04), M["dark"], bevel=0.004, parent=base)
    data = empty(f"M{i}_data", (0, 0, 0.14), root)
    box("slab", (W - 0.16, D - 0.14, 0.2), (0, 0, 0.1), M["dark"], bevel=0.03, parent=data)
    for k in range(3):
        x = -0.55 + k * 0.55
        cyl("drum", 0.17, 0.22, (x, 0.05, 0.31), M["alu"], parent=data)
        torus("ring", 0.172, 0.007, (x, 0.05, 0.36), M["dbring"], parent=data, minor=8)
        torus("ring", 0.172, 0.007, (x, 0.05, 0.27), M["dbring"], parent=data, minor=8)
    tools = empty(f"M{i}_tools", (0, 0, 0.58), root)
    box("slab", (W - 0.16, D - 0.14, 0.06), (0, 0, 0.03), M["body"], bevel=0.025, parent=tools)
    for k in range(3):
        x = -0.6 + k * 0.6
        s = box("screen", (0.54, 0.035, 0.34), (x, 0.28 + (0.06 if k == 1 else 0), 0.27), M["dark"], bevel=0.015, parent=tools, rot=(math.radians(-12), 0, math.radians((1 - k) * 14)))
        screen_face(s, k + i)
        box("stand", (0.05, 0.05, 0.12), (x, 0.3 + (0.06 if k == 1 else 0), 0.09), M["alu"], bevel=0.01, parent=tools)
    people = empty(f"M{i}_people", (0, 0, 1.06), root)
    box("slab", (W - 0.16, D - 0.14, 0.06), (0, 0, 0.03), M["body"], bevel=0.025, parent=people)
    for (x, y) in [(-0.6, -0.15), (0, -0.2), (0.6, -0.15), (-0.32, 0.25), (0.3, 0.27), (0.75, 0.3)]:
        box("body", (0.13, 0.11, 0.17), (x, y, 0.17), M["clay"], bevel=0.05, segs=4, parent=people)
        sphere("head", 0.058, (x, y, 0.32), M["clay"], parent=people)
    plate(f"M{i}_plate", label, sub, root, sig).location = (0, 0, 1.44)

for i, (label, sub, sig) in enumerate(TEAMS):
    module(i, label, sub, sig)

# ---------------------------------------------------------------- hub, AI layer, leader, sinks
hub = empty("Hub", (0, -5, 0))
cyl("HubBase", 1.15, 0.24, (0, 0, 0.12), M["hub"], parent=hub, bevel=0.03, verts=96)
torus("HubRim", 1.16, 0.022, (0, 0, 0.245), M["green"], parent=hub, major=128)
cyl("HubColumn", 0.36, 1.7, (0, 0, 1.0), M["aiglass"], parent=hub, bevel=0.02, verts=64)
cyl("HubCore", 0.09, 1.7, (0, 0, 1.0), M["aicore"], parent=hub, bevel=0, verts=24)
for k, r in enumerate([0.72, 0.98, 1.24]):
    torus(f"HubRing{k}", r, 0.026, (0, 0, 0.95 + k * 0.32), M["green"], parent=hub, major=128)
torus("SkillRing", 1.6, 0.03, (0, 0, 1.25), M["green"], parent=hub, major=160)

ai = empty("AILayer", (4, -5, 0))
box("glass", (W - 0.16, D - 0.14, 0.16), (0, 0, 0.08), M["aiglass"], bevel=0.03, parent=ai)
box("core", (W - 0.5, 0.05, 0.03), (0, 0, 0.08), M["aicore"], bevel=0.01, parent=ai)
box("core2", (0.05, D - 0.5, 0.03), (0, 0, 0.08), M["aicore"], bevel=0.01, parent=ai)

lead = empty("Leader", (-4, -5, 0))
plate("LeaderPlate", "Leadership", "", lead).location = (0, 0, 0)

def sink(name, loc):
    s = empty(name, loc)
    return s
sc = sink("SinkChat", (8, -5, 0))
box("bubble", (0.9, 0.12, 0.6), (0, 0, 0.3), M["amberbody"], bevel=0.12, segs=6, parent=sc)
box("edge", (0.92, 0.02, 0.62), (0, 0.06, 0.3), M["amber"], bevel=0.12, segs=6, parent=sc)
cyl("tail", 0.1, 0.12, (-0.25, 0, -0.02), M["amberbody"], parent=sc, rot=(math.radians(90), 0, 0), r2=0.0, verts=3, bevel=0)
for k in range(3):
    sphere("dot", 0.05, (-0.2 + k * 0.2, -0.07, 0.3), M["amber"], parent=sc)
ss = sink("SinkSheet", (10, -5, 0))
box("sheet", (0.8, 0.06, 0.6), (0, 0, 0.3), M["amberbody"], bevel=0.02, parent=ss)
for r in range(4):
    for c in range(3):
        box("cell", (0.22, 0.02, 0.1), (-0.25 + c * 0.25, -0.035, 0.12 + r * 0.13), M["amber"] if r == 3 else M["paper"], bevel=0.005, parent=ss)
sm = sink("SinkMail", (12, -5, 0))
box("env", (0.9, 0.06, 0.58), (0, 0, 0.29), M["amberbody"], bevel=0.02, parent=sm)
for s in (-1, 1):
    box("flap", (0.52, 0.02, 0.025), (s * 0.21, -0.035, 0.42), M["amber"], bevel=0, parent=sm, rot=(0, math.radians(s * 34), 0))
box("rim", (0.92, 0.02, 0.6), (0, 0.035, 0.29), M["amber"], bevel=0.02, parent=sm)

# ---------------------------------------------------------------- merge parts to keep draw calls low
def descendants(ob):
    out = []
    for c in ob.children:
        out.append(c); out += descendants(c)
    return out

def merge_under(group):
    meshes = [o for o in descendants(group) if o.type == "MESH"]
    if not meshes: return
    bpy.ops.object.select_all(action="DESELECT")
    for o in meshes:
        o.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    bpy.ops.object.convert(target="MESH")
    # bake parent transforms into the meshes, relative to the group
    for o in meshes:
        mw = o.matrix_world.copy(); o.parent = group; o.matrix_world = mw
    bpy.ops.object.join()
    joined = bpy.context.view_layer.objects.active
    joined.name = group.name + "_mesh"
    for e in [o for o in descendants(group) if o.type == "EMPTY"]:
        bpy.data.objects.remove(e, do_unlink=True)

groups = [o for o in scene.objects if o.type == "EMPTY" and (
    any(o.name == f"M{i}_{p}" for i in range(6) for p in ("base", "data", "tools", "people", "plate"))
    or o.name in ("AILayer", "Leader", "SinkChat", "SinkSheet", "SinkMail"))]
for g in groups:
    merge_under(g)

# ---------------------------------------------------------------- export
for ob in scene.objects:
    ob.select_set(True)
bpy.ops.export_scene.gltf(
    filepath=OUT, export_format="GLB", use_selection=False, export_apply=True, export_yup=True,
    export_cameras=False, export_lights=False, export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=7, export_image_format="WEBP",
)
print("WROTE", OUT, os.path.getsize(OUT) // 1024, "KB")
