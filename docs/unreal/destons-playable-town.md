# Deston's Trading Post Playable Town Plan

## Current Starting Point

This note is historical planning context for a playable UE5 prototype. Generated Blender, frame, and Unreal export artifacts previously lived under `exports/destons-trading-post/`, but `exports/` is now treated as generated local output and is not tracked in git.

Regenerate or restore the local export assets before continuing UE work. Expected local working locations are:

- `exports/destons-trading-post/`
- `exports/destons-trading-post/unreal-import/`
- `tools/export_destons_for_unreal.py`

## UE5 Setup

Use a First Person template project. Deston should start as a single-level playable prototype with the imported Blender scene as the visible guide.

Suggested level name:

`L_DestonsTradingPost_Walkable`

Suggested content folders:

- `/Game/DestonsTradingPost/Blockout`
- `/Game/DestonsTradingPost/Materials`
- `/Game/DestonsTradingPost/Lighting`
- `/Game/DestonsTradingPost/Blueprints`
- `/Game/DestonsTradingPost/Maps`

## Gameplay Spine

The first playable loop should be:

1. Spawn on the south road.
2. Walk through the gate.
3. Cross the central yard.
4. Enter or approach Deston's Hall.
5. Walk past the market stalls.
6. Visit the stable.
7. Return to the gate or camp edge.

## First Blocking Volumes

Create simple UE blocking volumes for:

- Outer stockade and gate.
- Deston's Hall footprint.
- Guesthouse footprint.
- Stable footprint.
- Market tables and carts.
- Camp tents.
- Large trees and dense prop clusters.

## Interactions To Add Early

- Hall door prompt.
- Stable door prompt.
- Notice board prompt.
- Campfire rest prompt.
- Market stall examine prompt.

## Art Pass Order

1. Replace sketch ground with sculpted terrain and dirt paths.
2. Split large imports into reusable meshes if needed.
3. Replace prototype collision with clean simple collision.
4. Improve lighting and fog.
5. Add ambient sound: wind, tavern interior murmur, stable, market, fire.
6. Add NPC idle markers after navigation works.
