"""Basctdelm medieval building kit — procedural Blender pieces.

Modular, metric pieces on a 2.4 m bay grid (ground floor 3.4 m, upper floors
2.9 m). Facades face -Y: the outer face of every wall piece lies on y = 0 and
the body runs into +Y. Pieces are real geometry — boolean-cut openings,
individually modelled timbers, overlapping roof-tile courses, bevelled edges —
with world-scale UVs, so they read correctly in Blender renders and in
Unreal Engine (exported as FBX with named material slots M_*).

Used by build_kit.py (exports) and preview_street.py (test renders).
"""
import bpy, bmesh, math, os, random
from mathutils import Vector, Matrix

BAY = 2.4
GROUND_H = 3.4
FLOOR_H = 2.9
PITCH = math.radians(50)
TEX = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'images', 'city-scenes', 'basctdelm', 'materials')

# ------------------------------------------------------------------ materials
# name: (texture asset, tint, roughness, metres per texture tile, bump)
MATERIALS = {
    'M_Stone':        ('medieval_wall_02', (.86, .82, .76), .9, 2.4, .6),
    'M_StoneDressed': ('medieval_blocks_05', (.9, .86, .8), .85, 1.6, .5),
    'M_Plaster':      ('white_plaster_rough_01', (.93, .88, .78), .95, 2.2, .35),
    'M_PlasterOchre': ('white_plaster_rough_01', (.92, .78, .55), .95, 2.2, .35),
    'M_PlasterRose':  ('white_plaster_rough_01', (.9, .74, .66), .95, 2.2, .35),
    'M_PlasterWorn':  ('worn_plaster_wall', (.95, .92, .86), .95, 2.2, .5),
    'M_Timber':       ('dark_wooden_planks', (.55, .47, .4), .8, 1.4, .6),
    'M_DoorPlanks':   ('old_planks_02', (.7, .6, .5), .75, 1.2, .6),
    'M_RoofTile':     ('roof_tiles', (.95, .62, .5), .8, 1.6, .7),
    'M_RoofSlate':    ('roof_slates_02', (.8, .86, .9), .7, 1.6, .7),
    'M_Brick':        ('medieval_red_brick', (.9, .8, .75), .9, 1.6, .6),
    'M_Glass':        (None, (.05, .07, .08), .08, 1, 0),
    'M_Iron':         (None, (.04, .04, .04), .5, 1, 0),
    'M_Dark':         (None, (.01, .01, .01), 1, 1, 0),
}

def material(name):
    if name in bpy.data.materials:
        return bpy.data.materials[name]
    asset, tint, rough, tile, bump = MATERIALS[name]
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    bsdf = next(n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED')
    bsdf.inputs['Roughness'].default_value = rough
    if asset:
        tex = nt.nodes.new('ShaderNodeTexImage')
        tex.image = bpy.data.images.load(os.path.join(TEX, asset + '-diff.jpg'), check_existing=True)
        mix = nt.nodes.new('ShaderNodeMix'); mix.data_type = 'RGBA'; mix.blend_type = 'MULTIPLY'
        mix.inputs['Factor'].default_value = 1
        mix.inputs[7].default_value = (*tint, 1)
        nt.links.new(tex.outputs['Color'], mix.inputs[6])
        nt.links.new(mix.outputs[2], bsdf.inputs['Base Color'])
        nrm_img = nt.nodes.new('ShaderNodeTexImage')
        nrm_img.image = bpy.data.images.load(os.path.join(TEX, asset + '-normal.jpg'), check_existing=True)
        nrm_img.image.colorspace_settings.name = 'Non-Color'
        nrm = nt.nodes.new('ShaderNodeNormalMap'); nrm.inputs['Strength'].default_value = bump * 1.6
        nt.links.new(nrm_img.outputs['Color'], nrm.inputs['Color'])
        nt.links.new(nrm.outputs['Normal'], bsdf.inputs['Normal'])
    else:
        bsdf.inputs['Base Color'].default_value = (*tint, 1)
        if name == 'M_Glass':
            bsdf.inputs['Metallic'].default_value = .3
    m['tile_m'] = tile
    return m

# ------------------------------------------------------------------- builder
class Piece:
    """Accumulates cuboids and polygons into one bmesh with material slots."""
    def __init__(self, name):
        self.name, self.bm, self.slots = name, bmesh.new(), []
        self.rng = random.Random(hash(name) & 0xffff)

    def slot(self, mat):
        if mat not in self.slots:
            self.slots.append(mat)
        return self.slots.index(mat)

    def cuboid(self, x0, x1, y0, y1, z0, z1, mat, rot=None, pivot=None):
        """Axis-aligned box, optionally rotated (Matrix) about pivot."""
        geom = bmesh.ops.create_cube(self.bm, size=1)
        verts = geom['verts']
        sx, sy, sz = x1 - x0, y1 - y0, z1 - z0
        bmesh.ops.scale(self.bm, vec=(sx, sy, sz), verts=verts)
        bmesh.ops.translate(self.bm, vec=((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2), verts=verts)
        if rot is not None:
            p = Vector(pivot) if pivot else Vector(((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2))
            bmesh.ops.rotate(self.bm, cent=p, matrix=rot, verts=verts)
        idx = self.slot(mat)
        for f in {f for v in verts for f in v.link_faces}:
            f.material_index = idx
        return verts

    def beam(self, a, b, width, depth, y0, mat):
        """Timber from point a to b (x, z) in the wall plane, depth along +y from y0."""
        a, b = Vector((a[0], 0, a[1])), Vector((b[0], 0, b[1]))
        d = b - a
        length = d.length
        ang = math.atan2(d.z, d.x)
        mid = (a + b) / 2
        verts = self.cuboid(mid.x - length / 2, mid.x + length / 2, y0, y0 + depth, mid.z - width / 2, mid.z + width / 2, mat)
        bmesh.ops.rotate(self.bm, cent=(mid.x, 0, mid.z), matrix=Matrix.Rotation(-ang, 3, 'Y'), verts=verts)
        return verts

    def prism(self, outline, y0, y1, mat):
        """Extrude an XZ polygon outline (list of (x, z)) from y0 to y1."""
        vs0 = [self.bm.verts.new((x, y0, z)) for x, z in outline]
        vs1 = [self.bm.verts.new((x, y1, z)) for x, z in outline]
        idx = self.slot(mat)
        faces = [self.bm.faces.new(vs0[::-1]), self.bm.faces.new(vs1)]
        n = len(outline)
        for i in range(n):
            j = (i + 1) % n
            faces.append(self.bm.faces.new((vs0[i], vs0[j], vs1[j], vs1[i])))
        for f in faces:
            f.material_index = idx
        bmesh.ops.recalc_face_normals(self.bm, faces=faces)
        return faces

    def finish(self, bevel=.012, cutters=()):
        me = bpy.data.meshes.new(self.name)
        self.bm.to_mesh(me)
        self.bm.free()
        obj = bpy.data.objects.new(self.name, me)
        bpy.context.scene.collection.objects.link(obj)
        for m in self.slots:
            me.materials.append(material(m))
        for c in cutters:
            mod = obj.modifiers.new('cut', 'BOOLEAN'); mod.operation = 'DIFFERENCE'; mod.solver = 'EXACT'; mod.object = c
        if bevel:
            bv = obj.modifiers.new('bevel', 'BEVEL'); bv.width = bevel; bv.segments = 2; bv.limit_method = 'ANGLE'
            bv.angle_limit = math.radians(40); bv.harden_normals = False
        bpy.context.view_layer.objects.active = obj
        for mod in list(obj.modifiers):
            bpy.ops.object.modifier_apply(modifier=mod.name)
        for c in cutters:
            bpy.data.objects.remove(c, do_unlink=True)
        world_uvs(obj)
        for p in me.polygons:
            p.use_smooth = False
        return obj


def cutter(outline, y0=-.5, y1=1.5):
    p = Piece('cutter')
    p.prism(outline, y0, y1, 'M_Dark')
    me = bpy.data.meshes.new('cutter'); p.bm.to_mesh(me); p.bm.free()
    obj = bpy.data.objects.new('cutter', me); bpy.context.scene.collection.objects.link(obj)
    obj.hide_render = True
    return obj


def world_uvs(obj):
    """Planar UVs in metres from the dominant normal, divided by each material's tile size."""
    me = obj.data
    uv = me.uv_layers.new(name='UVMap') if not me.uv_layers else me.uv_layers[0]
    for poly in me.polygons:
        mat = me.materials[poly.material_index] if me.materials else None
        tile = mat.get('tile_m', 2.0) if mat else 2.0
        n = poly.normal
        ax, ay, az = abs(n.x), abs(n.y), abs(n.z)
        for li in poly.loop_indices:
            co = me.vertices[me.loops[li].vertex_index].co
            if az >= ax and az >= ay:
                u, v = co.x, co.y
            elif ay >= ax:
                u, v = co.x, co.z
            else:
                u, v = co.y, co.z
            uv.data[li].uv = (u / tile, v / tile)


def arch_outline(cx, z0, w, h, kind='pointed', steps=10):
    """Opening outline: straight jambs then a pointed, round or flat head."""
    xl, xr = cx - w / 2, cx + w / 2
    if kind == 'flat':
        return [(xl, z0), (xr, z0), (xr, z0 + h), (xl, z0 + h)]
    if kind == 'round':
        spring = z0 + h - w / 2
        pts = [(xl, z0), (xr, z0)]
        pts += [(cx + w / 2 * math.cos(t * math.pi / steps), spring + w / 2 * math.sin(t * math.pi / steps)) for t in range(steps + 1)]
        return pts
    spring = z0 + max(0, h - .866 * w)
    pts = [(xl, z0), (xr, z0)]
    for k in range(steps + 1):
        t = k / steps * math.pi / 3
        pts.append((xl + w * math.cos(t), spring + w * math.sin(t)))
    for k in range(1, steps + 1):
        t = math.pi * 2 / 3 + k / steps * math.pi / 3
        pts.append((xr + w * math.cos(t), spring + w * math.sin(t)))
    return pts


def offset_outline(pts, d):
    """Grow an outline outward by d (for stone surrounds)."""
    cx = sum(p[0] for p in pts) / len(pts)
    zmin = min(p[1] for p in pts)
    out = []
    for x, z in pts:
        dx = x - cx
        out.append((x + math.copysign(d, dx) if abs(dx) > 1e-6 else x, z + (d if z > zmin + 1e-6 else 0)))
    return out

# ------------------------------------------------------------ stone ground
def stone_wall(name, opening=None, w=BAY, h=GROUND_H, t=.55, mat='M_Stone'):
    # Openings are cut only from the plain slab: booleans need a clean closed solid.
    slab = Piece(name + '_slab')
    slab.cuboid(0, w, 0, t, 0, h, mat)
    p = Piece(name)
    p.cuboid(-.01, w + .01, -.07, 0, 0, .38, 'M_StoneDressed')                # chamfered plinth
    p.cuboid(-.01, w + .01, -.05, 0, h - .22, h, 'M_StoneDressed')             # string course
    cutters = []
    if opening:
        kind, ow, oh, sill, head = opening
        cx = w / 2
        hole = arch_outline(cx, sill, ow, oh, head)
        cutters.append(cutter(hole))
        ring = offset_outline(hole, .2)
        # Dressed-stone surround standing proud of the rubble wall.
        sur = Piece(name + '_surround')
        sur.prism(ring, -.06, .08, 'M_StoneDressed')
        sur_obj = sur.finish(bevel=.01, cutters=[cutter(hole)])
        if kind == 'door':
            door = Piece(name + '_door')
            door.prism(arch_outline(cx, 0, ow, oh, head), t * .55, t * .62, 'M_DoorPlanks')
            for z in (.45, oh * .55):
                door.cuboid(cx - ow / 2 + .08, cx + ow / 2 - .08, t * .53, t * .55, z, z + .06, 'M_Iron')
            door.cuboid(cx + ow * .3, cx + ow * .3 + .05, t * .5, t * .55, 1.0, 1.08, 'M_Iron')
            door_obj = door.finish(bevel=.005)
            p.cuboid(cx - ow / 2 - .25, cx + ow / 2 + .25, -.45, 0, 0, .16, 'M_StoneDressed')   # step
        elif kind == 'window':
            win = Piece(name + '_window')
            win.prism(hole, t * .45, t * .47, 'M_Glass')
            win.cuboid(cx - .05, cx + .05, t * .38, t * .5, sill, sill + oh - .05, 'M_StoneDressed')     # mullion
            win.cuboid(cx - ow / 2, cx + ow / 2, t * .38, t * .5, sill + oh * .55, sill + oh * .55 + .08, 'M_StoneDressed')
            win.cuboid(cx - ow / 2 - .12, cx + ow / 2 + .12, -.12, t * .45, sill - .1, sill, 'M_StoneDressed')  # sill
            door_obj = win.finish(bevel=.006)
        else:  # shop: open arcade with a fold-down stall board and a dark interior
            shop = Piece(name + '_shop')
            shop.cuboid(cx - ow / 2, cx + ow / 2, t - .04, t, 0, oh, 'M_Dark')
            shop.cuboid(cx - ow / 2 + .05, cx + ow / 2 - .05, -.35, t * .4, sill - .06, sill, 'M_DoorPlanks')
            for sx in (-1, 1):
                shop.cuboid(cx + sx * (ow / 2 - .12) - .04, cx + sx * (ow / 2 - .12) + .04, -.35, -.27, 0, sill, 'M_Timber')
            door_obj = shop.finish(bevel=.006)
        slab_obj = slab.finish(cutters=cutters)
        return join(name, [slab_obj, p.finish(), sur_obj, door_obj])
    return join(name, [slab.finish(), p.finish()])

# ----------------------------------------------------------- timber upper
def timber_wall(name, pattern='cross', window=True, w=BAY, h=FLOOR_H, plaster='M_Plaster', seed=0):
    rnd = random.Random(seed)
    p = Piece(name)
    T, D = .2, .22                                      # timber width / depth
    jig = lambda a: a + rnd.uniform(-.015, .015)        # hand-hewn irregularity
    cutters = []
    win = (w / 2 - .42, w / 2 + .42, 1.0, 2.05) if window else None
    infill = Piece(name + '_infill')
    infill.cuboid(0, w, .05, .17, 0, h, plaster)        # infill panel, set back behind the timbers
    if win:
        cutters.append(cutter([(win[0], win[2]), (win[1], win[2]), (win[1], win[3]), (win[0], win[3])]))
    # sole plate, head beam, left post, mid rail
    p.beam((0, T / 2), (w, T / 2), T + .04, D, 0, 'M_Timber')
    p.beam((0, h - T / 2), (w, h - T / 2), T, D, 0, 'M_Timber')
    p.beam((T / 2, 0), (T / 2, h), T, D, 0, 'M_Timber')
    rail = .95
    if pattern == 'close':
        for x in [x * .45 + .45 for x in range(int((w - .5) / .45))]:
            if win and win[0] - .1 < x < win[1] + .1 and win[2] - .1 < h * .5:
                p.beam((x, T), (x, win[2]), .13, D, 0, 'M_Timber'); p.beam((x, win[3]), (x, h - T), .13, D, 0, 'M_Timber')
            else:
                p.beam((jig(x), T), (jig(x), h - T), .13, D, 0, 'M_Timber')
    elif pattern == 'cross':
        p.beam((0, rail), (w, rail), .16, D, 0, 'M_Timber')
        for x0, x1 in ((T, w / 2 - .5), (w / 2 + .5, w - .02)) if win else ((T, w / 2), (w / 2, w - .02)):
            p.beam((x0, T), (x1, rail - .08), .14, D - .02, .01, 'M_Timber')
            p.beam((x0, rail - .08), (x1, T), .14, D - .02, .01, 'M_Timber')
        if not win:
            p.beam((w / 2, rail), (w / 2, h - T), .15, D, 0, 'M_Timber')
    else:  # herringbone chevrons in the lower panels
        p.beam((0, rail), (w, rail), .16, D, 0, 'M_Timber')
        for k in range(3):
            z = T + .05 + k * .22
            p.beam((.3, z), (w / 2 - .45, z + .22), .1, D - .03, .015, 'M_Timber')
            p.beam((w - .1, z), (w / 2 + .45, z + .22), .1, D - .03, .015, 'M_Timber')
    if win:
        x0, x1, z0, z1 = win
        for x in (x0 - .08, x1 + .08):
            p.beam((x, z0 - .12), (x, z1 + .12), .16, D, 0, 'M_Timber')
        p.beam((x0 - .16, z0 - .08), (x1 + .16, z0 - .08), .15, D + .05, -.05, 'M_Timber')
        p.beam((x0 - .16, z1 + .08), (x1 + .16, z1 + .08), .15, D, 0, 'M_Timber')
        p.cuboid(x0, x1, .14, .16, z0, z1, 'M_Glass')
        p.cuboid((x0 + x1) / 2 - .035, (x0 + x1) / 2 + .035, .08, .15, z0, z1, 'M_Timber')
        p.cuboid(x0, x1, .08, .15, z0 + (z1 - z0) * .6, z0 + (z1 - z0) * .6 + .06, 'M_Timber')
        # open shutters folded back against the infill
        for sx, xs in ((-1, x0 - .5), (1, x1 + .1)):
            p.cuboid(xs, xs + .4, -.04, -.01, z0, z1, 'M_DoorPlanks')
    return join(name, [p.finish(bevel=.012), infill.finish(bevel=0, cutters=cutters)])


def jetty(name, w=BAY, proj=.45):
    """Bressumer and joist ends where an upper floor oversails the one below."""
    p = Piece(name)
    p.cuboid(0, w, -proj, .3, -.28, 0, 'M_Timber')
    for x in [x * .4 + .2 for x in range(int(w / .4))]:
        p.cuboid(x - .07, x + .07, -proj - .06, -proj + .1, -.42, -.28, 'M_Timber')
    return p.finish(bevel=.01)

# --------------------------------------------------------------------- roofs
def roof(name, depth, w=BAY, mat='M_RoofTile', eave=.45, course=.3, gable_over=0):
    """Two tiled slopes over one bay; ridge along X at y = depth / 2."""
    p = Piece(name)
    rise = depth / 2 * math.tan(PITCH)
    slope = math.hypot(depth / 2 + eave, rise + eave * math.tan(PITCH))
    x0, x1 = -gable_over, w + gable_over
    for side in (-1, 1):
        n = int(slope / course) + 1
        for k in range(n):
            s0 = k * course
            # Each course is a thin slab whose lower edge laps over the course below.
            y_eave, z_eave = (0 - eave, -eave * math.tan(PITCH)) if side < 0 else (depth + eave, -eave * math.tan(PITCH))
            dirv = Vector((0, (depth / 2 - y_eave), rise - z_eave)).normalized()
            start = Vector((0, y_eave, z_eave)) + dirv * s0
            end = Vector((0, y_eave, z_eave)) + dirv * min(slope, s0 + course + .06)
            nrm = Vector((0, -dirv.z, dirv.y)) if side < 0 else Vector((0, dirv.z, -dirv.y))
            nrm = nrm if nrm.z > 0 else -nrm
            lift = .035
            a, b = start + nrm * lift, end + nrm * .005
            outline = [(a.y, a.z), (b.y, b.z), (b.y - nrm.y * .03, b.z - nrm.z * .03), (a.y - nrm.y * .03, a.z - nrm.z * .03)]
            vs0 = [p.bm.verts.new((x0 + p.rng.uniform(-.01, .01), y, z)) for y, z in outline]
            vs1 = [p.bm.verts.new((x1, y, z)) for y, z in outline]
            idx = p.slot(mat)
            faces = [p.bm.faces.new(vs0[::-1]), p.bm.faces.new(vs1)]
            for i in range(4):
                j = (i + 1) % 4
                faces.append(p.bm.faces.new((vs0[i], vs0[j], vs1[j], vs1[i])))
            for f in faces:
                f.material_index = idx
            bmesh.ops.recalc_face_normals(p.bm, faces=faces)
    # ridge tiles
    for x in [x * .4 for x in range(int((x1 - x0) / .4) + 1)]:
        bmesh.ops.create_cone(p.bm, cap_ends=True, segments=8, radius1=.13, radius2=.12, depth=.42,
                              matrix=Matrix.Translation((x0 + x + .2, depth / 2, rise + .08)) @ Matrix.Rotation(math.pi / 2, 4, 'Y'))
    idx = p.slot(mat)
    # fascia boards along both eaves
    for side in (-1, 1):
        y = -eave if side < 0 else depth + eave
        p.cuboid(x0, x1, y - .04 if side < 0 else y, y if side < 0 else y + .04, -eave * math.tan(PITCH) - .22, -eave * math.tan(PITCH) + .02, 'M_Timber')
    return p.finish(bevel=0)


def gable(name, depth, style='timber', plaster='M_Plaster', over=.12):
    """Triangular gable wall spanning x 0..depth, outer face on y = 0."""
    p = Piece(name)
    rise = depth / 2 * math.tan(PITCH)
    tri = [(0, 0), (depth, 0), (depth / 2, rise)]
    if style == 'stone':
        p.prism([(y, z) for y, z in tri], 0, .5, 'M_Stone')
        for s in (-1, 1):   # coping stones up each rake
            a = (0 if s < 0 else depth, 0); b = (depth / 2, rise)
            p.beam(a, b, .22, .7, -.1, 'M_StoneDressed')
    else:
        p.prism([(y, z) for y, z in tri], .05, .17, plaster)
        p.beam((0, .1), (depth, .1), .2, .22, 0, 'M_Timber')
        p.beam((depth * .2, rise * .4), (depth * .8, rise * .4), .18, .22, 0, 'M_Timber')     # collar
        p.beam((depth / 2, .2), (depth / 2, rise - .1), .18, .22, 0, 'M_Timber')              # king post
        for s in (-1, 1):
            a = (depth * (.5 + s * .3), .2); b = (depth / 2, rise * .4)
            p.beam(a, b, .14, .2, .01, 'M_Timber')
            # bargeboard following the roof slope
            p.beam((depth / 2 + s * (depth / 2 + .45), -.4), (depth / 2, rise + .12), .24, .06, -over, 'M_Timber')
    # Canonical like every wall piece: triangle in the XZ plane, body toward +y.
    return p.finish(bevel=.01)


def chimney(name, h=3.2):
    p = Piece(name)
    p.cuboid(-.4, .4, -.5, .5, 0, h, 'M_Brick' if hash(name) % 2 else 'M_Stone')
    p.cuboid(-.5, .5, -.6, .6, h, h + .18, 'M_StoneDressed')
    for y in (-.22, .22):
        bmesh.ops.create_cone(p.bm, cap_ends=True, segments=12, radius1=.14, radius2=.11, depth=.5,
                              matrix=Matrix.Translation((0, y, h + .43)))
    return p.finish(bevel=.01)


def join(name, objs):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    objs[0].name = name
    objs[0].data.name = name
    return objs[0]


# ------------------------------------------------ masonry / rendered upper walls
def solid_wall(name, mat='M_Stone', window='cross', w=BAY, h=FLOOR_H, t=.45, trim='M_StoneDressed', seed=0):
    """Upper-floor wall in ashlar, brick or render with a stone-dressed window.

    window: 'cross' (cross-mullioned with a hood mould), 'lancet' (pointed pair),
    'small' (a single casement with shutters) or None.
    """
    rnd = random.Random(seed)
    slab = Piece(name + '_slab')
    slab.cuboid(0, w, 0, t, 0, h, mat)
    p = Piece(name)
    p.cuboid(-.01, w + .01, -.05, 0, 0, .16, trim)                  # floor string course
    cutters, extra = [], []
    cx = w / 2 + rnd.uniform(-.08, .08)
    if window == 'cross':
        x0, x1, z0, z1 = cx - .55, cx + .55, .75, 2.35
        cutters.append(cutter([(x0, z0), (x1, z0), (x1, z1), (x0, z1)]))
        p.cuboid(x0, x1, t * .5, t * .52, z0, z1, 'M_Glass')
        p.cuboid(cx - .06, cx + .06, t * .3, t * .52, z0, z1, trim)                       # mullion
        p.cuboid(x0, x1, t * .3, t * .52, z0 + 1.0, z0 + 1.12, trim)                      # transom
        for x in (x0 - .14, x1):
            p.cuboid(x, x + .14, -.05, t * .3, z0 - .08, z1 + .08, trim)                  # jambs
        p.cuboid(x0 - .22, x1 + .22, -.14, t * .3, z0 - .16, z0, trim)                    # sill
        p.cuboid(x0 - .26, x1 + .26, -.12, 0, z1 + .06, z1 + .22, trim)                   # hood mould
        for x in (x0 - .26, x1 + .12):
            p.cuboid(x, x + .14, -.12, 0, z1 - .18, z1 + .06, trim)                       # label stops
    elif window == 'lancet':
        for dx in (-.34, .34):
            hole = arch_outline(cx + dx, .8, .5, 1.55, 'pointed', 8)
            cutters.append(cutter(hole))
            win = Piece(name + '_lancet')
            win.prism(hole, t * .5, t * .52, 'M_Glass')
            ring = Piece(name + '_lancet_ring')
            ring.prism(offset_outline(hole, .12), -.05, .06, trim)
            extra += [win.finish(bevel=0), ring.finish(bevel=.006, cutters=[cutter(hole)])]
        p.cuboid(cx - .75, cx + .75, -.12, t * .3, .66, .8, trim)
    elif window == 'small':
        x0, x1, z0, z1 = cx - .38, cx + .38, 1.0, 2.0
        cutters.append(cutter([(x0, z0), (x1, z0), (x1, z1), (x0, z1)]))
        p.cuboid(x0, x1, t * .5, t * .52, z0, z1, 'M_Glass')
        p.cuboid(cx - .03, cx + .03, t * .4, t * .52, z0, z1, 'M_Timber')
        p.cuboid(x0 - .1, x1 + .1, -.12, t * .4, z0 - .1, z0, trim)
        p.cuboid(x0 - .1, x1 + .1, -.06, t * .4, z1, z1 + .12, 'M_Timber')
        for xs in (x0 - .44, x1 + .06):
            p.cuboid(xs, xs + .38, -.04, -.01, z0, z1, 'M_DoorPlanks')
    return join(name, [slab.finish(bevel=0, cutters=cutters), p.finish(bevel=.008)] + extra)


def timber_ground(name, kind='door', w=BAY, h=GROUND_H, plaster='M_Plaster', seed=0):
    """Timber-framed ground floor on a low stone sill wall: plank door or open shop front."""
    T, D = .24, .26
    p = Piece(name)
    infill = Piece(name + '_infill')
    infill.cuboid(0, w, .06, .2, .6, h, plaster)
    p.cuboid(0, w, -.02, .3, 0, .62, 'M_Stone')                       # sill wall
    p.beam((0, .68), (w, .68), .16, D, 0, 'M_Timber')                  # sole plate
    p.beam((0, h - .14), (w, h - .14), .28, D + .04, -.04, 'M_Timber') # heavy lintel beam
    p.beam((T / 2, 0), (T / 2, h), T, D, 0, 'M_Timber')
    cutters, extra = [], []
    cx = w / 2
    if kind == 'door':
        x0, x1, top = cx - .55, cx + .55, 2.3
        cutters.append(cutter([(x0, .5), (x1, .5), (x1, top), (x0, top)]))
        p.cuboid(x0, x1, .1, .14, 0, top, 'M_DoorPlanks')
        for x in (x0 - .1, x1 + .1):
            p.beam((x, 0), (x, top + .1), .2, D, 0, 'M_Timber')
        p.beam((x0 - .2, top + .08), (x1 + .2, top + .08), .18, D, 0, 'M_Timber')
        p.beam((x0 - .2, top + .2), (x0 + .3, h - .3), .12, D - .04, .02, 'M_Timber')   # carved brackets
        p.beam((x1 + .2, top + .2), (x1 - .3, h - .3), .12, D - .04, .02, 'M_Timber')
        p.cuboid(x0 + .15, x1 - .15, .06, .1, 1.0, 1.06, 'M_Iron')
        p.cuboid(x0 - .25, x1 + .25, -.4, .05, 0, .14, 'M_StoneDressed')
    else:
        x0, x1, z0, top = cx - .85, cx + .85, .9, 2.4
        cutters.append(cutter([(x0, z0), (x1, z0), (x1, top), (x0, top)]))
        p.cuboid(x0, x1, .26, .3, z0, top, 'M_Dark')
        for x in (x0 - .1, x1 + .1):
            p.beam((x, 0), (x, top + .1), .2, D, 0, 'M_Timber')
        p.beam((x0 - .2, top + .08), (x1 + .2, top + .08), .18, D, 0, 'M_Timber')
        # The shutter pair: lower one folded down as a counter, upper propped as an awning.
        p.cuboid(x0, x1, -.55, .02, z0 - .07, z0, 'M_DoorPlanks')
        for x in (x0 + .05, x1 - .1):
            p.cuboid(x, x + .05, -.55, -.5, 0, z0 - .07, 'M_Timber')
        awn = Piece(name + '_awning')
        awn.cuboid(x0, x1, -.9, 0, 0, .05, 'M_DoorPlanks')
        ao = awn.finish(bevel=.004)
        ao.data.transform(Matrix.Translation((0, 0, top + .05)) @ Matrix.Rotation(math.radians(18), 4, 'X'))
        extra.append(ao)
    for x in (w * .25, w * .75):
        if abs(x - cx) < (.9 if kind == 'door' else 1.1):
            continue
        p.beam((x, .75), (x, h - .28), .16, D, 0, 'M_Timber')
    return join(name, [p.finish(bevel=.012), infill.finish(bevel=0, cutters=cutters)] + extra)


def stepped_gable(name, width, rise, mat='M_Brick', steps=5, t=.45, trim='M_StoneDressed'):
    """Crow-stepped (Flemish/Hanseatic) gable standing on the facade, x 0..width."""
    p = Piece(name)
    for k in range(steps):
        inset = width / 2 * k / steps
        z0, z1 = rise * k / steps, rise * (k + 1) / steps
        p.cuboid(inset, width - inset, 0, t, z0, z1, mat)
        for x0 in (inset - .06, width - inset - .5):
            p.cuboid(x0, x0 + .56, -.06, t + .06, z1 - .02, z1 + .12, trim)       # step copings
    p.cuboid(width / 2 - .3, width / 2 + .3, -.06, t + .06, rise, rise + .9, mat)   # finial pier
    p.cuboid(width / 2 - .38, width / 2 + .38, -.1, t + .1, rise + .9, rise + 1.04, trim)
    # A small loft door and a pair of ventilation slits.
    p.cuboid(width / 2 - .45, width / 2 + .45, -.02, .02, rise * .12, rise * .12 + 1.6, 'M_DoorPlanks')
    for dx in (-1.1, 1.1):
        p.cuboid(width / 2 + dx - .08, width / 2 + dx + .08, -.02, .02, rise * .45, rise * .45 + .7, 'M_Dark')
    return p.finish(bevel=.01)


def oriel(name, w=1.8, h=2.2, proj=.7, mat='M_Timber', plaster='M_Plaster'):
    """Projecting oriel window: glazed on three sides, carried on corbels, lean-to roof."""
    p = Piece(name)
    p.cuboid(0, w, -proj, 0, 0, .25, mat)
    p.cuboid(0, w, -proj, 0, h - .2, h, mat)
    for x in (0, w - .14):
        p.cuboid(x, x + .14, -proj, -proj + .14, .25, h - .2, mat)
    for x in (w * .33, w * .66):
        p.cuboid(x - .05, x + .05, -proj, -proj + .1, .25, h - .2, mat)
    p.cuboid(.14, w - .14, -proj + .05, -proj + .07, .25, h - .2, 'M_Glass')
    for x in (.02, w - .09):
        p.cuboid(x, x + .07, -proj + .14, -.02, .25, h - .2, 'M_Glass')
    p.cuboid(-.05, w + .05, -proj - .08, 0, .25, .95, plaster)             # panelled apron
    for x in (.15, w / 2, w - .15):
        p.beam((x, -.9), (x, .05), .16, .2, -proj * .7, mat)              # corbels
    roofp = Piece(name + '_roof')
    roofp.cuboid(-.1, w + .1, -proj - .2, .1, 0, .06, 'M_RoofTile')
    ro = roofp.finish(bevel=.004)
    ro.data.transform(Matrix.Translation((0, 0, h)) @ Matrix.Rotation(math.radians(-24), 4, 'X'))
    return join(name, [p.finish(bevel=.01), ro])
