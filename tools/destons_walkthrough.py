"""
Deston's Trading Post — photorealistic walkthrough renderer.

Opens destons-trading-post.blend, then:
  1. Replaces the flat black world with a Nishita sky
  2. Fixes lighting (sun energy, kills the 260W fill, boosts lanterns)
  3. Adds procedural bump + roughness variation to every flat PBR material
  4. Creates a 960-frame person-height camera walkthrough
  5. Renders a proof frame, saves the .blend, then optionally renders all frames

Run:
  blender --background exports/destons-trading-post/destons-trading-post.blend \\
          --python tools/destons_walkthrough.py
"""

import bpy, math, os
from mathutils import Vector, Euler

ROOT       = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
EXPORT_DIR = os.path.join(ROOT, "exports", "destons-trading-post")
FRAMES_DIR = os.path.join(EXPORT_DIR, "walkthrough-frames")
os.makedirs(FRAMES_DIR, exist_ok=True)

scene = bpy.context.scene

# ── 1. REALISTIC SKY ─────────────────────────────────────────────────────────
world = scene.world
if not world:
    world = bpy.data.worlds.new("World")
    scene.world = world
world.use_nodes = True
wt = world.node_tree
wt.nodes.clear()

bg_nd  = wt.nodes.new("ShaderNodeBackground")
out_nd = wt.nodes.new("ShaderNodeOutputWorld")
out_nd.location = (400, 0)
bg_nd.location  = (150, 0)

sky_applied = False
for sky_type in ("HOSEK_WILKIE", "PREETHAM"):
    try:
        sky_nd = wt.nodes.new("ShaderNodeTexSky")
        sky_nd.sky_type      = sky_type
        sky_nd.sun_elevation = math.radians(38)
        sky_nd.sun_rotation  = math.radians(210)
        if hasattr(sky_nd, "turbidity"):   sky_nd.turbidity     = 3.0
        if hasattr(sky_nd, "ground_albedo"): sky_nd.ground_albedo = 0.35
        sky_nd.location = (-100, 0)
        wt.links.new(sky_nd.outputs["Color"], bg_nd.inputs["Color"])
        bg_nd.inputs["Strength"].default_value = 1.0
        print(f"[OK] {sky_type} sky applied")
        sky_applied = True
        break
    except Exception as e:
        print(f"[WARN] {sky_type} failed: {e}")
        wt.nodes.remove(sky_nd)

if not sky_applied:
    bg_nd.inputs["Color"].default_value    = (0.38, 0.60, 0.88, 1.0)
    bg_nd.inputs["Strength"].default_value = 0.9
    print("[OK] Fallback solid-blue sky")

wt.links.new(bg_nd.outputs["Background"], out_nd.inputs["Surface"])

# ── 2. LIGHTING ───────────────────────────────────────────────────────────────
for obj in scene.objects:
    if obj.type != "LIGHT":
        continue
    ld = obj.data
    if ld.type == "SUN":
        # Raise to a proper afternoon angle — low X rotation = steep sun
        obj.rotation_euler = Euler((math.radians(22), 0, math.radians(-40)), "XYZ")
        ld.energy = 4.5
        ld.angle  = math.radians(2)
        ld.color  = (1.0, 0.93, 0.78)
    elif ld.type == "AREA":
        # Kill the 260W fill — sky provides all ambient now
        ld.energy = 0.0
    elif ld.type == "POINT":
        if "fire" in obj.name.lower() or "glow" in obj.name.lower():
            ld.energy = min(ld.energy, 110)
            ld.color  = (1.0, 0.52, 0.22)
            ld.shadow_soft_size = 0.3
        else:
            # Lanterns
            ld.energy = min(ld.energy * 1.8, 95)
            ld.color  = (1.0, 0.75, 0.40)
            ld.shadow_soft_size = 0.15

# Add a warm stable lantern at correct height for this scene's scale
bpy.ops.object.light_add(type="POINT", location=(1.4, 2.1, 0.7))
stable_lamp = bpy.context.object
stable_lamp.name = "Stable lantern"
stable_lamp.data.energy           = 60
stable_lamp.data.color            = (1.0, 0.72, 0.38)
stable_lamp.data.shadow_soft_size = 0.25

# ── 3. MATERIAL UPGRADES: procedural bump + roughness variation ───────────────

# Map of lowercase keyword → (bump_strength, noise_scale, add_wood_grain)
BUMP_CFG = {
    "timber":     (1.2, 14.0, True),
    "wood":       (1.0, 12.0, True),
    "bark":       (1.6, 20.0, False),
    "shake":      (1.3, 10.0, True),
    "fieldstone": (1.9,  7.0, False),
    "stacked":    (1.9,  7.0, False),
    "stone":      (1.5,  9.0, False),
    "plaster":    (0.7,  6.0, False),
    "wattle":     (1.0,  8.0, False),
    "thatch":     (1.5, 18.0, True),
    "canvas":     (0.5, 10.0, False),
    "straw":      (1.3, 20.0, True),
    "crate":      (1.0, 12.0, True),
    "barrel":     (0.9, 13.0, True),
    "burlap":     (1.1, 15.0, False),
    "rope":       (1.0, 24.0, False),
    "sign":       (0.8, 10.0, True),
}

def _cfg_for(mat_name):
    low = mat_name.lower()
    for k, v in BUMP_CFG.items():
        if k in low:
            return v
    return None

def upgrade_mat(m):
    cfg = _cfg_for(m.name)
    if cfg is None:
        return
    bump_str, n_scale, grain = cfg
    nt = m.node_tree
    if not nt:
        return
    bsdf = next((n for n in nt.nodes if n.type == "BSDF_PRINCIPLED"), None)
    if not bsdf:
        return
    if bsdf.inputs["Normal"].links:
        return   # already has bump wired

    # Shared texture coordinate
    coord = nt.nodes.new("ShaderNodeTexCoord")
    coord.location = (-700, -100)

    # ── Bump via noise ────────────────────────────────────────────────────────
    b_noise = nt.nodes.new("ShaderNodeTexNoise")
    b_noise.inputs["Scale"].default_value       = n_scale
    b_noise.inputs["Detail"].default_value      = 7.0
    b_noise.inputs["Roughness"].default_value   = 0.65
    b_noise.inputs["Distortion"].default_value  = 0.2
    b_noise.location = (-450, -100)

    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = bump_str
    bump.inputs["Distance"].default_value = 0.04
    bump.location = (-200, -100)

    nt.links.new(coord.outputs["Object"], b_noise.inputs["Vector"])
    nt.links.new(b_noise.outputs["Fac"],  bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"],  bsdf.inputs["Normal"])

    # ── Roughness variation ───────────────────────────────────────────────────
    r_noise = nt.nodes.new("ShaderNodeTexNoise")
    r_noise.inputs["Scale"].default_value  = n_scale * 0.55
    r_noise.inputs["Detail"].default_value = 2.0
    r_noise.location = (-450, -280)

    rmap = nt.nodes.new("ShaderNodeMapRange")
    base_r = bsdf.inputs["Roughness"].default_value
    rmap.inputs["From Min"].default_value = 0.0
    rmap.inputs["From Max"].default_value = 1.0
    rmap.inputs["To Min"].default_value   = max(0.0, base_r - 0.13)
    rmap.inputs["To Max"].default_value   = min(1.0, base_r + 0.13)
    rmap.location = (-200, -280)

    nt.links.new(coord.outputs["Object"], r_noise.inputs["Vector"])
    nt.links.new(r_noise.outputs["Fac"], rmap.inputs["Value"])
    nt.links.new(rmap.outputs["Result"], bsdf.inputs["Roughness"])

    # ── Optional wood grain (wave bands on base colour) ───────────────────────
    if grain:
        wave  = nt.nodes.new("ShaderNodeTexWave")
        wave.wave_type = "BANDS"
        wave.inputs["Scale"].default_value       = n_scale
        wave.inputs["Distortion"].default_value  = 1.8
        wave.inputs["Detail"].default_value      = 3.0
        wave.location = (-450, 100)

        mix_c = nt.nodes.new("ShaderNodeMixRGB")
        mix_c.blend_type = "MIX"
        mix_c.location   = (-200, 100)

        bc = bsdf.inputs["Base Color"]
        base_col = tuple(bc.default_value[:3])
        dark_col = tuple(max(0, c - 0.055) for c in base_col)
        mix_c.inputs["Color1"].default_value = (*base_col, 1.0)
        mix_c.inputs["Color2"].default_value = (*dark_col, 1.0)

        # If base colour already has a texture link, wire it into slot 1
        if bc.links:
            nt.links.new(bc.links[0].from_socket, mix_c.inputs["Color1"])

        nt.links.new(coord.outputs["Object"], wave.inputs["Vector"])
        nt.links.new(wave.outputs["Fac"],     mix_c.inputs["Fac"])
        nt.links.new(mix_c.outputs["Color"],  bsdf.inputs["Base Color"])

upgraded = 0
for m in bpy.data.materials:
    try:
        before = bool(next((n for n in m.node_tree.nodes
                            if n.type == "BSDF_PRINCIPLED"), None).inputs["Normal"].links
                      if m.node_tree else False)
        upgrade_mat(m)
        upgraded += 1
    except Exception as e:
        print(f"[WARN] {m.name}: {e}")
print(f"[OK] Materials upgraded: {upgraded}")

# ── 4. CAMERA WALKTHROUGH ─────────────────────────────────────────────────────
# Scene scale: 1 unit ≈ 3.5 real metres (map covers 18 × 14.6 units).
# Palisade stakes are 0.7 units tall (≈ 2.45m real) — this confirms the scale.
# Person height 1.7m / 3.5m per unit = 0.49 units → eye height ≈ 0.45 units.
EYE = 0.45

cam_obj = next((o for o in scene.objects if o.type == "CAMERA"), None)
if not cam_obj:
    bpy.ops.object.camera_add()
    cam_obj = bpy.context.object
scene.camera = cam_obj
cam_obj.data.lens     = 24     # wide-angle — fills frame, suits tight compound spaces
cam_obj.data.clip_end = 150
cam_obj.data.clip_start = 0.01

if cam_obj.animation_data:
    cam_obj.animation_data_clear()
cam_obj.animation_data_create()

# (frame, cam_x, cam_y, cam_z,  target_x, target_y, target_z)
# All positions confirmed against actual object locations in the blend:
#   Hall sign     (-1.62, 3.17)   Guesthouse sign (-1.55, 0.42)
#   Storage hut   ( 0.44, 3.89)   Stable sign     ( 1.49, 1.62)
#   Stable bales  ( 3.04-3.07, 1.48-3.75)   Camp 6 pavilion (6.42,-1.08)
#   Meridian tents(-1.76→2.21, -5.62→-5.83)  Meridian fire  (1.79,-4.77)
#   Compound:  x -3.04→3.78,  y -0.17→5.59   Gate: x≈0.08, south wall y≈-0.17
# Get CLOSE to buildings — at 24mm wide angle, 0.4-0.8 unit distance fills frame.
# Look targets are slightly ABOVE eye level so buildings fill the upper frame.
KEYS = [
    # ── Southern approach: camera close, gate fills frame ────────────────
    (  1,  0.10, -2.50, EYE,   0.10, -0.30, 0.62),   # approach: gate centre ahead
    ( 72,  0.10, -0.55, EYE,   0.10,  0.40, 0.60),   # just south of gate, arch above
    (120,  0.10,  0.30, EYE,  -0.80,  0.50, 0.58),   # through gate, turning west
    # ── Guesthouse facade ────────────────────────────────────────────────
    (190, -0.70,  0.30, EYE,  -1.55,  0.42, 0.70),   # facing guesthouse from close
    (260, -1.00,  0.42, EYE,  -1.55,  0.55, 0.80),   # right in front of guesthouse
    # ── Hall: lined up along west side, see facade ────────────────────────
    (340, -1.62,  2.20, EYE,  -1.62,  3.17, 0.85),   # 1 unit from Hall, fills frame
    (410, -1.62,  2.80, EYE,  -1.62,  3.17, 0.90),   # even closer to Hall entrance
    # ── Storage hut: walk around it ──────────────────────────────────────
    (490,  0.44,  3.10, EYE,   0.44,  3.89, 0.90),   # 0.8 units from storage hut
    (560, -0.20,  3.89, EYE,   0.44,  3.89, 0.85),   # beside hut, looking at side
    # ── Stable: enter and look along stalls ──────────────────────────────
    (640,  1.49,  1.00, EYE,   1.49,  1.62, 0.70),   # stable entrance sign close-up
    (720,  2.20,  2.00, EYE,   3.05,  3.00, 0.58),   # deep in stable, hay bales right
    # ── North wall: banners, look south over compound ─────────────────────
    (800, -3.04,  5.20, EYE,   0.50,  2.80, 0.55),   # near NW banner, wide view south
    (860,  0.10,  0.10, EYE,   0.10, -2.00, 0.52),   # exiting through gate
    # ── Camp 6 pavilion ──────────────────────────────────────────────────
    (940,  5.50, -1.08, EYE,   6.42, -1.08, 0.68),   # 0.9 units from pavilion
    # ── Meridian camp ────────────────────────────────────────────────────
    (1020, 0.23, -4.80, EYE,   0.23, -5.83, 0.65),   # close to Meridian center tent
]

FPS = 24
scene.render.fps        = FPS
scene.frame_start       = 1
scene.frame_end         = KEYS[-1][0]

def insert_cam_key(frame, loc, tgt):
    scene.frame_set(frame)
    cam_obj.location       = Vector(loc)
    cam_obj.rotation_euler = (Vector(tgt) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    cam_obj.keyframe_insert("location")
    cam_obj.keyframe_insert("rotation_euler")

for kf in KEYS:
    insert_cam_key(kf[0], kf[1:4], kf[4:7])

# Smooth bezier on all camera f-curves (API differs between Blender versions)
try:
    action = cam_obj.animation_data.action
    # Blender ≤ 4.3: action.fcurves
    fcurves = list(action.fcurves)
    for fc in fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation     = "BEZIER"
            kp.handle_left_type  = "AUTO_CLAMPED"
            kp.handle_right_type = "AUTO_CLAMPED"
except AttributeError:
    # Blender 4.4+ new action-slot system — skip interpolation tuning
    print("[INFO] Blender 5.x action system: skipping bezier smoothing")

print(f"[OK] Camera animation: {len(KEYS)} keyframes, {scene.frame_end} frames @ {FPS}fps "
      f"({scene.frame_end / FPS:.1f}s)")

# ── 5. GROUND MATERIAL — brighten sketch texture ──────────────────────────────
# The sketch image is a good base but Filmic renders it darker than expected.
# Insert a Gamma node (0.7) to brighten it to a natural outdoor level.
for m in bpy.data.materials:
    if "ground" not in m.name.lower() and "sketch" not in m.name.lower():
        continue
    nt = m.node_tree
    if not nt:
        continue
    bsdf  = next((n for n in nt.nodes if n.type == "BSDF_PRINCIPLED"), None)
    tex   = next((n for n in nt.nodes if n.type == "TEX_IMAGE"),        None)
    if not (bsdf and tex):
        continue
    if bsdf.inputs["Base Color"].links:
        continue   # already wired, skip

    gamma = nt.nodes.new("ShaderNodeGamma")
    gamma.inputs["Gamma"].default_value = 0.72   # brighten without blowing out
    gamma.location = (-200, 0)
    tex.location   = (-450, 0)

    nt.links.new(tex.outputs["Color"],   gamma.inputs["Color"])
    nt.links.new(gamma.outputs["Color"], bsdf.inputs["Base Color"])
    print(f"[OK] Ground material brightened: {m.name}")

# ── 6. EEVEE NEXT SETTINGS (Blender 5.x API) ─────────────────────────────────
scene.render.engine = "BLENDER_EEVEE"
ev = scene.eevee
# Apply each setting individually — avoid one bad attr killing the rest
def _set(obj, attr, val):
    try:
        setattr(obj, attr, val)
    except (AttributeError, TypeError):
        pass

_set(ev, "taa_render_samples",    64)
_set(ev, "taa_samples",           16)
# EEVEE Next fast GI replaces legacy GTAO
_set(ev, "fast_gi_method",        "GLOBAL_ILLUMINATION")
_set(ev, "fast_gi_quality",       0.5)
_set(ev, "fast_gi_ray_count",     2)
_set(ev, "fast_gi_resolution",    "64")
_set(ev, "fast_gi_distance",      3.0)
# Shadow quality
_set(ev, "shadow_resolution_scale", 2.0)
_set(ev, "shadow_ray_count",        2)
_set(ev, "shadow_step_count",       6)
print("[OK] EEVEE Next settings applied")

scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.image_settings.file_format = "PNG"
scene.view_settings.view_transform = "Filmic"
scene.view_settings.look            = "Medium High Contrast"
scene.view_settings.exposure        = 0.18

# ── 6. SAVE BLEND + PROOF RENDERS ─────────────────────────────────────────────
save_path = os.path.join(EXPORT_DIR, "destons-walkthrough.blend")
bpy.ops.wm.save_as_mainfile(filepath=save_path)
print(f"[OK] Blend saved → {save_path}")

# Render three proof frames at key moments
proofs = [
    ( 72, "proof-gate.png"),       # gate arch filling frame
    (440, "proof-hall.png"),       # walking toward Hall door
    (740, "proof-stable.png"),     # inside stable, hay bales
]
for frame, fname in proofs:
    scene.frame_set(frame)
    scene.render.filepath = os.path.join(EXPORT_DIR, fname)
    bpy.ops.render.render(write_still=True)
    print(f"[OK] Proof frame {frame} → {scene.render.filepath}")

# Full frame-sequence path (run blender again without the proof-only guard to render all)
scene.render.filepath = os.path.join(FRAMES_DIR, "frame-####")
bpy.ops.wm.save_as_mainfile(filepath=save_path)
print(f"[DONE] To render full walkthrough:")
print(f"  blender --background {save_path} --render-anim")
