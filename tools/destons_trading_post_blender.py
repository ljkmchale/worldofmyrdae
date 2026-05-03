import math
import os
import sys

import bpy
from mathutils import Vector


ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
EXPORT_DIR = os.path.join(ROOT, "exports", "destons-trading-post")
MAP_IMAGE = os.path.join(EXPORT_DIR, "map-crop.png")
ASSET_ROOT = os.path.join(ROOT, "assets", "vendor", "quaternius-medieval-village")

MAP_W = 1268
MAP_H = 1028
WORLD_W = 18.0
WORLD_H = WORLD_W * MAP_H / MAP_W


def has_flag(name):
    return name in sys.argv


RENDER_MOVIE = has_flag("--render-movie")
AUDIT = has_flag("--audit")
STATIC_REVIEW = has_flag("--static-review")
ASSET_REVIEW = has_flag("--asset-review")


def px_to_world(px, py, z=0.0):
    return ((px / MAP_W - 0.5) * WORLD_W, (0.5 - py / MAP_H) * WORLD_H, z)


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def make_mat(name, color, roughness=0.7, metallic=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    return mat


def make_texture_mat(name, image_path):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    tex = nodes.new("ShaderNodeTexImage")
    tex.image = bpy.data.images.load(image_path)
    tex.extension = "CLIP"
    mat.node_tree.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = 0.9
    return mat


def cube_obj(name, loc, scale, mat):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if mat:
        obj.data.materials.append(mat)
    if min(scale) > 0.05:
        bevel = obj.modifiers.new(name="Soft worn edges", type="BEVEL")
        bevel.width = 0.015
        bevel.segments = 1
        obj.modifiers.new(name="Weighted corner normals", type="WEIGHTED_NORMAL")
    return obj


def textured_ground(name, mat):
    verts = [
        (-WORLD_W / 2, -WORLD_H / 2, -0.02),
        (WORLD_W / 2, -WORLD_H / 2, -0.02),
        (WORLD_W / 2, WORLD_H / 2, -0.02),
        (-WORLD_W / 2, WORLD_H / 2, -0.02),
    ]
    faces = [(0, 1, 2, 3)]
    mesh = bpy.data.meshes.new(name + "Mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    uv_layer = mesh.uv_layers.new(name="UVMap")
    for loop, uv in zip(uv_layer.data, [(0, 0), (1, 0), (1, 1), (0, 1)]):
        loop.uv = uv
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    return obj


def cyl_obj(name, loc, radius, depth, mat, vertices=32, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    if mat:
        obj.data.materials.append(mat)
    obj.modifiers.new(name="Weighted normals", type="WEIGHTED_NORMAL")
    return obj


def world_size_from_px(w_px, h_px):
    return (w_px / MAP_W * WORLD_W, h_px / MAP_H * WORLD_H)


def object_bounds(objects):
    points = []
    for obj in objects:
        if obj.type != "MESH":
            continue
        for corner in obj.bound_box:
            points.append(obj.matrix_world @ Vector(corner))
    if not points:
        return None
    min_v = Vector((min(p.x for p in points), min(p.y for p in points), min(p.z for p in points)))
    max_v = Vector((max(p.x for p in points), max(p.y for p in points), max(p.z for p in points)))
    return min_v, max_v


def fit_asset_group(name, objects, px, py, target_w, target_h, z=0.0, rot=0.0, height_scale=1.0):
    bounds = object_bounds(objects)
    if not bounds:
        return None
    min_v, max_v = bounds
    center = (min_v + max_v) * 0.5
    width = max(max_v.x - min_v.x, 0.001)
    depth = max(max_v.y - min_v.y, 0.001)
    sx = target_w / width
    sy = target_h / depth
    sz = min(sx, sy) * height_scale

    empty = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(empty)
    empty.empty_display_type = "CUBE"
    empty.empty_display_size = 0.35
    empty.location = center
    for obj in objects:
        obj.parent = empty
        obj.matrix_parent_inverse = empty.matrix_world.inverted()
        obj.name = f"{name}::{obj.name}"
    x, y, _ = px_to_world(px, py, z)
    empty.scale = (sx, sy, sz)
    empty.rotation_euler[2] = math.radians(rot)
    empty.location = (x, y, z)
    return empty


def import_fbx_asset(name, rel_path, px, py, target_w, target_h, z=0.0, rot=0.0, height_scale=1.0):
    path = os.path.join(ASSET_ROOT, rel_path)
    if not os.path.exists(path):
        return None
    before = set(bpy.data.objects)
    bpy.ops.import_scene.fbx(filepath=path, automatic_bone_orientation=True)
    objects = [obj for obj in bpy.data.objects if obj not in before]
    return fit_asset_group(name, objects, px, py, target_w, target_h, z, rot, height_scale)


def import_fbx_to_library(rel_path, collection):
    path = os.path.join(ASSET_ROOT, rel_path)
    if not os.path.exists(path):
        return []
    before = set(bpy.data.objects)
    bpy.ops.import_scene.fbx(filepath=path, automatic_bone_orientation=True)
    objects = [obj for obj in bpy.data.objects if obj not in before]
    stem = os.path.splitext(os.path.basename(path))[0]
    for obj in objects:
        obj.name = f"VendorLibrary::{stem}::{obj.name}"
        for c in list(obj.users_collection):
            c.objects.unlink(obj)
        collection.objects.link(obj)
        obj.hide_viewport = True
        obj.hide_render = True
        obj.location = (40, 40, 0)
    return objects


def append_blend_asset(name, rel_path, px, py, target_w, target_h, z=0.0, rot=0.0, height_scale=1.0):
    path = os.path.join(ASSET_ROOT, rel_path)
    if not os.path.exists(path):
        return None
    with bpy.data.libraries.load(path, link=False) as (data_from, data_to):
        data_to.objects = data_from.objects
    objects = []
    for obj in data_to.objects:
        if obj is None:
            continue
        if obj.name not in bpy.context.collection.objects:
            bpy.context.collection.objects.link(obj)
        objects.append(obj)
    return fit_asset_group(name, objects, px, py, target_w, target_h, z, rot, height_scale)


def append_blend_to_library(rel_path, collection):
    path = os.path.join(ASSET_ROOT, rel_path)
    if not os.path.exists(path):
        return []
    with bpy.data.libraries.load(path, link=False) as (data_from, data_to):
        data_to.objects = data_from.objects
    objects = []
    stem = os.path.splitext(os.path.basename(path))[0]
    for obj in data_to.objects:
        if obj is None:
            continue
        obj.name = f"VendorLibrary::{stem}::{obj.name}"
        collection.objects.link(obj)
        obj.hide_viewport = True
        obj.hide_render = True
        obj.location = (44, 44, 0)
        objects.append(obj)
    return objects


def load_vendor_asset_library():
    library = bpy.data.collections.new("Vendor Asset Library - loaded hidden")
    bpy.context.scene.collection.children.link(library)
    building_dir = os.path.join(ASSET_ROOT, "Buildings", "FBX")
    prop_blend_dir = os.path.join(ASSET_ROOT, "Props", "Blends")
    loaded = 0
    if os.path.isdir(building_dir):
        for filename in sorted(os.listdir(building_dir)):
            if filename.lower().endswith(".fbx"):
                loaded += len(import_fbx_to_library(os.path.join("Buildings", "FBX", filename), library))
    if os.path.isdir(prop_blend_dir):
        for filename in sorted(os.listdir(prop_blend_dir)):
            if filename.lower().endswith(".blend"):
                loaded += len(append_blend_to_library(os.path.join("Props", "Blends", filename), library))
    print(f"Loaded hidden vendor asset library objects: {loaded}")
    return library


def set_rot(obj, z_degrees=0, x_degrees=0, y_degrees=0):
    obj.rotation_euler = (math.radians(x_degrees), math.radians(y_degrees), math.radians(z_degrees))
    return obj


def add_crate(name, px, py, z=0.14, size=0.32, rot=0):
    x, y, _ = px_to_world(px, py, z)
    crate = cube_obj(name, (x, y, z), (size, size * 0.78, size * 0.55), MATS["crate_wood"])
    set_rot(crate, rot)
    for off in [-0.42, 0.42]:
        band = cube_obj(name + "-iron-band", (x + math.cos(math.radians(rot)) * off * size, y + math.sin(math.radians(rot)) * off * size, z + size * 0.06), (0.035, size * 0.86, size * 0.62), MATS["dark_iron"])
        set_rot(band, rot)
    return crate


def add_barrel(name, px, py, z=0.22, rot=0):
    x, y, _ = px_to_world(px, py, z)
    barrel = cyl_obj(name, (x, y, z), 0.14, 0.42, MATS["barrel_wood"], vertices=20, rotation=(math.radians(90), 0, math.radians(rot)))
    for dx in [-0.15, 0.15]:
        band = cyl_obj(name + "-band", (x + math.cos(math.radians(rot)) * dx, y + math.sin(math.radians(rot)) * dx, z), 0.145, 0.018, MATS["dark_iron"], vertices=20, rotation=(math.radians(90), 0, math.radians(rot)))
    return barrel


def add_sack(name, px, py, z=0.16, rot=0):
    x, y, _ = px_to_world(px, py, z)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, radius=0.18, location=(x, y, z))
    obj = bpy.context.object
    obj.name = name
    obj.scale = (0.85, 0.58, 0.72)
    obj.rotation_euler[2] = math.radians(rot)
    obj.data.materials.append(MATS["burlap"])
    obj.modifiers.new(name="Soft sack normals", type="WEIGHTED_NORMAL")
    return obj


def add_hay_bale(name, px, py, z=0.15, rot=0):
    x, y, _ = px_to_world(px, py, z)
    bale = cube_obj(name, (x, y, z), (0.52, 0.28, 0.26), MATS["hay"])
    set_rot(bale, rot)
    for off in [-0.16, 0.16]:
        strap = cube_obj(name + "-twine", (x, y + off, z + 0.015), (0.56, 0.025, 0.29), MATS["rope"])
        set_rot(strap, rot)
    return bale


def add_lantern(name, px, py, z=0.62):
    x, y, _ = px_to_world(px, py, z)
    cyl_obj(name + "-post", (x, y, z * 0.5), 0.022, z, MATS["dark_wood"], vertices=8)
    cage = cyl_obj(name + "-cage", (x, y, z + 0.12), 0.075, 0.14, MATS["dark_iron"], vertices=8)
    flame = cyl_obj(name + "-warm-glass", (x, y, z + 0.12), 0.052, 0.12, MATS["lantern_glow"], vertices=12)
    bpy.ops.object.light_add(type="POINT", location=(x, y, z + 0.13))
    light = bpy.context.object
    light.name = name + " light"
    light.data.energy = 30
    light.data.color = (1.0, 0.58, 0.28)
    return cage


def add_banner(name, px, py, z=1.05, rot=0):
    x, y, _ = px_to_world(px, py, z)
    pole = cyl_obj(name + "-pole", (x, y, z * 0.5), 0.025, z, MATS["dark_wood"], vertices=8)
    cloth = cube_obj(name + "-cloth", (x + 0.12 * math.cos(math.radians(rot)), y + 0.12 * math.sin(math.radians(rot)), z - 0.18), (0.34, 0.025, 0.36), MATS["faded_crimson"])
    set_rot(cloth, rot)
    return cloth


def add_rope_line(name, start_px, start_py, end_px, end_py, z=0.045):
    sx, sy, _ = px_to_world(start_px, start_py, z)
    ex, ey, _ = px_to_world(end_px, end_py, z)
    dx, dy = ex - sx, ey - sy
    length = math.hypot(dx, dy)
    angle = math.degrees(math.atan2(dy, dx))
    rope = cube_obj(name, ((sx + ex) / 2, (sy + ey) / 2, z), (length, 0.025, 0.025), MATS["rope"])
    set_rot(rope, angle)
    return rope


def add_wagon(name, px, py, rot=-18):
    x, y, _ = px_to_world(px, py, 0.18)
    body = cube_obj(name + "-bed", (x, y, 0.20), (0.72, 0.36, 0.18), MATS["crate_wood"])
    set_rot(body, rot)
    for ox in [-0.28, 0.28]:
        for oy in [-0.20, 0.20]:
            wx = x + math.cos(math.radians(rot)) * ox - math.sin(math.radians(rot)) * oy
            wy = y + math.sin(math.radians(rot)) * ox + math.cos(math.radians(rot)) * oy
            cyl_obj(name + "-wheel", (wx, wy, 0.17), 0.11, 0.04, MATS["dark_wood"], vertices=16, rotation=(math.radians(90), 0, math.radians(rot)))
    tongue = cube_obj(name + "-tongue", (x + math.cos(math.radians(rot)) * 0.52, y + math.sin(math.radians(rot)) * 0.52, 0.17), (0.62, 0.045, 0.045), MATS["dark_wood"])
    set_rot(tongue, rot)
    return body


def gable_roof(name, center, size, height, mat):
    sx, sy, sz = size
    x0, x1 = -sx / 2, sx / 2
    y0, y1 = -sy / 2, sy / 2
    z0 = 0
    zr = sz
    zp = sz + height
    verts = [
        (x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0),
        (x0, y0, zr), (x1, y0, zr), (x1, y1, zr), (x0, y1, zr),
        (0, y0, zp), (0, y1, zp),
    ]
    faces = [
        (0, 1, 2, 3), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0),
        (4, 8, 5), (7, 6, 9), (4, 7, 9, 8), (5, 8, 9, 6),
    ]
    mesh = bpy.data.meshes.new(name + "Mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = center
    if mat:
        obj.data.materials.append(mat)
    obj.modifiers.new(name="Weighted roof normals", type="WEIGHTED_NORMAL")
    return obj


def add_roof_course(name, cx, cy, z, sx, sy, rot, index, mat):
    strip = cube_obj(name, (cx, cy, z), (sx, 0.035, 0.025), mat)
    local_y = -sy / 2 + index * 0.18
    strip.location.x += -math.sin(math.radians(rot)) * local_y
    strip.location.y += math.cos(math.radians(rot)) * local_y
    set_rot(strip, rot)
    return strip


def add_pitched_building(name, px, py, w, h, wall_height, roof_height, wall_mat, roof_mat, rot=0, door_side="south"):
    x, y, _ = px_to_world(px, py, 0)
    body = cube_obj(name + " plaster-and-timber walls", (x, y, wall_height / 2), (w, h, wall_height), wall_mat)
    set_rot(body, rot)

    foundation = cube_obj(name + " stone foundation", (x, y, 0.09), (w + 0.16, h + 0.16, 0.18), MATS["stone"])
    set_rot(foundation, rot)

    roof = gable_roof(name + " pitched roof", (x, y, wall_height - 0.02), (w + 0.34, h + 0.34, 0.04), roof_height, roof_mat)
    set_rot(roof, rot)

    # Horizontal roof courses make the roof read as shingles/thatch instead of a flat block.
    for idx in range(max(4, int(h / 0.18))):
        add_roof_course(name + f" roof course {idx:02d}", x, y, wall_height + roof_height * 0.38, w + 0.42, h + 0.34, rot, idx, MATS["roof_dark_detail"])

    # Timber framing and simple shutters.
    for lx in [-w / 2 + 0.08, w / 2 - 0.08]:
        beam = cube_obj(name + " corner post", (x + math.cos(math.radians(rot)) * lx, y + math.sin(math.radians(rot)) * lx, wall_height / 2), (0.06, h + 0.05, wall_height + 0.05), MATS["dark_wood"])
        set_rot(beam, rot)
    cross = cube_obj(name + " front lintel", (x, y - h / 2 * math.cos(math.radians(rot)), wall_height * 0.72), (w + 0.08, 0.055, 0.06), MATS["dark_wood"])
    set_rot(cross, rot)

    door_y = y - h / 2 - 0.018 if door_side == "south" else y + h / 2 + 0.018
    door = cube_obj(name + " heavy plank door", (x - w * 0.22, door_y, wall_height * 0.32), (0.30, 0.045, wall_height * 0.55), MATS["dark_wood"])
    set_rot(door, rot)
    for wx in [x + w * 0.20, x + w * 0.38]:
        window = cube_obj(name + " shuttered window", (wx, door_y, wall_height * 0.58), (0.26, 0.04, 0.20), MATS["warm_window"])
        set_rot(window, rot)
        left_shutter = cube_obj(name + " side shutter", (wx - 0.17, door_y, wall_height * 0.58), (0.075, 0.04, 0.23), MATS["dark_wood"])
        right_shutter = cube_obj(name + " side shutter", (wx + 0.17, door_y, wall_height * 0.58), (0.075, 0.04, 0.23), MATS["dark_wood"])
        set_rot(left_shutter, rot)
        set_rot(right_shutter, rot)
    return body


def add_thatch_ribs(name, px, py, radius, z, count=18):
    x, y, _ = px_to_world(px, py, z)
    for i in range(count):
        angle = i * 360 / count
        rib = cube_obj(f"{name} rib {i:02d}", (x, y, z), (radius * 1.05, 0.018, 0.025), MATS["roof_dark_detail"])
        rib.location.x += math.cos(math.radians(angle)) * radius * 0.24
        rib.location.y += math.sin(math.radians(angle)) * radius * 0.24
        set_rot(rib, angle)


def tent(name, px, py, w_px, h_px, height, mat):
    x, y, _ = px_to_world(px, py, 0)
    sx = w_px / MAP_W * WORLD_W
    sy = h_px / MAP_H * WORLD_H
    verts = [
        (-sx / 2, -sy / 2, 0), (sx / 2, -sy / 2, 0), (sx / 2, sy / 2, 0), (-sx / 2, sy / 2, 0),
        (0, 0, height),
    ]
    faces = [(0, 1, 4), (1, 2, 4), (2, 3, 4), (3, 0, 4), (0, 3, 2, 1)]
    mesh = bpy.data.meshes.new(name + "Mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = (x, y, 0.04)
    obj.data.materials.append(mat)
    return obj


def add_label(name, text, px, py, z, size=0.18):
    # Floating labels are useful for map diagrams, but they break the ground-level
    # realism pass. Building signs should be modeled as facade props later.
    return None
    x, y, _ = px_to_world(px, py, z)
    bpy.ops.object.text_add(location=(x, y, z), rotation=(math.radians(72), 0, 0))
    obj = bpy.context.object
    obj.name = name
    obj.data.body = text
    obj.data.align_x = "CENTER"
    obj.data.align_y = "CENTER"
    obj.data.size = size
    obj.data.extrude = 0.01
    obj.data.materials.append(MATS["sign_text"])
    return obj


def add_post_line(name, start_px, start_py, end_px, end_py, count, radius=0.045, height=0.72):
    start = Vector(px_to_world(start_px, start_py, 0))
    end = Vector(px_to_world(end_px, end_py, 0))
    for i in range(count):
        t = i / max(count - 1, 1)
        p = start.lerp(end, t)
        cyl_obj(f"{name}-{i:02d}", (p.x, p.y, height / 2), radius, height, MATS["dark_wood"], vertices=10)


def add_plank_walkway(name, center_px, center_py, w_px, h_px, z=0.55):
    x, y, _ = px_to_world(center_px, center_py, z)
    sx = w_px / MAP_W * WORLD_W
    sy = h_px / MAP_H * WORLD_H
    cube_obj(name, (x, y, z), (sx, sy, 0.08), MATS["weathered_wood"])


def add_tower(name, px, py):
    x, y, _ = px_to_world(px, py, 0)
    cyl_obj(name + "-stone-ring", (x, y, 0.18), 0.72, 0.36, MATS["stone"], vertices=40)
    cyl_obj(name + "-deck", (x, y, 0.62), 0.62, 0.14, MATS["weathered_wood"], vertices=40)
    for angle in [i * math.tau / 12 for i in range(12)]:
        cyl_obj(
            name + "-palisade",
            (x + math.cos(angle) * 0.72, y + math.sin(angle) * 0.72, 0.66),
            0.045,
            0.72,
            MATS["dark_wood"],
            vertices=8,
        )
    # Crossed beams echo the ballista-like shapes on the sketch, but stay modest.
    for rot in [math.radians(42), math.radians(-42)]:
        beam = cube_obj(name + "-defense-beam", (x, y, 0.95), (1.0, 0.08, 0.08), MATS["dark_wood"])
        beam.rotation_euler[2] = rot


def add_buildings():
    # Deston's Hall and Guesthouse are placed exactly over their roof footprints.
    hall_x, hall_y, _ = px_to_world(520, 230, 0.0)
    if not import_fbx_asset("Destons Hall imported inn footprint", "Buildings/FBX/Inn.fbx", 520, 230, 2.15, 1.65, 0.02, 0, 0.72):
        add_pitched_building(
            "Destons Hall",
            520,
            230,
            2.15,
            1.65,
            0.62,
            0.62,
            MATS["warm_plaster"],
            MATS["terracotta_roof"],
        )
    hall_sign = cube_obj("Destons Hall facade sign", (hall_x, hall_y - 0.86, 0.62), (0.72, 0.05, 0.22), MATS["sign_board"])
    hall_sign.rotation_euler[0] = math.radians(0)

    guest_x, guest_y, _ = px_to_world(525, 440, 0.0)
    if not import_fbx_asset("Guesthouse imported house footprint", "Buildings/FBX/House_2.fbx", 525, 440, 2.35, 1.20, 0.02, 0, 0.72):
        add_pitched_building(
            "Guesthouse",
            525,
            440,
            2.35,
            1.20,
            0.55,
            0.48,
            MATS["aged_wattle_wall"],
            MATS["dark_roof"],
        )
    cube_obj("Guesthouse facade sign", (guest_x, guest_y - 0.63, 0.55), (0.58, 0.05, 0.18), MATS["sign_board"])

    # Stable is an open timber shed around the long brown rectangle.
    sx, sy, _ = px_to_world(790, 318, 0)
    if not import_fbx_asset("Stable imported footprint", "Buildings/FBX/Stable.fbx", 790, 318, 1.9, 2.45, 0.02, 0, 0.7):
        cube_obj("Stable floor", (sx, sy, 0.04), (1.9, 2.45, 0.08), MATS["hay"])
        for dx in [-0.85, 0.0, 0.85]:
            cube_obj("Stable post", (sx + dx, sy - 1.05, 0.42), (0.06, 0.06, 0.84), MATS["dark_wood"])
            cube_obj("Stable post", (sx + dx, sy + 1.05, 0.42), (0.06, 0.06, 0.84), MATS["dark_wood"])
        gable_roof("Stable pitched thatch roof", (sx, sy, 0.76), (2.15, 2.65, 0.08), 0.36, MATS["thatched_roof"])
        for row in range(10):
            add_roof_course("Stable straw roof course", sx, sy, 1.00, 2.2, 2.65, 0, row, MATS["roof_dark_detail"])
        for px in [740, 790, 840]:
            stall_x, stall_y, _ = px_to_world(px, 318, 0.36)
            cube_obj("Stable stall divider", (stall_x, stall_y, 0.34), (0.055, 2.0, 0.18), MATS["dark_wood"])
    cube_obj("Stable hanging sign", (sx - 0.72, sy - 1.16, 0.72), (0.42, 0.04, 0.16), MATS["sign_board"])

    # Storage is round in the sketch.
    st_x, st_y, _ = px_to_world(665, 240, 0)
    cyl_obj("Round storage wall", (st_x, st_y, 0.33), 0.55, 0.66, MATS["wattle"], vertices=40)
    for z in [0.18, 0.38, 0.58]:
        cyl_obj("Round storage binding band", (st_x, st_y, z), 0.565, 0.025, MATS["rope"], vertices=40)
    bpy.ops.mesh.primitive_cone_add(vertices=40, radius1=0.66, radius2=0.12, depth=0.62, location=(st_x, st_y, 0.97))
    bpy.context.object.name = "Round storage thatch"
    bpy.context.object.data.materials.append(MATS["thatched_roof"])
    add_thatch_ribs("Round storage thatch", 665, 240, 0.58, 1.02, 20)
    cube_obj("Storage small sign", (st_x, st_y - 0.57, 0.55), (0.42, 0.04, 0.16), MATS["sign_board"])

    # Market yard tables and central fire remain low so this still reads as an open yard.
    for px, py in [(500, 350), (595, 350), (540, 310)]:
        if not append_blend_asset("Imported market stand", "Props/Blends/MarketStand_1.blend", px, py, 0.50, 0.30, 0.02, 0, 0.7):
            x, y, _ = px_to_world(px, py, 0.23)
            cube_obj("Market table", (x, y, 0.23), (0.45, 0.22, 0.12), MATS["weathered_wood"])
    for i, (px, py, rot) in enumerate([(488, 326, 8), (594, 328, -7), (545, 372, 18)]):
        add_crate(f"Market trade crate {i}", px, py, 0.16, 0.26, rot)
    for i, (px, py, rot) in enumerate([(470, 356, -10), (615, 356, 12)]):
        add_sack(f"Market burlap sack {i}", px, py, 0.12, rot)
    fire_x, fire_y, _ = px_to_world(548, 350, 0.04)
    cyl_obj("Market fire stones", (fire_x, fire_y, 0.05), 0.16, 0.08, MATS["stone"], vertices=16)
    bpy.ops.object.light_add(type="POINT", location=(fire_x, fire_y, 0.55))
    bpy.context.object.name = "Market fire glow"
    bpy.context.object.data.energy = 90
    bpy.context.object.data.color = (1.0, 0.55, 0.25)
    add_lantern("Market pole lantern", 555, 330, 0.72)
    add_wagon("Yard handcart", 748, 455, -20)


def add_fantasy_assets():
    # Trading goods staged around the yard without hiding the map footprint.
    for i, (px, py, rot) in enumerate([(462, 282, 6), (487, 282, -5), (570, 280, 4), (595, 280, -7)]):
        add_hay_bale(f"Stacked fodder bale {i}", px, py, 0.13, rot)
    for i, (px, py, rot) in enumerate([(848, 250, 0), (850, 330, 0), (850, 410, 0)]):
        add_hay_bale(f"Stable long hay bale {i}", px, py, 0.13, rot)
    for i, (px, py, rot) in enumerate([(740, 250, 8), (760, 275, -9), (720, 302, 14)]):
        add_barrel(f"Stable water barrel {i}", px, py, 0.16, rot)
    for i, (px, py, rot) in enumerate([(640, 225, 0), (690, 255, 12), (640, 270, -12)]):
        add_sack(f"Storage grain sack {i}", px, py, 0.13, rot)
    add_barrel("Storage sealed barrel", 700, 230, 0.16, 20)
    add_lantern("Guesthouse door lantern", 505, 392, 0.72)
    add_lantern("Hall door lantern", 535, 298, 0.78)
    add_banner("Northwest post banner", 420, 150, 1.15, 90)
    add_banner("Southeast post banner", 900, 500, 1.15, -90)

    # Campsite clutter and tent anchoring.
    for i, (px, py, rot) in enumerate([(1000, 665, 20), (1060, 667, -15), (1110, 650, 25)]):
        add_sack(f"Campsite bedroll {i}", px, py, 0.10, rot)
    for i, (px, py, rot) in enumerate([(500, 895, 18), (785, 888, -18), (640, 872, 4), (690, 875, -7)]):
        add_sack(f"Meridian bedroll {i}", px, py, 0.10, rot)
    for i, (a, b) in enumerate([((620, 880), (585, 855)), ((680, 880), (715, 855)), ((1085, 540), (1038, 508)), ((1085, 540), (1130, 510))]):
        add_rope_line(f"Tent guy rope {i}", a[0], a[1], b[0], b[1])
    add_crate("Meridian supply crate", 720, 850, 0.14, 0.28, -12)
    add_barrel("Campsite water cask", 1030, 675, 0.15, 8)


def add_imported_vendor_assets():
    # Vendor models are fitted to the sketch footprints and used as visual detail,
    # not as new invented map locations.
    imported_fbx = [
        ("Imported yard cart", "Props/FBX/Cart.fbx", 748, 455, 0.78, 0.42, 0.02, -20, 0.9),
        ("Imported market bag stack", "Props/FBX/Bags.fbx", 470, 356, 0.42, 0.32, 0.02, -10, 0.9),
        ("Imported market open bag", "Props/FBX/Bag_Open.fbx", 615, 356, 0.34, 0.28, 0.02, 12, 0.9),
        ("Imported stable barrel 1", "Props/FBX/Barrel.fbx", 740, 250, 0.30, 0.30, 0.02, 8, 1.0),
        ("Imported stable barrel 2", "Props/FBX/Barrel.fbx", 760, 275, 0.30, 0.30, 0.02, -9, 1.0),
        ("Imported campsite bench 1", "Props/FBX/Bench_1.fbx", 1010, 700, 0.62, 0.22, 0.02, 20, 0.8),
        ("Imported campsite bench 2", "Props/FBX/Bench_2.fbx", 1075, 700, 0.62, 0.22, 0.02, -16, 0.8),
        ("Imported campsite bonfire", "Props/FBX/Bonfire_Lit.fbx", 1015, 675, 0.42, 0.42, 0.02, 0, 0.9),
        ("Imported meridian bonfire", "Props/FBX/Bonfire_Lit.fbx", 760, 850, 0.42, 0.42, 0.02, 0, 0.9),
        ("Imported meridian bag 1", "Props/FBX/Bag.fbx", 640, 872, 0.30, 0.24, 0.02, 4, 0.9),
        ("Imported meridian bag 2", "Props/FBX/Bag.fbx", 690, 875, 0.30, 0.24, 0.02, -7, 0.9),
    ]
    for args in imported_fbx:
        import_fbx_asset(*args)

    imported_blends = [
        ("Imported crate near hall", "Props/Blends/Crate.blend", 488, 326, 0.32, 0.26, 0.02, 8, 0.9),
        ("Imported crate near market", "Props/Blends/Crate.blend", 594, 328, 0.32, 0.26, 0.02, -7, 0.9),
        ("Imported hay bale hall stack 1", "Props/Blends/Hay.blend", 462, 282, 0.45, 0.26, 0.02, 6, 0.9),
        ("Imported hay bale hall stack 2", "Props/Blends/Hay.blend", 487, 282, 0.45, 0.26, 0.02, -5, 0.9),
        ("Imported stable hay 1", "Props/Blends/Hay.blend", 848, 250, 0.48, 0.28, 0.02, 0, 0.9),
        ("Imported stable hay 2", "Props/Blends/Hay.blend", 850, 330, 0.48, 0.28, 0.02, 0, 0.9),
        ("Imported stable hay 3", "Props/Blends/Hay.blend", 850, 410, 0.48, 0.28, 0.02, 0, 0.9),
        ("Imported storage package 1", "Props/Blends/Package_1.blend", 640, 225, 0.30, 0.24, 0.02, 0, 0.9),
        ("Imported storage package 2", "Props/Blends/Package_2.blend", 690, 255, 0.34, 0.25, 0.02, 12, 0.9),
        ("Imported campsite cauldron", "Props/Blends/Cauldron.blend", 1045, 650, 0.32, 0.32, 0.02, 0, 0.8),
        ("Imported campsite rock 1", "Props/Blends/Rock_1.blend", 975, 668, 0.34, 0.26, 0.02, 20, 0.8),
        ("Imported campsite rock 2", "Props/Blends/Rock_2.blend", 1088, 662, 0.34, 0.26, 0.02, -18, 0.8),
        ("Imported meridian supply crate", "Props/Blends/Crate.blend", 720, 850, 0.34, 0.27, 0.02, -12, 0.9),
        ("Imported meridian package", "Props/Blends/Package_2.blend", 700, 872, 0.34, 0.25, 0.02, -7, 0.9),
        ("Imported yard rock detail", "Props/Blends/Rock_3.blend", 735, 455, 0.32, 0.24, 0.02, 18, 0.8),
        ("Imported market stand 2", "Props/Blends/MarketStand_2.blend", 540, 310, 0.55, 0.35, 0.02, 0, 0.75),
        ("Imported small well prop", "Props/Blends/Well.blend", 622, 270, 0.42, 0.42, 0.02, 0, 0.55),
    ]
    for args in imported_blends:
        append_blend_asset(*args)


def add_camps():
    tent("Campsite pavilion", 1086, 590, 125, 110, 0.82, MATS["canvas"])
    add_label("camp-sign", "Campsite", 1086, 515, 0.92, 0.12)
    for px, py, rot in [(1010, 700, 20), (1075, 700, -16)]:
        x, y, _ = px_to_world(px, py, 0.05)
        log = cube_obj("Camp log", (x, y, 0.08), (0.55, 0.10, 0.10), MATS["dark_wood"])
        log.rotation_euler[2] = math.radians(rot)

    tent("Meridian center tent", 650, 925, 125, 110, 0.72, MATS["canvas"])
    tent("Meridian left tent", 510, 915, 90, 90, 0.58, MATS["canvas_dark"])
    tent("Meridian right tent", 790, 910, 90, 90, 0.58, MATS["canvas_dark"])
    add_label("meridian-sign", "Meridian Campsite", 650, 835, 0.82, 0.13)
    fire_x, fire_y, _ = px_to_world(760, 850, 0.05)
    cyl_obj("Meridian fire stones", (fire_x, fire_y, 0.06), 0.18, 0.08, MATS["stone"], vertices=18)
    bpy.ops.object.light_add(type="POINT", location=(fire_x, fire_y, 0.52))
    bpy.context.object.name = "Meridian fire glow"
    bpy.context.object.data.energy = 75
    bpy.context.object.data.color = (1.0, 0.54, 0.25)
    add_lantern("Meridian standing lantern", 730, 846, 0.66)


def add_realistic_tree(index, px, py, radius, height, lean=0):
    x, y, _ = px_to_world(px, py, 0)
    trunk_h = height * 0.72
    cyl_obj(f"Tree {index} rough trunk", (x, y, trunk_h / 2), radius * 0.13, trunk_h, MATS["bark"], vertices=10)
    for i, angle in enumerate([35, 115, 210, 300]):
        branch_len = radius * (0.55 + 0.08 * (i % 2))
        bx = x + math.cos(math.radians(angle)) * branch_len * 0.35
        by = y + math.sin(math.radians(angle)) * branch_len * 0.35
        branch = cyl_obj(
            f"Tree {index} angled branch {i}",
            (bx, by, trunk_h * 0.72),
            radius * 0.045,
            branch_len,
            MATS["bark"],
            vertices=8,
            rotation=(math.radians(72), 0, math.radians(angle)),
        )
    for i, (ox, oy, oz, scale, mat_name) in enumerate([
        (0.00, 0.00, 0.95, 1.00, "leaf"),
        (0.22, -0.12, 0.82, 0.78, "leaf_dark"),
        (-0.23, 0.08, 0.84, 0.74, "leaf_light"),
        (0.05, 0.24, 0.76, 0.66, "leaf"),
        (-0.08, -0.23, 0.70, 0.60, "leaf_dark"),
    ]):
        bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=12, radius=radius * scale, location=(x + ox * radius, y + oy * radius, height * oz))
        obj = bpy.context.object
        obj.name = f"Tree {index} layered canopy {i}"
        obj.scale = (1.0, 0.86, 0.58)
        obj.data.materials.append(MATS[mat_name])
        obj.modifiers.new(name="Soft leaf normals", type="WEIGHTED_NORMAL")
    # A few root flares ground the tree instead of making it look planted like a pole.
    for i, angle in enumerate([20, 150, 260]):
        root = cube_obj(f"Tree {index} exposed root {i}", (x + math.cos(math.radians(angle)) * radius * 0.14, y + math.sin(math.radians(angle)) * radius * 0.14, 0.045), (radius * 0.50, 0.035, 0.04), MATS["bark"])
        set_rot(root, angle)


def add_trees():
    for i, (px, py, r, h) in enumerate([
        (168, 340, 0.46, 1.15), (174, 985, 0.38, 0.95), (788, 712, 0.52, 1.25),
        (1100, 185, 0.42, 1.05), (1092, 360, 0.40, 1.0), (990, 1000, 0.40, 0.98),
        (320, 30, 0.32, 0.82), (560, 995, 0.35, 0.9), (1050, 470, 0.36, 0.88),
    ]):
        add_realistic_tree(i, px, py, r, h)


def add_stockade():
    # Walkways and posts match the drawn enclosure.
    add_plank_walkway("North raised walk", 663, 128, 470, 36)
    add_plank_walkway("South raised walk west", 530, 528, 210, 38)
    add_plank_walkway("South raised walk east", 798, 528, 210, 38)
    add_plank_walkway("West raised walk", 404, 324, 36, 360)
    add_plank_walkway("East raised walk", 903, 324, 36, 360)
    add_post_line("North palisade", 424, 104, 902, 104, 58)
    add_post_line("South palisade", 424, 548, 890, 548, 52)
    add_post_line("West palisade", 382, 136, 382, 514, 44)
    add_post_line("East palisade", 925, 136, 925, 514, 44)
    for name, px, py in [
        ("NW tower", 420, 120), ("NE tower", 900, 120),
        ("SW tower", 420, 526), ("SE tower", 900, 526),
    ]:
        add_tower(name, px, py)


def add_path_guides():
    # Subtle raised gravel where the sketch already shows paths.
    for name, px, py, sx, sy in [
        ("Southern road", 650, 710, 0.82, 4.0),
        ("Inner yard gravel", 650, 335, 3.7, 3.2),
        ("Gate threshold", 650, 530, 1.1, 0.35),
    ]:
        x, y, _ = px_to_world(px, py, 0.025)
        cube_obj(name, (x, y, 0.025), (sx, sy, 0.035), MATS["gravel"])


def setup_camera():
    bpy.ops.object.empty_add(type="PLAIN_AXES", location=px_to_world(650, 800, 0.7))
    target = bpy.context.object
    target.name = "Walk target"

    bpy.ops.object.camera_add(location=px_to_world(650, 940, 0.82))
    camera = bpy.context.object
    bpy.context.scene.camera = camera
    camera.data.lens = 24
    camera.data.dof.use_dof = True
    camera.data.dof.focus_object = target
    camera.data.dof.aperture_fstop = 7.5

    constraint = camera.constraints.new(type="TRACK_TO")
    constraint.track_axis = "TRACK_NEGATIVE_Z"
    constraint.up_axis = "UP_Y"
    constraint.target = target

    if ASSET_REVIEW:
        camera.location = px_to_world(650, 685, 2.65)
        target.location = px_to_world(650, 310, 0.65)
        camera.data.lens = 26
        camera.data.dof.use_dof = False
        bpy.context.scene.frame_set(1)
        return

    if STATIC_REVIEW:
        camera.constraints.clear()
        camera.location = (0, 0, 28)
        camera.rotation_euler = (0, 0, 0)
        camera.data.type = "ORTHO"
        camera.data.ortho_scale = WORLD_H * 1.12
        camera.data.dof.use_dof = False
        bpy.context.scene.frame_set(1)
        return

    if AUDIT:
        camera.constraints.clear()
        camera.location = (0, 0, 18)
        camera.rotation_euler = (0, 0, 0)
        camera.data.type = "ORTHO"
        camera.data.ortho_scale = max(WORLD_H, WORLD_W) * 1.45
        bpy.context.scene.frame_set(1)
        return

    route = [
        (650, 965, 650, 890),
        (650, 850, 760, 850),
        (650, 720, 650, 585),
        (650, 555, 650, 390),
        (650, 435, 520, 245),
        (625, 345, 665, 238),
        (690, 325, 790, 318),
        (725, 385, 790, 318),
        (650, 445, 525, 440),
        (590, 455, 525, 440),
    ]
    frames = [1, 180, 360, 540, 720, 900, 1080, 1260, 1440, 1620]
    for frame, (cpx, cpy, tpx, tpy) in zip(frames, route):
        camera.location = px_to_world(cpx, cpy, 0.86)
        target.location = px_to_world(tpx, tpy, 0.74)
        camera.keyframe_insert(data_path="location", frame=frame)
        target.keyframe_insert(data_path="location", frame=frame)

def setup_render():
    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = 1 if (AUDIT or STATIC_REVIEW or ASSET_REVIEW) else 1620
    scene.render.fps = 24
    scene.render.resolution_x = 960 if RENDER_MOVIE else (1268 if STATIC_REVIEW else 1280)
    scene.render.resolution_y = 540 if RENDER_MOVIE else (1028 if STATIC_REVIEW else 720)
    scene.eevee.taa_render_samples = 8 if RENDER_MOVIE else 48
    scene.eevee.taa_samples = 8 if RENDER_MOVIE else 24
    scene.render.engine = "BLENDER_EEVEE"
    scene.world = bpy.data.worlds.new("Destons World") if not scene.world else scene.world
    scene.world.color = (0.035, 0.04, 0.032)
    scene.view_settings.view_transform = "Filmic"
    scene.view_settings.look = "Medium High Contrast"
    scene.view_settings.exposure = -0.15
    scene.view_settings.gamma = 1.0
    if RENDER_MOVIE:
        frame_dir = os.path.join(EXPORT_DIR, "frames")
        os.makedirs(frame_dir, exist_ok=True)
        scene.render.image_settings.file_format = "PNG"
        scene.render.filepath = os.path.join(frame_dir, "frame-")


def setup_lighting():
    bpy.ops.object.light_add(type="SUN", location=(0, 0, 8))
    sun = bpy.context.object
    sun.name = "Low afternoon sun"
    sun.rotation_euler = (math.radians(42), 0, math.radians(-35))
    sun.data.energy = 2.4
    sun.data.angle = math.radians(4.5)

    bpy.ops.object.light_add(type="AREA", location=(0, -5, 5.0))
    area = bpy.context.object
    area.name = "Soft sky fill"
    area.data.energy = 260
    area.data.size = 8


def build_scene():
    clear_scene()
    os.makedirs(EXPORT_DIR, exist_ok=True)
    global MATS
    MATS = {
        "map": make_texture_mat("Original sketch ground", MAP_IMAGE),
        "weathered_wood": make_mat("Weathered timber", (0.32, 0.19, 0.11, 1)),
        "dark_wood": make_mat("Dark rough timber", (0.16, 0.09, 0.045, 1)),
        "stone": make_mat("Stacked fieldstone", (0.38, 0.34, 0.28, 1)),
        "terracotta_roof": make_mat("Weathered reddish roof", (0.34, 0.16, 0.10, 1)),
        "dark_roof": make_mat("Dark shake roof", (0.16, 0.10, 0.07, 1)),
        "roof_dark_detail": make_mat("Dark uneven roof courses", (0.11, 0.075, 0.045, 1)),
        "warm_plaster": make_mat("Warm limewashed plaster", (0.62, 0.42, 0.28, 1)),
        "aged_wattle_wall": make_mat("Aged wattle and daub wall", (0.36, 0.27, 0.21, 1)),
        "warm_window": make_mat("Warm shuttered window glow", (0.78, 0.52, 0.26, 1), roughness=0.28),
        "thatched_roof": make_mat("Dry thatch", (0.52, 0.42, 0.23, 1)),
        "wattle": make_mat("Wattle wall", (0.43, 0.32, 0.21, 1)),
        "hay": make_mat("Stable straw", (0.58, 0.45, 0.20, 1)),
        "canvas": make_mat("Aged canvas", (0.52, 0.50, 0.42, 1)),
        "canvas_dark": make_mat("Weathered grey canvas", (0.36, 0.36, 0.32, 1)),
        "leaf": make_mat("Muted summer leaves", (0.26, 0.36, 0.13, 1)),
        "leaf_dark": make_mat("Deep shaded leaves", (0.12, 0.22, 0.08, 1)),
        "leaf_light": make_mat("Sunlit leaf clusters", (0.39, 0.48, 0.18, 1)),
        "bark": make_mat("Rough bark", (0.19, 0.10, 0.045, 1)),
        "gravel": make_mat("Pale gravel dust", (0.54, 0.52, 0.43, 1)),
        "sign_text": make_mat("Warm sign lettering", (0.88, 0.74, 0.45, 1)),
        "sign_board": make_mat("Aged hanging sign boards", (0.24, 0.13, 0.06, 1)),
        "crate_wood": make_mat("Rough crate planks", (0.38, 0.23, 0.11, 1)),
        "barrel_wood": make_mat("Oiled barrel staves", (0.30, 0.17, 0.08, 1)),
        "dark_iron": make_mat("Dark hammered iron", (0.035, 0.032, 0.03, 1), roughness=0.48, metallic=0.45),
        "burlap": make_mat("Dusty burlap sacks", (0.47, 0.38, 0.24, 1)),
        "rope": make_mat("Hemp rope", (0.62, 0.50, 0.30, 1)),
        "lantern_glow": make_mat("Warm lantern glass", (1.0, 0.58, 0.22, 1), roughness=0.2),
        "faded_crimson": make_mat("Faded crimson canvas", (0.42, 0.07, 0.045, 1)),
    }

    textured_ground("Original Deston's Trading Post sketch texture", MATS["map"])
    load_vendor_asset_library()

    add_stockade()
    add_buildings()
    add_camps()
    add_fantasy_assets()
    add_imported_vendor_assets()
    add_trees()
    setup_lighting()
    setup_camera()
    setup_render()

    blend_path = os.path.join(EXPORT_DIR, "destons-trading-post.blend")
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    print(f"Created Deston's Trading Post scene: {blend_path}")


if __name__ == "__main__":
    build_scene()
    if AUDIT:
        bpy.context.scene.render.filepath = os.path.join(EXPORT_DIR, "destons-audit-topdown.png")
        bpy.ops.render.render(write_still=True)
    elif STATIC_REVIEW:
        bpy.context.scene.render.filepath = os.path.join(EXPORT_DIR, "destons-static-front-review.png")
        bpy.ops.render.render(write_still=True)
    elif ASSET_REVIEW:
        bpy.context.scene.render.filepath = os.path.join(EXPORT_DIR, "destons-asset-quality-review.png")
        bpy.ops.render.render(write_still=True)
    elif RENDER_MOVIE:
        bpy.ops.render.render(animation=True)
