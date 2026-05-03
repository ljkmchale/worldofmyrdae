#!/usr/bin/env python3
"""
Create a quick Blender preview scene from a Myrdae city map module.

Usage:
  blender --background --python tools/city_blender_preview.py -- tratta
  blender --background --python tools/city_blender_preview.py -- tratta --cinematic --render-movie
  blender --background --python tools/city_blender_preview.py -- tratta --tour --render-movie
  blender --background --python tools/city_blender_preview.py -- tratta --walkthrough --render-movie
  blender --background --python tools/city_blender_preview.py -- tratta --walkthrough --audit
"""
from __future__ import annotations

import math
import re
import sys
from pathlib import Path

import bpy
from mathutils import Vector


ROOT = Path(__file__).resolve().parents[1]
EXPORT_DIR = ROOT / "exports" / "city-cinematics"


def args_after_double_dash() -> list[str]:
    if "--" not in sys.argv:
        return []
    return sys.argv[sys.argv.index("--") + 1 :]


def arg_after_double_dash(default: str = "tratta") -> str:
    args = args_after_double_dash()
    return args[0] if args else default


def has_flag(name: str) -> bool:
    return name in args_after_double_dash()


def js_string(text: str, key: str, default: str = "") -> str:
    match = re.search(rf"{key}\s*:\s*[\"']([^\"']+)[\"']", text)
    return match.group(1) if match else default


def js_number(obj: str, key: str, default: float = 0.0) -> float:
    match = re.search(rf"{key}\s*:\s*(-?\d+(?:\.\d+)?)", obj)
    return float(match.group(1)) if match else default


def parse_city(city_id: str) -> dict:
    city_file = ROOT / "js" / "cities" / f"{city_id}.js"
    if not city_file.exists():
        raise FileNotFoundError(f"No city module found: {city_file}")

    text = city_file.read_text(encoding="utf-8")
    name = js_string(text, "name", city_id)
    image = js_string(text, "image")

    pins_block_match = re.search(r"pins\s*:\s*\[(.*?)\]\s*,\s*namedLabels", text, re.S)
    pins_block = pins_block_match.group(1) if pins_block_match else ""
    pin_objects = re.findall(r"\{[^{}]*\}", pins_block, re.S)
    pins = []
    for obj in pin_objects:
        pin_name = js_string(obj, "name", "Point")
        pin_type = js_string(obj, "type", "poi").lower()
        pins.append(
            {
                "n": int(js_number(obj, "n", len(pins) + 1)),
                "x": js_number(obj, "x", 50),
                "y": js_number(obj, "y", 50),
                "name": pin_name,
                "type": pin_type,
                "size": js_number(obj, "size", 1.0),
            }
        )

    return {"id": city_id, "name": name, "image": image, "pins": pins}


def look_at(obj, target):
    direction = target - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def make_material(name: str, color):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Roughness"].default_value = 0.65
    return material


def make_roof_mesh(name: str, width: float, depth: float, height: float, roof_height: float):
    mesh = bpy.data.meshes.new(name)
    hw = width / 2
    hd = depth / 2
    verts = [
        (-hw, -hd, height),
        (hw, -hd, height),
        (hw, hd, height),
        (-hw, hd, height),
        (0, -hd, height + roof_height),
        (0, hd, height + roof_height),
    ]
    faces = [
        (0, 1, 2, 3),
        (0, 4, 1),
        (3, 2, 5),
        (0, 3, 5, 4),
        (1, 4, 5, 2),
    ]
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    return mesh


def add_house(x: float, y: float, scale: float, wall_material, roof_material, rotation: float = 0.0):
    width = 0.22 * scale
    depth = 0.28 * scale
    height = 0.16 * scale
    roof_height = 0.14 * scale

    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, y, height / 2))
    body = bpy.context.object
    body.name = "Procedural town house"
    body.dimensions = (width, depth, height)
    body.rotation_euler[2] = rotation
    body.data.materials.append(wall_material)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

    roof_mesh = make_roof_mesh("House roof mesh", width * 1.15, depth * 1.18, height, roof_height)
    roof = bpy.data.objects.new("Steep slate roof", roof_mesh)
    bpy.context.collection.objects.link(roof)
    roof.location = (x, y, 0)
    roof.rotation_euler[2] = rotation
    roof.data.materials.append(roof_material)
    return body


def add_tower(x: float, y: float, scale: float, wall_material, roof_material):
    radius = 0.11 * scale
    height = 0.6 * scale
    bpy.ops.mesh.primitive_cylinder_add(vertices=18, radius=radius, depth=height, location=(x, y, height / 2))
    tower = bpy.context.object
    tower.name = "Stone tower"
    tower.data.materials.append(wall_material)
    bpy.ops.mesh.primitive_cone_add(vertices=18, radius1=radius * 1.25, radius2=0, depth=0.28 * scale, location=(x, y, height + 0.14 * scale))
    roof = bpy.context.object
    roof.name = "Tower roof"
    roof.data.materials.append(roof_material)
    return tower


def add_tree(x: float, y: float, scale: float, trunk_material, leaf_material):
    trunk_h = 0.13 * scale
    bpy.ops.mesh.primitive_cylinder_add(vertices=7, radius=0.025 * scale, depth=trunk_h, location=(x, y, trunk_h / 2))
    trunk = bpy.context.object
    trunk.name = "Small cypress trunk"
    trunk.data.materials.append(trunk_material)
    bpy.ops.mesh.primitive_cone_add(vertices=9, radius1=0.09 * scale, radius2=0.015 * scale, depth=0.34 * scale, location=(x, y, trunk_h + 0.17 * scale))
    leaves = bpy.context.object
    leaves.name = "Small dark tree"
    leaves.data.materials.append(leaf_material)
    return leaves


def add_street_strip(points: list[tuple[float, float]], width: float, material):
    for start, end in zip(points, points[1:]):
        sx, sy = start
        ex, ey = end
        direction = Vector((ex - sx, ey - sy, 0))
        length = direction.length
        if length < 0.001:
            continue
        direction.normalize()
        side = Vector((-direction.y, direction.x, 0))
        center = Vector(((sx + ex) / 2, (sy + ey) / 2, 0.011))
        angle = math.atan2(direction.y, direction.x)
        bpy.ops.mesh.primitive_cube_add(size=1, location=center)
        strip = bpy.context.object
        strip.name = "Raised street path"
        strip.dimensions = (length, width, 0.010)
        strip.rotation_euler[2] = angle
        strip.data.materials.append(material)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)


def make_texture_material(image_path: Path):
    material = bpy.data.materials.new("City map texture")
    material.use_nodes = True
    nodes = material.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    image_node = nodes.new("ShaderNodeTexImage")
    image_node.image = bpy.data.images.load(str(image_path))
    material.node_tree.links.new(image_node.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = 0.9
    return material, image_node.image


def add_text(label: str, x: float, y: float, z: float, size: float, material):
    bpy.ops.object.text_add(location=(x, y, z), rotation=(math.radians(75), 0, 0))
    obj = bpy.context.object
    obj.name = f"Label - {label}"
    obj.data.body = label
    obj.data.align_x = "CENTER"
    obj.data.align_y = "CENTER"
    obj.data.size = size
    obj.data.materials.append(material)
    return obj


def add_sign(label: str, x: float, y: float, z: float, rotation: float, board_material, text_material):
    short_label = label if len(label) <= 22 else label[:20] + "."
    width = max(0.24, min(0.62, len(short_label) * 0.032))

    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, y, z))
    board = bpy.context.object
    board.name = f"Shop sign - {label}"
    board.dimensions = (width, 0.16, 0.018)
    board.rotation_euler[2] = rotation
    board.data.materials.append(board_material)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

    bpy.ops.object.text_add(location=(x, y, z + 0.014), rotation=(0, 0, rotation))
    text = bpy.context.object
    text.name = f"Sign text - {label}"
    text.data.body = short_label
    text.data.align_x = "CENTER"
    text.data.align_y = "CENTER"
    text.data.size = 0.045
    text.data.materials.append(text_material)
    return board


def add_facade_sign(label: str, building, scale: float, board_material, text_material):
    short_label = label if len(label) <= 20 else label[:18] + "."
    width = max(0.20, min(0.46, len(short_label) * 0.024))
    rotation = building.rotation_euler[2]
    front = Vector((-math.sin(rotation), math.cos(rotation), 0))
    sign_y_offset = 0.28 * scale / 2 + 0.030
    x = building.location.x + front.x * sign_y_offset
    y = building.location.y + front.y * sign_y_offset
    z = 0.13 * scale

    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, y, z))
    board = bpy.context.object
    board.name = f"Facade sign - {label}"
    board.dimensions = (width, 0.052, 0.040)
    board.rotation_euler[2] = rotation
    board.data.materials.append(board_material)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

    bpy.ops.object.text_add(location=(x, y, z + 0.023), rotation=(0, 0, rotation))
    text = bpy.context.object
    text.name = f"Facade sign text - {label}"
    text.data.body = short_label
    text.data.align_x = "CENTER"
    text.data.align_y = "CENTER"
    text.data.size = 0.032
    text.data.materials.append(text_material)
    return board


def distance_2d(a: tuple[float, float], b: tuple[float, float]) -> float:
    return math.hypot(a[0] - b[0], a[1] - b[1])


def lerp(a: float, b: float, amount: float) -> float:
    return a + (b - a) * amount


def distance_to_segment(point: tuple[float, float], start: tuple[float, float], end: tuple[float, float]) -> float:
    px, py = point
    sx, sy = start
    ex, ey = end
    dx = ex - sx
    dy = ey - sy
    length_sq = dx * dx + dy * dy
    if length_sq < 0.0001:
        return distance_2d(point, start)
    amount = max(0.0, min(1.0, ((px - sx) * dx + (py - sy) * dy) / length_sq))
    return distance_2d(point, (sx + dx * amount, sy + dy * amount))


def build_scene(city: dict):
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()

    image_path = ROOT / city["image"]
    texture_material, source_image = make_texture_material(image_path)
    px_w, px_h = source_image.size
    width = 12.0
    height = width * (px_h / px_w)

    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, 0))
    ground = bpy.context.object
    ground.name = f"{city['name']} map plane"
    ground.scale = (width, height, 1)
    ground.data.materials.append(texture_material)

    walkthrough = has_flag("--walkthrough")
    audit = has_flag("--audit")
    tour = has_flag("--tour") or walkthrough
    cinematic = has_flag("--cinematic") or tour
    gold = make_material("Warm gold markers", (0.95, 0.68, 0.18, 1))
    crimson = make_material("Crimson landmark markers", (0.72, 0.08, 0.12, 1))
    blue = make_material("Harbor blue markers", (0.12, 0.45, 0.72, 1))
    ivory = make_material("Ivory labels", (0.92, 0.86, 0.68, 1))
    stone = make_material("Weathered limestone", (0.55, 0.50, 0.42, 1))
    timber = make_material("Dark timber", (0.22, 0.13, 0.08, 1))
    slate = make_material("Deep slate roof", (0.10, 0.12, 0.15, 1))
    terracotta = make_material("Old red tile roof", (0.45, 0.15, 0.09, 1))
    leaves = make_material("Dark coastal greenery", (0.08, 0.18, 0.10, 1))
    sign_board = make_material("Painted dark signboard", (0.13, 0.07, 0.035, 1))
    street_lift = make_material("Raised pale street surface", (0.46, 0.43, 0.37, 1))

    type_materials = {
        "harbor": blue,
        "market": gold,
        "gate": crimson,
        "keep": crimson,
        "stronghold": crimson,
        "palace": crimson,
        "temple": gold,
        "shrine": gold,
    }

    def to_world(px: float, py: float) -> tuple[float, float]:
        return (px / 100.0 - 0.5) * width, (0.5 - py / 100.0) * height

    def to_percent(x: float, y: float) -> tuple[float, float]:
        return ((x / width) + 0.5) * 100.0, (0.5 - (y / height)) * 100.0

    image_pixels = list(source_image.pixels[:])

    def sampled_rgb(px: float, py: float) -> tuple[float, float, float]:
        ix = max(0, min(px_w - 1, int((px / 100.0) * px_w)))
        iy = max(0, min(px_h - 1, int((1.0 - py / 100.0) * px_h)))
        offset = (iy * px_w + ix) * 4
        return image_pixels[offset], image_pixels[offset + 1], image_pixels[offset + 2]

    def roof_score(px: float, py: float) -> float:
        r, g, b = sampled_rgb(px, py)
        red_bias = max(0.0, r - g * 0.95) + max(0.0, g - b * 0.90)
        warmth = (r * 0.55 + g * 0.35 - b * 0.18)
        brightness_ok = 0.18 < (r + g + b) / 3.0 < 0.72
        gray_distance = max(r, g, b) - min(r, g, b)
        if not brightness_ok or gray_distance < 0.055:
            return 0.0
        if b > r * 0.95:
            return 0.0
        return red_bias + warmth * 0.18

    def inside_tratta_build_area(px: float, py: float) -> bool:
        if py < 8.0 or py > 86.0:
            return False
        if px < 15.0 or px > 84.5:
            return False
        if px > 80.0 and py > 67.0:
            return False
        if px < 19.0 and py < 34.0:
            return False
        if px < 21.0 and py > 62.0:
            return False
        return True

    route = [
        (50.3, 5.8),
        "The Anchored Spire",
        (44.0, 33.2),
        "Lower Market",
        (49.5, 39.3),
        "Slippy Tails",
        (55.5, 35.2),
        "Lower Warehouse",
        (43.0, 45.0),
        "SeaRoute Colosseum",
        (30.0, 58.0),
        "Torguard Post",
        (42.0, 67.0),
        "The Majestic",
        (60.0, 73.5),
        "Travane College",
        (72.0, 80.5),
        "The Reserve (Vault)",
        (70.0, 66.0),
        "Temple of Tratta",
        (77.1, 90.6),
    ]

    pin_positions = []
    city_buildings = []
    tour_types = {
        "arena",
        "bank",
        "college",
        "harbor",
        "inn",
        "landmark",
        "market",
        "medical",
        "shop",
        "shrine",
        "stables",
        "stronghold",
        "tavern",
        "temple",
        "warehouse",
    }

    for pin in city["pins"]:
        x, y = to_world(pin["x"], pin["y"])
        pin_positions.append((pin, x, y))

    pins_by_name_for_route = {pin["name"]: (pin, x, y) for pin, x, y in pin_positions}
    route_positions_for_clearance = []
    for step in route:
        if isinstance(step, tuple):
            route_positions_for_clearance.append(to_world(step[0], step[1]))
        elif step in pins_by_name_for_route:
            _, x, y = pins_by_name_for_route[step]
            route_positions_for_clearance.append((x, y))

    def clear_of_walk_route(x: float, y: float, clearance: float = 0.36) -> bool:
        if not walkthrough or len(route_positions_for_clearance) < 2:
            return True
        return all(
            distance_to_segment((x, y), start, end) >= clearance
            for start, end in zip(route_positions_for_clearance, route_positions_for_clearance[1:])
        )

    def clear_of_markers(x: float, y: float, clearance: float = 0.22) -> bool:
        return all(distance_2d((x, y), (mx, my)) >= clearance for _, mx, my in pin_positions)

    def clear_of_buildings(x: float, y: float, clearance: float = 0.19) -> bool:
        return all(distance_2d((x, y), (entry["x"], entry["y"])) >= clearance for entry in city_buildings)

    def add_building_entry(
        x: float,
        y: float,
        scale: float,
        wall_material,
        roof_material,
        rotation: float,
        require_marker_clearance: bool = False,
    ):
        if abs(x) >= width * 0.475 or abs(y) >= height * 0.475:
            return None
        px, py = to_percent(x, y)
        if tour and not inside_tratta_build_area(px, py):
            return None
        if require_marker_clearance and not clear_of_markers(x, y):
            return None
        if not clear_of_walk_route(x, y):
            return None
        if tour and not clear_of_buildings(x, y):
            return None
        building = add_house(x, y, scale, wall_material, roof_material, rotation=rotation)
        city_buildings.append(
            {
                "object": building,
                "x": building.location.x,
                "y": building.location.y,
                "scale": scale,
                "assigned": False,
            }
        )
        return building

    def add_whole_city_fabric():
        placed = 0
        for py in [9.0 + row * 1.45 for row in range(54)]:
            for px in [15.5 + col * 1.45 for col in range(49)]:
                if not inside_tratta_build_area(px, py):
                    continue
                score = roof_score(px, py)
                if score < 0.22:
                    continue
                x, y = to_world(px, py)
                local_angle = ((int(px * 13 + py * 7) % 8) / 8.0) * math.pi
                scale = 0.48 + 0.07 * ((int(px * 3 + py * 5)) % 4)
                wall_material = timber if (int(px + py) % 5 == 0) else stone
                roof_material = terracotta if score > 0.35 else slate
                if add_building_entry(x, y, scale, wall_material, roof_material, local_angle):
                    placed += 1
        print(f"Generated whole-city building fabric: {placed} buildings")

    def add_street_row(points: list[tuple[float, float]], spacing: float, side_offset: float, start_offset: float = 0.0):
        for start, end in zip(points, points[1:]):
            sx, sy = to_world(start[0], start[1])
            ex, ey = to_world(end[0], end[1])
            direction = Vector((ex - sx, ey - sy, 0))
            segment_length = direction.length
            if segment_length < 0.1:
                continue
            direction.normalize()
            side = Vector((-direction.y, direction.x, 0))
            rotation = math.atan2(direction.y, direction.x) + math.pi / 2
            count = max(1, int(segment_length / spacing))
            for i in range(count + 1):
                amount = min(0.94, max(0.06, (i + start_offset) / max(1, count)))
                bx = lerp(sx, ex, amount) + side.x * side_offset
                by = lerp(sy, ey, amount) + side.y * side_offset
                scale = 0.92 + 0.12 * ((i + int(abs(side_offset) * 10)) % 3)
                wall_material = timber if i % 4 == 0 else stone
                roof_material = terracotta if i % 2 == 0 else slate
                add_building_entry(bx, by, scale, wall_material, roof_material, rotation)

    if tour:
        add_whole_city_fabric()
        street_spines = [
            [(50.3, 5.8), (47.3, 18.0), (44.0, 33.2), (49.5, 39.3), (43.0, 45.0), (32.0, 50.7), (30.0, 58.0), (25.4, 71.9)],
            [(49.5, 39.3), (55.5, 35.2), (59.0, 28.3), (69.2, 38.9), (67.6, 52.8), (68.1, 62.6), (70.0, 66.0), (72.0, 80.5), (77.1, 90.6)],
            [(43.0, 45.0), (43.5, 58.9), (46.9, 66.3), (52.3, 72.0), (63.0, 74.5), (70.2, 82.8)],
            [(22.7, 44.8), (31.2, 37.9), (39.0, 33.8), (52.0, 30.2), (59.0, 28.3)],
        ]
        if not walkthrough:
            for spine in street_spines:
                add_street_row(spine, spacing=0.82, side_offset=0.74, start_offset=0.15)
                add_street_row(spine, spacing=0.82, side_offset=-0.74, start_offset=0.55)

    for index, (pin, x, y) in enumerate(pin_positions):
        radius = 0.060 * pin["size"] if cinematic else 0.07 * pin["size"]
        marker_height = 0.018 if cinematic else 0.35 + 0.05 * pin["size"]
        material = type_materials.get(pin["type"], gold)

        if tour:
            pass
        elif cinematic:
            bpy.ops.mesh.primitive_cylinder_add(
                vertices=24,
                radius=radius,
                depth=marker_height,
                location=(x, y, marker_height / 2 + 0.018),
            )
            marker = bpy.context.object
            marker.name = f"Location marker {pin['n']} - {pin['name']}"
            marker.data.materials.append(material)

            bpy.ops.mesh.primitive_torus_add(
                major_radius=radius * 1.04,
                minor_radius=radius * 0.13,
                major_segments=24,
                minor_segments=6,
                location=(x, y, marker_height + 0.028),
            )
            ring = bpy.context.object
            ring.name = f"Marker ring {pin['n']} - {pin['name']}"
            ring.data.materials.append(ivory)
        else:
            bpy.ops.mesh.primitive_cylinder_add(
                vertices=24,
                radius=radius,
                depth=marker_height,
                location=(x, y, marker_height / 2),
            )
            marker = bpy.context.object
            marker.name = f"Pin {pin['n']} - {pin['name']}"
            marker.data.materials.append(material)

            if pin["n"] <= 12:
                add_text(pin["name"], x, y - 0.18, marker_height + 0.08, 0.12, ivory)

        cluster_count = 0 if tour else (4 if cinematic else 3)
        for offset_index in range(cluster_count):
            angle = (index * 1.73 + offset_index * 2.05) % (math.pi * 2)
            distance = (0.92 + 0.16 * offset_index) if tour else (0.26 + 0.10 * offset_index)
            sx = x + math.cos(angle) * distance
            sy = y + math.sin(angle) * distance
            wall_material = timber if pin["type"] in {"harbor", "warehouse", "market"} and offset_index == 0 else stone
            roof_material = terracotta if offset_index % 2 == 0 else slate
            add_building_entry(sx, sy, 0.43 + 0.07 * offset_index, wall_material, roof_material, angle)

        if cinematic and index % 2 == 0:
            for tree_index in range(2):
                angle = index * 0.91 + tree_index * 2.7
                sx = x + math.cos(angle) * 0.52
                sy = y + math.sin(angle) * 0.52
                if abs(sx) < width * 0.48 and abs(sy) < height * 0.48:
                    add_tree(sx, sy, 0.8, timber, leaves)

    if tour:
        for pin, x, y in pin_positions:
            if pin["type"].lower() not in tour_types or pin["n"] > 18:
                continue
            candidates = [entry for entry in city_buildings if not entry["assigned"]]
            if not candidates:
                candidates = city_buildings
            nearest = min(candidates, key=lambda entry: distance_2d((x, y), (entry["x"], entry["y"])))
            nearest["assigned"] = True
            building = nearest["object"]
            add_facade_sign(pin["name"], building, nearest["scale"], sign_board, ivory)

    bpy.ops.object.light_add(type="SUN", location=(-3, -4, 8))
    sun = bpy.context.object
    sun.name = "Low warm sun"
    sun.data.energy = 2.4
    sun.rotation_euler = (math.radians(45), 0, math.radians(-35))

    bpy.ops.object.light_add(type="AREA", location=(0, -3, 6))
    area = bpy.context.object
    area.name = "Soft city wash"
    area.data.energy = 450
    area.data.size = 8

    bpy.ops.object.camera_add(location=(-1.0, -height * 0.95, 7.0))
    camera = bpy.context.object
    bpy.context.scene.camera = camera
    look_at(camera, Vector((0, 0, 0)))
    camera.data.lens = 28

    bpy.context.scene.frame_start = 1
    draft_movie = has_flag("--render-movie")
    bpy.context.scene.frame_end = 1 if audit else (1440 if tour else (240 if cinematic and draft_movie else (72 if draft_movie else 192)))
    if tour:
        camera.data.lens = 24 if walkthrough else 36
        target = bpy.data.objects.new("Tour camera look-ahead target", None)
        bpy.context.collection.objects.link(target)
        constraint = camera.constraints.new(type="TRACK_TO")
        constraint.track_axis = "TRACK_NEGATIVE_Z"
        constraint.up_axis = "UP_Y"
        constraint.target = target
        pins_by_name = {pin["name"]: (pin, x, y) for pin, x, y in pin_positions}

        def point_from_percent(px: float, py: float):
            x, y = to_world(px, py)
            return ({"name": "street waypoint"}, x, y)

        route_positions = []
        for step in route:
            if isinstance(step, tuple):
                route_positions.append(point_from_percent(step[0], step[1]))
            elif step in pins_by_name:
                route_positions.append(pins_by_name[step])

        frame_step = max(1, bpy.context.scene.frame_end // max(1, len(route_positions) - 1))
        for route_index, (pin, x, y) in enumerate(route_positions):
            frame = min(bpy.context.scene.frame_end, 1 + route_index * frame_step)
            next_pin, nx, ny = route_positions[min(route_index + 1, len(route_positions) - 1)]
            prev_pin, px, py = route_positions[max(0, route_index - 1)]
            direction = Vector((nx - x, ny - y, 0))
            if direction.length < 0.001:
                direction = Vector((x - px, y - py, 0))
            if direction.length < 0.001:
                direction = Vector((0, 1, 0))
            direction.normalize()
            side = Vector((-direction.y, direction.x, 0))
            if walkthrough:
                camera.location = (x - direction.x * 0.62 + side.x * 0.08, y - direction.y * 0.62 + side.y * 0.08, 0.76)
                target.location = (x + direction.x * 1.65, y + direction.y * 1.65, 0.52)
            else:
                camera.location = (x - direction.x * 1.70 + side.x * 0.38, y - direction.y * 1.70 + side.y * 0.38, 3.65)
                target.location = (x + direction.x * 0.42, y + direction.y * 0.42, 0.10)
            camera.keyframe_insert(data_path="location", frame=frame)
            target.keyframe_insert(data_path="location", frame=frame)

    elif cinematic:
        camera.location = (-width * 0.12, -height * 0.74, 5.8)
        look_at(camera, Vector((-0.2, -0.05, 0)))
        camera.keyframe_insert(data_path="location", frame=1)
        camera.keyframe_insert(data_path="rotation_euler", frame=1)
    else:
        camera.location = (width * 0.1, -height * 0.55, 5.8)
        look_at(camera, Vector((0.2, -0.3, 0)))
        camera.keyframe_insert(data_path="location", frame=1)
        camera.keyframe_insert(data_path="rotation_euler", frame=1)

    if not tour:
        middle_frame = 120 if cinematic and draft_movie else (36 if draft_movie else 96)
        end_frame = 240 if cinematic and draft_movie else (72 if draft_movie else 192)
        if cinematic:
            camera.location = (width * 0.06, -height * 0.42, 4.15)
            look_at(camera, Vector((0.45, 0.05, 0)))
        else:
            camera.location = (width * 0.18, -height * 0.30, 4.2)
            look_at(camera, Vector((0.8, 0.1, 0)))
        camera.keyframe_insert(data_path="location", frame=middle_frame)
        camera.keyframe_insert(data_path="rotation_euler", frame=middle_frame)

        if cinematic and draft_movie:
            camera.location = (width * 0.36, -height * 0.15, 3.4)
            look_at(camera, Vector((width * 0.23, height * 0.05, 0)))
        camera.keyframe_insert(data_path="location", frame=end_frame)
        camera.keyframe_insert(data_path="rotation_euler", frame=end_frame)

    if audit:
        camera.constraints.clear()
        camera.data.type = "ORTHO"
        camera.data.ortho_scale = max(width, height) * 1.03
        camera.location = (0, 0, 12)
        camera.rotation_euler = (0, 0, 0)
        camera.keyframe_insert(data_path="location", frame=1)
        camera.keyframe_insert(data_path="rotation_euler", frame=1)

    engine_ids = {item.identifier for item in bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items}
    bpy.context.scene.render.engine = "BLENDER_EEVEE_NEXT" if "BLENDER_EEVEE_NEXT" in engine_ids else "BLENDER_EEVEE"
    if hasattr(bpy.context.scene, "eevee"):
        bpy.context.scene.eevee.taa_render_samples = 10 if tour and draft_movie else (12 if draft_movie else 64)
    bpy.context.scene.render.resolution_x = 1280
    bpy.context.scene.render.resolution_y = 720
    bpy.context.scene.render.fps = 24
    bpy.context.scene.world.color = (0.015, 0.013, 0.018)
    bpy.context.scene.render.image_settings.file_format = "PNG"

    if not cinematic:
        title = add_text(city["name"], 0, height * 0.56, 0.08, 0.42, ivory)
        title.name = "Scene title"

    EXPORT_DIR.mkdir(parents=True, exist_ok=True)
    output = EXPORT_DIR / f"{city['id']}-preview.blend"
    bpy.ops.wm.save_as_mainfile(filepath=str(output))
    return output


def main():
    city_id = arg_after_double_dash()
    city = parse_city(city_id)
    output = build_scene(city)
    print(f"Created Blender preview: {output}")
    if has_flag("--render-movie"):
        suffix = "tour-frames" if has_flag("--tour") else ("cinematic-frames" if has_flag("--cinematic") else "frames")
        frames_dir = EXPORT_DIR / f"{city['id']}-{suffix}"
        frames_dir.mkdir(parents=True, exist_ok=True)
        bpy.context.scene.render.filepath = str(frames_dir / "frame-")
        bpy.ops.render.render(animation=True)
        print(f"Rendered frames: {frames_dir}")


if __name__ == "__main__":
    main()
