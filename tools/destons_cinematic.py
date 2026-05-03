"""Deston's Trading Post — accurate-scale Blender scene builder.
Run: blender --background --python tools/destons_cinematic.py
Output: exports/destons-trading-post/destons-cinematic.png  +  .blend

Coordinate system: MAP_W=1268, MAP_H=1028 pixels → WORLD_W=18 units.
All positions are taken directly from the sketch — no artistic scaling.
"""

import bpy
import math
import os
from mathutils import Vector, Euler

ROOT       = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
EXPORT_DIR = os.path.join(ROOT, "exports", "destons-trading-post")
os.makedirs(EXPORT_DIR, exist_ok=True)
BLEND_PATH  = os.path.join(EXPORT_DIR, "destons-cinematic.blend")
RENDER_PATH = os.path.join(EXPORT_DIR, "destons-cinematic.png")

# Coordinate system matches sketch dimensions
MAP_W, MAP_H = 1268, 1028
WORLD_W = 18.0
WORLD_H = WORLD_W * MAP_H / MAP_W   # ~14.6

def px(px_x, px_y, z=0.0):
    """Convert sketch pixel coords to world coords."""
    return ((px_x / MAP_W - 0.5) * WORLD_W,
            (0.5 - px_y / MAP_H) * WORLD_H,
            z)

# ── Clear scene ───────────────────────────────────────────────────────────────
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete()
for blk in list(bpy.data.meshes):    bpy.data.meshes.remove(blk)
for blk in list(bpy.data.materials): bpy.data.materials.remove(blk)
for blk in list(bpy.data.lights):    bpy.data.lights.remove(blk)
for blk in list(bpy.data.cameras):   bpy.data.cameras.remove(blk)
for blk in list(bpy.data.curves):    bpy.data.curves.remove(blk)

scene = bpy.context.scene
coll  = scene.collection

# ── Materials ─────────────────────────────────────────────────────────────────
def make_mat(name, rgb, rough=0.85, metal=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    t = m.node_tree
    t.nodes.clear()
    out  = t.nodes.new("ShaderNodeOutputMaterial")
    bsdf = t.nodes.new("ShaderNodeBsdfPrincipled")
    out.location = (300, 0); bsdf.location = (0, 0)
    bsdf.inputs["Base Color"].default_value = (*rgb, 1.0)
    bsdf.inputs["Roughness"].default_value  = rough
    bsdf.inputs["Metallic"].default_value   = metal
    t.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return m

def make_wood_mat(name, rgb=(0.30, 0.18, 0.09)):
    """Dark timber with wood-grain wave bands for texture realism."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    t = m.node_tree
    t.nodes.clear()
    out   = t.nodes.new("ShaderNodeOutputMaterial")
    bsdf  = t.nodes.new("ShaderNodeBsdfPrincipled")
    wave  = t.nodes.new("ShaderNodeTexWave")
    noise = t.nodes.new("ShaderNodeTexNoise")
    mix_c = t.nodes.new("ShaderNodeMixRGB")
    coord = t.nodes.new("ShaderNodeTexCoord")
    out.location=(600,0); bsdf.location=(350,0); mix_c.location=(150,0)
    wave.location=(-50,100); noise.location=(-50,-100); coord.location=(-300,0)
    wave.wave_type = "BANDS"
    wave.inputs["Scale"].default_value      = 14.0
    wave.inputs["Distortion"].default_value = 2.5
    wave.inputs["Detail"].default_value     = 3.0
    noise.inputs["Scale"].default_value     = 22.0
    noise.inputs["Detail"].default_value    = 2.0
    dark = tuple(max(0, c - 0.08) for c in rgb)
    mix_c.blend_type = "MIX"
    mix_c.inputs["Color1"].default_value = (*rgb,  1.0)
    mix_c.inputs["Color2"].default_value = (*dark, 1.0)
    bsdf.inputs["Roughness"].default_value = 0.88
    t.links.new(coord.outputs["Object"], wave.inputs["Vector"])
    t.links.new(coord.outputs["Object"], noise.inputs["Vector"])
    t.links.new(wave.outputs["Fac"],     mix_c.inputs["Fac"])
    t.links.new(mix_c.outputs["Color"],  bsdf.inputs["Base Color"])
    t.links.new(bsdf.outputs["BSDF"],    out.inputs["Surface"])
    return m

def make_stone_mat(name, rgb=(0.40, 0.36, 0.30)):
    """Fieldstone with multi-scale noise for mossy/weathered look."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    t = m.node_tree
    t.nodes.clear()
    out    = t.nodes.new("ShaderNodeOutputMaterial")
    bsdf   = t.nodes.new("ShaderNodeBsdfPrincipled")
    noise1 = t.nodes.new("ShaderNodeTexNoise")   # large blotches
    noise2 = t.nodes.new("ShaderNodeTexNoise")   # fine grain
    ramp   = t.nodes.new("ShaderNodeValToRGB")
    mix_c  = t.nodes.new("ShaderNodeMixRGB")
    coord  = t.nodes.new("ShaderNodeTexCoord")
    out.location=(700,0); bsdf.location=(450,0); mix_c.location=(220,0)
    ramp.location=(0,100); noise1.location=(-200,150); noise2.location=(-200,-50)
    coord.location=(-400,0)
    noise1.inputs["Scale"].default_value   = 5.0
    noise1.inputs["Detail"].default_value  = 2.0
    noise2.inputs["Scale"].default_value   = 18.0
    noise2.inputs["Detail"].default_value  = 4.0
    light = tuple(min(1, c + 0.12) for c in rgb)
    ramp.color_ramp.elements[0].color = (*rgb,   1.0)
    ramp.color_ramp.elements[1].color = (*light, 1.0)
    mix_c.blend_type = "MIX"
    mix_c.inputs["Color1"].default_value = (*rgb, 1.0)
    bsdf.inputs["Roughness"].default_value = 0.92
    t.links.new(coord.outputs["Object"],  noise1.inputs["Vector"])
    t.links.new(coord.outputs["Object"],  noise2.inputs["Vector"])
    t.links.new(noise1.outputs["Fac"],    ramp.inputs["Fac"])
    t.links.new(ramp.outputs["Color"],    mix_c.inputs["Color1"])
    t.links.new(noise2.outputs["Fac"],    mix_c.inputs["Fac"])
    t.links.new(noise2.outputs["Color"],  mix_c.inputs["Color2"])
    t.links.new(mix_c.outputs["Color"],   bsdf.inputs["Base Color"])
    t.links.new(bsdf.outputs["BSDF"],     out.inputs["Surface"])
    return m

def make_noise_mat(name, rgb_dark, rgb_light, scale=9.0, rough=0.95):
    """Blends two colours with a noise texture for natural-looking ground."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    t = m.node_tree
    t.nodes.clear()
    out   = t.nodes.new("ShaderNodeOutputMaterial")
    bsdf  = t.nodes.new("ShaderNodeBsdfPrincipled")
    noise = t.nodes.new("ShaderNodeTexNoise")
    ramp  = t.nodes.new("ShaderNodeValToRGB")
    coord = t.nodes.new("ShaderNodeTexCoord")
    out.location = (600, 0); bsdf.location = (350, 0)
    ramp.location = (150, 100); noise.location = (-50, 100); coord.location = (-250, 100)
    noise.inputs["Scale"].default_value     = scale
    noise.inputs["Detail"].default_value    = 5.0
    noise.inputs["Roughness"].default_value = 0.65
    ramp.color_ramp.elements[0].color = (*rgb_dark,  1.0)
    ramp.color_ramp.elements[1].color = (*rgb_light, 1.0)
    bsdf.inputs["Roughness"].default_value = rough
    t.links.new(coord.outputs["Object"], noise.inputs["Vector"])
    t.links.new(noise.outputs["Fac"],    ramp.inputs["Fac"])
    t.links.new(ramp.outputs["Color"],   bsdf.inputs["Base Color"])
    t.links.new(bsdf.outputs["BSDF"],    out.inputs["Surface"])
    return m

M = {
    "stone":  make_stone_mat("Fieldstone", (0.18, 0.15, 0.12)),
    "metal":  make_mat("Iron",         (0.22, 0.20, 0.18), 0.70, 0.55),
    "wood":   make_wood_mat("Timber",       (0.32, 0.20, 0.10)),
    "dwood":  make_wood_mat("DarkTimber",   (0.16, 0.09, 0.05)),
    "thatch": make_mat("Thatch",      (0.38, 0.28, 0.12), 0.95),
    "roof":   make_mat("DarkRoof",    (0.22, 0.13, 0.07), 0.90),
    "dirt":   make_noise_mat("Dirt",  (0.26, 0.18, 0.10), (0.38, 0.28, 0.16), scale=12),
    "grass":  make_noise_mat("Grass", (0.12, 0.25, 0.07), (0.22, 0.38, 0.13), scale=8),
    "canvas": make_mat("Canvas",      (0.46, 0.44, 0.36), 0.92),
    "leaf":   make_mat("Leaves",      (0.16, 0.30, 0.08), 0.95),
    "gravel": make_noise_mat("Gravel",(0.44, 0.42, 0.34), (0.58, 0.55, 0.46), scale=14),
    "wattle": make_mat("Wattle",      (0.40, 0.30, 0.18), 0.90),
    "hay":    make_mat("Hay",         (0.52, 0.40, 0.16), 0.95),
}

def assign(obj, mat):
    obj.data.materials.clear()
    obj.data.materials.append(mat)

# ── Primitive helpers ─────────────────────────────────────────────────────────
def cube(name, loc, dims, mat_key):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=loc)
    o = bpy.context.object
    o.name = name
    o.dimensions = dims
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    assign(o, M[mat_key])
    return o

def cyl(name, loc, r, h, segs=16, mat_key="stone"):
    bpy.ops.mesh.primitive_cylinder_add(vertices=segs, radius=r, depth=h, location=loc)
    o = bpy.context.object
    o.name = name
    assign(o, M[mat_key])
    return o

def cone_prim(name, loc, r, h, segs=12, mat_key="roof"):
    bpy.ops.mesh.primitive_cone_add(vertices=segs, radius1=r, radius2=0.0,
                                     depth=h, location=loc)
    o = bpy.context.object
    o.name = name
    assign(o, M[mat_key])
    return o

def poly_mesh(name, verts, faces, mat_key):
    me = bpy.data.meshes.new(name + "_mesh")
    me.from_pydata(verts, [], faces)
    me.update()
    ob = bpy.data.objects.new(name, me)
    coll.objects.link(ob)
    assign(ob, M[mat_key])
    return ob

def gable_building(name, cx, cy, wall_w, wall_d, wall_h, roof_rise, mat_walls, mat_roof):
    """Stone/timber box with a hip-gable roof."""
    cube(name + "_walls", (cx, cy, wall_h / 2), (wall_w, wall_d, wall_h), mat_walls)
    hw, hd = wall_w / 2 + 0.15, wall_d / 2 + 0.15
    rz = wall_h
    verts = [
        (cx - hw, cy - hd, rz),   # 0 front-left
        (cx + hw, cy - hd, rz),   # 1 front-right
        (cx + hw, cy + hd, rz),   # 2 back-right
        (cx - hw, cy + hd, rz),   # 3 back-left
        (cx,      cy - hd, rz + roof_rise),  # 4 front ridge
        (cx,      cy + hd, rz + roof_rise),  # 5 back ridge
    ]
    faces = [
        (0, 1, 4),        # front gable
        (2, 3, 5),        # back gable
        (0, 4, 5, 3),     # left slope
        (1, 2, 5, 4),     # right slope
        (3, 2, 1, 0),     # ceiling cap
    ]
    poly_mesh(name + "_roof", verts, faces, mat_roof)

# ── Fort bounds — taken directly from sketch pixels, no scaling ───────────────
WX0 = px(382, 0)[0]   # west palisade wall
WX1 = px(925, 0)[0]   # east palisade wall
WY0 = px(0, 540)[1]   # south palisade wall
WY1 = px(0, 110)[1]   # north palisade wall
GATE_CX  = px(650, 0)[0]
GATE_GAP = 1.05
STAKE_H  = 2.9
PLAT_H   = 1.75
PLAT_W   = 1.05

# ── Ground ────────────────────────────────────────────────────────────────────
cube("Ground", (0, 0, -0.12), (WORLD_W + 60, WORLD_H + 60, 0.24), "grass")

# Dirt courtyard — interior of compound
yd_cx, yd_cy = px(650, 330)[:2]
cyard_w = (WX1 - WX0) - PLAT_W * 2
cyard_d = (WY1 - WY0) - PLAT_W * 2
cube("Courtyard", (yd_cx, yd_cy, 0.015), (cyard_w, cyard_d, 0.03), "dirt")

# Gravel paths
cube("Path_Gate",   (*px(650, 590)[:2], 0.01), (1.05, 2.5, 0.02), "gravel")
cube("Path_South",  (*px(650, 720)[:2], 0.01), (1.05, 4.5, 0.02), "gravel")

# ── Compound walls — correct palisade design ──────────────────────────────────
# (WX0/WX1/WY0/WY1/STAKE_H/PLAT_H/PLAT_W defined above near ground)

def _palisade_wall(label, ax, ay, bx, by, inward_dx, inward_dy, n_stakes, split_gate=False):
    """Build one side of the palisade: outer stakes + inner fighting platform."""
    wall_len = math.hypot(bx - ax, by - ay)

    # ── Fighting platform (solid timber deck, inside of stakes) ──────────────
    plat_cx = (ax + bx) / 2 + inward_dx * PLAT_W / 2
    plat_cy = (ay + by) / 2 + inward_dy * PLAT_W / 2
    # platform thickness along wall = full wall length; depth = PLAT_W; height = PLAT_H
    is_ns   = abs(inward_dy) > 0.5          # north/south wall (platform runs east-west)
    px_dim  = (wall_len, PLAT_W, PLAT_H) if is_ns else (PLAT_W, wall_len, PLAT_H)
    cube(f"Plat_{label}", (plat_cx, plat_cy, PLAT_H / 2), px_dim, "wood")

    # Outer facing boards (thin fascia on stake face, visual detail)
    face_cx = (ax + bx) / 2
    face_cy = (ay + by) / 2
    fd = (wall_len, 0.08, PLAT_H) if is_ns else (0.08, wall_len, PLAT_H)
    cube(f"Plat_{label}_face", (face_cx, face_cy, PLAT_H / 2), fd, "dwood")

    # Support posts on INNER edge of platform every ~1.4 units
    n_supp = max(2, int(wall_len / 1.4))
    for i in range(n_supp):
        t2 = i / max(n_supp - 1, 1)
        sx = ax + (bx - ax) * t2 + inward_dx * PLAT_W
        sy = ay + (by - ay) * t2 + inward_dy * PLAT_W
        cyl(f"Supp_{label}_{i:02d}", (sx, sy, PLAT_H * 0.45),
            0.095, PLAT_H * 0.9, segs=6, mat_key="dwood")

    # ── Outer palisade stakes ─────────────────────────────────────────────────
    for i in range(n_stakes):
        t2 = i / max(n_stakes - 1, 1)
        sx = ax + (bx - ax) * t2
        sy = ay + (by - ay) * t2
        if split_gate and abs(sx - GATE_CX) < GATE_GAP + 0.12:
            continue
        cyl(f"Stake_{label}_{i:02d}", (sx, sy, STAKE_H / 2),
            0.042, STAKE_H, segs=6, mat_key="dwood")

# North wall — platform extends inward (-Y from WY1)
_palisade_wall("N", WX0, WY1, WX1, WY1, 0, -1, 72)
# South wall — platform extends inward (+Y from WY0), gate gap
_palisade_wall("S", WX0, WY0, WX1, WY0, 0,  1, 66, split_gate=True)
# East wall  — platform extends inward (-X from WX1)
_palisade_wall("E", WX1, WY0, WX1, WY1,-1,  0, 58)
# West wall  — platform extends inward (+X from WX0)
_palisade_wall("W", WX0, WY0, WX0, WY1, 1,  0, 58)

# ── Gate structure ────────────────────────────────────────────────────────────
cube("Gate_Post_L", (GATE_CX - GATE_GAP - 0.25, WY0, STAKE_H * 0.55),
     (0.45, 0.45, STAKE_H * 1.10), "dwood")
cube("Gate_Post_R", (GATE_CX + GATE_GAP + 0.25, WY0, STAKE_H * 0.55),
     (0.45, 0.45, STAKE_H * 1.10), "dwood")
cube("Gate_Lintel", (GATE_CX, WY0, STAKE_H * 1.05),
     (GATE_GAP * 2 + 0.1, 0.35, 0.45), "dwood")
# Gate doors (ajar)
cube("Gate_Door_L", (GATE_CX - GATE_GAP * 0.5, WY0 + 0.6, STAKE_H * 0.48),
     (0.12, 1.4, STAKE_H * 0.90), "dwood")
cube("Gate_Door_R", (GATE_CX + GATE_GAP * 0.5, WY0 + 0.6, STAKE_H * 0.48),
     (0.12, 1.4, STAKE_H * 0.90), "dwood")

# ── Inner railing on each fighting platform ───────────────────────────────────
# Low fence on the compound-facing edge so defenders don't fall off
RAIL_H = 0.52

def _platform_railing(label, ax, ay, bx, by, idx, idy):
    """Railing along the inner edge of a fighting platform."""
    # Inner edge runs parallel to wall, offset inward by PLAT_W
    rx0, ry0 = ax + idx * PLAT_W, ay + idy * PLAT_W
    rx1, ry1 = bx + idx * PLAT_W, by + idy * PLAT_W
    wlen = math.hypot(rx1 - rx0, ry1 - ry0)
    n_posts = max(3, int(wlen / 1.6))
    for i in range(n_posts):
        t3 = i / max(n_posts - 1, 1)
        rpx = rx0 + (rx1 - rx0) * t3
        rpy = ry0 + (ry1 - ry0) * t3
        cyl(f"Rail_{label}_p{i}", (rpx, rpy, PLAT_H + RAIL_H / 2),
            0.038, RAIL_H, segs=5, mat_key="dwood")
    # Horizontal top rail
    rcx, rcy = (rx0 + rx1) / 2, (ry0 + ry1) / 2
    is_ns = abs(idy) > 0.5
    rdims = (wlen, 0.055, 0.055) if is_ns else (0.055, wlen, 0.055)
    cube(f"Rail_{label}_top", (rcx, rcy, PLAT_H + RAIL_H), rdims, "dwood")
    # Mid rail
    cube(f"Rail_{label}_mid", (rcx, rcy, PLAT_H + RAIL_H * 0.55), rdims, "dwood")

_platform_railing("N",   WX0,             WY1, WX1,             WY1,  0, -1)
_platform_railing("E",   WX1,             WY0, WX1,             WY1, -1,  0)
_platform_railing("W",   WX0,             WY0, WX0,             WY1,  1,  0)
_platform_railing("S_L", WX0,             WY0, GATE_CX-GATE_GAP, WY0, 0,  1)
_platform_railing("S_R", GATE_CX+GATE_GAP, WY0, WX1,            WY0,  0,  1)

# ── Platform access ladders (2 per long wall, 1 per short section) ────────────
def _ladder(name, cx4, cy4, rot_z=0.0):
    """Fixed vertical ladder from ground up to fighting platform."""
    n_rungs = int(PLAT_H / 0.32)
    for i in range(n_rungs):
        rz = 0.18 + i * (PLAT_H - 0.18) / max(n_rungs - 1, 1)
        rung = cube(f"Rung_{name}_{i}", (cx4, cy4, rz), (0.48, 0.055, 0.042), "wood")
        rung.rotation_euler[2] = rot_z
    cube(f"Lad_{name}_L", (cx4, cy4, PLAT_H / 2), (0.042, 0.042, PLAT_H), "dwood")
    cube(f"Lad_{name}_R", (cx4, cy4, PLAT_H / 2), (0.042, 0.042, PLAT_H), "dwood")

# North wall — two ladders, one each side of centre
_ladder("N_L", WX0 + (WX1-WX0)*0.28, WY1 - PLAT_W + 0.12)
_ladder("N_R", WX0 + (WX1-WX0)*0.72, WY1 - PLAT_W + 0.12)
# East wall
_ladder("E",   WX1 - PLAT_W + 0.12, WY0 + (WY1-WY0)*0.50, math.radians(90))
# West wall
_ladder("W",   WX0 + PLAT_W - 0.12, WY0 + (WY1-WY0)*0.50, math.radians(90))
# South wall (one each side of gate)
_ladder("S_L", WX0 + (GATE_CX-GATE_GAP-WX0)*0.55, WY0 + PLAT_W - 0.12)
_ladder("S_R", GATE_CX+GATE_GAP + (WX1-GATE_CX-GATE_GAP)*0.45, WY0 + PLAT_W - 0.12)

# ── Wall braziers with fire glow ───────────────────────────────────────────────
# Iron baskets on posts every ~3 units along the platform surface
_braz_z = PLAT_H   # base of post is at platform level

def _brazier(name, bx, by):
    cyl(f"Braz_{name}_post", (bx, by, _braz_z + 0.50), 0.038, 1.0, segs=6, mat_key="metal")
    cube(f"Braz_{name}_basket", (bx, by, _braz_z + 1.12), (0.22, 0.22, 0.20), "metal")
    bpy.ops.object.light_add(type="POINT", location=(bx, by, _braz_z + 1.38))
    bl = bpy.context.object
    bl.data.energy = 22; bl.data.color = (1.0, 0.52, 0.22)
    bl.data.shadow_soft_size = 0.18

# Place braziers along each wall face on the platform
for i, t4 in enumerate([0.2, 0.5, 0.8]):
    _brazier(f"N{i}", WX0 + (WX1-WX0)*t4,    WY1 - PLAT_W * 0.5)
    _brazier(f"S{i}", WX0 + (WX1-WX0)*t4,    WY0 + PLAT_W * 0.5)
for i, t4 in enumerate([0.3, 0.7]):
    _brazier(f"E{i}", WX1 - PLAT_W * 0.5,    WY0 + (WY1-WY0)*t4)
    _brazier(f"W{i}", WX0 + PLAT_W * 0.5,    WY0 + (WY1-WY0)*t4)

# ── Corner towers (positioned at scaled compound corners) ─────────────────────
TR = 1.0                          # wider towers for bigger fort
TH = STAKE_H + 1.6                # towers rise above the palisade stakes

def add_tower(name, tx, ty):
    cyl(name + "_body", (tx, ty, TH / 2), TR, TH, segs=14, mat_key="stone")
    # Flat fighting top — no cone, soldiers stand up here
    cube(name + "_top_deck", (tx, ty, TH + 0.14), (TR * 2.2, TR * 2.2, 0.28), "wood")
    # 8 stone merlons around the parapet edge
    for j in range(8):
        ang = j * math.pi / 4
        cx3 = tx + (TR - 0.06) * math.cos(ang)
        cy3 = ty + (TR - 0.06) * math.sin(ang)
        cube(f"{name}_merlon_{j}", (cx3, cy3, TH + 0.56), (0.24, 0.24, 0.60), "stone")
    # Thin top cap ring (raised lip at edge)
    cyl(name + "_cap", (tx, ty, TH + 0.27), TR + 0.14, 0.06, segs=14, mat_key="stone")

# Place towers at the four scaled compound corners
for t_name, tx2, ty2 in [
    ("Tower_NW", WX0, WY1), ("Tower_NE", WX1, WY1),
    ("Tower_SW", WX0, WY0), ("Tower_SE", WX1, WY0),
]:
    add_tower(t_name, tx2, ty2)

# ── 5. Deston's Hall (upper-left) ─────────────────────────────────────────────
hall_cx, hall_cy = px(520, 230)[:2]
gable_building("Hall", hall_cx, hall_cy, 2.3, 1.8, 2.4, 1.3, "stone", "roof")
cube("Hall_Chimney",  (hall_cx - 0.75, hall_cy + 0.62, 3.3),  (0.34, 0.34, 1.6), "stone")
cube("Hall_Door",     (hall_cx,        hall_cy - 0.92, 1.05), (0.55, 0.10, 2.0), "dwood")
cube("Hall_Win_L",    (hall_cx - 0.70, hall_cy - 0.92, 1.60), (0.44, 0.10, 0.55), "dwood")
cube("Hall_Win_R",    (hall_cx + 0.70, hall_cy - 0.92, 1.60), (0.44, 0.10, 0.55), "dwood")

# ── 4. Storage (round wattle hut) ─────────────────────────────────────────────
st_cx, st_cy = px(665, 240)[:2]
cyl("Storage_Walls", (st_cx, st_cy, 1.1), 0.65, 2.2, segs=20, mat_key="wattle")
cone_prim("Storage_Roof", (st_cx, st_cy, 2.3), 0.82, 1.1, segs=20, mat_key="thatch")
cube("Storage_Door", (st_cx, st_cy - 0.66, 0.9), (0.35, 0.10, 1.7), "dwood")

# ── 3. Stable (open timber shed) ──────────────────────────────────────────────
sb_cx, sb_cy = px(790, 318)[:2]
SBW, SBD, SBH = 2.1, 2.7, 2.2

cube("Stable_Back",  (sb_cx, sb_cy + SBD / 2, SBH / 2), (SBW, 0.18, SBH), "wood")
cube("Stable_Wall_L",(sb_cx - SBW / 2, sb_cy, SBH / 4), (0.18, SBD, SBH / 2), "wood")
cube("Stable_Wall_R",(sb_cx + SBW / 2, sb_cy, SBH / 4), (0.18, SBD, SBH / 2), "wood")
# Corner support posts
for dx2, dy2 in [(-SBW / 2 + 0.12, -SBD / 2 + 0.18),
                  (SBW / 2 - 0.12, -SBD / 2 + 0.18),
                  (-SBW / 2 + 0.12,  SBD / 2 - 0.18),
                  (SBW / 2 - 0.12,  SBD / 2 - 0.18)]:
    cyl(f"SPost_{dx2:.1f}_{dy2:.1f}",
        (sb_cx + dx2, sb_cy + dy2, SBH / 2), 0.07, SBH, segs=6, mat_key="dwood")
# Lean-to roof (shed style: slopes up toward back)
hx, hy = SBW / 2 + 0.18, SBD / 2 + 0.18
poly_mesh("Stable_Roof",
          [(sb_cx - hx, sb_cy - hy, SBH),
           (sb_cx + hx, sb_cy - hy, SBH),
           (sb_cx + hx, sb_cy + hy, SBH + 0.70),
           (sb_cx - hx, sb_cy + hy, SBH + 0.70)],
          [(0, 1, 2, 3), (3, 2, 1, 0)], "thatch")
# Hay bales
for bx2, by2 in [(sb_cx - 0.62, sb_cy + 0.50), (sb_cx + 0.52, sb_cy - 0.30)]:
    cube(f"Hay_{bx2:.1f}", (bx2, by2, 0.30), (0.62, 0.40, 0.58), "hay")
cube("Trough", (sb_cx - 0.85, sb_cy - SBD / 2 - 0.50, 0.30), (1.05, 0.35, 0.58), "wood")

# ── 2. Guesthouse (lower-left) ────────────────────────────────────────────────
gh_cx, gh_cy = px(525, 440)[:2]
gable_building("Guest", gh_cx, gh_cy, 2.5, 1.4, 2.1, 1.0, "stone", "roof")
cube("Guest_Chimney", (gh_cx + 0.82, gh_cy + 0.50, 2.75), (0.32, 0.32, 1.3), "stone")
cube("Guest_Door",    (gh_cx, gh_cy - 0.72, 1.00), (0.50, 0.10, 1.9), "dwood")
cube("Guest_Win_L",   (gh_cx - 0.72, gh_cy - 0.72, 1.60), (0.40, 0.10, 0.52), "dwood")
cube("Guest_Win_R",   (gh_cx + 0.72, gh_cy - 0.72, 1.60), (0.40, 0.10, 0.52), "dwood")

# ── 1. Market yard stalls ─────────────────────────────────────────────────────
for i, (mpx, mpy) in enumerate([(500, 340), (595, 340), (540, 305)]):
    mx, my = px(mpx, mpy)[:2]
    cube(f"Stall_Table_{i}", (mx, my, 0.26), (0.72, 0.30, 0.52), "wood")
    cube(f"Stall_Roof_{i}",  (mx, my, 1.25), (0.88, 0.58, 0.10), "thatch")
    for dx3 in (-0.40, 0.40):
        cyl(f"StallPost_{i}_{dx3:.1f}", (mx + dx3, my, 0.65),
            0.050, 1.30, segs=6, mat_key="dwood")

# Market well (centre of yard)
wx, wy = px(548, 350)[:2]
cyl("Well_Ring",  (wx, wy, 0.42), 0.30, 0.84, segs=16, mat_key="stone")
cube("Well_PostL", (wx - 0.33, wy, 1.12), (0.08, 0.08, 1.0), "dwood")
cube("Well_PostR", (wx + 0.33, wy, 1.12), (0.08, 0.08, 1.0), "dwood")
cube("Well_Beam",  (wx, wy, 1.65), (0.72, 0.08, 0.08), "dwood")

# Barrels / crates
for i, (bp_x, bp_y) in enumerate([(475, 370), (620, 300), (570, 370)]):
    bx2, by2 = px(bp_x, bp_y)[:2]
    if i % 2 == 0:
        cyl(f"Barrel_{i}", (bx2, by2, 0.42), 0.24, 0.84, segs=10, mat_key="wood")
    else:
        cube(f"Crate_{i}", (bx2, by2, 0.26), (0.50, 0.50, 0.52), "dwood")

# Inner campfire
fire_x, fire_y = px(548, 390)[:2]
cyl("YardFire_Ring", (fire_x, fire_y, 0.05), 0.18, 0.10, segs=10, mat_key="stone")
cube("YardFire_LogA", (fire_x, fire_y, 0.12), (0.52, 0.09, 0.09), "dwood")
cube("YardFire_LogB", (fire_x, fire_y, 0.12), (0.09, 0.52, 0.09), "dwood")

# ── 6. Campsite (east of map) ──────────────────────────────────────────────────
def make_tent(name, cx2, cy2, half_w, half_d, height, mat_key="canvas"):
    vts = [(cx2 - half_w, cy2 - half_d, 0.04),
           (cx2 + half_w, cy2 - half_d, 0.04),
           (cx2 + half_w, cy2 + half_d, 0.04),
           (cx2 - half_w, cy2 + half_d, 0.04),
           (cx2, cy2, height)]
    fcs = [(0, 1, 4), (1, 2, 4), (2, 3, 4), (3, 0, 4), (3, 2, 1, 0)]
    poly_mesh(name, vts, fcs, mat_key)

# ── 6. Campsite (east of compound) ───────────────────────────────────────────
# Sketch shows wagon-wheel camp symbol just east of the east palisade wall.
# Two tents, central campfire with seating, and two wagons.
camp6_x, camp6_y = px(1086, 510)[:2]
make_tent("Camp6_TentA", camp6_x - 1.0, camp6_y + 0.8, 0.90, 1.15, 1.2)
make_tent("Camp6_TentB", camp6_x + 0.6, camp6_y - 0.8, 0.75, 0.95, 1.0)

c6f_x, c6f_y = px(1086, 570)[:2]
cyl("Camp6_Fire_Ring", (c6f_x, c6f_y, 0.06), 0.28, 0.10, segs=12, mat_key="stone")
cube("Camp6_Fire_LogA", (c6f_x, c6f_y, 0.10), (0.60, 0.09, 0.09), "dwood")
cube("Camp6_Fire_LogB", (c6f_x, c6f_y, 0.10), (0.09, 0.60, 0.09), "dwood")
bpy.ops.object.light_add(type="POINT", location=(c6f_x, c6f_y, 0.55))
c6_light = bpy.context.object
c6_light.data.energy = 65; c6_light.data.color = (1.0, 0.55, 0.22)

# Seating logs around camp 6 fire
for _ang, _r in [(0, 0.65), (110, 0.65), (220, 0.65)]:
    _a = math.radians(_ang)
    cube(f"C6Seat_{_ang}", (c6f_x + math.cos(_a)*_r, c6f_y + math.sin(_a)*_r, 0.16),
         (0.70, 0.20, 0.28), "dwood")

# Two wagons at camp 6
for _i, (_wpx, _wpy) in enumerate([(1040, 460), (1140, 560)]):
    _wgx, _wgy = px(_wpx, _wpy)[:2]
    cube(f"C6Wagon_Body_{_i}", (_wgx, _wgy, 0.55), (2.0, 1.0, 0.85), "wood")
    for _wdx, _wdy in [(-0.8,-0.55),(0.8,-0.55),(-0.8,0.55),(0.8,0.55)]:
        cyl(f"C6Wagon_Whl_{_i}_{_wdx:.0f}", (_wgx+_wdx, _wgy+_wdy, 0.38),
            0.38, 0.16, segs=10, mat_key="dwood")

# Gravel path from east palisade toward camp 6
cube("Path_East", (*px(1000, 550)[:2], 0.01), (2.8, 0.95, 0.02), "gravel")

# ── 7. Meridian Campsite (south of map) ───────────────────────────────────────
# Three tents in a cluster; campfire between wagons; seating logs.
for i, (tpx, tpy, sc) in enumerate([(480, 895, 1.0), (635, 905, 1.15), (785, 888, 1.0)]):
    make_tent(f"MTent_{i}", *px(tpx, tpy)[:2], 1.10 * sc, 1.45 * sc, 1.35 * sc)

mcf_x, mcf_y = px(640, 855)[:2]
cyl("MCFire_Ring", (mcf_x, mcf_y, 0.08), 0.28, 0.14, segs=12, mat_key="stone")
cube("MCFire_LogA", (mcf_x, mcf_y, 0.12), (0.60, 0.10, 0.10), "dwood")
cube("MCFire_LogB", (mcf_x, mcf_y, 0.12), (0.10, 0.60, 0.10), "dwood")
bpy.ops.object.light_add(type="POINT", location=(mcf_x, mcf_y, 0.55))
mc_light = bpy.context.object
mc_light.data.energy = 65; mc_light.data.color = (1.0, 0.55, 0.22)
# Seating logs
for _ang in [30, 150, 270]:
    _a = math.radians(_ang)
    cube(f"MCSeat_{_ang}", (mcf_x + math.cos(_a)*0.70, mcf_y + math.sin(_a)*0.70, 0.16),
         (0.70, 0.20, 0.28), "dwood")

# Two wagons flanking meridian camp
for i, (wpx, wpy) in enumerate([(440, 855), (840, 855)]):
    wgx, wgy = px(wpx, wpy)[:2]
    cube(f"Wagon_Body_{i}", (wgx, wgy, 0.58), (2.2, 1.0, 0.90), "wood")
    for wdx, wdy in [(-0.85,-0.55),(0.85,-0.55),(-0.85,0.55),(0.85,0.55)]:
        cyl(f"Wagon_Wheel_{i}_{wdx}", (wgx+wdx, wgy+wdy, 0.42),
            0.42, 0.16, segs=10, mat_key="dwood")
    cube(f"Wagon_Rail_{i}", (wgx, wgy, 1.08), (2.3, 0.09, 0.24), "dwood")

# Gravel path: gate south → Meridian
cube("Path_South_Ext", (*px(650, 775)[:2], 0.01), (1.05, 5.5, 0.02), "gravel")

# ── Trees ─────────────────────────────────────────────────────────────────────
tree_data = [
    # (sketch_px, sketch_py, canopy_radius, trunk_height)
    (168, 340, 0.52, 1.45),   # far west mid
    (174, 985, 0.42, 1.15),   # far west south
    (788, 712, 0.58, 1.55),   # south of east wall
    (320,  30, 0.36, 0.98),   # north-west corner
    (560, 995, 0.40, 1.05),   # south, near Meridian
    (940, 220, 0.44, 1.18),   # north-east, just outside east wall
    (940, 460, 0.40, 1.05),   # east of compound, middle height
    (840, 780, 0.38, 1.02),   # south-east, between compound and Meridian
]
# Deterministic pseudo-random scale jitter per tree index
_jitter = [(0.9,1.1,0.7),(1.1,0.9,0.8),(0.85,1.05,0.75),(1.0,1.0,0.70),
           (1.05,0.92,0.78),(0.92,1.08,0.72),(1.0,1.0,0.68),(0.95,1.0,0.74),(1.08,0.9,0.71)]
for i, (tpx, tpy, tr2, th2) in enumerate(tree_data):
    txw, tyw = px(tpx, tpy)[:2]
    cyl(f"Tree_{i}_trunk", (txw, tyw, th2 * 0.35), 0.075, th2 * 0.70, segs=8, mat_key="dwood")
    leaf_rgb = (0.13 + (i % 3) * 0.025, 0.26 + (i % 2) * 0.04, 0.08 + (i % 4) * 0.015)
    lmat = make_mat(f"Leaf_{i}", leaf_rgb, 0.95)
    # Ico-sphere for rougher, more natural canopy shape
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=tr2,
                                           location=(txw, tyw, th2 * 0.75))
    ts = bpy.context.object
    ts.name = f"Tree_{i}_canopy"
    jx, jy, jz = _jitter[i % len(_jitter)]
    ts.scale = (jx, jy, jz)
    bpy.ops.object.transform_apply(scale=True)
    ts.data.materials.clear()
    ts.data.materials.append(lmat)

# ── Lighting ──────────────────────────────────────────────────────────────────
bpy.ops.object.light_add(type="SUN", location=(0, 0, 10))
sun = bpy.context.object
sun.name = "Sun"
# High overhead sun (X=20° = 70° above horizon from south-west)
# Low X rotation = steep sun angle = short shadows, map stays readable
sun.rotation_euler = Euler((math.radians(20), 0, math.radians(-40)), "XYZ")
sun.data.energy = 5.5
sun.data.color  = (1.0, 0.96, 0.88)   # bright midday
sun.data.angle  = math.radians(3)

bpy.ops.object.light_add(type="AREA", location=(0, 4, 9))
fill = bpy.context.object
fill.name = "SkyFill"
fill.data.energy = 35
fill.data.size   = 14
fill.data.color  = (0.82, 0.90, 1.0)

# Campfire glow lights
for cf_px2, cf_py2 in [(548, 390), (760, 850), (1010, 680)]:
    bpy.ops.object.light_add(type="POINT", location=(*px(cf_px2, cf_py2)[:2], 0.55))
    fl = bpy.context.object
    fl.data.energy           = 85
    fl.data.color            = (1.0, 0.55, 0.25)
    fl.data.shadow_soft_size = 0.35

# ── World sky ─────────────────────────────────────────────────────────────────
world = bpy.data.worlds.new("Sky")
scene.world = world
world.use_nodes = True
wt = world.node_tree
wt.nodes.clear()
bg_nd  = wt.nodes.new("ShaderNodeBackground")
out_nd = wt.nodes.new("ShaderNodeOutputWorld")
bg_nd.inputs["Color"].default_value    = (0.38, 0.60, 0.88, 1.0)  # clear afternoon blue
bg_nd.inputs["Strength"].default_value = 0.9
out_nd.location = (200, 0)
wt.links.new(bg_nd.outputs["Background"], out_nd.inputs["Surface"])

# ── Camera — orthographic map view, showing the full sketch area ──────────────
bpy.ops.object.camera_add()
cam = bpy.context.object
cam.name = "Camera"
scene.camera = cam
cam.data.type     = "ORTHO"
cam.data.clip_end = 300

# Slight north-facing tilt (~28° from vertical) so buildings show height while
# the ground layout reads like the sketch.  ortho_scale covers WORLD_W=18 +margin.
cam_pos = Vector((1.5, -14.0, 28.0))
look_at = Vector(( 1.5,  -1.0,  0.0))   # centred on full scene (compound + south camps)
cam.location       = cam_pos
cam.rotation_euler = (look_at - cam_pos).to_track_quat("-Z", "Y").to_euler()
cam.data.ortho_scale = 27.0

# ── Render settings ───────────────────────────────────────────────────────────
# Match sketch aspect ratio (1268 × 1028 = 1.233 : 1) for undistorted layout
scene.render.resolution_x = 1920
scene.render.resolution_y = 1557
scene.render.image_settings.file_format = "PNG"
scene.view_settings.view_transform = "Filmic"
scene.view_settings.look = "Medium High Contrast"
scene.view_settings.exposure = 0.12
scene.render.filepath = RENDER_PATH

scene.render.engine        = "CYCLES"
scene.cycles.samples       = 128
scene.cycles.use_denoising = True
# Use Metal GPU on Mac if available, otherwise CPU
try:
    bpy.context.preferences.addons["cycles"].preferences.compute_device_type = "METAL"
    scene.cycles.device = "GPU"
except Exception:
    scene.cycles.device = "CPU"

# ── Save .blend and render ─────────────────────────────────────────────────────
bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)
print(f"[OK] .blend saved → {BLEND_PATH}")

bpy.ops.render.render(write_still=True)
print(f"[OK] Rendered   → {RENDER_PATH}")
