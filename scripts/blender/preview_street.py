"""Assemble a test street from the medieval kit and render it (Cycles, GPU).

blender -b --python scripts/blender/preview_street.py -- <out.png> [camera]
"""
import bpy, math, os, random, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import medieval_kit as K

args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = args[0] if args else os.path.join(os.path.dirname(__file__), 'preview.png')
VIEW = args[1] if len(args) > 1 else 'street'

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
library = bpy.data.collections.new('kit templates')
scene.collection.children.link(library)
cache = {}

def piece(key, build):
    """Build each distinct piece once; houses place linked duplicates."""
    if key not in cache:
        obj = build()
        for c in obj.users_collection:
            c.objects.unlink(obj)
        library.objects.link(obj)
        obj.hide_render = obj.hide_viewport = True
        cache[key] = obj
    return cache[key]

def place(template, loc, rot_z=0, parent=None):
    o = template.copy()
    o.hide_render = o.hide_viewport = False
    scene.collection.objects.link(o)
    o.location = loc
    o.rotation_euler = (0, 0, rot_z)
    if parent:
        o.parent = parent
    return o

STYLES = [('timber', .42), ('stone', .22), ('brick', .14), ('render', .22)]

def pick_style(rng):
    r, acc = rng.random(), 0
    for name, w in STYLES:
        acc += w
        if r < acc:
            return name
    return 'timber'

def house(where, rng):
    """One house. Local frame: facade on y = 0 facing -y, bays along +x. Returns its width."""
    style = pick_style(rng)
    bays = rng.choice([2, 2, 3, 3, 4] if style != 'brick' else [2, 3, 3])
    root = bpy.data.objects.new('house ' + style, None)
    scene.collection.objects.link(root)
    loc, rot = where(bays * K.BAY)
    root.location = loc; root.rotation_euler = (0, 0, rot)
    depth = rng.choice([7.0, 8.0, 9.0])
    floors = rng.choice({'timber': [2, 3, 3, 4], 'stone': [2, 3, 3], 'brick': [3, 3, 4], 'render': [2, 2, 3]}[style])
    plaster = rng.choice(['M_Plaster', 'M_PlasterOchre', 'M_PlasterRose', 'M_PlasterWorn'])
    wall = {'timber': plaster, 'stone': 'M_Stone', 'brick': 'M_Brick', 'render': plaster}[style]
    roofmat = rng.choice(['M_RoofTile', 'M_RoofTile', 'M_RoofSlate'] if style != 'stone' else ['M_RoofSlate', 'M_RoofSlate', 'M_RoofTile'])
    gable_front = style == 'brick' or (bays >= 2 and rng.random() < {'timber': .4, 'stone': .5, 'render': .15}.get(style, 0))
    W = bays * K.BAY
    door = rng.randrange(bays)
    seed = rng.randrange(4)
    # ---- ground floor
    for b in range(bays):
        kind = 'door' if b == door else rng.choice(['shop', 'window', 'window'] if style != 'brick' else ['window', 'shop'])
        if style == 'timber' and rng.random() < .5 and kind != 'window':
            t = piece(('tground', kind, plaster), lambda kind=kind: K.timber_ground('SM_TimberGround_%s_%s' % (kind, plaster), kind, plaster=plaster))
        else:
            opening = {'door': ('door', 1.25, 2.55, 0, 'pointed' if style != 'render' else 'round'),
                       'window': ('window', .75, 1.3, 1.1, 'pointed'), 'shop': ('shop', 1.7, 2.6, .9, 'round')}[kind]
            gmat = {'brick': 'M_Brick', 'render': plaster}.get(style, 'M_Stone')
            t = piece(('stone', kind, gmat, opening[4]), lambda opening=opening, gmat=gmat: K.stone_wall('SM_Ground_%s_%s' % (opening[0], gmat), opening, mat=gmat))
        place(t, (b * K.BAY, 0, 0), parent=root)
    # ---- upper floors
    z, front = K.GROUND_H, 0
    jet = style == 'timber' and rng.random() < .75
    oriel_bay = rng.randrange(bays) if style in ('timber', 'stone') and rng.random() < .35 else -1
    for k in range(1, floors):
        if jet:
            front -= .45
            for b in range(bays):
                place(piece(('jetty',), lambda: K.jetty('SM_Jetty')), (b * K.BAY, front + .45, z), parent=root)
        for b in range(bays):
            if style == 'timber':
                pattern = rng.choice(['cross', 'close', 'herring']) if k == 1 else ['close', 'cross', 'herring'][(seed + k) % 3]
                win = rng.random() > .18
                key = ('timber', pattern, win, plaster, seed)
                t = piece(key, lambda key=key: K.timber_wall('SM_Timber_%s_%s_%s_%d' % (key[1], 'win' if key[2] else 'solid', key[3], key[4]),
                                                           key[1], key[2], plaster=key[3], seed=key[4]))
            else:
                window = {'stone': 'cross', 'brick': 'lancet', 'render': 'small'}[style]
                if rng.random() < .12:
                    window = None
                key = ('solid', wall, window, seed)
                t = piece(key, lambda key=key: K.solid_wall('SM_Wall_%s_%s_%d' % (key[1], key[2], key[3]), key[1], key[2], seed=key[3]))
            place(t, (b * K.BAY, front, z), parent=root)
            if k == 1 and b == oriel_bay:
                place(piece(('oriel', plaster), lambda: K.oriel('SM_Oriel_' + plaster, plaster=plaster)), (b * K.BAY + .3, front, z + .45), parent=root)
        z += K.FLOOR_H
    # ---- roof and gables
    d_roof = depth - front
    if gable_front:
        span = W
        for i in range(int(math.ceil(d_roof / K.BAY))):
            t = piece(('roof', span, roofmat), lambda span=span: K.roof('SM_Roof_%s_%g' % (roofmat, span), span, mat=roofmat))
            place(t, (W, front + i * K.BAY, z), rot_z=math.pi / 2, parent=root)
        rise = span / 2 * math.tan(K.PITCH)
        if style == 'brick':
            g = piece(('stepped', span), lambda span=span, rise=rise: K.stepped_gable('SM_SteppedGable_%g' % span, span, rise))
        else:
            gstyle = 'stone' if style == 'stone' else 'timber'
            g = piece(('gable', span, plaster, gstyle), lambda span=span, gstyle=gstyle: K.gable('SM_Gable_%g_%s_%s' % (span, plaster, gstyle), span, gstyle, plaster=plaster))
        place(g, (0, front - (.06 if style == 'brick' else 0), z), parent=root)
    else:
        for b in range(bays):
            t = piece(('roof', d_roof, roofmat), lambda d=d_roof: K.roof('SM_Roof_%s_%g' % (roofmat, d), d, mat=roofmat))
            place(t, (b * K.BAY, front, z), parent=root)
        gstyle = 'stone' if style in ('stone', 'brick') else 'timber'
        for gx in (0, W):
            g = piece(('gable', d_roof, plaster, gstyle), lambda d=d_roof, gstyle=gstyle: K.gable('SM_Gable_%g_%s_%s' % (d, plaster, gstyle), d, gstyle, plaster=plaster))
            place(g, (gx, front, z), rot_z=math.pi / 2, parent=root)
    # ---- closed shell: side and back walls
    shell = K.Piece('shell')
    for x0, x1 in ((0, .3), (W - .3, W)):
        shell.cuboid(x0, x1, 0, depth, 0, K.GROUND_H, 'M_Stone' if style != 'brick' else 'M_Brick')
        shell.cuboid(x0, x1, front + .2, depth, K.GROUND_H, z, wall)
    shell.cuboid(0, W, depth - .3, depth, 0, z, wall)
    so = shell.finish(bevel=0); so.parent = root
    if rng.random() < .85:
        place(piece(('chimney', style == 'brick'), lambda: K.chimney('SM_Chimney_' + ('brick' if style == 'brick' else 'stone'))),
              (W * rng.choice([.2, .8]), depth * .62, z + 1.2), parent=root)
    return W

R_STREET, HALF = 70.0, 3.7

def street():
    """A narrow street curving gently, houses shoulder to shoulder on both sides."""
    rng = random.Random(23)
    for side in (1, -1):
        r = R_STREET - side * HALF
        theta = -4 / r
        while theta * r < 58:
            def where(W, theta=theta, r=r, side=side):
                # Far-side houses face the other way, so they are anchored at their far end.
                th = theta if side > 0 else theta + W / r
                return (r * math.sin(th), R_STREET - r * math.cos(th), 0), th + (0 if side > 0 else math.pi)
            theta += (house(where, rng) + .03) / r

def ground():
    for name, mat, size, loc, tile in (('street setts', 'M_StoneDressed', (90, 90), (25, 30, 0), 1.6),):
        bpy.ops.mesh.primitive_plane_add(size=1, location=loc)
        o = bpy.context.object; o.name = name; o.scale = (*size, 1)
        bpy.ops.object.transform_apply(scale=True)
        o.data.materials.append(K.material(mat)); K.world_uvs(o)

def lighting():
    world = bpy.data.worlds.new('sky'); scene.world = world; world.use_nodes = True
    nt = world.node_tree; bg = nt.nodes['Background']
    sky = nt.nodes.new('ShaderNodeTexSky')
    for kind in ('MULTIPLE_SCATTERING', 'NISHITA', 'HOSEK_WILKIE'):
        try:
            sky.sky_type = kind; break
        except TypeError:
            continue
    try:
        sky.sun_elevation = math.radians(28); sky.sun_rotation = math.radians(215)
    except AttributeError:
        pass
    nt.links.new(sky.outputs['Color'], bg.inputs['Color']); bg.inputs['Strength'].default_value = .35
    sun = bpy.data.lights.new('sun', 'SUN'); sun.energy = 4.2; sun.angle = math.radians(1.2)
    sun.color = (1, .93, .82)
    so = bpy.data.objects.new('sun', sun); scene.collection.objects.link(so)
    so.rotation_euler = (math.radians(62), 0, math.radians(215))

def camera():
    cam = bpy.data.cameras.new('cam'); cam.lens = 28
    co = bpy.data.objects.new('cam', cam); scene.collection.objects.link(co); scene.camera = co
    th = .02
    if VIEW == 'aerial':
        co.location = (-10, -26, 30); co.rotation_euler = (math.radians(55), 0, math.radians(-25))
    else:
        co.location = (R_STREET * math.sin(th), R_STREET - R_STREET * math.cos(th) - .6, 1.7)
        co.rotation_euler = (math.radians(89), 0, th + .1 - math.pi / 2)

def render():
    scene.render.engine = 'CYCLES'
    prefs = bpy.context.preferences.addons['cycles'].preferences
    for dev_type in ('OPTIX', 'CUDA'):
        try:
            prefs.compute_device_type = dev_type; prefs.refresh_devices()
            if any(d.type == dev_type for d in prefs.devices):
                for d in prefs.devices:
                    d.use = d.type == dev_type
                scene.cycles.device = 'GPU'; break
        except TypeError:
            continue
    scene.cycles.samples = 128; scene.cycles.use_denoising = True
    scene.render.resolution_x, scene.render.resolution_y = 1280, 720
    scene.view_settings.view_transform = 'AgX'
    try:
        scene.view_settings.look = 'AgX - Medium High Contrast'
    except TypeError:
        pass
    scene.render.filepath = OUT
    bpy.ops.render.render(write_still=True)
    print('RENDERED', OUT, 'device', scene.cycles.device)

street(); ground(); lighting(); camera(); render()
