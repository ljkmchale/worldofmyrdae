# Basctdelm building kit (web)

`basctdelm-kit.glb` holds the 58 house pieces the walkable city is assembled from, generated and
baked in Blender by `scripts/blender/build_kit.py` (pieces defined in `scripts/blender/medieval_kit.py`).

Every piece is real geometry — boolean-cut doorways, windows and shop arcades, individually
modelled timbers, overlapping roof-tile courses, bevelled edges — on a 2.4 m bay grid
(ground floor 3.4 m, upper floors 2.9 m), with Cycles-baked ambient occlusion on a second UV set
wired to the glTF occlusion slot. Textures are the CC0 Poly Haven sets in `../materials/`.

Rebuild after changing the kit (GPU for this process only; the system-wide
`CUDA_VISIBLE_DEVICES=-1` protects the voice stack):

    CUDA_VISIBLE_DEVICES=0 blender -b --python scripts/blender/build_kit.py -- <out_dir>

then copy `basctdelm-kit.glb` and `basctdelm-kit.json` here.
