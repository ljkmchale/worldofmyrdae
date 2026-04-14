/**
 * Tratta City Location Data
 * Shared between city-tratta.html (viewer) and editor.html (pin editor).
 * Edit pin positions via the City Map tab in editor.html, then save.
 */
const TRATTA_CITY = {
  numbered: [
    { n:  1, x: 41.1, y: 26.2, name: 'The Anchored Spire',  type: 'tavern',     desc: 'A well-known tavern and meeting point in the heart of Tratta\'s upper ring.' },
    { n:  2, x: 32.1, y: 50.9, name: 'SeaRoute Colosseum',  type: 'arena',      desc: 'Tratta\'s grand fighting arena. Gladiatorial bouts, beast fights, and spectacle draw crowds from across Yearning Vale.' },
    { n:  3, x: 25.5, y: 72.3, name: 'Torguard Post',       type: 'garrison',   desc: 'City guard outpost on the western edge of Tratta. Watches the Westpost approaches and the outer gate.' },
    { n:  4, x: 52.7, y: 72.5, name: 'The Majestic',        type: 'inn',        desc: 'Tratta\'s finest inn. Lavish rooms, a respected dining hall, and discretion guaranteed for wealthy guests.' },
    { n:  5, x: 63.4, y: 75.0, name: 'Travane College',     type: 'college',    desc: 'One of two Travane College campuses in Tratta. Educates the city\'s merchant class in trade, navigation, and letters.' },
    { n:  6, x: 76.5, y: 76.5, name: 'The Reserve (Vault)', type: 'bank',       desc: 'Tratta\'s most secure financial institution. Houses gold reserves, trade bonds, and sealed private vaults.' },
    { n:  7, x: 59.1, y: 28.5, name: 'Lower Warehouse',     type: 'warehouse',  desc: 'Large storage facility serving the lower dock district. Goods from the High Decks are staged here before distribution.' },
    { n:  8, x: 49.2, y: 39.9, name: 'Slippy Tails',        type: 'tavern',     desc: 'A rowdy dockside tavern popular with fishermen and sailors off the Lower Docks. Known for cheap ale and brawls.' },
    { n:  9, x: 44.8, y: 14.3, name: 'Ye Olde Elderberry',  type: 'tavern',     desc: 'A venerable drinking establishment in the north ward. Claims to be the oldest continuously-operating tavern in Tratta.' },
    { n: 10, x: 39.3, y: 34.0, name: 'Sticky Parrot',       type: 'tavern',     desc: 'Lively tavern in the inner ring. Named for the landlord\'s famously foul-mouthed parrot, still perched behind the bar.' },
    { n: 11, x: 22.7, y: 45.0, name: 'SeaRoute Inn',        type: 'inn',        desc: 'Affordable lodging for traveling merchants following the sea trade routes. Run by the SeaRoute guild.' },
    { n: 12, x: 47.1, y: 66.6, name: 'Mahl\'s Hold',        type: 'stronghold', desc: 'A secondary fortified compound belonging to the Mahl dynasty, separate from Mahl Palace. Used for city administration.' },
    { n: 13, x: 67.9, y: 53.1, name: 'Trusty Tankard',      type: 'tavern',     desc: 'Sailor\'s tavern on the eastern dock strip. A reliable haunt — the drinks are honest and the fights are honest too.' },
    { n: 14, x: 70.6, y: 83.3, name: 'The Zealous Crew',    type: 'tavern',     desc: 'Favored by privateers and naval officers alike. Recruitment boards line the walls with postings for sea voyages.' },
    { n: 15, x: 52.1, y: 30.5, name: 'Lower Market',        type: 'market',     desc: 'The main street market of the lower ring. Daily stalls selling food, cloth, tools, and imported curiosities.' },
    { n: 16, x: 31.4, y: 38.1, name: 'Trade Shops',         type: 'market',     desc: 'A cluster of permanent trade shops near the harbor entry. Covers everything from rope and sailcloth to spices and dyes.' },
    { n: 17, x: 43.7, y: 59.2, name: 'Soren\'s Oddities',   type: 'shop',       desc: 'A curiosity shop run by the enigmatic Soren. Sells rare imports, unusual trinkets, and items of uncertain provenance.' },
    { n: 18, x: 65.7, y: 59.3, name: 'High Market',         type: 'market',     desc: 'The upscale market district. Fine goods, luxury imports, and guild-controlled trade between Tratta\'s wealthiest merchants.' },
    { n: 19, x: 68.5, y: 87.9, name: 'Travane College',     type: 'college',    desc: 'Second campus of Travane College, serving the southern districts. Focuses on maritime law and trade contracts.' },
    { n: 20, x: 69.2, y: 38.9, name: 'Broken Sea Pearl',    type: 'inn',        desc: 'An inn with harbor views, named for a massive cracked pearl mounted above its door. Favored by captains and navigators.' },
    { n: 21, x: 32.4, y: 31.2, name: 'Shrine of Knowledge', type: 'shrine',     desc: 'A small but respected shrine dedicated to the pursuit of knowledge. Scholars and scribes leave offerings here.' },
    { n: 22, x: 20.9, y: 26.3, name: 'Statue of Brault',    type: 'landmark',   desc: 'A large bronze statue of Brault the Navigator, founder of Tratta\'s first sea-trade guild. A civic landmark.' },
    { n: 23, x: 68.3, y: 63.0, name: 'Temple of Tratta',    type: 'temple',     desc: 'The city\'s primary temple. Dedicated to the patron deity of Tratta — a place of worship, ceremony, and civic oath-taking.' },
    { n: 24, x: 40.6, y: 85.2, name: 'Stables',             type: 'stables',    desc: 'City stables in the southwest quarter. Horses, mules, and draft animals for hire or boarding.' },
    { n: 25, x: 48.0, y: 17.2, name: 'Bathhouse',           type: 'bathhouse',  desc: 'Public bathhouse in the upper ring. Hot and cold baths, steam rooms, and a small attached barber.' },
    { n: 26, x: 40.7, y: 76.5, name: 'Triage',              type: 'medical',    desc: 'A triage and healing station in the lower ring. Currently in need of repair and restocking.' },
    { n: 27, x: 84.2, y: 69.2, name: 'Lovely Loft',         type: 'brothel',    desc: 'Tratta\'s most notable brothel, located conveniently near the harbor. Discreet, well-run, and surprisingly expensive.' },
  ],
  named: [
    { id: 'north-gate',  name: 'North Gate',     x: 49.5, y:  3.2, type: 'gate',     desc: 'Primary northern entrance to Tratta. The iron portcullis was reinforced after the Siege of 847 AR.' },
    { id: 'westpost',    name: 'Westpost',        x:  3.5, y: 41.5, type: 'district', desc: 'The outer western settlement beyond the walls. Merchants, travelers, and transient workers settle here.' },
    { id: 'lower-docks', name: 'Lower Docks',     x: 54.5, y: 40.5, type: 'harbor',   desc: 'Inner harbor sheltered from the Broken Deep. Fishing vessels and small trade barges dock here daily.' },
    { id: 'high-decks',  name: 'High Decks',      x: 61.6, y: 45.5, type: 'harbor',   desc: 'Deep-water berths for ocean-going vessels. The lifeblood of Tratta\'s maritime trade empire.' },
    { id: 'mahl-palace', name: 'Mahl Palace',     x: 84.2, y: 53.5, type: 'palace',   desc: 'Seat of the Mahl dynasty. The fortified compound has never fallen to siege.' },
    { id: 'high-gate',   name: 'High Gate',       x: 60.5, y: 95.2, type: 'gate',     desc: 'Southern gate connecting Tratta to the road toward Yearning Vale and the interior.' },
    { id: 'broken-deep', name: 'The Broken Deep', x: 83.5, y: 19.0, type: 'sea',      desc: 'Treacherous coastal waters east of Tratta. Named for the shattered reef that has claimed a thousand ships.' },
  ]
};
