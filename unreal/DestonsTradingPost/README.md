# Deston's Trading Post UE5 Starter

This folder is a lightweight Unreal Engine project shell for turning Deston's Trading Post into a walkable playable town.

## Source Exports

Generated import files:

- `/Users/larrymchale/Desktop/worldofmyrdae-master/exports/destons-trading-post/unreal-import/destons-trading-post-unreal.fbx`
- `/Users/larrymchale/Desktop/worldofmyrdae-master/exports/destons-trading-post/unreal-import/destons-trading-post-unreal.glb`
- `/Users/larrymchale/Desktop/worldofmyrdae-master/exports/destons-trading-post/unreal-import/destons-unreal-manifest.json`

Regenerate them with:

```bash
blender --background /Users/larrymchale/Desktop/worldofmyrdae-master/exports/destons-trading-post/destons-trading-post.blend --python /Users/larrymchale/Desktop/worldofmyrdae-master/tools/export_destons_for_unreal.py
```

## Open In Unreal

1. Install/open Unreal Engine 5.x.
2. Open `/Users/larrymchale/Desktop/worldofmyrdae-master/unreal/DestonsTradingPost/DestonsTradingPost.uproject`.
3. If Unreal asks to update the engine association, accept it.
4. Enable Lumen if prompted by the project settings.

## First Import Pass

1. Create `/Game/DestonsTradingPost/Blockout`.
2. Import `destons-trading-post-unreal.fbx`.
3. Use import scale `100` if the model arrives too small; the Blender source uses meters and Unreal uses centimeters.
4. Keep materials enabled for the first pass.
5. Leave the sketch-textured ground visible while placing gameplay volumes.

## Playable Pass

Add these in the level:

- `PlayerStart` outside the south gate.
- `NavMeshBoundsVolume` covering the stockade, hall, guesthouse, stable, market yard, and camp areas.
- Blocking volumes around walls, buildings, tents, carts, market tables, and the stable.
- Door/interaction trigger volumes at Deston's Hall, guesthouse, and stable.
- Warm lantern point lights near the hall, gate, market, and camp edges.

## Goal For The First Walkable Build

The first build should prove scale, navigation, collision, and atmosphere. Art polish can wait until the player can walk from the south road through the gate, cross the yard, visit the hall, inspect the stable, and loop back through the market without snagging on collision.
