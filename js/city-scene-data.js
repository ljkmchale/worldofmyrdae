window.CITY_SCENE_DATA = {
  basctdelm: {
    id: "basctdelm",
    cityName: "Bascdelm",
    sceneName: "The Waiting Ship Inn",
    sceneSubtitle: "Dockside Proof of Concept",
    tagline: "A lantern-warm harbor slice of northern Bascdelm, built as an explorable scene around the Waiting Ship Inn.",
    cityMapImage: "images/cities/basctdelm/basctdelm.png",
    sceneVideo: "images/city-scenes/basctdelm/dockside-backdrop.mp4",
    signImage: "images/city-scenes/basctdelm/waiting-ship-sign.png",
    facadeImage: "images/city-scenes/basctdelm/waiting-ship-facade.png",
    backdropImage: "images/city-scenes/basctdelm/dockside-backdrop.png",
    mapFocus: { x: 73.3, y: 41.2 },
    playerStart: { x: 18, y: 7.8, z: 72, lookAt: { x: -18, y: 11, z: 46 } },
    bounds: { minX: -92, maxX: 104, minZ: -6, maxZ: 116 },
    lore: [
      "The Waiting Ship Inn watches the northern piers where outbound merchants linger for the tide, the weather, or the courage to leave Bascdelm's walls behind.",
      "Market barges crowd the quay by day, while lantern crews, rope-haulers, and late sailors take the inn's upper balcony long after the last toll of the lighthouse bell.",
      "This proof of concept interprets the city map as an atmospheric dockside scene rather than a literal one-to-one reconstruction."
    ],
    controls: [
      "Drag to look around",
      "W A S D to walk the quay",
      "Shift to quicken your pace",
      "R to return to the starting spot"
    ],
    hotspots: [
      {
        id: "waiting-ship-inn",
        name: "The Waiting Ship Inn",
        type: "Inn",
        position: { x: -34, y: 11, z: 47 },
        description: "A three-storey harbor inn with a salt-dark sign, balcony lamps, and a front terrace built to watch the tide and the traffic."
      },
      {
        id: "north-quay",
        name: "North Quay",
        type: "Docks",
        position: { x: 2, y: 6, z: 22 },
        description: "The busiest finger piers on this stretch of the harbor, stacked with rope, fish crates, and sailors waiting on a favorable current."
      },
      {
        id: "merchants-sheds",
        name: "Lantern Market Sheds",
        type: "Trade",
        position: { x: 44, y: 8, z: 62 },
        description: "Canvas-roof stalls and rough timber sheds where chandlers, tally-keepers, and fast-talking brokers work the evening crowd."
      },
      {
        id: "moored-caravel",
        name: "The Tidebound Caravel",
        type: "Ship",
        position: { x: 16, y: 8, z: -18 },
        description: "A broad-beamed trader riding low in the water while deckhands secure cargo and argue over the tide table."
      }
    ],
    buildings: [
      {
        kind: "inn",
        position: { x: -38, y: 0, z: 50 },
        width: 24,
        depth: 15,
        height: 17,
        roofHeight: 8,
        timber: "#4b3528",
        plaster: "#b99c7a",
        roof: "#233040",
        lanterns: [
          { x: -31, y: 8.5, z: 57 },
          { x: -25.5, y: 8.5, z: 51.5 },
          { x: -41, y: 8.5, z: 58.5 }
        ]
      },
      {
        kind: "annex",
        position: { x: -20, y: 0, z: 49 },
        width: 12,
        depth: 11,
        height: 11,
        roofHeight: 5,
        timber: "#4f3929",
        plaster: "#a88361",
        roof: "#6c4432"
      },
      {
        kind: "warehouse",
        position: { x: -3, y: 0, z: 51 },
        width: 18,
        depth: 14,
        height: 12,
        roofHeight: 6,
        timber: "#503521",
        plaster: "#957258",
        roof: "#4b2b20"
      },
      {
        kind: "warehouse",
        position: { x: 24, y: 0, z: 48 },
        width: 22,
        depth: 12,
        height: 11,
        roofHeight: 5,
        timber: "#564131",
        plaster: "#9c7e62",
        roof: "#5c3a2d"
      },
      {
        kind: "shed",
        position: { x: 46, y: 0, z: 61 },
        width: 12,
        depth: 8,
        height: 7,
        roofHeight: 4,
        timber: "#664937",
        plaster: "#b08f70",
        roof: "#82614b"
      },
      {
        kind: "shed",
        position: { x: 58, y: 0, z: 57 },
        width: 10,
        depth: 8,
        height: 6,
        roofHeight: 4,
        timber: "#634534",
        plaster: "#b49376",
        roof: "#8a6347"
      },
      {
        kind: "gatehouse",
        position: { x: 82, y: 0, z: 38 },
        width: 18,
        depth: 14,
        height: 20,
        roofHeight: 7,
        timber: "#4c3d35",
        plaster: "#b7b4ae",
        roof: "#5f4e4b"
      }
    ],
    docks: [
      {
        type: "main",
        x: -2,
        z: 20,
        width: 14,
        length: 72
      },
      {
        type: "finger",
        x: -24,
        z: -2,
        width: 9,
        length: 28
      },
      {
        type: "finger",
        x: 22,
        z: 0,
        width: 10,
        length: 34
      },
      {
        type: "finger",
        x: 48,
        z: 8,
        width: 9,
        length: 24
      }
    ],
    ships: [
      {
        name: "Tidebound Caravel",
        position: { x: 14, y: 1.1, z: -22 },
        scale: 1.15,
        heading: 0.12,
        hull: "#2d2019",
        sail: "#d8cfbf",
        lantern: "#f3be63"
      },
      {
        name: "Lantern Reach Sloop",
        position: { x: 55, y: 0.9, z: -6 },
        scale: 0.82,
        heading: -0.18,
        hull: "#35251c",
        sail: "#cfc7b8",
        lantern: "#ebae58"
      }
    ],
    props: {
      crates: [
        { x: -7, z: 41, w: 3.4, h: 2.8, d: 3.1 },
        { x: 8, z: 36, w: 3.2, h: 2.5, d: 3.2 },
        { x: 29, z: 42, w: 3.5, h: 2.3, d: 3.1 },
        { x: 40, z: 66, w: 2.8, h: 2.0, d: 2.6 },
        { x: 51, z: 51, w: 2.4, h: 2.2, d: 2.4 }
      ],
      barrels: [
        { x: -18, z: 40, r: 1.1, h: 2.6 },
        { x: 0, z: 44, r: 1.0, h: 2.5 },
        { x: 20, z: 55, r: 1.0, h: 2.7 },
        { x: 35, z: 47, r: 0.9, h: 2.4 },
        { x: 62, z: 60, r: 0.95, h: 2.4 }
      ],
      lampPosts: [
        { x: -21, z: 58, h: 8.5 },
        { x: 4, z: 47, h: 8.2 },
        { x: 28, z: 43, h: 8.4 },
        { x: 58, z: 53, h: 8.6 }
      ],
      marketAwnings: [
        { x: 42, z: 66, w: 8, d: 6, color: "#c7b28c" },
        { x: 53, z: 67, w: 7, d: 5, color: "#d7c2a1" },
        { x: 62, z: 65, w: 8, d: 6, color: "#bfa584" }
      ]
    }
  }
};
