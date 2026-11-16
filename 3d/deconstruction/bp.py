"""Turn the current scene into an anime.js-style blueprint: ink lines on paper."""
import bpy

def srgb(h):
    h = h.lstrip("#"); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c)

def apply_blueprint(scene, paper="#E9EAE4", ink="#22262B", thickness=1.15):
    scene.view_settings.view_transform = "Standard"
    try: scene.view_settings.look = "None"
    except Exception: pass
    w = scene.world; nt = w.node_tree; nt.nodes.clear()
    bg = nt.nodes.new("ShaderNodeBackground"); bg.inputs[0].default_value = (*srgb(paper), 1); bg.inputs[1].default_value = 1
    out = nt.nodes.new("ShaderNodeOutputWorld"); nt.links.new(bg.outputs[0], out.inputs[0])
    flat = bpy.data.materials.new("Paper"); flat.use_nodes = True; fn = flat.node_tree; fn.nodes.clear()
    em = fn.nodes.new("ShaderNodeEmission"); em.inputs[0].default_value = (*srgb(paper), 1); em.inputs[1].default_value = 1
    mo = fn.nodes.new("ShaderNodeOutputMaterial"); fn.links.new(em.outputs[0], mo.inputs[0])
    vl = scene.view_layers[0]; vl.material_override = flat
    scene.render.use_freestyle = True
    scene.render.line_thickness_mode = "ABSOLUTE"; scene.render.line_thickness = thickness
    vl.use_freestyle = True
    fs = vl.freestyle_settings
    ls = fs.linesets[0] if len(fs.linesets) else fs.linesets.new("Lines")
    ls.select_by_visibility = True; ls.visibility = "VISIBLE"
    ls.select_by_edge_types = True
    ls.select_silhouette = True; ls.select_border = True; ls.select_crease = True; ls.select_external_contour = True
    fs.crease_angle = 2.2
    if ls.linestyle is None:
        ls.linestyle = bpy.data.linestyles.new("Ink")
    ls.linestyle.color = srgb(ink); ls.linestyle.thickness = thickness
    for ob in scene.objects:
        if ob.type == "LIGHT": ob.hide_render = True
    # no depth of field or glow in a technical drawing
    if scene.camera: scene.camera.data.dof.use_dof = False
    scene.cycles.samples = 16
