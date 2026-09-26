# Basctdelm townsfolk (rigged characters)

Eight character variants assembled in Blender by `scripts/build-basctdelm-folk.py` from three
CC0 packs by [Quaternius](https://quaternius.com/) (CC0 1.0 — public domain):

- [Modular Character Outfits – Fantasy](https://quaternius.itch.io/modular-character-outfits-fantasy) (free tier: Peasant and Ranger outfits)
- [Universal Base Characters](https://quaternius.itch.io/universal-base-characters) (heads, eyes, eyebrows, hairstyles)
- [Universal Animation Library](https://quaternius.itch.io/universal-animation-library) (Walk_Loop, Idle_Loop, Idle_Talking_Loop)

Each variant is one skinned mesh on the shared 65-bone humanoid rig, decimated to ~35% for crowd
use, with 1024px WebP textures. `js/basctdelm-life.js` bakes the three clips into a bone-matrix
texture at load (Babylon baked vertex animation) and draws every townsperson as a thin instance.
