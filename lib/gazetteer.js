// Shared Google Doc gazetteer fetching/parsing helpers.
// Used by the /api/ai/parse-gazetteer route and the /api/gazetteer/audit route
// so image-extraction heuristics stay identical between them.

const https = require('https');
const http = require('http');
const crypto = require('crypto');

// Fetch with redirect following, returns { data: Buffer, contentType: string }
function fetchUrl(targetUrl, depth) {
    depth = depth || 0;
    return new Promise((resolve, reject) => {
        if (depth > 8) { reject(new Error('Too many redirects')); return; }
        const mod = targetUrl.startsWith('https') ? https : http;
        const request = mod.get(targetUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (r) => {
            if ([301, 302, 307, 308].includes(r.statusCode) && r.headers.location) {
                fetchUrl(r.headers.location, depth + 1).then(resolve, reject);
                return;
            }
            if (r.statusCode !== 200) { reject(new Error('HTTP ' + r.statusCode)); return; }
            const chunks = [];
            r.on('data', c => chunks.push(c));
            r.on('end', () => resolve({ data: Buffer.concat(chunks), contentType: r.headers['content-type'] || '' }));
            r.on('error', reject);
        });
        request.setTimeout(20000, () => request.destroy(new Error('Request timed out')));
        request.on('error', reject);
    });
}

// Resolve an <img src> (data: URI or remote URL) to raw image bytes
async function imageBytesFromSrc(src) {
    if (src.startsWith('data:')) {
        const base64Data = src.split(',')[1];
        if (!base64Data) throw new Error('Invalid data URI');
        return Buffer.from(base64Data, 'base64');
    }
    const result = await fetchUrl(src);
    const ct = result.contentType.toLowerCase();
    if (!ct.includes('image') && result.data.length < 100) throw new Error('Not an image');
    return result.data;
}

function sha256(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
}

// Strip HTML tags, decode entities, collapse whitespace
function stripHtml(html) {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    let content = bodyMatch ? bodyMatch[1] : html;

    while (content.includes('<style') || content.includes('<script')) {
        const newContent = content
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        if (newContent === content) break;
        content = newContent;
    }

    return content
        .replace(/<\/tr>/gi, '\n')
        .replace(/<\/td>/gi, '  ')
        .replace(/<\/th>/gi, '  ')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<\/div>/gi, '\n')
        .replace(/<\/li>/gi, '\n')
        .replace(/<\/h[1-6]>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .replace(/\xa0/g, ' ')
        .replace(/&#39;/g, "'")
        .replace(/&rsquo;/g, "'")
        .replace(/&lsquo;/g, "'")
        .replace(/&rdquo;/g, '"')
        .replace(/&ldquo;/g, '"')
        .replace(/&quot;/g, '"')
        .replace(/[ \t]+/g, ' ')
        .replace(/\r/g, '')
        .replace(/\n[ \t]+/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function summarizeLocationText(text) {
    return (text || '')
        .replace(/\s+/g, ' ')
        .replace(/\bNon-Player Characters?\b.*$/i, '')
        .trim();
}

function collectHeadingBasedLocations(allSections) {
    const genericHeadingPattern = /^(overview|history|citizenry|races|holidays and traditions|winterfest|government|the village council|town meetings|customs|interaction with external forces|laws|economy and trade|trade and barter|specialized craftsmanship|local resources|professional guilds|religion|central beliefs|the everlight deity.*|beliefs|the balance of elements|the festival of winterfest|religious practices|daily offerings|blessings and rituals|sacred sites|clergy and key figures|landmarks|notable.?locations?|locations?|points? of interest|lodging|meals|services provided|approaching|entering|unique items|map|city\s*map|non-player characters?)$/i;
    const entries = [];

    for (const section of allSections) {
        const heading = (section.heading || '').trim();
        const text = summarizeLocationText(section.text || '');
        if (!heading || genericHeadingPattern.test(heading)) {
            continue;
        }
        if (text.length < 80) {
            continue;
        }
        entries.push({ heading, text });
    }

    return entries;
}

// Parse a Google Doc HTML export into sections and identify the crest, map,
// and numbered-locations-overlay image sources.
function parseGazetteerHtml(html) {
    const allImages = [...html.matchAll(/<img[^>]+src="([^"]+)"/gi)].map(m => m[1]);

    const headingRegex = /<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi;
    const headings = [];
    let hm;
    while ((hm = headingRegex.exec(html)) !== null) {
        headings.push({
            text: hm[1].replace(/<[^>]+>/g, '').trim(),
            index: hm.index,
            end: hm.index + hm[0].length
        });
    }

    // Content before the first heading (page 1 — crest lives here)
    const preHtml = headings.length > 0 ? html.slice(0, headings[0].index) : html;
    const preImages = [...preHtml.matchAll(/<img[^>]+src="([^"]+)"/gi)].map(m => m[1]);

    const sections = headings.map((h, i) => {
        const sHtml = html.slice(h.end, i + 1 < headings.length ? headings[i + 1].index : html.length);
        return {
            heading: h.text,
            text: stripHtml(sHtml),
            images: [...sHtml.matchAll(/<img[^>]+src="([^"]+)"/gi)].map(m => m[1])
        };
    });

    const mapSection = sections.find(s => /^(map|city\s*map)$/i.test(s.heading.trim())) || null;
    const locSectionIdx = sections.findIndex(s =>
        /landmarks/i.test(s.heading) ||
        /notable.?locations?/i.test(s.heading) ||
        /^locations?$/i.test(s.heading.trim()) ||
        /points? of interest/i.test(s.heading)
    );
    const locSection = locSectionIdx !== -1 ? sections[locSectionIdx] : null;

    // If the Notable Locations section itself has no body text, the doc uses headings
    // per location — collect all sub-section text until the next major section
    if (locSection && locSection.text.trim().length < 50 && locSectionIdx !== -1) {
        const majorSectionKeywords = /^(non-player characters|services provided|approaching|entering|lodging|meals|unique items|npc|overview|history|government|economy|religion|traditions|laws|punishment)$/i;
        const subTexts = [];
        for (let si = locSectionIdx + 1; si < sections.length; si++) {
            const s = sections[si];
            if (!majorSectionKeywords.test(s.heading.trim())) {
                subTexts.push(s.heading + (s.text ? '\n' + s.text : ''));
            }
        }
        locSection.text = subTexts.join('\n\n');
    }

    const headingBasedLocations = collectHeadingBasedLocations(sections);
    const formattedHeadingLocations = headingBasedLocations
        .map((entry, index) => `${index + 1}. ${entry.heading}: ${entry.text}`)
        .join('\n\n');

    if (locSection && (!locSection.text || locSection.text.trim().length < 50) && formattedHeadingLocations) {
        locSection.text = formattedHeadingLocations;
    }

    // Source URLs for crest, map, and numbered-locations overlay
    const crestSrcUrl = preImages[0] || allImages[0] || null;
    const mapSrcUrl = mapSection && mapSection.images.length > 0 ? mapSection.images[0] : null;

    // Smarter overlay discovery:
    // 1. Second image in Map section
    // 2. First image in Locations section
    // 3. Next image in doc after the map
    let locOverlaySrcUrl = null;
    if (mapSection && mapSection.images.length > 1) {
        locOverlaySrcUrl = mapSection.images[1];
    } else if (locSection && locSection.images.length > 0) {
        locOverlaySrcUrl = locSection.images[0];
    } else if (mapSrcUrl) {
        const mapIdx = allImages.indexOf(mapSrcUrl);
        if (mapIdx !== -1 && allImages[mapIdx + 1]) {
            locOverlaySrcUrl = allImages[mapIdx + 1];
        }
    }

    return {
        allImages,
        preImages,
        sections,
        mapSection,
        locSection,
        headingBasedLocations,
        formattedHeadingLocations,
        crestSrcUrl,
        mapSrcUrl,
        locOverlaySrcUrl
    };
}

module.exports = {
    fetchUrl,
    imageBytesFromSrc,
    sha256,
    stripHtml,
    parseGazetteerHtml
};
