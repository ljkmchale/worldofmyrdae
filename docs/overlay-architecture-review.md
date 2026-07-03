# Overlay Architecture Review

## Why This Review Exists

The current SVG/map feature set works, but the world overlay has become the place where many unrelated concerns meet:

- SVG root creation
- layer ordering
- road geometry
- route graph/travel calculations
- marker and label rendering
- tooltip rendering and image generation
- editor preview refresh
- boat animation bootstrapping
- dragon overlay coordination

That makes feature work risky because a change in one area can force redraws or assumptions in several others.

## What Feels Coupled Today

### 1. `map-overlay.js` is both renderer and domain service

`js/map-overlay.js` currently owns:

- scene bootstrapping and SVG creation
- spatial helpers like `measurePercentDistance`
- route graph construction and `findRouteBetweenLocations`
- road styling and label rendering
- marker shape rendering
- tooltip HTML generation
- tooltip image cropping/caching
- feature initialization for boats

This means UI tools like [`js/map-measure.js`](C:/Users/Larry%20McHale/Desktop/WorldofMyrdae/js/map-measure.js) depend on the overlay module for geometry and routing, even though those behaviors are not really rendering concerns.

### 2. Data flow is split between real data and editor shadow data

The editor replaces `window.CampaignData` with a render-state bridge in [`js/editor.js`](C:/Users/Larry%20McHale/Desktop/WorldofMyrdae/js/editor.js), then broadcasts `campaign-data-updated`.

That works, but it creates hidden coupling:

- viewer pages expect `CampaignData`
- editor mode swaps in a different implementation
- `MapOverlay.init()` decides whether to read `CampaignData` or `window.CampaignData`
- redraws are triggered through document events rather than explicit state ownership

This is flexible, but it is difficult to reason about and hard to test.

### 3. Overlay ownership is inconsistent across features

Different features mount in different ways:

- [`js/map-overlay.js`](C:/Users/Larry%20McHale/Desktop/WorldofMyrdae/js/map-overlay.js) creates the main `svg.map-overlay`
- [`js/dragon-overlay.js`](C:/Users/Larry%20McHale/Desktop/WorldofMyrdae/js/dragon-overlay.js) waits for that SVG and appends into it
- [`js/boat-animations.js`](C:/Users/Larry%20McHale/Desktop/WorldofMyrdae/js/boat-animations.js) is initialized from inside `map-overlay.js`
- [`js/map-measure.js`](C:/Users/Larry%20McHale/Desktop/WorldofMyrdae/js/map-measure.js) creates its own separate SVG sibling
- [`js/coord-grid.js`](C:/Users/Larry%20McHale/Desktop/WorldofMyrdae/js/coord-grid.js) also creates its own SVG sibling
- the city editor overlay in [`editor.html`](C:/Users/Larry%20McHale/Desktop/WorldofMyrdae/editor.html) creates another independent SVG path

So there is no single answer to:

- who owns the root SVG?
- who owns z-order?
- which features redraw on data changes?
- which features redraw on transform changes?

### 4. Full re-init is the default update path

On `campaign-data-updated`, `MapOverlay` re-runs `init()` for every initialized container and rebuilds the entire overlay tree. That is simple, but it increases coupling because every feature has to survive teardown/rebuild cycles.

This especially matters for:

- editor preview updates
- future filters/toggles
- animated overlays
- partial feature additions like faction shading, encounter zones, heatmaps, etc.

### 5. Presentation rules live inside imperative drawing code

Road styling, marker styling, label typography, tooltip rules, and feature-specific exceptions are mixed directly into renderer functions like `addRoad`, `addMarker`, `addLabel`, and `showTooltip`.

That makes it harder to:

- add new location or road types safely
- theme or restyle the map
- reuse rules in city maps or future views
- unit test visual decisions without DOM work

## Main Architectural Goal

Separate the world map into four layers of responsibility:

1. `state`
2. `geometry`
3. `scene/layers`
4. `features`

The important change is not "more files" by itself. The important change is that each part gets a stable contract.

## Proposed Target Shape

The most practical version of this refactor is the file split below. It keeps the public `MapOverlay` API intact while removing the hidden coupling caused by module-scoped render state.

```text
js/
  map-overlay.js
  overlay/
    render-context.js
    location-types.js
    route-graph.js
    road-renderer.js
    marker-renderer.js
    tooltip.js
```

`js/map-overlay.js` should remain the thin public coordinator so existing callers like `map.html`, `embed-map.html`, and `editor.html` do not need to change.

### 1. Render context first, store later

Before introducing a broader store abstraction, the immediate win is to replace implicit closure state with an explicit render context object.

That context should carry the values that are currently shared through module scope:

```js
{
  data,
  locMap,
  natW,
  natH,
  roadGroup,
  roadLinksByLocation,
  tooltip,
  initializedContainers
}
```

This can live in `js/overlay/render-context.js` with small helpers like:

- `createRenderContext()`
- `setRenderData(ctx, data)`
- `setRenderMetrics(ctx, natW, natH)`
- `rebuildLocationIndex(ctx)`

Benefits:

- renderer functions stop lying about their dependencies
- pure helpers become much easier to test
- the eventual state-store migration becomes simpler because the renderers already accept explicit inputs

A dedicated map state store is still a good later step, especially for editor preview state, but it is not required to get the first major decoupling win.

### 2. Extract geometry/domain services out of `MapOverlay`

Move non-rendering logic into pure modules:

- `js/map-geometry.js`
  - `measurePercentDistance`
  - `percentToMiles`
  - `milesToDays`
  - point resolution helpers
- `js/road-graph.js`
  - `buildRoadLinks`
  - `findRouteBetweenLocations`
  - road adjacency lookup
- `js/road-paths.js`
  - `calculatePathD`
  - curved vs straight path building

Then `MapMeasureTool` and future route features depend on those services directly, not on `MapOverlay`.

Benefits:

- easier testing
- geometry changes no longer require renderer edits
- route logic can be reused by UI outside SVG

### 3. Add a location type registry

This is the highest-value extraction because it removes the current "touch four places to add one type" problem.

Create `js/overlay/location-types.js` as the single place for per-type behavior:

```js
const LOCATION_TYPES = {
  capital: {
    icon: '🏰',
    radiusMultiplier: 2.2,
    font: 'Simonetta',
    fontStyle: 'normal',
    drawMarker(ctx, group, loc, px, py, radius) {}
  }
};
```

This registry should own:

- tooltip icon
- default marker radius multiplier
- default label font family
- default label font style
- marker drawing behavior
- optional type-specific tooltip/image behavior hooks

Then:

- `addMarker()` stops switching on `loc.type`
- `addLabel()` stops branching on `loc.type`
- tooltip icon lookup moves out of `showTooltip()`

Benefits:

- adding a new type becomes one-file work
- marker/label consistency improves automatically
- per-type visual rules become declarative instead of scattered

### 4. Split tooltip HTML from tooltip behavior

`showTooltip()` currently combines:

- type/icon lookup
- road link lookup
- preview image priority logic
- description cleanup
- HTML string building
- DOM positioning

These should be separated inside `js/overlay/tooltip.js`:

- `buildTooltipHTML(loc, tooltipState)`
- `resolveTooltipPreviewImage(loc, ctx)`
- `showTooltip(event, loc, ctx)`
- `hideTooltip(event, ctx)`
- `positionTooltip(event, ctx)`

The important part is that `buildTooltipHTML()` should be a focused template function, not mixed into mouse event logic.

Benefits:

- layout changes stop touching behavior code
- future tooltip themes become easier
- image selection logic becomes easier to reason about

### 5. Introduce a scene manager with named layers

Create a small `MapScene` module that owns SVG root creation and named `<g>` layers.

Suggested layer order:

- `regionLabels`
- `roads`
- `waterRoutes`
- `locations`
- `labels`
- `effects`
- `actors`
- `debug`

The API can be as small as:

```js
MapScene.init({ containerId, imageId })
MapScene.getLayer('roads')
MapScene.clearLayer('locations')
MapScene.setTransform(transformStr)
MapScene.getMetrics()
```

Then every feature renders into a declared layer instead of creating arbitrary sibling SVGs or attaching directly to the root.

Benefits:

- one owner for z-index and root SVG lifecycle
- features stop fighting over mount order
- dragon/boats/grid/measure can declare their layer instead of guessing

### 6. Split `MapOverlay` into feature renderers

The current `MapOverlay` can become an orchestrator, while rendering is split into focused modules:

- `road-renderer.js`
- `marker-renderer.js`
- `tooltip.js`

If region rendering remains small, it can stay in the coordinator for a while. It does not have to be extracted first.

Each renderer should accept:

- scene layer
- immutable render data
- style/config rules
- shared services

Example shape:

```js
RoadRenderer.render({
  layer,
  roads,
  locationIndex,
  metrics,
  styleRules
});
```

Benefits:

- adding a new road behavior no longer risks marker or tooltip code
- smaller files and clearer ownership
- easier to replace one renderer later

### 7. Make features plugins instead of hard-coded side effects

Instead of `map-overlay.js` directly calling `initializeBoatAnimations(svg, data, locMap, natW, natH)`, define a feature contract:

```js
feature.mount(context)
feature.update(context)
feature.unmount()
```

Example features:

- boats
- dragon flyover
- measurement
- coordinate grid
- water repaint bridge
- future faction borders
- future quest/event overlays

Each feature receives a controlled context:

- `scene`
- `state`
- `services.geometry`
- `services.roadGraph`
- `mode` (`viewer` or `editor`)

Benefits:

- new features stop reaching into global modules
- features become removable and testable
- editor-only or viewer-only behavior becomes explicit

## Practical Refactor Phases

### Phase 1: Safe extraction

No behavior changes, only code movement.

- extract `location-types.js`
- extract `route-graph.js`
- extract `tooltip.js`
- leave current DOM/event flow in place

This gives immediate value with low risk and removes the biggest day-to-day pain points first.

### Phase 2: Scene ownership

- introduce `MapScene`
- have `map-overlay.js` create layers through `MapScene`
- move `dragon-overlay.js`, `coord-grid.js`, and `map-measure.js` to request layers from `MapScene`
- stop creating multiple unrelated SVG siblings where possible

This reduces the biggest structural coupling.

### Phase 3: Renderer cleanup

- extract `road-renderer.js`
- extract `marker-renderer.js`
- update functions to accept `ctx` explicitly instead of reading closure state
- remove "ignored" parameters like `ignoredLocMap`

This is the phase that makes the code honest about its dependencies.

### Phase 4: State cleanup

- add a dedicated map state store
- make viewer and editor both publish state to it
- keep document events only as backward-compatibility during migration
- remove the editor's `window.CampaignData` override after consumers are migrated

This removes the trickiest hidden dependency.

### Phase 5: Feature plugin model

- convert boats and dragon to feature modules with lifecycle methods
- optionally migrate measure/grid after the first two prove the contract

This is the long-term maintainability step.

## What I Would Not Change Yet

- I would not switch the whole app to a framework just to solve this.
- I would not replace the current percent-based world coordinates.
- I would not rewrite editor flows first.
- I would not try to make every feature incremental before extracting the pure geometry/domain logic.

The highest-value move is to separate the location type rules and explicit render dependencies first.

## Suggested First Slice

If we want to start with one contained refactor, I recommend this exact first pass:

1. Create `js/overlay/location-types.js`
2. Route `addMarker()`, `addLabel()`, and tooltip icon lookup through it
3. Create `js/overlay/route-graph.js`
4. Move `buildRoadLinks()` and `findRouteBetweenLocations()` into it
5. Create `js/overlay/tooltip.js` and move HTML template generation there

That first slice reduces coupling immediately without forcing a risky rewrite of the SVG layer system or the public API.

## Biggest Payoff After Refactor

After these changes, adding a feature like:

- political borders
- encounter heatmap
- faction influence tinting
- animated caravans
- fog-of-war regions
- quest overlays

becomes "add a feature renderer or plugin" instead of "edit the giant overlay file and hope no other behavior moves."
