# Myrdae Layered Map Source

This folder is a non-destructive layered recreation package for `images/Myrdae.jpg`.

- Canvas size: `6400 x 3600`
- Source SVG: `Myrdae-layered.svg`
- Flattened coordinate anchor: `Myrdae-layered-preview.jpg`
- Runtime display layers: `display-ocean-base.jpg` and `display-land-composite.png`
- Original app map: unchanged at `../Myrdae.jpg`

Layer order:

1. `01-ocean-base.png`
2. `02-land-base.png`
3. `03-lowlands-green.png`
4. `04-desert.png`
5. `05-mountains-relief.png`
6. `06-snow-and-ice.png`
7. `07-dark-line-detail.png`
8. `08-coastline-mask.png`
9. `99-original-reference-30pct.png` hidden by default in the SVG

Open `Myrdae-layered.svg` in an editor such as Inkscape, Affinity Designer, or Illustrator to toggle/reorder/edit layers while preserving the exact coordinate space used by the current map overlays.

The app uses the compact `display-*` layers for runtime performance. Regenerate them from the source layers after making visual edits.
