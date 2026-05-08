/**
 * Tooltip state, image resolution, and HTML rendering.
 */
const MapOverlayTooltip = (function () {
    const ENABLE_GENERATED_MAP_PREVIEWS = false;
    const TOOLTIP_BIOME_IMAGE_PATHS = Object.freeze({
        mountains: 'images/tooltips/biomes/mountains.png',
        forest: 'images/tooltips/biomes/forest.png',
        denseForest: 'images/tooltips/biomes/dense-forest.png',
        swamp: 'images/tooltips/biomes/swamp.png',
        wetlands: 'images/tooltips/biomes/wetlands.png',
        desert: 'images/tooltips/biomes/desert.png',
        highlands: 'images/tooltips/biomes/highlands.png',
        plains: 'images/tooltips/biomes/plains.png',
        meadow: 'images/tooltips/biomes/meadow.png',
        arctic: 'images/tooltips/biomes/arctic.png',
        tundra: 'images/tooltips/biomes/tundra.png',
        jungle: 'images/tooltips/biomes/jungle.png',
        volcanic: 'images/tooltips/biomes/volcanic.png',
        underground: 'images/tooltips/biomes/underground.png'
    });
    const TOOLTIP_WATER_IMAGE_PATHS = Object.freeze({
        ocean: 'images/tooltips/water/ocean.png',
        coast: 'images/tooltips/water/coast.png',
        lake: 'images/tooltips/water/lake.png',
        river: 'images/tooltips/water/river.png'
    });
    const TOOLTIP_GENERIC_TYPE_IMAGE_PATHS = Object.freeze({
        archive: 'images/tooltips/city-types/archive.png',
        castle: 'images/tooltips/city-types/fortress.png',
        cemetery: 'images/tooltips/city-types/cemetery.png',
        church: 'images/tooltips/city-types/church.png',
        city: 'images/tooltips/city-types/market.png',
        fortress: 'images/tooltips/city-types/fortress.png',
        gate: 'images/tooltips/city-types/gate.png',
        harbor: 'images/tooltips/city-types/harbor.png',
        keep: 'images/tooltips/city-types/keep.png',
        landmark: 'images/tooltips/city-types/poi.png',
        manor: 'images/tooltips/city-types/manor.png',
        market: 'images/tooltips/city-types/market.png',
        pass: 'images/tooltips/city-types/gate.png',
        poi: 'images/tooltips/city-types/poi.png',
        port: 'images/tooltips/city-types/harbor.png',
        ruins: 'images/tooltips/city-types/ruins.png',
        shop: 'images/tooltips/city-types/shop.png',
        shrine: 'images/tooltips/city-types/temple.png',
        settlement: 'images/tooltips/city-types/market.png',
        stables: 'images/tooltips/city-types/stables.png',
        tavern: 'images/tooltips/city-types/tavern.png',
        temple: 'images/tooltips/city-types/temple.png',
        tomb: 'images/tooltips/city-types/tomb.png',
        tower: 'images/tooltips/city-types/tower.png',
        town: 'images/tooltips/city-types/market.png',
        vault: 'images/tooltips/city-types/vault.png',
        village: 'images/tooltips/city-types/market.png'
    });

    const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    function escapeHTML(value) {
        if (value === null || value === undefined) return '';
        return String(value).replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
    }

    function singleLineText(value) {
        return String(value || '').replace(/(?:\\n|[\r\n])+/g, ' ').replace(/\s{2,}/g, ' ').trim();
    }

    function safeHref(value) {
        if (!value) return '';
        const trimmed = String(value).trim();
        if (/^\s*(javascript|data|vbscript):/i.test(trimmed)) return '';
        return escapeHTML(trimmed);
    }

    function ensureTooltipElement(ctx) {
        if (ctx.tooltip) return ctx.tooltip;

        const tooltip = document.createElement('div');
        tooltip.className = 'map-tooltip';
        tooltip.style.display = 'none';
        document.body.appendChild(tooltip);

        tooltip.addEventListener('mouseenter', () => {
            tooltip.style.display = 'block';
            tooltip.style.pointerEvents = 'auto';
        });
        tooltip.addEventListener('mouseleave', (event) => hideTooltip(event, ctx));

        ctx.tooltip = tooltip;
        return tooltip;
    }

    function hideTooltipImmediately(ctx) {
        if (!ctx.tooltip) return;
        if (ctx.hideTimer) {
            clearTimeout(ctx.hideTimer);
            ctx.hideTimer = null;
        }
        ctx.tooltip.style.display = 'none';
        ctx.tooltip.style.pointerEvents = 'none';
    }

    function setTooltipsEnabled(ctx, enabled) {
        ctx.tooltipsEnabled = enabled !== false;
        if (!ctx.tooltipsEnabled) hideTooltipImmediately(ctx);
        return ctx.tooltipsEnabled;
    }

    function areTooltipsEnabled(ctx) {
        return ctx.tooltipsEnabled;
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function isWaterTooltipType(type) {
        return type === 'water' || type === 'river';
    }

    function isTooltipSuppressedLocation(loc) {
        return !!(loc && typeof loc.id === 'string' && /-header$/i.test(loc.id));
    }

    function normalizeTooltipMatchText(value) {
        return (value || '')
            .toLowerCase()
            .replace(/['â€™]/g, '')
            .replace(/[^a-z0-9]+/g, ' ')
            .trim();
    }

    function textIncludesAny(text, keywords) {
        return keywords.some((keyword) => text.includes(keyword));
    }

    function slugifyCityFolderId(value) {
        return String(value || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/['’]/g, '')
            .replace(/[^a-zA-Z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .toLowerCase();
    }

    function getTooltipCityMapId(loc) {
        if (!loc || !loc.cityMap) return null;
        const match = loc.cityMap.match(/[?&]city=([^&]+)/);
        return match ? match[1] : null;
    }

    function getTooltipCityFolderId(loc) {
        const cityMapId = getTooltipCityMapId(loc);
        if (cityMapId) return cityMapId;

        const cityMaps = (typeof CITY_MAPS !== 'undefined' ? CITY_MAPS : null) || [];
        const lookupKeys = [
            slugifyCityFolderId(loc && loc.id),
            slugifyCityFolderId(loc && loc.name)
        ].filter(Boolean);

        for (const key of lookupKeys) {
            const match = cityMaps.find((city) => {
                return slugifyCityFolderId(city && city.id) === key
                    || slugifyCityFolderId(city && city.name) === key;
            });
            if (match && match.id) return match.id;
        }

        return lookupKeys[0] || null;
    }

    function getCityMapEntry(loc) {
        const cityId = getTooltipCityFolderId(loc);
        if (!cityId) return null;
        const cityMaps = (typeof CITY_MAPS !== 'undefined' ? CITY_MAPS : null) || [];
        return cityMaps.find((city) => city.id === cityId) || null;
    }

    function getCityCrestImage(loc) {
        const cityId = getTooltipCityFolderId(loc);
        return cityId ? `images/cities/${cityId}/crest.png` : null;
    }

    function getCityPreviewImage(loc) {
        const entry = getCityMapEntry(loc);
        if (entry && (entry.previewImage || entry.image)) {
            return entry.previewImage || entry.image || null;
        }
        return null;
    }

    function getCustomTooltipHeaderImage(loc) {
        return loc && loc.tooltipImage ? loc.tooltipImage : null;
    }

    function getCachedImageAvailability(ctx, imageUrl) {
        if (!ctx || !imageUrl || !ctx.tooltipImageAvailabilityCache) return null;
        return ctx.tooltipImageAvailabilityCache.has(imageUrl)
            ? ctx.tooltipImageAvailabilityCache.get(imageUrl)
            : null;
    }

    function probeImageAvailability(ctx, imageUrl, onResolved) {
        if (!ctx || !imageUrl || !ctx.tooltipImageAvailabilityCache) return;

        const cached = getCachedImageAvailability(ctx, imageUrl);
        if (cached !== null) {
            if (typeof onResolved === 'function') onResolved(cached);
            return;
        }

        ctx.tooltipImageAvailabilityCache.set(imageUrl, 'pending');

        const img = new Image();
        img.onload = () => {
            ctx.tooltipImageAvailabilityCache.set(imageUrl, true);
            if (typeof onResolved === 'function') onResolved(true);
        };
        img.onerror = () => {
            ctx.tooltipImageAvailabilityCache.set(imageUrl, false);
            if (typeof onResolved === 'function') onResolved(false);
        };
        img.src = imageUrl;
    }

    function getTooltipMapImage(ctx) {
        for (const entry of ctx.initializedContainers) {
            const mapImg = document.getElementById(entry.imageId);
            if (mapImg && mapImg.complete && mapImg.naturalWidth && mapImg.naturalHeight) return mapImg;
        }
        return document.getElementById('map-image');
    }

    function getBiomeTooltipHeaderImage(loc) {
        if (!loc || (loc.type !== 'nature' && loc.type !== 'region')) return null;

        const resolveBiomeImage = (text) => {
            let biome = null;

            if (textIncludesAny(text, ['river waterway', 'waterway', 'river', 'brook', 'stream'])) return TOOLTIP_WATER_IMAGE_PATHS.river;
            if (textIncludesAny(text, ['coastal', 'coast', 'shore', 'shoreline', 'bay', 'cove', 'inlet'])) return TOOLTIP_WATER_IMAGE_PATHS.coast;
            if (textIncludesAny(text, ['ocean', 'sea', 'deep water'])) return TOOLTIP_WATER_IMAGE_PATHS.ocean;
            if (textIncludesAny(text, ['lake', 'loch', 'mere'])) return TOOLTIP_WATER_IMAGE_PATHS.lake;

            if (textIncludesAny(text, ['dense forest', 'deep forest', 'old growth', 'oldgrowth'])) biome = 'denseForest';
            else if (textIncludesAny(text, ['jungle', 'rainforest', 'tropical'])) biome = 'jungle';
            else if (textIncludesAny(text, ['forest', 'woods', 'wood', 'wilds', 'grove', 'thicket', 'pines', 'pine'])) biome = 'forest';
            else if (textIncludesAny(text, ['wetland', 'wetlands', 'swamp', 'swamps', 'marsh', 'morass', 'slough', 'mire', 'bog'])) biome = 'wetlands';
            else if (textIncludesAny(text, ['arctic', 'polar', 'icefield', 'ice field', 'glacier', 'glacial'])) biome = 'arctic';
            else if (textIncludesAny(text, ['tundra', 'taiga', 'permafrost'])) biome = 'tundra';
            else if (textIncludesAny(text, ['volcanic', 'volcano', 'lava', 'basalt', 'ashfield', 'ash field'])) biome = 'volcanic';
            else if (textIncludesAny(text, ['underground', 'cavern', 'cave', 'subterranean', 'underdeep'])) biome = 'underground';
            else if (textIncludesAny(text, ['desert', 'waste', 'wastes', 'sands', 'searing flats', 'blistered'])) biome = 'desert';
            else if (textIncludesAny(text, ['mountain', 'mountains', 'mount ', 'mount', 'peak', 'peaks', 'spine', 'crag', 'crags'])) biome = 'mountains';
            else if (textIncludesAny(text, ['highland', 'highlands', 'hill', 'hills', 'knoll', 'knolls', 'ridge', 'bluff', 'bluffs', 'rise', 'wold', 'wolds', 'crest', 'peninsula'])) biome = 'highlands';
            else if (textIncludesAny(text, ['plain', 'plains', 'grassland', 'grasslands', 'prairie', 'steppe', 'savanna'])) biome = 'plains';
            else if (textIncludesAny(text, ['meadow', 'mead', 'vale', 'valley', 'field', 'fields', 'garde'])) biome = 'meadow';

            return biome ? TOOLTIP_BIOME_IMAGE_PATHS[biome] : null;
        };

        const explicitBiomeImage = resolveBiomeImage(normalizeTooltipMatchText(loc.biome || ''));
        if (explicitBiomeImage) return explicitBiomeImage;

        const text = normalizeTooltipMatchText([loc.name, loc.description, loc.region].filter(Boolean).join(' '));
        return resolveBiomeImage(text) || (loc.type === 'region' ? TOOLTIP_BIOME_IMAGE_PATHS.mountains : null);
    }

    function getWaterTooltipHeaderImage(loc) {
        if (!loc || !isWaterTooltipType(loc.type)) return null;

        const text = normalizeTooltipMatchText([loc.name, loc.description, loc.region].filter(Boolean).join(' '));
        if (loc.type === 'river' || textIncludesAny(text, ['river', 'run', 'flow', 'brook'])) return TOOLTIP_WATER_IMAGE_PATHS.river;
        if (textIncludesAny(text, ['lake', 'loch', 'basin', 'mere'])) return TOOLTIP_WATER_IMAGE_PATHS.lake;
        if (textIncludesAny(text, ['bay', 'cove', 'inlet', 'strait', 'harbor', 'harbour', 'span', 'plunge'])) return TOOLTIP_WATER_IMAGE_PATHS.coast;
        if (textIncludesAny(text, ['sea', 'ocean', 'deep'])) return TOOLTIP_WATER_IMAGE_PATHS.ocean;
        return TOOLTIP_WATER_IMAGE_PATHS.ocean;
    }

    function getGenericTypeTooltipHeaderImage(loc) {
        if (!loc || !loc.type) return TOOLTIP_GENERIC_TYPE_IMAGE_PATHS.poi;
        if (loc.type === 'nature' || loc.type === 'region' || isWaterTooltipType(loc.type)) return null;
        const typeKey = String(loc.type).toLowerCase().replace(/[^a-z0-9]+/g, '-');
        if (TOOLTIP_GENERIC_TYPE_IMAGE_PATHS[typeKey]) return TOOLTIP_GENERIC_TYPE_IMAGE_PATHS[typeKey];

        const text = normalizeTooltipMatchText([loc.name, loc.description, loc.region].filter(Boolean).join(' '));
        if (textIncludesAny(text, ['harbor', 'harbour', 'port', 'dock', 'wharf'])) return TOOLTIP_GENERIC_TYPE_IMAGE_PATHS.harbor;
        if (textIncludesAny(text, ['ruin', 'ruins', 'ancient'])) return TOOLTIP_GENERIC_TYPE_IMAGE_PATHS.ruins;
        if (textIncludesAny(text, ['fort', 'fortress', 'keep', 'castle', 'citadel'])) return TOOLTIP_GENERIC_TYPE_IMAGE_PATHS.fortress;
        if (textIncludesAny(text, ['temple', 'shrine', 'sanctuary'])) return TOOLTIP_GENERIC_TYPE_IMAGE_PATHS.temple;
        if (textIncludesAny(text, ['tower', 'spire'])) return TOOLTIP_GENERIC_TYPE_IMAGE_PATHS.tower;
        if (textIncludesAny(text, ['tomb', 'crypt', 'barrow'])) return TOOLTIP_GENERIC_TYPE_IMAGE_PATHS.tomb;
        if (textIncludesAny(text, ['gate', 'pass', 'crossing'])) return TOOLTIP_GENERIC_TYPE_IMAGE_PATHS.gate;
        if (textIncludesAny(text, ['tavern', 'inn'])) return TOOLTIP_GENERIC_TYPE_IMAGE_PATHS.tavern;
        if (textIncludesAny(text, ['market', 'bazaar', 'trade'])) return TOOLTIP_GENERIC_TYPE_IMAGE_PATHS.market;

        return TOOLTIP_GENERIC_TYPE_IMAGE_PATHS.poi;
    }

    function getStaticGeneratedTooltipHeaderImage(loc) {
        if (!loc || !loc.id || !loc.type) return null;
        if (isWaterTooltipType(loc.type) || loc.type === 'nature' || loc.type === 'region') return null;
        const id = String(loc.id)
            .toLowerCase()
            .replace(/['’]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        return id ? `images/tooltips/generated/locations/${id}.jpg` : null;
    }

    function generateTooltipHeaderImage(loc, ctx) {
        if (!loc || typeof loc.x !== 'number' || typeof loc.y !== 'number') return null;

        const mapImg = getTooltipMapImage(ctx);
        if (!mapImg || !mapImg.complete || !mapImg.naturalWidth || !mapImg.naturalHeight) return null;

        const cacheKey = [
            loc.id || loc.name || 'location',
            loc.x,
            loc.y,
            loc.tooltipImageOffsetX || 0,
            loc.tooltipImageOffsetY || 0,
            mapImg.currentSrc || mapImg.src || 'map'
        ].join('|');

        if (ctx.tooltipHeaderImageCache.has(cacheKey)) {
            return ctx.tooltipHeaderImageCache.get(cacheKey);
        }

        const canvas = document.createElement('canvas');
        const width = 560;
        const height = 300;
        const cropAspect = width / height;
        const cropWidth = mapImg.naturalWidth * 0.18;
        const cropHeight = cropWidth / cropAspect;
        const offsetX = (typeof loc.tooltipImageOffsetX === 'number' ? loc.tooltipImageOffsetX : 0) / 100 * mapImg.naturalWidth;
        const offsetY = (typeof loc.tooltipImageOffsetY === 'number' ? loc.tooltipImageOffsetY : 0) / 100 * mapImg.naturalHeight;
        const centerX = (loc.x / 100) * mapImg.naturalWidth + offsetX;
        const centerY = (loc.y / 100) * mapImg.naturalHeight + offsetY;

        let sx = centerX - cropWidth / 2;
        let sy = centerY - cropHeight * 0.58;
        sx = clamp(sx, 0, Math.max(0, mapImg.naturalWidth - cropWidth));
        sy = clamp(sy, 0, Math.max(0, mapImg.naturalHeight - cropHeight));

        canvas.width = width;
        canvas.height = height;

        const canvasCtx = canvas.getContext('2d');
        if (!canvasCtx) return null;

        canvasCtx.imageSmoothingEnabled = true;
        canvasCtx.imageSmoothingQuality = 'high';
        canvasCtx.drawImage(mapImg, sx, sy, cropWidth, cropHeight, 0, 0, width, height);

        const vignette = canvasCtx.createLinearGradient(0, 0, 0, height);
        vignette.addColorStop(0, 'rgba(12, 10, 8, 0.08)');
        vignette.addColorStop(0.55, 'rgba(10, 8, 8, 0.14)');
        vignette.addColorStop(1, 'rgba(5, 5, 8, 0.72)');
        canvasCtx.fillStyle = vignette;
        canvasCtx.fillRect(0, 0, width, height);

        if (isWaterTooltipType(loc.type)) {
            const waterTint = canvasCtx.createLinearGradient(0, 0, width, height);
            waterTint.addColorStop(0, 'rgba(72, 140, 196, 0.18)');
            waterTint.addColorStop(0.55, 'rgba(28, 88, 144, 0.12)');
            waterTint.addColorStop(1, 'rgba(6, 29, 56, 0.26)');
            canvasCtx.fillStyle = waterTint;
            canvasCtx.fillRect(0, 0, width, height);
        }

        const shade = canvasCtx.createRadialGradient(width * 0.5, height * 0.45, width * 0.08, width * 0.5, height * 0.45, width * 0.7);
        shade.addColorStop(0, 'rgba(255, 220, 150, 0.06)');
        shade.addColorStop(1, 'rgba(0, 0, 0, 0.22)');
        canvasCtx.fillStyle = shade;
        canvasCtx.fillRect(0, 0, width, height);

        const imageUrl = canvas.toDataURL('image/jpeg', 0.88);
        ctx.tooltipHeaderImageCache.set(cacheKey, imageUrl);
        return imageUrl;
    }

    function getTooltipDescription(loc) {
        if (!loc || !loc.description) return '';

        const raw = String(loc.description).trim();
        if (!raw) return '';

        const typeName = loc.type ? loc.type.replace(/-/g, ' ').trim() : '';
        if (!typeName) return raw;

        const escapedType = typeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const duplicatePrefixPattern = new RegExp(`^${escapedType}(?:\\s*(?:[-:.,]|\\u2022)\\s*|\\s+)`, 'i');
        return raw.replace(duplicatePrefixPattern, '').trim();
    }

    function truncate(str, max) {
        return str && str.length > max ? `${str.slice(0, max).trimEnd()}…` : str;
    }

    function buildPreviewImageCandidates(loc, ctx) {
        const crestPreviewImage = getCityCrestImage(loc);
        const crestAvailable = getCachedImageAvailability(ctx, crestPreviewImage) === true;
        const cityPreviewImage = getCityPreviewImage(loc);
        const biomePreviewImage = getBiomeTooltipHeaderImage(loc);
        const waterPreviewImage = getWaterTooltipHeaderImage(loc);
        const staticGeneratedPreviewImage = getStaticGeneratedTooltipHeaderImage(loc);
        const genericTypePreviewImage = getGenericTypeTooltipHeaderImage(loc);
        const generatedPreviewImage = (
            ENABLE_GENERATED_MAP_PREVIEWS
            && !cityPreviewImage
            && !biomePreviewImage
            && !waterPreviewImage
            && !staticGeneratedPreviewImage
            && !genericTypePreviewImage
        ) ? generateTooltipHeaderImage(loc, ctx) : null;

        const ordered = [
            crestAvailable ? crestPreviewImage : null,
            cityPreviewImage,
            biomePreviewImage,
            waterPreviewImage,
            staticGeneratedPreviewImage,
            genericTypePreviewImage,
            generatedPreviewImage
        ].filter(Boolean);

        return {
            previewImage: ordered[0] || null,
            fallbackPreviewImages: ordered.slice(1),
            crestPreviewImage: crestAvailable ? crestPreviewImage : null,
            cityPreviewImage,
            biomePreviewImage,
            waterPreviewImage,
            staticGeneratedPreviewImage,
            genericTypePreviewImage,
            generatedPreviewImage
        };
    }

    function resolveTooltipPreviewImage(loc, ctx) {
        const customPreviewImage = getCustomTooltipHeaderImage(loc);
        const previewImages = customPreviewImage
            ? {
                previewImage: customPreviewImage,
                fallbackPreviewImages: [],
                crestPreviewImage: null,
                cityPreviewImage: null,
                biomePreviewImage: null,
                waterPreviewImage: null,
                staticGeneratedPreviewImage: null,
                genericTypePreviewImage: null,
                generatedPreviewImage: null
            }
            : buildPreviewImageCandidates(loc, ctx);

        return {
            previewImage: previewImages.previewImage,
            fallbackPreviewImages: previewImages.fallbackPreviewImages,
            customPreviewImage,
            crestPreviewImage: previewImages.crestPreviewImage,
            cityPreviewImage: previewImages.cityPreviewImage,
            biomePreviewImage: previewImages.biomePreviewImage,
            waterPreviewImage: previewImages.waterPreviewImage,
            staticGeneratedPreviewImage: previewImages.staticGeneratedPreviewImage,
            genericTypePreviewImage: previewImages.genericTypePreviewImage
        };
    }

    function buildRoadLinksHTML(roadLinks) {
        const tooltipRoadLinks = (roadLinks || []).slice(0, 6).map((link) => {
            const daysText = link.days >= 10 ? `${Math.round(link.days)} days` : `${link.days.toFixed(1)} days`;
            return `
                <div style="display:flex;justify-content:space-between;gap:0.75rem;font-family:'Cormorant Garamond', serif;font-size:0.9rem;color:#d7cfbb;">
                    <span><strong style="color:#efe4bd;">${escapeHTML(singleLineText(link.roadName))}</strong></span>
                    <span style="white-space:nowrap;color:#bfae82;">${Math.round(link.miles)} mi • ${escapeHTML(daysText)}</span>
                </div>
            `;
        }).join('');

        if (!tooltipRoadLinks) return '';

        return `
            <div class="tooltip-roads" style="margin-top:0.55rem;padding-top:0.45rem;border-top:1px solid rgba(212,175,55,0.2);">
                <div style="font-family:'Inter', sans-serif;font-size:0.68rem;color:#a0a0a0;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:0.35rem;">Connected By Road</div>
                <div style="display:flex;flex-direction:column;gap:0.2rem;">${tooltipRoadLinks}</div>
                <div style="font-family:'Cormorant Garamond', serif;font-size:0.78rem;color:#8f8770;font-style:italic;margin-top:0.35rem;">Approximate miles and horse-cart travel days.</div>
            </div>
        `;
    }

    function buildTooltipHTML(loc, state) {
        const typeConfig = MapOverlayLocationTypes.getTypeConfig(loc.type);
        const icon = typeConfig.icon || '&#128205;';
        const rawTypeName = loc.type ? loc.type.charAt(0).toUpperCase() + loc.type.slice(1) : 'Location';
        const typeName = escapeHTML(rawTypeName);
        const waterTooltip = isWaterTooltipType(loc.type);
        const fallbackPreviewImagesAttr = escapeHTML(JSON.stringify(state.fallbackPreviewImages || []));
        const roadSection = buildRoadLinksHTML(state.roadLinks);
        const safeName = escapeHTML(loc.name);
        const safePreview = state.previewImage ? escapeHTML(state.previewImage) : '';
        const cityMapHref = safeHref(loc.cityMap);
        const citySceneHref = safeHref(loc.cityScene);
        const linkHref = safeHref(loc.link);
        const linksSection = (cityMapHref || citySceneHref || linkHref) ? `
            <div style="margin-top:0.5rem;padding-top:0.4rem;border-top:1px solid rgba(212,175,55,0.2);display:flex;gap:0.75rem;align-items:center;flex-wrap:wrap;">
                ${cityMapHref ? `<a href="${cityMapHref}" target="_blank" rel="noopener noreferrer" style="font-family:'Cinzel',serif;font-size:0.75rem;color:#d4af37;text-decoration:none;display:inline-flex;align-items:center;gap:0.3rem;padding:0.25rem 0.6rem;border:1px solid rgba(212,175,55,0.5);border-radius:3px;" onmouseenter="this.style.background='rgba(212,175,55,0.15)'" onmouseleave="this.style.background='transparent'">&#9680; City Map</a>` : ''}
                ${citySceneHref ? `<a href="${citySceneHref}" target="_blank" rel="noopener noreferrer" style="font-family:'Cinzel',serif;font-size:0.75rem;color:#d4af37;text-decoration:none;display:inline-flex;align-items:center;gap:0.3rem;padding:0.25rem 0.6rem;border:1px solid rgba(212,175,55,0.5);border-radius:3px;" onmouseenter="this.style.background='rgba(212,175,55,0.15)'" onmouseleave="this.style.background='transparent'">&#127916; City Scene</a>` : ''}
                ${linkHref ? `<a href="${linkHref}" target="_blank" rel="noopener noreferrer" style="font-family:'Inter',sans-serif;font-size:0.8rem;color:#ffd700;text-decoration:none;" onmouseenter="this.style.color='#fff'" onmouseleave="this.style.color='#ffd700'">Learn More →</a>` : ''}
            </div>` : '';
        const desc = escapeHTML(truncate(getTooltipDescription(loc), 160));
        const details = escapeHTML(truncate(loc.details, 100));
        const metaSection = `
            <div class="tt-meta">
                <div class="tt-type"><span class="tt-meta-label">Type</span><span class="tt-meta-value">${typeName}</span></div>
                ${loc.region ? `<div class="tt-type"><span class="tt-meta-label">Territory</span><span class="tt-meta-value">${escapeHTML(loc.region)}</span></div>` : ''}
                ${loc.biome ? `<div class="tt-type"><span class="tt-meta-label">Biome</span><span class="tt-meta-value">${escapeHTML(loc.biome)}</span></div>` : ''}
            </div>
        `;

        if (state.previewImage) {
            if (state.crestPreviewImage) {
                return `
                    <div class="tt-crest-header">
                        <div class="tt-crest-image-frame">
                            <img src="${safePreview}" alt="${safeName}" data-fallback-images="${fallbackPreviewImagesAttr}">
                        </div>
                        <div class="tt-crest-nameplate">${safeName}</div>
                    </div>
                    <div class="tt-body">
                        ${metaSection}
                        ${desc ? `<div class="tt-desc">${desc}</div>` : ''}
                        ${details ? `<div class="tt-desc" style="color:#888;font-style:italic;margin-top:0.25rem;font-size:0.82rem;">${details}</div>` : ''}
                        ${roadSection}
                        ${linksSection}
                    </div>
                `;
            }

            const wrapClass = state.customPreviewImage
                ? ' tt-generated-preview-wrap'
                : state.cityPreviewImage
                    ? ' tt-city-preview-wrap'
                    : (state.biomePreviewImage || state.waterPreviewImage || state.staticGeneratedPreviewImage)
                        ? ' tt-biome-preview-wrap'
                        : state.genericTypePreviewImage
                            ? ' tt-biome-preview-wrap'
                            : ' tt-generated-preview-wrap';

            return `
                <div class="tt-img-wrap${waterTooltip ? ' tt-water-img-wrap' : ''}${wrapClass}">
                    <img src="${safePreview}" alt="${safeName}" data-fallback-images="${fallbackPreviewImagesAttr}">
                    ${waterTooltip ? `<div class="tt-water-badge">${icon} ${typeName}</div>` : ''}
                    <div class="tt-name-overlay">${safeName}</div>
                </div>
                <div class="tt-body">
                    ${metaSection}
                    ${desc ? `<div class="tt-desc">${desc}</div>` : ''}
                    ${details ? `<div class="tt-desc" style="color:#888;font-style:italic;margin-top:0.25rem;font-size:0.82rem;">${details}</div>` : ''}
                    ${roadSection}
                    ${linksSection}
                </div>
            `;
        }

        return `
            <div class="tt-no-img-header">
                <span style="font-size:1.1rem;">${icon}</span>
                <span class="tt-no-img-name">${safeName}</span>
            </div>
            <div class="tt-body">
                ${metaSection}
                ${desc ? `<div class="tt-desc">${desc}</div>` : ''}
                ${details ? `<div class="tt-desc" style="color:#888;font-style:italic;margin-top:0.25rem;font-size:0.82rem;">${details}</div>` : ''}
                ${roadSection}
                ${linksSection}
            </div>
        `;
    }

    function bindTooltipPreviewFallbacks(ctx) {
        if (!ctx.tooltip) return;

        const previewImage = ctx.tooltip.querySelector('img[data-fallback-images]');
        if (!previewImage) return;

        let fallbacks = [];
        try {
            fallbacks = JSON.parse(previewImage.dataset.fallbackImages || '[]');
        } catch (error) {
            fallbacks = [];
        }

        if (!fallbacks.length) {
            delete previewImage.dataset.fallbackImages;
            return;
        }

        previewImage.addEventListener('error', () => {
            const nextImage = fallbacks.shift();
            if (nextImage) {
                previewImage.dataset.fallbackImages = JSON.stringify(fallbacks);
                previewImage.src = nextImage;
                return;
            }

            previewImage.remove();
        });
    }

    function getTooltipHtmlCacheKey(loc, previewState, roadLinks) {
        const roadKey = (roadLinks || [])
            .slice(0, 6)
            .map((link) => [link.roadId, link.destinationId, Math.round(link.miles || 0), Math.round((link.days || 0) * 10)].join(':'))
            .join(',');
        return JSON.stringify({
            id: loc.id || '',
            name: loc.name || '',
            type: loc.type || '',
            region: loc.region || '',
            biome: loc.biome || '',
            description: loc.description || '',
            details: loc.details || '',
            cityMap: loc.cityMap || '',
            cityScene: loc.cityScene || '',
            link: loc.link || '',
            previewImage: previewState.previewImage || '',
            fallbackPreviewImages: previewState.fallbackPreviewImages || [],
            customPreviewImage: previewState.customPreviewImage || '',
            crestPreviewImage: previewState.crestPreviewImage || '',
            cityPreviewImage: previewState.cityPreviewImage || '',
            biomePreviewImage: previewState.biomePreviewImage || '',
            waterPreviewImage: previewState.waterPreviewImage || '',
            staticGeneratedPreviewImage: previewState.staticGeneratedPreviewImage || '',
            genericTypePreviewImage: previewState.genericTypePreviewImage || '',
            roadKey
        });
    }

    function renderTooltipContent(loc, ctx) {
        if (!ctx.tooltipHtmlCache) ctx.tooltipHtmlCache = new Map();
        const previewState = resolveTooltipPreviewImage(loc, ctx);
        const roadLinks = loc.id ? (ctx.roadLinksByLocation.get(loc.id) || []) : [];
        const cacheKey = getTooltipHtmlCacheKey(loc, previewState, roadLinks);
        let html = ctx.tooltipHtmlCache.get(cacheKey);
        if (!html) {
            html = buildTooltipHTML(loc, {
            ...previewState,
                roadLinks
            });
            ctx.tooltipHtmlCache.set(cacheKey, html);
        }
        ctx.tooltip.innerHTML = html;
        bindTooltipPreviewFallbacks(ctx);
    }

    function positionTooltip(event, ctx) {
        if (!ctx.tooltip) return;
        const padding = 15;
        let x = event.clientX + padding;
        let y = event.clientY + padding;
        const rect = ctx.tooltip.getBoundingClientRect();
        if (x + rect.width > window.innerWidth) x = event.clientX - rect.width - padding;
        if (y + rect.height > window.innerHeight) y = event.clientY - rect.height - padding;
        ctx.tooltip.style.left = `${x}px`;
        ctx.tooltip.style.top = `${y}px`;
    }

    function showTooltip(event, loc, ctx) {
        if (!ensureTooltipElement(ctx) || !ctx.tooltipsEnabled || isTooltipSuppressedLocation(loc)) return;

        if (ctx.hideTimer) {
            clearTimeout(ctx.hideTimer);
            ctx.hideTimer = null;
        }

        ctx.activeTooltipLocationId = loc.id || null;
        renderTooltipContent(loc, ctx);

        const crestPreviewImage = getCityCrestImage(loc);
        if (crestPreviewImage && getCachedImageAvailability(ctx, crestPreviewImage) === null) {
            probeImageAvailability(ctx, crestPreviewImage, (available) => {
                if (!available) return;
                if (!ctx.tooltip || ctx.activeTooltipLocationId !== (loc.id || null)) return;
                renderTooltipContent(loc, ctx);
                positionTooltip(event, ctx);
            });
        }

        ctx.tooltip.style.display = 'block';
        ctx.tooltip.style.pointerEvents = 'auto';
        positionTooltip(event, ctx);
    }

    function moveTooltip() {
        // Intentionally static after opening so links remain easy to click.
    }

    function hideTooltip(event, ctx) {
        if (!ctx.tooltip) return;
        if (!ctx.tooltipsEnabled) {
            hideTooltipImmediately(ctx);
            return;
        }

        if (ctx.hideTimer) {
            clearTimeout(ctx.hideTimer);
            ctx.hideTimer = null;
        }

        ctx.hideTimer = setTimeout(() => {
            const currentHover = document.querySelectorAll(':hover');
            const isHoveringTooltip = Array.from(currentHover).some((el) => el === ctx.tooltip || ctx.tooltip.contains(el));
            const isHoveringTrigger = Array.from(currentHover).some((el) => el.closest && (el.closest('.marker-group') || el.closest('.region-label')));

            if (!isHoveringTooltip && !isHoveringTrigger) {
                ctx.hideTimer = setTimeout(() => {
                    const hover2 = document.querySelectorAll(':hover');
                    const stillOnTooltip = Array.from(hover2).some((el) => el === ctx.tooltip || ctx.tooltip.contains(el));
                    const stillOnTrigger = Array.from(hover2).some((el) => el.closest && (el.closest('.marker-group') || el.closest('.region-label')));

                    if (!stillOnTooltip && !stillOnTrigger) {
                        ctx.activeTooltipLocationId = null;
                        ctx.tooltip.style.display = 'none';
                        ctx.tooltip.style.pointerEvents = 'none';
                    }
                    ctx.hideTimer = null;
                }, 300);
            } else {
                ctx.hideTimer = null;
            }
        }, 500);
    }

    return {
        ensureTooltipElement,
        setTooltipsEnabled,
        areTooltipsEnabled,
        hideTooltipImmediately,
        isTooltipSuppressedLocation,
        showTooltip,
        moveTooltip,
        hideTooltip
    };
})();
