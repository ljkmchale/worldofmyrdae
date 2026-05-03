"""Export Deston's Trading Post assets for an Unreal Engine playable blockout.

Run:
    blender --background exports/destons-trading-post/destons-trading-post.blend \
        --python tools/export_destons_for_unreal.py

Outputs are written to:
    exports/destons-trading-post/unreal-import/
"""

import json
import os

import bpy


ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
EXPORT_DIR = os.path.join(ROOT, "exports", "destons-trading-post")
UNREAL_DIR = os.path.join(EXPORT_DIR, "unreal-import")
MANIFEST_PATH = os.path.join(UNREAL_DIR, "destons-unreal-manifest.json")


def ensure_dirs():
    os.makedirs(UNREAL_DIR, exist_ok=True)


def apply_modifiers():
    bpy.ops.object.select_all(action="DESELECT")
    for obj in bpy.context.scene.objects:
        if obj.type != "MESH":
            continue
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        for modifier in list(obj.modifiers):
            try:
                bpy.ops.object.modifier_apply(modifier=modifier.name)
            except RuntimeError:
                pass
        obj.select_set(False)


def collect_scene_manifest():
    meshes = []
    collision_hints = []

    for obj in sorted(bpy.context.scene.objects, key=lambda item: item.name.lower()):
        if obj.type != "MESH":
            continue

        dims = obj.dimensions
        loc = obj.location
        rot = obj.rotation_euler
        entry = {
            "name": obj.name,
            "location_m": [round(loc.x, 4), round(loc.y, 4), round(loc.z, 4)],
            "rotation_rad": [round(rot.x, 4), round(rot.y, 4), round(rot.z, 4)],
            "dimensions_m": [round(dims.x, 4), round(dims.y, 4), round(dims.z, 4)],
            "materials": [slot.material.name for slot in obj.material_slots if slot.material],
        }
        meshes.append(entry)

        lower_name = obj.name.lower()
        if any(word in lower_name for word in ("hall", "guesthouse", "stable", "stockade", "gate", "wall")):
            collision_hints.append(
                {
                    "name": obj.name,
                    "recommended_ue_collision": "Use Complex as Simple for prototype; replace with simplified blocking volumes for playable pass.",
                }
            )

    return {
        "name": "Deston's Trading Post",
        "source_blend": os.path.join(EXPORT_DIR, "destons-trading-post.blend"),
        "scale": "1 Blender unit = 1 meter; import into Unreal at 100 scale if using centimeters.",
        "recommended_unreal_project": "First Person template, UE 5.x, Lumen enabled.",
        "exports": {
            "fbx": "destons-trading-post-unreal.fbx",
            "glb": "destons-trading-post-unreal.glb",
        },
        "playable_pass_targets": [
            "Add PlayerStart in the south approach outside the gate.",
            "Add NavMeshBoundsVolume covering the stockade, yard, hall, guesthouse, stable, and camps.",
            "Replace prototype mesh collision with blocking volumes around buildings, fence lines, carts, and tents.",
            "Add simple door trigger volumes for Deston's Hall, guesthouse, and stable entrances.",
            "Use the sketch-textured ground plane as a temporary layout guide; hide it after terrain/material pass.",
        ],
        "mesh_count": len(meshes),
        "meshes": meshes,
        "collision_hints": collision_hints,
    }


def export_fbx():
    fbx_path = os.path.join(UNREAL_DIR, "destons-trading-post-unreal.fbx")
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.export_scene.fbx(
        filepath=fbx_path,
        use_selection=True,
        apply_unit_scale=True,
        apply_scale_options="FBX_SCALE_UNITS",
        bake_space_transform=False,
        object_types={"MESH", "EMPTY", "LIGHT", "CAMERA"},
        path_mode="COPY",
        embed_textures=True,
        add_leaf_bones=False,
    )
    return fbx_path


def export_glb():
    glb_path = os.path.join(UNREAL_DIR, "destons-trading-post-unreal.glb")
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.export_scene.gltf(
        filepath=glb_path,
        export_format="GLB",
        use_selection=True,
        export_apply=True,
    )
    return glb_path


def write_manifest(data):
    with open(MANIFEST_PATH, "w", encoding="utf-8") as handle:
        json.dump(data, handle, indent=2)
        handle.write("\n")


def main():
    ensure_dirs()
    apply_modifiers()
    fbx_path = export_fbx()
    glb_path = export_glb()
    manifest = collect_scene_manifest()
    manifest["generated_files"] = [fbx_path, glb_path, MANIFEST_PATH]
    write_manifest(manifest)
    print(f"Exported Unreal starter files to {UNREAL_DIR}")


if __name__ == "__main__":
    main()
