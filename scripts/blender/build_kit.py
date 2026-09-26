"""Export the medieval kit for the web: every piece variant the city uses,
each with baked ambient occlusion, in one glTF binary plus a manifest.

    CUDA_VISIBLE_DEVICES=0 blender -b --python scripts/blender/build_kit.py -- <out_dir>

Per piece: a second UV set ('Lightmap') is unwrapped, Cycles bakes AO into a
small image, and the image is wired to the glTF occlusion slot of piece-local
copies of the materials — so the browser shows the contact shadow in every
window reveal, under every beam and inside every arch without computing it.
Geometry is in Blender's frame (facade on y = 0 facing -Y, bays along +X,
Z up); js/basctdelm-walk.js converts on placement.
"""
import bpy, json, math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import medieval_kit as K

OUT = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else os.path.join(os.path.dirname(__file__), 'kit_out')
os.makedirs(OUT, exist_ok=True)
AO_DISTANCE = 1.1
PLASTERS = {'white': 'M_Plaster', 'ochre': 'M_PlasterOchre', 'rose': 'M_PlasterRose', 'worn': 'M_PlasterWorn'}
OPENINGS = {'door': ('door', 1.25, 2.55, 0, 'pointed'), 'window': ('window', .75, 1.3, 1.1, 'pointed'),
            'shop': ('shop', 1.7, 2.6, .9, 'round')}
GROUND_MATS = {'stone': 'M_Stone', 'brick': 'M_Brick', 'plaster': 'M_Plaster'}

def variants():
    """(piece name, builder, AO map size)."""
    v = []
    for kind, opening in OPENINGS.items():
        for gm, mat in GROUND_MATS.items():
            v.append(('G_%s_%s' % (kind, gm), lambda o=opening, m=mat, n='G_%s_%s' % (kind, gm): K.stone_wall(n, o, mat=m), 512))
    for kind in ('door', 'shop'):
        for pk in ('white', 'ochre'):
            n = 'GT_%s_%s' % (kind, pk)
            v.append((n, lambda k=kind, p=PLASTERS[pk], n=n: K.timber_ground(n, k, plaster=p), 512))
    for pattern in ('cross', 'close', 'herring'):
        for win in (True, False):
            for pk, pm in PLASTERS.items():
                n = 'UT_%s_%s_%s' % (pattern, 'win' if win else 'solid', pk)
                v.append((n, lambda pa=pattern, w=win, pm=pm, n=n: K.timber_wall(n, pa, w, plaster=pm, seed=len(n)), 512))
    for mat, window, n in (('M_Stone', 'cross', 'US_stone_cross'), ('M_Brick', 'lancet', 'US_brick_lancet'),
                           ('M_Plaster', 'small', 'US_white_small'), ('M_PlasterOchre', 'small', 'US_ochre_small'),
                           ('M_Stone', None, 'US_stone_none'), ('M_Brick', None, 'US_brick_none'), ('M_Plaster', None, 'US_white_none')):
        v.append((n, lambda m=mat, w=window, n=n: K.solid_wall(n, m, w), 512))
    v.append(('JETTY', lambda: K.jetty('JETTY'), 256))
    v.append(('ROOF_tile', lambda: K.roof('ROOF_tile', 8.0, mat='M_RoofTile'), 512))
    v.append(('ROOF_slate', lambda: K.roof('ROOF_slate', 8.0, mat='M_RoofSlate'), 512))
    for pk, pm in PLASTERS.items():
        v.append(('GABLE_timber_' + pk, lambda pm=pm, pk=pk: K.gable('GABLE_timber_' + pk, 8.0, 'timber', plaster=pm), 512))
    v.append(('GABLE_stone', lambda: K.gable('GABLE_stone', 8.0, 'stone'), 512))
    for w in (4.8, 7.2):
        n = 'STEP_%g' % w
        v.append((n, lambda w=w, n=n: K.stepped_gable(n, w, w / 2 * math.tan(K.PITCH)), 512))
    v.append(('CHIMNEY_stone', lambda: K.chimney('CHIMNEY_stone', mat='M_Stone'), 256))
    v.append(('CHIMNEY_brick', lambda: K.chimney('CHIMNEY_brick', mat='M_Brick'), 256))
    for pk in ('white', 'ochre'):
        v.append(('ORIEL_' + pk, lambda pk=pk: K.oriel('ORIEL_' + pk, plaster=PLASTERS[pk]), 256))
    return v

def setup_cycles():
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    prefs = bpy.context.preferences.addons['cycles'].preferences
    for t in ('OPTIX', 'CUDA'):
        try:
            prefs.compute_device_type = t; prefs.refresh_devices()
        except TypeError:
            continue
        if any(d.type == t for d in prefs.devices):
            for d in prefs.devices:
                d.use = d.type == t
            scene.cycles.device = 'GPU'
            break
    scene.cycles.samples = 64
    scene.render.bake.margin = 6
    world = bpy.data.worlds.new('bake world'); scene.world = world
    world.light_settings.distance = AO_DISTANCE
    print('bake device', scene.cycles.device)

def bake_ao(obj, size):
    """Unwrap a lightmap UV, bake AO, and wire it to glTF occlusion on piece-local materials."""
    me = obj.data
    lm = me.uv_layers.new(name='Lightmap')
    me.uv_layers.active = lm
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True); bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=.02, area_weight=0)
    bpy.ops.object.mode_set(mode='OBJECT')
    img = bpy.data.images.new('AO_' + obj.name, size, size, alpha=False)
    img.generated_color = (1, 1, 1, 1)
    # Piece-local material copies, each with the bake target as the active node.
    for i, slot in enumerate(obj.material_slots):
        if slot.material is None:
            continue
        m = slot.material.copy(); m.name = slot.material.name + '__' + obj.name
        slot.material = m
        nt = m.node_tree
        tex = nt.nodes.new('ShaderNodeTexImage'); tex.image = img; tex.name = 'AO bake'
        uvn = nt.nodes.new('ShaderNodeUVMap'); uvn.uv_map = 'Lightmap'
        nt.links.new(uvn.outputs['UV'], tex.inputs['Vector'])
        nt.nodes.active = tex
    me.uv_layers.active = me.uv_layers['UVMap']
    bpy.ops.object.bake(type='AO', use_clear=True, margin=6)
    img.filepath_raw = os.path.join(OUT, 'ao', img.name + '.png'); img.file_format = 'PNG'
    os.makedirs(os.path.join(OUT, 'ao'), exist_ok=True)
    img.save()
    for slot in obj.material_slots:
        if slot.material is None:
            continue
        nt = slot.material.node_tree
        tex = nt.nodes['AO bake']
        grp = bpy.data.node_groups.get('glTF Material Output')
        if grp is None:
            grp = bpy.data.node_groups.new('glTF Material Output', 'ShaderNodeTree')
            grp.interface.new_socket('Occlusion', in_out='INPUT', socket_type='NodeSocketFloat')
            grp.interface.new_socket('Thickness', in_out='INPUT', socket_type='NodeSocketFloat')
        gn = nt.nodes.new('ShaderNodeGroup'); gn.node_tree = grp
        sep = nt.nodes.new('ShaderNodeSeparateColor')
        nt.links.new(tex.outputs['Color'], sep.inputs['Color'])
        nt.links.new(sep.outputs[0], gn.inputs['Occlusion'])

def main():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    K.BEVEL_SEGMENTS = 1
    setup_cycles()
    manifest = {}
    built = []
    x = 0
    for name, build, size in variants():
        obj = build()
        obj.name = name; obj.data.name = name
        # Tidy: everything in object space at the origin, no parent.
        bpy.context.view_layer.update()
        bake_ao(obj, size)
        dims = [round(v, 3) for v in obj.dimensions]
        manifest[name] = {'dims': dims, 'tris': sum(len(p.vertices) - 2 for p in obj.data.polygons)}
        obj.location.x = 0
        built.append(obj)
        print('PIECE', name, manifest[name])
    bpy.ops.object.select_all(action='DESELECT')
    for o in built:
        o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, 'basctdelm-kit.glb'), export_format='GLB', use_selection=True,
                              export_image_format='WEBP', export_texcoords=True, export_normals=True,
                              export_tangents=False, export_materials='EXPORT', export_apply=False,
                              export_extras=False, export_cameras=False, export_lights=False, export_yup=True)
    with open(os.path.join(OUT, 'basctdelm-kit.json'), 'w') as f:
        json.dump({'bay': K.BAY, 'groundH': K.GROUND_H, 'floorH': K.FLOOR_H, 'pitchDeg': math.degrees(K.PITCH),
                   'roofDepth': 8.0, 'gableDepth': 8.0, 'pieces': manifest}, f, indent=1)
    print('KIT DONE', len(built), 'pieces')

main()
