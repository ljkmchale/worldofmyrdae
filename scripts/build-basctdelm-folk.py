"""Assemble Basctdelm townsfolk from the Quaternius CC0 packs.

Each variant = outfit (with its skeleton) + head/eyes/eyebrows cut from a base
character + a hairstyle, all bound to the outfit armature, joined into ONE
skinned mesh, carrying Walk/Idle/Talk actions as NLA tracks, exported as .glb
with 1024px WebP textures. Also reports the walk cycle's ground speed.
"""
import bpy, bmesh, os, sys, json

W = sys.argv[sys.argv.index('--') + 1]
OUT = sys.argv[sys.argv.index('--') + 2]
ANIMS = ['Walk_Loop', 'Idle_Loop', 'Idle_Talking_Loop']

VARIANTS = [
    # name, outfit, clothing base colour override, body, hair list
    ('man_peasant_a',   'Male_Peasant',   None,                   'Male',   ['Hair_SimpleParted', 'Hair_Beard']),
    ('man_peasant_b',   'Male_Peasant',   'T_Peasant_2_BaseColor', 'Male',   ['Hair_Buzzed', 'Hair_Beard']),
    ('man_peasant_c',   'Male_Peasant',   'T_Peasant_2_BaseColor', 'Male',   ['Hair_Long']),
    ('man_ranger',      'Male_Ranger',    None,                   'Male',   ['Hair_Beard']),
    ('woman_peasant_a', 'Female_Peasant', None,                   'Female', ['Hair_Buns']),
    ('woman_peasant_b', 'Female_Peasant', 'T_Peasant_2_BaseColor', 'Female', ['Hair_Long']),
    ('woman_peasant_c', 'Female_Peasant', 'T_Peasant_2_BaseColor', 'Female', ['Hair_Buns']),
    ('woman_ranger',    'Female_Ranger',  'T_Ranger_3_BaseColor',  'Female', []),
]

def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def import_gltf(path):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=path)
    return [o for o in bpy.data.objects if o not in before]

def delete(objs):
    for o in objs:
        if o.name in bpy.data.objects:
            bpy.data.objects.remove(o, do_unlink=True)

def rebind(mesh, arm):
    """Point a skinned mesh at the outfit armature (same bone names)."""
    world = mesh.matrix_world.copy()
    mesh.parent = arm
    mesh.matrix_world = world
    for mod in mesh.modifiers:
        if mod.type == 'ARMATURE':
            mod.object = arm
    if not any(m.type == 'ARMATURE' for m in mesh.modifiers):
        mod = mesh.modifiers.new('Armature', 'ARMATURE'); mod.object = arm

def cut_below(mesh, z):
    bm = bmesh.new(); bm.from_mesh(mesh.data)
    mw = mesh.matrix_world
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if (mw @ v.co).z < z], context='VERTS')
    bm.to_mesh(mesh.data); bm.free()

def swap_base_color(objs, image_name):
    path = os.path.join(W, 'outfits', image_name + '.png')
    img = bpy.data.images.load(path)
    for o in objs:
        if o.type != 'MESH':
            continue
        for mat in o.data.materials:
            if mat and mat.use_nodes and ('Peasant' in mat.name or 'Ranger' in mat.name):
                for n in mat.node_tree.nodes:
                    if n.type == 'TEX_IMAGE' and n.image and 'BaseColor' in n.image.name:
                        n.image = img

def walk_speed(arm, action):
    """Ground speed implied by the in-place walk: foot travel during stance."""
    arm.animation_data.action = action
    f0, f1 = map(int, action.frame_range)
    ys = []
    for f in range(f0, f1 + 1):
        bpy.context.scene.frame_set(f)
        ys.append((arm.matrix_world @ arm.pose.bones['foot_l'].head).y)
    fps = bpy.context.scene.render.fps
    return (max(ys) - min(ys)) / ((f1 - f0) / fps / 2), (f1 - f0) / fps

report = {}
os.makedirs(OUT, exist_ok=True)
for name, outfit, recolor, body, hairs in VARIANTS:
    reset()
    new = import_gltf(os.path.join(W, 'outfits', outfit + '.gltf'))
    arm = next(o for o in new if o.type == 'ARMATURE')
    if recolor:
        swap_base_color(new, recolor)
    delete([o for o in new if o.type == 'MESH' and o.parent is None])  # helper icospheres
    # Head, eyes and eyebrows from the matching base character.
    base = import_gltf(os.path.join(W, 'base', f'Superhero_{body}_FullBody.gltf'))
    for o in base:
        if o.type == 'MESH' and o.parent is not None:
            if o.name.startswith('SuperHero') or o.name.startswith('Superhero'):
                cut_below(o, 1.50 if body == 'Male' else 1.455)
            rebind(o, arm)
    delete([o for o in base if o.type == 'ARMATURE' or (o.type == 'MESH' and o.parent is None)])
    for hair in hairs:
        h = import_gltf(os.path.join(W, 'hair', hair + '.gltf'))
        for o in h:
            if o.type == 'MESH' and o.parent is not None:
                rebind(o, arm)
        delete([o for o in h if o.type == 'ARMATURE' or (o.type == 'MESH' and o.parent is None)])
    # Animations from the Universal Animation Library (same 65-bone rig).
    lib = import_gltf(os.path.join(W, 'anims', 'UAL1_Standard.glb'))
    delete(lib)
    arm.animation_data_create()
    for a in ANIMS:
        act = bpy.data.actions[a]
        act.use_fake_user = True
        track = arm.animation_data.nla_tracks.new(); track.name = a
        track.strips.new(a, int(act.frame_range[0]), act)
    speed, duration = walk_speed(arm, bpy.data.actions['Walk_Loop'])
    arm.animation_data.action = None
    # One skinned mesh per character keeps draw calls down.
    meshes = [o for o in bpy.data.objects if o.type == 'MESH']
    bpy.ops.object.select_all(action='DESELECT')
    for m in meshes: m.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    bpy.ops.object.join()
    meshes[0].name = name
    # Crowd LOD: collapse to ~35% of the triangles before the armature deforms it.
    body = meshes[0]
    dec = body.modifiers.new("CrowdLOD", "DECIMATE"); dec.ratio = 0.35; dec.use_collapse_triangulate = True
    while body.modifiers.find("CrowdLOD") > 0:
        bpy.ops.object.modifier_move_up({"object": body}, modifier="CrowdLOD") if False else body.modifiers.move(body.modifiers.find("CrowdLOD"), 0)
    bpy.context.view_layer.objects.active = body
    bpy.ops.object.modifier_apply(modifier="CrowdLOD")
    # Single-channel roughness maps cannot be written as WebP (the glTF would
    # reference a missing image), so skin/eye roughness becomes a constant.
    for mat in bpy.data.materials:
        if not mat or not mat.use_nodes:
            continue
        for node in list(mat.node_tree.nodes):
            if node.type == "TEX_IMAGE" and node.image and "Roughness" in node.image.name:
                mat.node_tree.nodes.remove(node)
        bsdf = next((n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED"), None)
        if bsdf and not bsdf.inputs["Roughness"].is_linked:
            bsdf.inputs["Roughness"].default_value = 0.75
    for img in list(bpy.data.images):
        if img.size[0] > 1024:
            img.scale(1024, 1024)
        if img.channels < 3 and img.size[0] > 0:
            # WebP needs RGB(A): copy greyscale maps into an RGBA image.
            rgb = bpy.data.images.new(img.name + "_rgb", img.size[0], img.size[1], alpha=False)
            rgb.pixels.foreach_set(list(img.pixels))
            rgb.colorspace_settings.name = img.colorspace_settings.name
            img.user_remap(rgb)
    bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, name + '.glb'), export_format='GLB',
        export_image_format='WEBP', export_animation_mode='NLA_TRACKS', export_force_sampling=True,
        export_optimize_animation_size=True, export_def_bones=True, export_apply=False,
        export_extras=False, export_cameras=False, export_lights=False)
    report[name] = {'walk_speed_mps': round(speed, 3), 'walk_cycle_s': round(duration, 3),
                    'verts': len(meshes[0].data.vertices), 'materials': [m.name for m in meshes[0].data.materials]}
print('REPORT ' + json.dumps(report))
