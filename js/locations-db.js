/**
 * World of Myrdae - Default Location Database
 * 
 * This file contains the default data for locations, roads, and regions.
 * It is loaded as a script to bypass CORS restrictions when running locally via file:// protocol.
 */

const WORLD_LOCATIONS = {
    "locations": [
        {
            "id": "lochlorn",
            "name": "Lochlorn",
            "type": "water",
            "x": 65.68,
            "y": 41.92,
            "region": "",
            "description": "Nature",
            "fontFamily": "Quintessential",
            "fontSize": 16,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "destons-outpost",
            "name": "Deston's\nOutpost",
            "type": "landmark",
            "x": 70.4,
            "y": 51.1,
            "region": "",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 11,
            "labelOffsetY": -7,
            "opacity": 1
        },
        {
            "id": "annagos",
            "name": "Annagos",
            "type": "town",
            "x": 69.55,
            "y": 51.05,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -57,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "staghaven",
            "name": "Staghaven",
            "type": "town",
            "x": 69.3,
            "y": 53.5,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 8,
            "labelOffsetY": 11,
            "fontStyle": "Normal"
        },
        {
            "id": "witherwood",
            "name": "Witherwood",
            "type": "nature",
            "x": 69.83,
            "y": 52.88,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 1
        },
        {
            "id": "tynevale",
            "name": "Tyne'vale",
            "type": "town",
            "x": 67.35,
            "y": 54.7,
            "region": "",
            "description": "Town",
            "link": "https://docs.google.com/document/d/1J553Gt1bLDE58Cfx2Lt2zUh4pT6XlRj__qlzz2GMyXg/edit?tab=t.0",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -64,
            "labelOffsetY": 7,
            "fontStyle": "Normal"
        },
        {
            "id": "willow-lodge",
            "name": "Willow\nLodge",
            "type": "poi",
            "x": 67.93,
            "y": 53.1,
            "region": "",
            "description": "Outpost",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": -3,
            "opacity": 1
        },
        {
            "id": "mid-dock",
            "name": "Mid Dock",
            "type": "landmark",
            "x": 67.7,
            "y": 51.3,
            "region": "",
            "description": "Outpost",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 1
        },
        {
            "id": "Old-gates",
            "name": "Old Gates",
            "type": "poi",
            "x": 65.8,
            "y": 56.5,
            "region": "",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 5,
            "opacity": 1
        },
        {
            "id": "dunduar",
            "name": "Dunduar",
            "type": "small-city",
            "x": 65.47,
            "y": 57.3,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -57,
            "labelOffsetY": -6,
            "fontStyle": "Normal"
        },
        {
            "id": "mount-emberstran",
            "name": "Mount\nEmberstran",
            "type": "region",
            "x": 63.09,
            "y": 55.5,
            "region": "",
            "description": "Nature",
            "fontFamily": "Penumbra Sans Std",
            "fontSize": 24,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 0.5
        },
        {
            "id": "semmerest-keep",
            "name": "Semmerest Keep",
            "type": "poi",
            "x": 61.8,
            "y": 65.2,
            "region": "",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 11,
            "labelOffsetY": 5,
            "opacity": 1
        },
        {
            "id": "harbok",
            "name": "Harbok",
            "type": "town",
            "x": 61.7,
            "y": 63.2,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -40,
            "labelOffsetY": 17,
            "fontStyle": "Normal"
        },
        {
            "id": "ulgrey",
            "name": "Ulgrey",
            "type": "town",
            "x": 62.87,
            "y": 60.8,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -56,
            "labelOffsetY": 0,
            "fontStyle": "Normal"
        },
        {
            "id": "tower-of-zibeus",
            "name": "Tower of\nZibeus",
            "type": "poi",
            "x": 62.6,
            "y": 61.7,
            "region": "",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -19,
            "labelOffsetY": 17,
            "opacity": 1
        },
        {
            "id": "kahlbits-veil",
            "name": "Kahlbit's\nVeil",
            "type": "nature",
            "x": 63.98,
            "y": 62.11,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 15,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1
        },
        {
            "id": "the-glimmering-sea",
            "name": "The\nGlimmering\nSea",
            "type": "water",
            "x": 59.1,
            "y": 61.9,
            "region": "",
            "description": "Nature",
            "fontFamily": "Quintessential",
            "fontSize": 30,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "silverhill",
            "name": "Silverhill",
            "type": "poi",
            "x": 64.87,
            "y": 45.5,
            "region": "Gaelscape",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -26,
            "labelOffsetY": 19,
            "opacity": 1
        },
        {
            "id": "crulfeld",
            "name": "Crulfeld",
            "type": "town",
            "x": 65.23,
            "y": 42.55,
            "region": "Crimson March",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -58,
            "labelOffsetY": 3
        },
        {
            "id": "wrynn",
            "name": "Wrynn",
            "type": "town",
            "x": 63.7,
            "y": 40.9,
            "region": "Crimson March",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -13,
            "labelOffsetY": -13
        },
        {
            "id": "ghogam",
            "name": "Ghogam",
            "type": "town",
            "x": 64.5,
            "y": 41.5,
            "region": "Crimson March",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3
        },
        {
            "id": "ofwood",
            "name": "Ofwood",
            "type": "town",
            "x": 65.4,
            "y": 38.96,
            "region": "Crimson March",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3
        },
        {
            "id": "crimson-pins",
            "name": "Crimson Pines",
            "type": "nature",
            "x": 63.75,
            "y": 37.94,
            "region": "Crimson March",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 1
        },
        {
            "id": "mirstone",
            "name": "Mirstone",
            "type": "town",
            "x": 67.8,
            "y": 38.8,
            "region": "Yearning Vale",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -62,
            "labelOffsetY": 5
        },
        {
            "id": "stouhg",
            "name": "Stouhg",
            "type": "city",
            "x": 62.8,
            "y": 41.5,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -38,
            "labelOffsetY": 19,
            "fontStyle": "Normal"
        },
        {
            "id": "offwood-crossroad",
            "name": "",
            "type": "town",
            "x": 65.16,
            "y": 40.74,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 1,
            "fontWeight": "300",
            "markerSize": 0.01,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "gur-madihl",
            "name": "Gur\nMadihl",
            "type": "small-city",
            "x": 63.1,
            "y": 46.04,
            "region": "Crimson March",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -37,
            "labelOffsetY": 5
        },
        {
            "id": "stonewood",
            "name": "Stonewood",
            "type": "nature",
            "x": 64.69,
            "y": 46.65,
            "region": "Gaelscape",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 16,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 1
        },
        {
            "id": "witherwood-river",
            "name": "Witherwood River",
            "type": "river",
            "x": 71.05,
            "y": 53.58,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "rotation": 44,
            "opacity": 0.8
        },
        {
            "id": "tossing-run-river",
            "name": "Tossing Run River",
            "type": "river",
            "x": 68.23,
            "y": 54.6,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 0.8
        },
        {
            "id": "far-valley-flow",
            "name": "Far Valley Flow",
            "type": "river",
            "x": 65.82,
            "y": 51.73,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 0.8
        },
        {
            "id": "stillbluff",
            "name": "Stillbluff",
            "type": "region",
            "x": 75.94,
            "y": 69.19,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 12,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "emberstran",
            "name": "Emberstran",
            "type": "city",
            "x": 60.75,
            "y": 58.23,
            "region": "",
            "description": "City",
            "link": "https://docs.google.com/document/d/1oECFiNos1Qqa1CfGo-2DJWbyet9SOF_gMKd3ZR2kY6c/edit?tab=t.0",
            "cityMap": "city-viewer.html?city=emberstran",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -53,
            "labelOffsetY": 22,
            "fontStyle": "Normal"
        },
        {
            "id": "stonetrace",
            "name": "Stonetrace",
            "type": "landmark",
            "x": 59.56,
            "y": 56.08,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 4,
            "labelOffsetY": -10,
            "opacity": 1
        },
        {
            "id": "wortstone",
            "name": "Wortstone",
            "type": "river",
            "x": 58.71,
            "y": 57.2,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "rotation": -35,
            "opacity": 0.8
        },
        {
            "id": "baltwood",
            "name": "Baltwood",
            "type": "nature",
            "x": 61.1,
            "y": 55.06,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 17,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1
        },
        {
            "id": "ahndashere",
            "name": "Ahndashere",
            "type": "town",
            "x": 57.85,
            "y": 57.49,
            "region": "",
            "description": "Town",
            "link": "https://docs.google.com/document/d/1tfgzGJK9ZZcaoiva1lfVAgR0xmbe_2Mn0uFoVj9bFLQ/edit?tab=t.0",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -53,
            "labelOffsetY": 18,
            "fontStyle": "Normal"
        },
        {
            "id": "lasdale",
            "name": "Lasdale",
            "type": "town",
            "x": 57.12,
            "y": 53.05,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -54,
            "labelOffsetY": 15,
            "fontStyle": "Normal"
        },
        {
            "id": "glofdale",
            "name": "Glofdale",
            "type": "town",
            "x": 57.2,
            "y": 55.6,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -55,
            "labelOffsetY": -6,
            "fontStyle": "Normal"
        },
        {
            "id": "crosswind",
            "name": "Crosswind",
            "type": "landmark",
            "x": 56.6,
            "y": 57.46,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -40,
            "labelOffsetY": 17,
            "opacity": 1
        },
        {
            "id": "flatgarde",
            "name": "Flatgarde",
            "type": "town",
            "x": 55.29,
            "y": 58.42,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -53,
            "labelOffsetY": -12,
            "fontStyle": "Normal"
        },
        {
            "id": "husing-wolds",
            "name": "Hushing\nWolds",
            "type": "region",
            "x": 55.71,
            "y": 56.08,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 17,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 0.5
        },
        {
            "id": "northern-stoneflow",
            "name": "Northern Stoneflow",
            "type": "river",
            "x": 59.93,
            "y": 52.25,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "rotation": -49,
            "opacity": 1
        },
        {
            "id": "dalerun",
            "name": "Dalerun",
            "type": "river",
            "x": 57.75,
            "y": 51.7,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "rotation": -53,
            "opacity": 1
        },
        {
            "id": "mistforge",
            "name": "Mistforge",
            "type": "town",
            "x": 58.48,
            "y": 49.6,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "castle-montavein",
            "name": "Castle\nMontavein",
            "type": "landmark",
            "x": 57.6,
            "y": 48.5,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -54,
            "labelOffsetY": 3,
            "opacity": 1
        },
        {
            "id": "severdale",
            "name": "Severdale",
            "type": "town",
            "x": 56.4,
            "y": 50.48,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -62,
            "labelOffsetY": 14,
            "fontStyle": "Normal"
        },
        {
            "id": "the-wispy-vale",
            "name": "The Wispy\nVale",
            "type": "nature",
            "x": 59.35,
            "y": 47.76,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 17,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1
        },
        {
            "id": "slagerum",
            "name": "Slag'erum",
            "type": "town",
            "x": 54.63,
            "y": 47.8,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": -3,
            "fontStyle": "Normal"
        },
        {
            "id": "meadowgarde",
            "name": "Meadowgarde",
            "type": "region",
            "x": 53.93,
            "y": 51.73,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 20,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "rotation": -39,
            "opacity": 0.5,
            "fontStyle": "Normal"
        },
        {
            "id": "shademeadow",
            "name": "Shademeadow",
            "type": "nature",
            "x": 54.5,
            "y": 54.35,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 19,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1
        },
        {
            "id": "the-argent-hells",
            "name": "The Argent\nHalls",
            "type": "town",
            "x": 54.75,
            "y": 62.84,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -39,
            "labelOffsetY": -13,
            "fontStyle": "Normal"
        },
        {
            "id": "paendley",
            "name": "Paendley",
            "type": "small-city",
            "x": 53.85,
            "y": 63.28,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -60,
            "labelOffsetY": 10,
            "fontStyle": "Normal"
        },
        {
            "id": "culburn",
            "name": "Culburn",
            "type": "town",
            "x": 58.81,
            "y": 65.39,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "glimmerstone",
            "name": "Glimmerstone",
            "type": "city",
            "x": 56.77,
            "y": 64.1,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -49,
            "labelOffsetY": -13,
            "fontStyle": "Normal"
        },
        {
            "id": "derly-river",
            "name": "Derly River",
            "type": "river",
            "x": 59.11,
            "y": 68.09,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "rotation": 15,
            "opacity": 1
        },
        {
            "id": "weald-of-whispers",
            "name": "Weald\nof\nWhispers",
            "type": "nature",
            "x": 59.52,
            "y": 70.14,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 16,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1
        },
        {
            "id": "passaria",
            "name": "Passaria",
            "type": "poi",
            "x": 57.78,
            "y": 68.09,
            "region": "",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 1
        },
        {
            "id": "terandell",
            "name": "Terandell",
            "type": "town",
            "x": 58.6,
            "y": 73.2,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -2,
            "labelOffsetY": -9,
            "fontStyle": "Normal"
        },
        {
            "id": "everdrift",
            "name": "Everdrift",
            "type": "river",
            "x": 59.98,
            "y": 73.63,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "rotation": -55,
            "opacity": 1
        },
        {
            "id": "kaltera-mountains",
            "name": "Kaltera Mountains",
            "type": "region",
            "x": 52.38,
            "y": 73.37,
            "region": "",
            "description": "Nature",
            "fontFamily": "Penumbra Sans Std",
            "fontSize": 24,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "rotation": 72,
            "textCurve": -130,
            "opacity": 0.5,
            "fontStyle": "Normal"
        },
        {
            "id": "nurador",
            "name": "Nurador",
            "type": "town",
            "x": 55.21,
            "y": 67.71,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -27,
            "labelOffsetY": 19,
            "fontStyle": "Normal"
        },
        {
            "id": "driftbend",
            "name": "Driftbend",
            "type": "town",
            "x": 59.92,
            "y": 74.96,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -66,
            "labelOffsetY": 12,
            "fontStyle": "Normal"
        },
        {
            "id": "brokenfall",
            "name": "Brokenfall",
            "type": "town",
            "x": 56.53,
            "y": 73.93,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -70,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "crossroad-boldshire-edgewind-bistron",
            "name": "crossroad-boldshire-edgewind-bistron",
            "type": "town",
            "x": 68.76,
            "y": 61.7,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "hideLabel": true,
            "fontStyle": "Normal"
        },
        {
            "id": "coastline-location-siltbay",
            "name": "coastline-location-siltbay",
            "type": "town",
            "x": 69.28,
            "y": 62.86,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "hideLabel": true,
            "fontStyle": "Normal"
        },
        {
            "id": "next-to-glimmerstone-location",
            "name": "next-to-glimmerstone-location",
            "type": "town",
            "x": 57.16,
            "y": 65.23,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "hideLabel": true,
            "fontStyle": "Normal"
        },
        {
            "id": "next-to-glimmerstone-location-1",
            "name": "next-to-glimmerstone-location-1",
            "type": "town",
            "x": 56.17,
            "y": 66.19,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "hideLabel": true,
            "fontStyle": "Normal"
        },
        {
            "id": "next-to-glimmerstone-location-3",
            "name": "next-to-glimmerstone-location-3",
            "type": "town",
            "x": 55.51,
            "y": 65.26,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "hideLabel": true,
            "fontStyle": "Normal"
        },
        {
            "id": "unknown-location-10",
            "name": "unknown-location-10",
            "type": "town",
            "x": 53.8,
            "y": 69.7,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "hideLabel": true,
            "fontStyle": "Normal"
        },
        {
            "id": "unknown-location-11",
            "name": "unknown-location-11",
            "type": "town",
            "x": 56.4,
            "y": 71.8,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "hideLabel": true,
            "fontStyle": "Normal"
        },
        {
            "id": "vanapur-mountains",
            "name": "Vanapur Mountains",
            "type": "region",
            "x": 55.81,
            "y": 71.49,
            "region": "",
            "description": "Nature",
            "fontFamily": "Penumbra Sans Std",
            "fontSize": 18,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "rotation": 65,
            "textCurve": 60,
            "opacity": 0.5,
            "fontStyle": "Normal"
        },
        {
            "id": "climbor",
            "name": "Climbor",
            "type": "city",
            "x": 51.6,
            "y": 69.97,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -1,
            "labelOffsetY": 19,
            "fontStyle": "Normal",
            "cityMap": "city-viewer.html?city=climbor"
        },
        {
            "id": "felden",
            "name": "Felden",
            "type": "small-city",
            "x": 50.5,
            "y": 67.2,
            "region": "",
            "description": "Small City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -40,
            "labelOffsetY": 16,
            "fontStyle": "Normal"
        },
        {
            "id": "greyrun",
            "name": "Greyrun",
            "type": "river",
            "x": 62.26,
            "y": 61.73,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "400",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "rotation": -53,
            "opacity": 1
        },
        {
            "id": "harbok-river",
            "name": "Harbok River",
            "type": "river",
            "x": 61.89,
            "y": 60.9,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 10,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "rotation": -60,
            "opacity": 1
        },
        {
            "id": "crossroads-1",
            "name": "beveress-paendley-crossroads",
            "type": "town",
            "x": 53.82,
            "y": 62.64,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "hideLabel": true,
            "fontStyle": "Normal"
        },
        {
            "id": "Beveress",
            "name": "Beveress",
            "type": "town",
            "x": 52.65,
            "y": 60.06,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -22,
            "labelOffsetY": -10,
            "fontStyle": "Normal"
        },
        {
            "id": "stoneflow",
            "name": "Stoneflow",
            "type": "river",
            "x": 50.28,
            "y": 62.55,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 0.7
        },
        {
            "id": "corebb-keep",
            "name": "Corebb\nKeep",
            "type": "landmark",
            "x": 51.8,
            "y": 62.5,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -36,
            "labelOffsetY": -13,
            "opacity": 1
        },
        {
            "id": "hasfen",
            "name": "Hasfen",
            "type": "town",
            "x": 51.85,
            "y": 59.74,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -48,
            "labelOffsetY": -8,
            "fontStyle": "Normal"
        },
        {
            "id": "stoneshore",
            "name": "Stoneshore",
            "type": "city",
            "x": 48.62,
            "y": 61.12,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -73,
            "labelOffsetY": 11,
            "fontStyle": "Normal"
        },
        {
            "id": "steenlodge",
            "name": "Steenlodge",
            "type": "town",
            "x": 48.8,
            "y": 64.1,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "gevakaln",
            "name": "Gevakaln",
            "type": "city",
            "x": 46.88,
            "y": 64.68,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -69,
            "labelOffsetY": 5,
            "fontStyle": "Normal"
        },
        {
            "id": "duskwaren",
            "name": "Duskwaren",
            "type": "town",
            "x": 52.66,
            "y": 65.29,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "heildward",
            "name": "Heildward",
            "type": "town",
            "x": 51.7,
            "y": 66.1,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -36,
            "labelOffsetY": -10,
            "fontStyle": "Normal"
        },
        {
            "id": "basinpass",
            "name": "Basinpass",
            "type": "town",
            "x": 49.06,
            "y": 66.26,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -67,
            "labelOffsetY": -5,
            "fontStyle": "Normal"
        },
        {
            "id": "morimyr",
            "name": "Morimyr",
            "type": "town",
            "x": 52.44,
            "y": 67.67,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "tarrarin",
            "name": "Tarrarin",
            "type": "small-city",
            "x": 48.37,
            "y": 74.34,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -62,
            "labelOffsetY": 2,
            "fontStyle": "Normal"
        },
        {
            "id": "witguard",
            "name": "Witguard",
            "type": "town",
            "x": 49.9,
            "y": 70.9,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -59,
            "labelOffsetY": -11,
            "fontStyle": "Normal"
        },
        {
            "id": "pelveron",
            "name": "Pelveron",
            "type": "small-city",
            "x": 49.26,
            "y": 72.3,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -59,
            "labelOffsetY": 0,
            "fontStyle": "Normal"
        },
        {
            "id": "silviora",
            "name": "Silviora",
            "type": "town",
            "x": 50.5,
            "y": 73.4,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "tyrynader",
            "name": "Tyrynder",
            "type": "small-city",
            "x": 47.73,
            "y": 70.8,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -52,
            "labelOffsetY": -8,
            "fontStyle": "Normal"
        },
        {
            "id": "unknown-12",
            "name": "unknown-12",
            "type": "poi",
            "x": 50.1,
            "y": 71.6,
            "region": "",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 1,
            "hideLabel": true
        },
        {
            "id": "Valenlun",
            "name": "Valenlun",
            "type": "town",
            "x": 47.93,
            "y": 68.2,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "greywater-bay",
            "name": "Greywater\nBay",
            "type": "water",
            "x": 47.83,
            "y": 60.02,
            "region": "",
            "description": "Nature",
            "fontFamily": "Quintessential",
            "fontSize": 12,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "distancion-mountains",
            "name": "Distancion Mountains",
            "type": "region",
            "x": 60,
            "y": 48.51,
            "region": "",
            "description": "Nature",
            "fontFamily": "Penumbra Sans Std",
            "fontSize": 50,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "rotation": 35,
            "textCurve": -21,
            "opacity": 0.5,
            "fontStyle": "Normal"
        },
        {
            "id": "thelkholdur",
            "name": "Thel Kholdur",
            "type": "small-city",
            "x": 54.79,
            "y": 44.9,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 5,
            "fontStyle": "Normal"
        },
        {
            "id": "inshire",
            "name": "Inshire",
            "type": "town",
            "x": 51.7,
            "y": 50.81,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "yunberr",
            "name": "Yunberr",
            "type": "town",
            "x": 50.9,
            "y": 55.6,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "seaway-harbor",
            "name": "Seaway\nHarbor",
            "type": "landmark",
            "x": 47.74,
            "y": 56.3,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -48,
            "labelOffsetY": 0,
            "opacity": 1
        },
        {
            "id": "graeton",
            "name": "Graeton",
            "type": "town",
            "x": 48.8,
            "y": 54.93,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -6,
            "labelOffsetY": 17,
            "fontStyle": "Normal"
        },
        {
            "id": "uktali-monastery",
            "name": "Uktali\nMonastery",
            "type": "poi",
            "x": 59.27,
            "y": 43.2,
            "region": "Halesworth",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 11,
            "labelOffsetY": 0,
            "opacity": 1
        },
        {
            "id": "olduktali",
            "name": "Old Uktali",
            "type": "town",
            "x": 59.06,
            "y": 41,
            "region": "Halesworth",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -28,
            "labelOffsetY": -14
        },
        {
            "id": "new-brimhaven",
            "name": "New\nBrimhaven",
            "type": "town",
            "x": 60.88,
            "y": 39.86,
            "region": "Crimson March",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -13,
            "labelOffsetY": 21
        },
        {
            "id": "ferndale",
            "name": "Ferndale",
            "type": "small-city",
            "x": 58.92,
            "y": 35.6,
            "region": "Halesworth",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 5
        },
        {
            "id": "basctdelm",
            "name": "Basctdelm",
            "type": "capital",
            "x": 57.72,
            "y": 31.66,
            "region": "Halesworth",
            "description": "Basctdelm is the capital of Halesworth and the seat of imperial authority for the Bathaen Empire, rising from a massive island anchored along the eastern edge of Lake Tribathe. Securely separated from the mainland by water on all sides save two controlled crossings, the city was shaped first for defense and governance, and only secondarily for trade. Its isolation is intentional—Basctdelm is not a crossroads, but a stronghold.",
            "cityMap": "city-viewer.html?city=basctdelm",
            "link": "https://docs.google.com/document/d/1kaDz6BPYRFUbRPyZefm41tVdlCHEUBqiZkgKtnDw1qk/edit?tab=t.0",
            "fontFamily": "Simonetta",
            "fontSize": 16,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -72,
            "labelOffsetY": 21,
            "fontStyle": "Normal"
        },
        {
            "id": "covered-bastion",
            "name": "Covered\nBastion",
            "type": "poi",
            "x": 61.25,
            "y": 39.32,
            "region": "Crimson March",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 9,
            "labelOffsetY": -14,
            "opacity": 1
        },
        {
            "id": "cultists-cave",
            "name": "Cultist's\nCave",
            "type": "poi",
            "x": 55.38,
            "y": 39.65,
            "region": "Halesworth",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -41,
            "labelOffsetY": -13,
            "opacity": 1
        },
        {
            "id": "halesworth-wetlands",
            "name": "Halesworth\nWetlands",
            "type": "nature",
            "x": 60.76,
            "y": 33.58,
            "region": "Halesworth",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 1
        },
        {
            "id": "seaglow",
            "name": "Seaglow",
            "type": "river",
            "x": 59.22,
            "y": 35.04,
            "region": "Halesworth",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "rotation": -40,
            "opacity": 0.7
        },
        {
            "id": "shademoor",
            "name": "Shademoor",
            "type": "town",
            "x": 56.8,
            "y": 37.8,
            "region": "Halesworth",
            "description": "Town",
            "link": "https://docs.google.com/document/d/1Bq6DDjHDkgMwH6-rko5hITz-hCnT5MmcbPIOwCavM-E/edit?tab=t.0#heading=h.eikouaesbcs9",
            "cityMap": "city-viewer.html?city=shademoor",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -74,
            "labelOffsetY": 11
        },
        {
            "id": "murfield",
            "name": "Murfield",
            "type": "town",
            "x": 56.9,
            "y": 34.8,
            "region": "Halesworth",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3
        },
        {
            "id": "nasmere-keep",
            "name": "Nasmere\nKeep",
            "type": "poi",
            "x": 58.1,
            "y": 36,
            "region": "Halesworth",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -40,
            "labelOffsetY": -13,
            "opacity": 1
        },
        {
            "id": "padstow",
            "name": "Padstow",
            "type": "town",
            "x": 58.2,
            "y": 32.4,
            "region": "Halesworth",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3
        },
        {
            "id": "dibsley",
            "name": "Dibsley",
            "type": "town",
            "x": 58.65,
            "y": 30.58,
            "region": "Halesworth",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 4,
            "labelOffsetY": 15
        },
        {
            "id": "southern-arch",
            "name": "Southern\nArch",
            "type": "poi",
            "x": 54.9,
            "y": 36.01,
            "region": "",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 38,
            "labelOffsetY": -12,
            "labelAlign": "end",
            "opacity": 1
        },
        {
            "id": "lake-tribathe",
            "name": "Lake Tribathe",
            "type": "water",
            "x": 56.4,
            "y": 31.41,
            "region": "",
            "description": "Nature",
            "fontFamily": "Quintessential",
            "fontSize": 12,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "hemmil",
            "name": "Hemmil",
            "type": "town",
            "x": 54.88,
            "y": 31.9,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -55,
            "labelOffsetY": 21,
            "fontStyle": "Normal"
        },
        {
            "id": "nauldeaus",
            "name": "Nauldeaus\n(Wave's Edge)",
            "type": "city",
            "x": 60.56,
            "y": 28.68,
            "region": "Halesworth",
            "description": "Nauldeaus started out simply as the port town “Wave’s Edge” before becoming the large city it is today.  As the gateway to Lake Tribathe, the large body of water that is known as the hub of the Bathaen Empire, almost all goods that arrive by sea into the three kingdoms come through Nauldeaus.",
            "cityMap": "city-viewer.html?city=nauldeaus",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 4,
            "labelOffsetY": 22,
            "fontStyle": "Normal"
        },
        {
            "id": "baryn",
            "name": "Baryn",
            "type": "town",
            "x": 59.23,
            "y": 28.93,
            "region": "Wheldrake",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -46,
            "labelOffsetY": -3
        },
        {
            "id": "omelle",
            "name": "Omelle",
            "type": "town",
            "x": 57.79,
            "y": 30.2,
            "region": "Wheldrake",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -51,
            "labelOffsetY": 3
        },
        {
            "id": "sharsley",
            "name": "Sharsley",
            "type": "town",
            "x": 56.9,
            "y": 28.9,
            "region": "Wheldrake",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -59,
            "labelOffsetY": 12
        },
        {
            "id": "haern",
            "name": "Haern",
            "type": "town",
            "x": 58.2,
            "y": 27.6,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": -5,
            "fontStyle": "Normal"
        },
        {
            "id": "gibuldon",
            "name": "Gibuldon",
            "type": "capital",
            "x": 28.4,
            "y": 28.2,
            "region": "",
            "description": "",
            "fontFamily": "Simonetta",
            "fontSize": 16,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 1,
            "labelOffsetY": 24,
            "fontStyle": "Normal"
        },
        {
            "id": "dryrock",
            "name": "Dryrock",
            "type": "town",
            "x": 27.8,
            "y": 29,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -52,
            "labelOffsetY": 13,
            "fontStyle": "Normal"
        },
        {
            "id": "abereth",
            "name": "Abereth",
            "type": "small-city",
            "x": 28.3,
            "y": 26.01,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -14,
            "labelOffsetY": -13,
            "fontStyle": "Normal"
        },
        {
            "id": "strolsworth",
            "name": "Strolsworth",
            "type": "town",
            "x": 29.42,
            "y": 26.53,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -14,
            "labelOffsetY": 18,
            "fontStyle": "Normal"
        },
        {
            "id": "loch-cerule",
            "name": "Loch\nCerule",
            "type": "water",
            "x": 28.91,
            "y": 27.57,
            "region": "",
            "description": "Nature",
            "fontFamily": "Quintessential",
            "fontSize": 8,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "lullin",
            "name": "Lullin",
            "type": "town",
            "x": 26.03,
            "y": 25.6,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -22,
            "labelOffsetY": 24,
            "fontStyle": "Normal"
        },
        {
            "id": "fruthuder-keep",
            "name": "Fruthuder\nKeep",
            "type": "landmark",
            "x": 24.7,
            "y": 25.6,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 34,
            "labelOffsetY": -12,
            "labelAlign": "end",
            "opacity": 1
        },
        {
            "id": "adsuren",
            "name": "Adsuren",
            "type": "town",
            "x": 24.1,
            "y": 28.6,
            "region": "Camburne",
            "description": "Adsuren is a small village in a wooded valley underneath Mount Ethea and borders on the Wehgyn River. It functions as a humble spot for those who call it home and a traveling spot for those who wish to get to the Eustera Ridge and don’t wish to go by the coast or up through Gibuldon. The village is littered with small buildings that branch off the river and form around a large open space where the town houses a market. ",
            "cityMap": "city-viewer.html?city=adsuren",
            "link": "https://docs.google.com/document/d/13vD63-iUc9eMgQz0Ycoi-n7LMDfw_I6NWImY6N_fqNA/edit?tab=t.0",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "caldwynn",
            "name": "Caldwynn",
            "type": "small-city",
            "x": 25.14,
            "y": 32.15,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 1,
            "labelOffsetY": -10,
            "fontStyle": "Normal"
        },
        {
            "id": "hathlao-swamp",
            "name": "Hath'lao\nSwamp",
            "type": "nature",
            "x": 25.38,
            "y": 27.61,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 15,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1
        },
        {
            "id": "tirncall",
            "name": "Tirncall",
            "type": "town",
            "x": 24.55,
            "y": 30.8,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 15,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "celedon-forest",
            "name": "Celedon\nForest",
            "type": "nature",
            "x": 25.91,
            "y": 30.42,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 15,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1
        },
        {
            "id": "lake-miremantle",
            "name": "Lake\nMiremantle",
            "type": "water",
            "x": 22.57,
            "y": 32.26,
            "region": "",
            "description": "Nature",
            "fontFamily": "Quintessential",
            "fontSize": 10,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "lake-glenmantle",
            "name": "Lake\nGlenmantle",
            "type": "water",
            "x": 22.64,
            "y": 33.75,
            "region": "",
            "description": "Nature",
            "fontFamily": "Quintessential",
            "fontSize": 8,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "celemere",
            "name": "Celemere",
            "type": "water",
            "x": 25.34,
            "y": 33.74,
            "region": "",
            "description": "Nature",
            "fontFamily": "Quintessential",
            "fontSize": 12,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "unstead",
            "name": "Unstead",
            "type": "town",
            "x": 24.54,
            "y": 34.43,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "kilnock",
            "name": "Kilnock",
            "type": "town",
            "x": 23.72,
            "y": 35.24,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -13,
            "labelOffsetY": 20,
            "fontStyle": "Normal"
        },
        {
            "id": "babbleglen",
            "name": "Babbleglen",
            "type": "town",
            "x": 22.73,
            "y": 34.27,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "gilburough-cascades",
            "name": "Gilburough\nCascades",
            "type": "poi",
            "x": 26.2,
            "y": 35.3,
            "region": "",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 11,
            "labelOffsetY": -11,
            "opacity": 1
        },
        {
            "id": "celemere-pass-location",
            "name": "Celemere Pass",
            "type": "town",
            "x": 26.8,
            "y": 31.31,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 9,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -41,
            "labelOffsetY": -10,
            "rotation": -43,
            "hideLabel": true,
            "fontStyle": "Normal"
        },
        {
            "id": "menmythorn",
            "name": "Menm'ythorn",
            "type": "town",
            "x": 23,
            "y": 31.8,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -16,
            "labelOffsetY": -9,
            "fontStyle": "Normal"
        },
        {
            "id": "wetlands-of-camburne",
            "name": "Wetlands of\nCamburne",
            "type": "nature",
            "x": 22.05,
            "y": 30.64,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 13,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1
        },
        {
            "id": "evyndar",
            "name": "Evyndar",
            "type": "small-city",
            "x": 19.79,
            "y": 32.27,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -52,
            "labelOffsetY": -3,
            "fontStyle": "Normal"
        },
        {
            "id": "leoning",
            "name": "Leoning",
            "type": "city",
            "x": 19.99,
            "y": 36.16,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -58,
            "labelOffsetY": -1,
            "fontStyle": "Normal"
        },
        {
            "id": "layden",
            "name": "Layden",
            "type": "town",
            "x": 23,
            "y": 38.17,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -4,
            "labelOffsetY": 19,
            "fontStyle": "Normal"
        },
        {
            "id": "proth",
            "name": "Proth",
            "type": "town",
            "x": 21.4,
            "y": 39.3,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "timberdown",
            "name": "Timberdown",
            "type": "landmark",
            "x": 24,
            "y": 37.7,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 7,
            "opacity": 1
        },
        {
            "id": "sheperds-keep",
            "name": "Shepherd's\nKeep",
            "type": "landmark",
            "x": 19.9,
            "y": 33.9,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -60,
            "labelOffsetY": 0,
            "opacity": 1
        },
        {
            "id": "broadmere-rest",
            "name": "Broadmere\nRest",
            "type": "landmark",
            "x": 20.2,
            "y": 30.2,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -12,
            "labelOffsetY": -11,
            "labelAlign": "end",
            "opacity": 1
        },
        {
            "id": "nesulport",
            "name": "Nesulport",
            "type": "town",
            "x": 20,
            "y": 26.9,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -64,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "daerswell-inlet",
            "name": "Daerswell Inlet",
            "type": "water",
            "x": 17.87,
            "y": 25.36,
            "region": "",
            "description": "Nature",
            "fontFamily": "Quintessential",
            "fontSize": 18,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "dreghye",
            "name": "Dreghye",
            "type": "town",
            "x": 18.75,
            "y": 23.2,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -56,
            "labelOffsetY": -3,
            "fontStyle": "Normal"
        },
        {
            "id": "eletold-wood",
            "name": "Eletold\nWood",
            "type": "nature",
            "x": 21.4,
            "y": 26.61,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 16,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1
        },
        {
            "id": "olmorrey",
            "name": "Ol'morrey",
            "type": "small-city",
            "x": 21.15,
            "y": 43.88,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -66,
            "labelOffsetY": -1,
            "fontStyle": "Normal"
        },
        {
            "id": "gristlow",
            "name": "Gristlow",
            "type": "town",
            "x": 22,
            "y": 41.51,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -1,
            "labelOffsetY": -7,
            "fontStyle": "Normal"
        },
        {
            "id": "morrey",
            "name": "Morrey",
            "type": "city",
            "x": 21.5,
            "y": 44.7,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -1,
            "labelOffsetY": -14,
            "fontStyle": "Normal"
        },
        {
            "id": "carnsby",
            "name": "Carnsby",
            "type": "town",
            "x": 23.7,
            "y": 45,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -54,
            "labelOffsetY": -3,
            "fontStyle": "Normal"
        },
        {
            "id": "kelmouth",
            "name": "Kelmouth",
            "type": "town",
            "x": 24.58,
            "y": 46.94,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -65,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "kith",
            "name": "Kith",
            "type": "town",
            "x": 27,
            "y": 46,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -33,
            "labelOffsetY": 10,
            "fontStyle": "Normal"
        },
        {
            "id": "dhachaomhnoir",
            "name": "Dha'Chaomhnoir",
            "type": "city",
            "x": 27.3,
            "y": 46.51,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -29,
            "labelOffsetY": 21,
            "fontStyle": "Normal"
        },
        {
            "id": "hillsofwheldrake",
            "name": "Hills of\nWheldrake",
            "type": "region",
            "x": 57.43,
            "y": 27.49,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 24,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 0.5
        },
        {
            "id": "riverside",
            "name": "Riverside",
            "type": "small-city",
            "x": 54.65,
            "y": 27.51,
            "region": "Wheldrake",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -28,
            "labelOffsetY": -13
        },
        {
            "id": "falthalor",
            "name": "Fal'thalor",
            "type": "town",
            "x": 53.49,
            "y": 38.4,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -66,
            "labelOffsetY": -10,
            "fontStyle": "Normal"
        },
        {
            "id": "dolkholdur",
            "name": "Dol Kholdur",
            "type": "landmark",
            "x": 54.77,
            "y": 43.7,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 13,
            "labelOffsetY": 4,
            "opacity": 1
        },
        {
            "id": "beselcrest",
            "name": "Beselcrest",
            "type": "region",
            "x": 49.41,
            "y": 56.74,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 15,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 0.5
        },
        {
            "id": "kholdurriver",
            "name": "Kholdur River",
            "type": "river",
            "x": 48.96,
            "y": 54.54,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 10,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "rotation": -25,
            "opacity": 0.8
        },
        {
            "id": "evostihl",
            "name": "Evostihl",
            "type": "town",
            "x": 48.83,
            "y": 49.9,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 6,
            "labelOffsetY": 12,
            "fontStyle": "Normal"
        },
        {
            "id": "nulvara",
            "name": "Nulvara",
            "type": "town",
            "x": 47,
            "y": 50.71,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": -12,
            "fontStyle": "Normal"
        },
        {
            "id": "grandpeaks",
            "name": "Grand\nPeaks",
            "type": "region",
            "x": 51.19,
            "y": 43.19,
            "region": "",
            "description": "Nature",
            "fontFamily": "Penumbra Sans Std",
            "fontSize": 16,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 0.5
        },
        {
            "id": "skrettel",
            "name": "Skrettel",
            "type": "city",
            "x": 49.32,
            "y": 43,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 5,
            "fontStyle": "Normal"
        },
        {
            "id": "snowcreepriver",
            "name": "Snowcreep River",
            "type": "river",
            "x": 47.25,
            "y": 47.54,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 10,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "rotation": -10,
            "opacity": 0.8
        },
        {
            "id": "amberleen",
            "name": "Amberleen",
            "type": "small-city",
            "x": 45.77,
            "y": 47.93,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -57,
            "labelOffsetY": 15,
            "fontStyle": "Normal"
        },
        {
            "id": "trasobahn",
            "name": "Tras'Obahn\n(Bay of Visions)",
            "type": "water",
            "x": 44.76,
            "y": 49.85,
            "region": "",
            "description": "Nature",
            "fontFamily": "Quintessential",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1
        },
        {
            "id": "endorei",
            "name": "Endorei",
            "type": "town",
            "x": 52,
            "y": 40.22,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -56,
            "labelOffsetY": -3,
            "fontStyle": "Normal"
        },
        {
            "id": "bastionoforder",
            "name": "Bastion of\nOrder",
            "type": "landmark",
            "x": 48.3,
            "y": 37.4,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -42,
            "labelOffsetY": -15,
            "opacity": 1
        },
        {
            "id": "gulward",
            "name": "Gulward",
            "type": "town",
            "x": 42.59,
            "y": 50.85,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -67,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "sunfelpost",
            "name": "Sundel\nPost",
            "type": "landmark",
            "x": 43.49,
            "y": 46.2,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 9,
            "labelOffsetY": -19,
            "opacity": 1
        },
        {
            "id": "deterahn",
            "name": "Deterahn",
            "type": "town",
            "x": 42.77,
            "y": 44.2,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -60,
            "labelOffsetY": -12,
            "fontStyle": "Normal"
        },
        {
            "id": "bonegate",
            "name": "Bonegate",
            "type": "small-city",
            "x": 40.57,
            "y": 43.76,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -33,
            "labelOffsetY": 17,
            "fontStyle": "Normal"
        },
        {
            "id": "everlownlodge",
            "name": "Everlown\nLodge",
            "type": "landmark",
            "x": 40.8,
            "y": 41.86,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -60,
            "labelOffsetY": 0,
            "opacity": 1
        },
        {
            "id": "scarden",
            "name": "Scar Den",
            "type": "town",
            "x": 41.9,
            "y": 38.6,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "waywardcrest",
            "name": "Wayward Crest",
            "type": "region",
            "x": 45.04,
            "y": 39.03,
            "region": "",
            "description": "Nature",
            "fontFamily": "Penumbra Sans Std",
            "fontSize": 21,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "rotation": 10,
            "opacity": 0.5
        },
        {
            "id": "kelaad",
            "name": "Kelaad",
            "type": "town",
            "x": 41.85,
            "y": 35.52,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -15,
            "labelOffsetY": 20,
            "tooltipImageOffsetX": 4,
            "fontStyle": "Normal"
        },
        {
            "id": "caelora",
            "name": "Caelora",
            "type": "small-city",
            "x": 53.13,
            "y": 36.23,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -57,
            "labelOffsetY": 5,
            "fontStyle": "Normal"
        },
        {
            "id": "darafee",
            "name": "Darafee",
            "type": "town",
            "x": 52.65,
            "y": 34.5,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": -2,
            "fontStyle": "Normal"
        },
        {
            "id": "tarnsport",
            "name": "Tarnsport",
            "type": "town",
            "x": 55.2,
            "y": 30.1,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -65,
            "labelOffsetY": -8,
            "fontStyle": "Normal"
        },
        {
            "id": "varenwood",
            "name": "Varenwood",
            "type": "nature",
            "x": 52.4,
            "y": 30.57,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 20,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1
        },
        {
            "id": "qaldynn",
            "name": "Qal'dynn",
            "type": "capital",
            "x": 50.94,
            "y": 33.2,
            "region": "",
            "description": "",
            "fontFamily": "Simonetta",
            "fontSize": 16,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "fontStyle": "Normal"
        },
        {
            "id": "onaren",
            "name": "O'naren",
            "type": "town",
            "x": 50.05,
            "y": 33.46,
            "region": "Borealian Sway",
            "description": "O’naren is a small elven settlement in the wooded foothills west of Qal’dynn, serving as both a waypoint for travelers and a place of quiet contemplation. Its finely carved stone buildings blend seamlessly with the gray-green forest, reflecting the elven reverence for nature. The town is centered around Driftglow Pond, a pristine circular body of water that catches the cascading falls from the hills. At its heart lies a small island, crowned by an ancient tree with striking pink foliage—believed to be a relic of the Qal’daefar, the original elves of Myrdae.",
            "cityMap": "city-viewer.html?city=onaren",
            "link": "https://docs.google.com/document/d/1ot7DXOzqFjYKucVqVu-tqmTRflrfBKSAwRZjNZtGLXU/edit?tab=t.0",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -2,
            "labelOffsetY": 18,
            "fontStyle": "Normal"
        },
        {
            "id": "abbeyofmontrest",
            "name": "Abbey of\nMont Rest",
            "type": "landmark",
            "x": 49.1,
            "y": 36.3,
            "region": "",
            "description": "The Abbey of Mont Rest, now commonly referred to as the Abbey of Light, is a sanctuary located south of O’naren, sitting at the summit of a tall foothill descending from the Distancion Mountains into the Borealian Sway. Originally dedicated to the old god Neera, the abbey has since expanded its purpose, becoming a place of study and reverence for all the gods of Myrdae. Built from the region’s natural stone, the abbey has stood for approximately 150 years, housing both devoted scholars of divine lore and an orphanage that provides care for abandoned or displaced children.",
            "link": "https://docs.google.com/document/d/14hX4cryRE61O6wLcZ26qFtsAXACJzqU60rwIgFkQYjQ/edit?tab=t.0",
            "cityMap": "city-viewer.html?city=abbey-of-mont-rest",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 13,
            "labelOffsetY": -5,
            "opacity": 1
        },
        {
            "id": "cradlecrestrise",
            "name": "Cradlecrest\nRise",
            "type": "region",
            "x": 49.73,
            "y": 35,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 15,
            "fontWeight": "200",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "rotation": -56,
            "opacity": 0.5
        },
        {
            "id": "mossholde",
            "name": "Mossholde",
            "type": "landmark",
            "x": 48.09,
            "y": 32.6,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -46,
            "labelOffsetY": -15,
            "opacity": 1
        },
        {
            "id": "brokencitadel",
            "name": "Broken\nCitadel",
            "type": "poi",
            "x": 47.82,
            "y": 33.04,
            "region": "",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -50,
            "labelOffsetY": 4,
            "opacity": 1
        },
        {
            "id": "tomboftsanvoeg",
            "name": "Tomb of\nTsan'voeg",
            "type": "poi",
            "x": 46.04,
            "y": 35.53,
            "region": "",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 9,
            "labelOffsetY": 4,
            "opacity": 1
        },
        {
            "id": "yallona",
            "name": "Y'allona\n(Sacred Valley)",
            "type": "region",
            "x": 46.72,
            "y": 34.42,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 0.5
        },
        {
            "id": "fardrift",
            "name": "Fardrift",
            "type": "town",
            "x": 64.85,
            "y": 26.76,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -46,
            "labelOffsetY": -10,
            "fontStyle": "Normal"
        },
        {
            "id": "corilas",
            "name": "Corilas",
            "type": "small-city",
            "x": 62.19,
            "y": 25.5,
            "region": "Wheldrake",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 5
        },
        {
            "id": "wellen",
            "name": "Wellen",
            "type": "town",
            "x": 61.19,
            "y": 26.3,
            "region": "Wheldrake",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 13
        },
        {
            "id": "murcomb",
            "name": "Murcomb",
            "type": "town",
            "x": 60.35,
            "y": 24.65,
            "region": "Wheldrake",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": -3
        },
        {
            "id": "howlerscove",
            "name": "Howler's\nCove",
            "type": "poi",
            "x": 62.56,
            "y": 32.76,
            "region": "Halesworth",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 9,
            "labelOffsetY": -13,
            "opacity": 0.7
        },
        {
            "id": "dibarynriver",
            "name": "Dibaryn\nRiver",
            "type": "river",
            "x": 58.73,
            "y": 30.06,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "rotation": -53,
            "opacity": 0.8
        },
        {
            "id": "seameetmarsh",
            "name": "Seameet Marsh",
            "type": "nature",
            "x": 59.81,
            "y": 26.77,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 16,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1
        },
        {
            "id": "lendahlee",
            "name": "Lendahlee",
            "type": "town",
            "x": 59.07,
            "y": 25.4,
            "region": "Wheldrake",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3
        },
        {
            "id": "vurnun",
            "name": "Vurnun",
            "type": "town",
            "x": 55.6,
            "y": 23.36,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "tibbers",
            "name": "Tibbers",
            "type": "town",
            "x": 56.07,
            "y": 25.7,
            "region": "",
            "description": "Town",
            "details": "Wheldrake",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -53,
            "labelOffsetY": 3
        },
        {
            "id": "wheldrake",
            "name": "Wheldrake",
            "type": "town",
            "x": 56.18,
            "y": 27.3,
            "region": "Wheldrake",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -28,
            "labelOffsetY": -11
        },
        {
            "id": "frystarianhighlands",
            "name": "Frystarian Highlands",
            "type": "region",
            "x": 57.61,
            "y": 21.83,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 26,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "rotation": 43,
            "opacity": 0.5
        },
        {
            "id": "baronsloch",
            "name": "Baron's Loch",
            "type": "water",
            "x": 51.93,
            "y": 27.93,
            "region": "",
            "description": "Nature",
            "fontFamily": "Quintessential",
            "fontSize": 12,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "blustaririver",
            "name": "Blustari River",
            "type": "river",
            "x": 53.69,
            "y": 27.9,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "rotation": -20,
            "opacity": 0.5
        },
        {
            "id": "lenshur",
            "name": "Lenshur",
            "type": "town",
            "x": 52.55,
            "y": 18.8,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "gristavel",
            "name": "Gristavel",
            "type": "town",
            "x": 50.83,
            "y": 20.2,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 5,
            "labelOffsetY": -9,
            "fontStyle": "Normal"
        },
        {
            "id": "palason",
            "name": "Palason",
            "type": "capital",
            "x": 54.22,
            "y": 22.1,
            "region": "",
            "description": "",
            "fontFamily": "Simonetta",
            "fontSize": 15,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetY": -10,
            "fontStyle": "Normal"
        },
        {
            "id": "kolgrafellthicket",
            "name": "Kolgrafell\nThicket",
            "type": "nature",
            "x": 52.6,
            "y": 23.58,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 18,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1
        },
        {
            "id": "ringere",
            "name": "Eringere",
            "type": "town",
            "x": 51.78,
            "y": 26.43,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -2,
            "labelOffsetY": 18,
            "fontStyle": "Normal"
        },
        {
            "id": "eruvic",
            "name": "Eruvic",
            "type": "small-city",
            "x": 46.3,
            "y": 20.87,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -49,
            "labelOffsetY": -1,
            "fontStyle": "Normal"
        },
        {
            "id": "sahvall",
            "name": "Sahvall",
            "type": "town",
            "x": 45.15,
            "y": 24.54,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "jordarr",
            "name": "Jordarr",
            "type": "town",
            "x": 50.99,
            "y": 28.07,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -56,
            "labelOffsetY": -2,
            "fontStyle": "Normal"
        },
        {
            "id": "northernarch",
            "name": "Northern\nArch",
            "type": "poi",
            "x": 50.13,
            "y": 28.56,
            "region": "",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -9,
            "labelOffsetY": 2,
            "labelAlign": "end",
            "opacity": 1
        },
        {
            "id": "ruinsoftegeonwaldkeep",
            "name": "Ruins of\nTegenwald Keep",
            "type": "poi",
            "x": 48.13,
            "y": 24.97,
            "region": "",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -62,
            "labelOffsetY": 4,
            "opacity": 1
        },
        {
            "id": "brekka",
            "name": "Brekka",
            "type": "town",
            "x": 48.79,
            "y": 18.02,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "aerley",
            "name": "A'erley",
            "type": "town",
            "x": 48.85,
            "y": 23.72,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -48,
            "labelOffsetY": -11,
            "fontStyle": "Normal"
        },
        {
            "id": "staghand",
            "name": "Staghand",
            "type": "town",
            "x": 53.15,
            "y": 25.7,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "stagled",
            "name": "Stagled",
            "type": "poi",
            "x": 53.14,
            "y": 25.29,
            "region": "",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -52,
            "labelOffsetY": 4,
            "opacity": 1
        },
        {
            "id": "everbloom",
            "name": "Mount\nEverbloom",
            "type": "region",
            "x": 47.41,
            "y": 28.3,
            "region": "",
            "description": "Nature",
            "fontFamily": "Penumbra Sans Std",
            "fontSize": 19,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 0.5
        },
        {
            "id": "crossroads-lenshur",
            "name": "crossroads-lenshur",
            "type": "town",
            "x": 52.39,
            "y": 19.4,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "hideLabel": true,
            "fontStyle": "Normal"
        },
        {
            "id": "leterboun",
            "name": "Leterboun",
            "type": "landmark",
            "x": 43.91,
            "y": 32.7,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": -8,
            "opacity": 1
        },
        {
            "id": "raselle",
            "name": "Raselle",
            "type": "small-city",
            "x": 43.36,
            "y": 31.02,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -25,
            "labelOffsetY": -14,
            "fontStyle": "Normal"
        },
        {
            "id": "holderscove",
            "name": "Holder's\nCove",
            "type": "water",
            "x": 42.1,
            "y": 32.8,
            "region": "",
            "description": "Nature",
            "fontFamily": "Quintessential",
            "fontSize": 11,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 21,
            "labelOffsetY": 11,
            "labelAlign": "middle",
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "srenesari",
            "name": "Sren Esari",
            "type": "town",
            "x": 49.93,
            "y": 29.9,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "ormsdal",
            "name": "Ormsdal",
            "type": "town",
            "x": 50.7,
            "y": 24.91,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 5,
            "labelOffsetY": -12,
            "fontStyle": "Normal"
        },
        {
            "id": "syori",
            "name": "Syori",
            "type": "town",
            "x": 48.99,
            "y": 20.8,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 1,
            "labelOffsetY": -10,
            "fontStyle": "Normal"
        },
        {
            "id": "thehighsea",
            "name": "The High Sea",
            "type": "water",
            "x": 42.29,
            "y": 15,
            "region": "",
            "description": "Nature",
            "fontFamily": "Quintessential",
            "fontSize": 30,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "tidelessspan",
            "name": "Tideless\nSpan",
            "type": "water",
            "x": 39.47,
            "y": 34,
            "region": "",
            "description": "Nature",
            "fontFamily": "Quintessential",
            "fontSize": 41,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "oldport",
            "name": "Oldport",
            "type": "small-city",
            "x": 37.94,
            "y": 35.51,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -25,
            "labelOffsetY": -14,
            "fontStyle": "Normal"
        },
        {
            "id": "ingress",
            "name": "Ingriss",
            "type": "city",
            "x": 37.62,
            "y": 31.7,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 25,
            "fontStyle": "Normal"
        },
        {
            "id": "kaldaros",
            "name": "Kaldaros",
            "type": "town",
            "x": 44.8,
            "y": 28.4,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "lasborin",
            "name": "Lasborin",
            "type": "town",
            "x": 46.18,
            "y": 22.9,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 12,
            "fontStyle": "Normal"
        },
        {
            "id": "tegenwaldwilds",
            "name": "Tegenwald\nWilds",
            "type": "nature",
            "x": 49.29,
            "y": 26.4,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 18,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1
        },
        {
            "id": "stinson",
            "name": "Stinson",
            "type": "small-city",
            "x": 43.12,
            "y": 23.71,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -54,
            "labelOffsetY": 0,
            "fontStyle": "Normal"
        },
        {
            "id": "eastmare",
            "name": "Eastmare",
            "type": "town",
            "x": 39.74,
            "y": 30.9,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 12,
            "fontStyle": "Normal"
        },
        {
            "id": "harelbek",
            "name": "Harelbek",
            "type": "small-city",
            "x": 36.44,
            "y": 48.34,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 5,
            "fontStyle": "Normal"
        },
        {
            "id": "braelen",
            "name": "Braelen",
            "type": "town",
            "x": 35.97,
            "y": 44.1,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "serpentsplunge",
            "name": "Serpent's\nPlunge",
            "type": "water",
            "x": 37.19,
            "y": 33.2,
            "region": "",
            "description": "Nature",
            "fontFamily": "Quintessential",
            "fontSize": 15,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "sarbaugh",
            "name": "Sarbaugh",
            "type": "region",
            "x": 46.53,
            "y": 17,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 18,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 0.5,
            "fontStyle": "Normal"
        },
        {
            "id": "aerley-syori-ormsdal-crossroads",
            "name": "aerley-syori-ormsdal-crossroads",
            "type": "town",
            "x": 49.37,
            "y": 23.26,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "hideLabel": true,
            "fontStyle": "Normal"
        },
        {
            "id": "thefowningspine",
            "name": "The Frowning Spine",
            "type": "region",
            "x": 62.03,
            "y": 11.25,
            "region": "",
            "description": "Nature",
            "fontFamily": "Penumbra Sans Std",
            "fontSize": 28,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "rotation": -10,
            "textCurve": -44,
            "opacity": 0.5
        },
        {
            "id": "thebrokendeep",
            "name": "The Broken Deep",
            "type": "water",
            "x": 73,
            "y": 28.46,
            "region": "",
            "description": "Nature",
            "fontFamily": "Quintessential",
            "fontSize": 28,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "everlight",
            "name": "Everlight",
            "type": "town",
            "x": 73.85,
            "y": 66.1,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 14,
            "fontStyle": "Normal"
        },
        {
            "id": "glidderingfalls",
            "name": "Gliddering\nFalls",
            "type": "landmark",
            "x": 72.89,
            "y": 69.49,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 10,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.15,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 7,
            "labelOffsetY": 7,
            "opacity": 1
        },
        {
            "id": "nesbit",
            "name": "Nesbit",
            "type": "town",
            "x": 39.1,
            "y": 29.3,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -50,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "greymill",
            "name": "Greymill",
            "type": "town",
            "x": 40.6,
            "y": 27.3,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -62,
            "labelOffsetY": 9,
            "fontStyle": "Normal"
        },
        {
            "id": "theemburerilocean",
            "name": "The Embueril\nOcean",
            "type": "water",
            "x": 84.7,
            "y": 78.1,
            "region": "",
            "description": "Nature",
            "fontFamily": "Quintessential",
            "fontSize": 81,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1
        },
        {
            "id": "dalasorstrait",
            "name": "Dalasor\nStrait",
            "type": "water",
            "x": 48.1,
            "y": 86.4,
            "region": "",
            "description": "Nature",
            "fontFamily": "Quintessential",
            "fontSize": 24,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "theseaofmarilia",
            "name": "The Sea of Marilia",
            "type": "water",
            "x": 42.64,
            "y": 75.11,
            "region": "",
            "description": "Nature",
            "fontFamily": "Quintessential",
            "fontSize": 30,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "theseaofsondera",
            "name": "The Sea of Sondera",
            "type": "water",
            "x": 37.77,
            "y": 55.2,
            "region": "",
            "description": "Nature",
            "fontFamily": "Quintessential",
            "fontSize": 34,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "thedelisnorocean",
            "name": "The Delisnor\nOcean",
            "type": "water",
            "x": 12,
            "y": 54.39,
            "region": "",
            "description": "Nature",
            "fontFamily": "Quintessential",
            "fontSize": 81,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1
        },
        {
            "id": "midrambay",
            "name": "Midram\nBay",
            "type": "water",
            "x": 20.52,
            "y": 44.49,
            "region": "",
            "description": "Nature",
            "fontFamily": "Quintessential",
            "fontSize": 12,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "bindwatch",
            "name": "Bindwatch",
            "type": "town",
            "x": 21.22,
            "y": 41.31,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -69,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "midrambasin",
            "name": "Midram\nBasin",
            "type": "water",
            "x": 22.47,
            "y": 42.29,
            "region": "",
            "description": "Nature",
            "fontFamily": "Quintessential",
            "fontSize": 10,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "wynspanhills",
            "name": "Wynspan\nHills",
            "type": "nature",
            "x": 21.38,
            "y": 40.1,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 10,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "layden-proth-kilnock-crossroad",
            "name": "layden-proth-kilnock-crossroad",
            "type": "town",
            "x": 22.89,
            "y": 37.52,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "hideLabel": true,
            "fontStyle": "Normal"
        },
        {
            "id": "whistlebay",
            "name": "Whistlebay",
            "type": "water",
            "x": 18.95,
            "y": 33.26,
            "region": "",
            "description": "Nature",
            "fontFamily": "Quintessential",
            "fontSize": 12,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "caldwellriver",
            "name": "Caldwell River",
            "type": "river",
            "x": 23.62,
            "y": 37.14,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "rotation": -53,
            "opacity": 0.8
        },
        {
            "id": "gilburoughtimers",
            "name": "Gilburough\nTimers",
            "type": "nature",
            "x": 25.07,
            "y": 36.6,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 15,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1
        },
        {
            "id": "gilburoughriver",
            "name": "Gilburough River",
            "type": "river",
            "x": 26.89,
            "y": 36.8,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 0.81
        },
        {
            "id": "wehgynriver",
            "name": "Wehgyn River",
            "type": "river",
            "x": 24.65,
            "y": 27.21,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 13,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "rotation": -71,
            "opacity": 0.8
        },
        {
            "id": "frostwellport",
            "name": "Frostwell\nPort",
            "type": "town",
            "x": 21.7,
            "y": 18.6,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -39,
            "labelOffsetY": -18,
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "mountethea",
            "name": "Mount\nEthea",
            "type": "region",
            "x": 23.09,
            "y": 28.64,
            "region": "",
            "description": "Nature",
            "fontFamily": "Penumbra Sans Std",
            "fontSize": 15,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 0.5
        },
        {
            "id": "Kodderl",
            "name": "Kodderl",
            "type": "small-city",
            "x": 21.03,
            "y": 23.78,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -8,
            "labelOffsetY": -13,
            "fontStyle": "Normal"
        },
        {
            "id": "insloe",
            "name": "Insloe",
            "type": "town",
            "x": 22.6,
            "y": 24.14,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -12,
            "labelOffsetY": -12,
            "fontStyle": "Normal"
        },
        {
            "id": "habell",
            "name": "Habell",
            "type": "town",
            "x": 24.6,
            "y": 22.9,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -21,
            "labelOffsetY": -11,
            "fontStyle": "Normal"
        },
        {
            "id": "berest",
            "name": "Berest",
            "type": "town",
            "x": 26.9,
            "y": 24.2,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "dregwaypost",
            "name": "Dregway\nPost",
            "type": "poi",
            "x": 19.7,
            "y": 21.1,
            "region": "",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 15,
            "labelOffsetY": 0,
            "opacity": 1
        },
        {
            "id": "aelspire",
            "name": "Aelspire",
            "type": "region",
            "x": 22.83,
            "y": 21,
            "region": "",
            "description": "Nature",
            "fontFamily": "Penumbra Sans Std",
            "fontSize": 16,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 0.5
        },
        {
            "id": "tovar",
            "name": "Tovar",
            "type": "town",
            "x": 26.56,
            "y": 22.47,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "tovarspan",
            "name": "Tovar Span",
            "type": "poi",
            "x": 26.64,
            "y": 21.2,
            "region": "",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 11,
            "labelOffsetY": 4,
            "opacity": 1
        },
        {
            "id": "pukett",
            "name": "Pukett",
            "type": "town",
            "x": 25.37,
            "y": 20.39,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -47,
            "labelOffsetY": -2,
            "fontStyle": "Normal"
        },
        {
            "id": "urbank",
            "name": "Urbank",
            "type": "landmark",
            "x": 26.9,
            "y": 19.9,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -44,
            "labelOffsetY": -5,
            "opacity": 1
        },
        {
            "id": "aesenfell",
            "name": "Aesenfell",
            "type": "town",
            "x": 24,
            "y": 19,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "frostwold",
            "name": "Frostwold",
            "type": "region",
            "x": 22.95,
            "y": 17.62,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 16,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 0.5
        },
        {
            "id": "solwindglaes",
            "name": "Solwind\nGlaes",
            "type": "town",
            "x": 25.73,
            "y": 16.2,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": -6,
            "fontStyle": "Normal"
        },
        {
            "id": "alconny",
            "name": "Alconny",
            "type": "town",
            "x": 29.95,
            "y": 19,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "whitewood",
            "name": "Whitewood",
            "type": "region",
            "x": 28.37,
            "y": 17.6,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 16,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 0.5
        },
        {
            "id": "thaelshore",
            "name": "Thaelshore",
            "type": "town",
            "x": 15.18,
            "y": 17.6,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -70,
            "labelOffsetY": -6,
            "fontStyle": "Normal"
        },
        {
            "id": "porpen",
            "name": "Porpen",
            "type": "city",
            "x": 13.53,
            "y": 19.8,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.17,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -52,
            "labelOffsetY": -1,
            "fontStyle": "Normal"
        },
        {
            "id": "claymere",
            "name": "Claymere",
            "type": "town",
            "x": 17.79,
            "y": 19.2,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 4,
            "labelOffsetY": -8,
            "fontStyle": "Normal"
        },
        {
            "id": "ruinsofdruegend",
            "name": "Ruins of\nDruegend",
            "type": "poi",
            "x": 17.6,
            "y": 20.3,
            "region": "",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 5,
            "opacity": 1
        },
        {
            "id": "fawrese",
            "name": "Fa'wrese",
            "type": "town",
            "x": 14.64,
            "y": 21.29,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -60,
            "labelOffsetY": 12,
            "fontStyle": "Normal"
        },
        {
            "id": "grobh",
            "name": "Grobh",
            "type": "town",
            "x": 16.02,
            "y": 19.63,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -11,
            "labelOffsetY": 19,
            "fontStyle": "Normal"
        },
        {
            "id": "couleepeninula",
            "name": "Coulee Peninsula",
            "type": "region",
            "x": 16.34,
            "y": 19.01,
            "region": "",
            "description": "Nature",
            "fontFamily": "Penumbra Sans Std",
            "fontSize": 18,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 0.5
        },
        {
            "id": "eusteraridge",
            "name": "Eustera Ridge",
            "type": "region",
            "x": 33.62,
            "y": 23.14,
            "region": "",
            "description": "Nature",
            "fontFamily": "Penumbra Sans Std",
            "fontSize": 42,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "rotation": 13,
            "textCurve": -21,
            "opacity": 0.5
        },
        {
            "id": "bonlightpass",
            "name": "Bonlight\nPass",
            "type": "landmark",
            "x": 30.8,
            "y": 20.5,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": -7,
            "opacity": 1
        },
        {
            "id": "bonfaduhr",
            "name": "Bonfaduhr\n(Oreguard)",
            "type": "small-city",
            "x": 31.4,
            "y": 22.61,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": -7,
            "fontStyle": "Normal"
        },
        {
            "id": "tariat",
            "name": "Tariat",
            "type": "town",
            "x": 30.96,
            "y": 26,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "bronzebellyfort",
            "name": "Bronzebelly\nFort",
            "type": "landmark",
            "x": 31.34,
            "y": 24.3,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": -5,
            "opacity": 1
        },
        {
            "id": "deadwingmountains",
            "name": "Deadwing Mountains",
            "type": "region",
            "x": 29.52,
            "y": 16.02,
            "region": "",
            "description": "Nature",
            "fontFamily": "Penumbra Sans Std",
            "fontSize": 31,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "rotation": 36,
            "textCurve": -48,
            "opacity": 0.5
        },
        {
            "id": "nebendie",
            "name": "Nebendie",
            "type": "town",
            "x": 25.63,
            "y": 12.43,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "avalvein",
            "name": "Avalvein",
            "type": "city",
            "x": 29.06,
            "y": 7.79,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.17,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -55,
            "labelOffsetY": -9,
            "fontStyle": "Normal"
        },
        {
            "id": "blisteredkeep",
            "name": "Blistered\nKeep",
            "type": "landmark",
            "x": 27.8,
            "y": 11.3,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -18,
            "labelOffsetY": -27,
            "opacity": 1
        },
        {
            "id": "seorneasor",
            "name": "Seorneasor\n(Sterwood)",
            "type": "small-city",
            "x": 30.46,
            "y": 8.5,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 5,
            "fontStyle": "Normal"
        },
        {
            "id": "mahralkal",
            "name": "Mah'ralkal",
            "type": "town",
            "x": 29.92,
            "y": 10.6,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 9,
            "labelOffsetY": 17,
            "fontStyle": "Normal"
        },
        {
            "id": "snowlightfort",
            "name": "Snowlight\nFort",
            "type": "landmark",
            "x": 31.39,
            "y": 16.52,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -12,
            "labelOffsetY": -12,
            "labelAlign": "end",
            "opacity": 1
        },
        {
            "id": "icespring",
            "name": "Icespring",
            "type": "small-city",
            "x": 31.8,
            "y": 16.5,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 5,
            "fontStyle": "Normal"
        },
        {
            "id": "fjordnahl",
            "name": "Fjord'nahl",
            "type": "small-city",
            "x": 35.03,
            "y": 13.87,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 5,
            "fontStyle": "Normal"
        },
        {
            "id": "manuspeninsula",
            "name": "Manus Peninsula",
            "type": "region",
            "x": 34.82,
            "y": 10.18,
            "region": "",
            "description": "Nature",
            "fontFamily": "Penumbra Sans Std",
            "fontSize": 18,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "rotation": 47,
            "opacity": 0.5
        },
        {
            "id": "peakoftibul",
            "name": "Peak of Tibul",
            "type": "poi",
            "x": 36.3,
            "y": 23.5,
            "region": "",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -2,
            "labelOffsetY": -10,
            "opacity": 1
        },
        {
            "id": "ashindel",
            "name": "Ashindel",
            "type": "town",
            "x": 33.04,
            "y": 29.06,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -60,
            "labelOffsetY": 8,
            "fontStyle": "Normal"
        },
        {
            "id": "whistgrove",
            "name": "Whistgrove",
            "type": "nature",
            "x": 33.03,
            "y": 26.96,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 17,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1
        },
        {
            "id": "glenleahwoods",
            "name": "Glenleah\nWoods",
            "type": "nature",
            "x": 30.85,
            "y": 31.24,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 17,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1
        },
        {
            "id": "eastmare-greymill-stinson-crossroad",
            "name": "eastmare-greymill-stinson-crossroad",
            "type": "town",
            "x": 40.49,
            "y": 29.6,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "hideLabel": true,
            "fontStyle": "Normal"
        },
        {
            "id": "tibulrise",
            "name": "Tibul Rise",
            "type": "region",
            "x": 37.44,
            "y": 23.93,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 12,
            "fontWeight": "300",
            "markerSize": -0.05,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "rotation": -12,
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "mablihod",
            "name": "Mablihod",
            "type": "town",
            "x": 30.9,
            "y": 33.9,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "tariatriver",
            "name": "Tariat River",
            "type": "river",
            "x": 30.12,
            "y": 25.8,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "rotation": -11,
            "opacity": 0.8
        },
        {
            "id": "bluffsofdunmoore",
            "name": "Bluffs of\nDunmoore",
            "type": "region",
            "x": 33.75,
            "y": 36.99,
            "region": "",
            "description": "Nature",
            "fontFamily": "Penumbra Sans Std",
            "fontSize": 22,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 0.5
        },
        {
            "id": "circleoftrevecs",
            "name": "Circle of\nTrevecs",
            "type": "poi",
            "x": 30.33,
            "y": 36.94,
            "region": "",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -52,
            "labelOffsetY": -12,
            "opacity": 1
        },
        {
            "id": "elondale",
            "name": "Elondale",
            "type": "town",
            "x": 31.43,
            "y": 36.92,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 8,
            "labelOffsetY": -8,
            "fontStyle": "Normal"
        },
        {
            "id": "blackfield",
            "name": "Blackfield",
            "type": "city",
            "x": 32.1,
            "y": 40.17,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -73,
            "labelOffsetY": 5,
            "fontStyle": "Normal"
        },
        {
            "id": "bluffhunt",
            "name": "Bluffhunt",
            "type": "landmark",
            "x": 33.7,
            "y": 36.3,
            "region": "",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 12,
            "labelOffsetY": -9,
            "opacity": 1
        },
        {
            "id": "hennibon",
            "name": "Hennibon",
            "type": "town",
            "x": 34.71,
            "y": 38.97,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 15,
            "fontStyle": "Normal"
        },
        {
            "id": "larnwik",
            "name": "Larnwik",
            "type": "town",
            "x": 33.3,
            "y": 40.7,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 16,
            "fontStyle": "Normal"
        },
        {
            "id": "tinderhill",
            "name": "Tinderhill",
            "type": "region",
            "x": 35.75,
            "y": 42.64,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 17,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 0.7
        },
        {
            "id": "edgewood",
            "name": "Edgewood",
            "type": "nature",
            "x": 36,
            "y": 45.9,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 15,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 1
        },
        {
            "id": "spareway",
            "name": "Spareway",
            "type": "landmark",
            "x": 35.3,
            "y": 44.9,
            "region": "",
            "description": "Nature",
            "fontFamily": "Garamond MT",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -55,
            "labelOffsetY": 0,
            "opacity": 1
        },
        {
            "id": "elspire",
            "name": "Elspire",
            "type": "town",
            "x": 31.77,
            "y": 45.9,
            "region": "",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3
        },
        {
            "id": "greymossswamp",
            "name": "Greymoss\nSwamp",
            "type": "nature",
            "x": 28.08,
            "y": 44.3,
            "region": "",
            "description": "Nature",
            "fontFamily": "Cinzel Decorative",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1
        },
        {
            "id": "kithriver",
            "name": "Kith River",
            "type": "river",
            "x": 28.66,
            "y": 42.92,
            "region": "",
            "description": "Nature",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "rotation": -27,
            "opacity": 0.8
        },
        {
            "id": "denskelber",
            "name": "Denskelber",
            "type": "landmark",
            "x": 26.7,
            "y": 44.03,
            "region": "",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 9,
            "labelOffsetY": 0,
            "opacity": 1
        },
        {
            "id": "carnsby-kith-denskelber-crossroad",
            "name": "carnsby-kith-denskelber-crossroad",
            "type": "town",
            "x": 26.3,
            "y": 45,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "hideLabel": true
        },
        {
            "id": "aelbonforest",
            "name": "Aelbon\nForest",
            "type": "nature",
            "x": 29.5,
            "y": 43.3,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 16,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1
        },
        {
            "id": "theshatteredtites",
            "name": "The Shattered\nTides",
            "type": "water",
            "x": 25,
            "y": 71.5,
            "region": "",
            "description": "",
            "fontFamily": "Quintessential",
            "fontSize": 28,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1
        },
        {
            "id": "celimann",
            "name": "Celimann",
            "type": "small-city",
            "x": 27.37,
            "y": 73.31,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -37,
            "labelOffsetY": 21
        },
        {
            "id": "scalerunhills",
            "name": "Scale Run\nHills",
            "type": "region",
            "x": 31,
            "y": 73.3,
            "region": "",
            "description": "",
            "fontFamily": "Sell Your Soul",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 0.5
        },
        {
            "id": "theseepingmorass",
            "name": "The Seeping\nMorass",
            "type": "nature",
            "x": 32.3,
            "y": 75.4,
            "region": "",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1
        },
        {
            "id": "Mountwick",
            "name": "Mount\nWick",
            "type": "region",
            "x": 35.25,
            "y": 83.17,
            "region": "",
            "description": "",
            "fontFamily": "Penumbra Sans Std",
            "fontSize": 20,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 0.5
        },
        {
            "id": "veinspeartomb",
            "name": "Veinspear Tomb",
            "type": "poi",
            "x": 42.85,
            "y": 87.88,
            "region": "",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -96,
            "labelOffsetY": 10,
            "opacity": 1
        },
        {
            "id": "nanthisahraridge",
            "name": "Nanthisah'ra Ridge",
            "type": "region",
            "x": 41.09,
            "y": 90.34,
            "region": "",
            "description": "",
            "fontFamily": "Penumbra Sans Std",
            "fontSize": 16,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "rotation": 39,
            "textCurve": 35,
            "opacity": 0.5
        },
        {
            "id": "waypoint",
            "name": "Waypoint",
            "type": "town",
            "x": 29.81,
            "y": 45.62,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 12,
            "labelOffsetY": 6
        },
        {
            "id": "kilgrenney",
            "name": "Kilgrenney",
            "type": "town",
            "x": 31.3,
            "y": 42.52,
            "region": "",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -74,
            "labelOffsetY": 3
        },
        {
            "id": "oakrest",
            "name": "Oakrest",
            "type": "landmark",
            "x": 32.53,
            "y": 43.77,
            "region": "",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 14,
            "labelOffsetY": 0,
            "opacity": 1
        },
        {
            "id": "blustery-waste",
            "name": "Blustery\nWaste",
            "type": "region",
            "x": 74.5,
            "y": 65.2,
            "region": "Arbescar",
            "description": "Blustery Waste",
            "fontFamily": "Sell Your Soul",
            "fontSize": 20,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 0.5,
            "fontStyle": "Normal"
        },
        {
            "id": "talbesar",
            "name": "Tal'besar\nRuins",
            "type": "ruins",
            "x": 73.1,
            "y": 64.7,
            "region": "Arbescar",
            "description": "Small Town",
            "link": "https://docs.google.com/document/d/1DiuIO2qtBG5l-wQECq-OqyMS2hc44vLnqJmNPQFi1AA/edit?tab=t.0",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -65,
            "labelOffsetY": -5
        },
        {
            "id": "scarbrook",
            "name": "Scarbrook",
            "type": "town",
            "x": 72.4,
            "y": 67.8,
            "region": "Arbescar",
            "description": "Small Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -65,
            "labelOffsetY": -5,
            "fontStyle": "Normal"
        },
        {
            "id": "eye-of-arbescar",
            "name": "Eye of\nArbescar",
            "type": "water",
            "x": 72.8,
            "y": 68.72,
            "region": "Arbescar",
            "description": "Eye of Arbescar",
            "fontFamily": "Quintessential",
            "fontSize": 12,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "glaspero",
            "name": "Glaspero",
            "type": "town",
            "x": 70.3,
            "y": 68.3,
            "region": "Arbescar",
            "description": "Small Coastal City",
            "cityMap": "city-viewer.html?city=glaspero",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -40,
            "labelOffsetY": -10,
            "fontStyle": "Normal"
        },
        {
            "id": "marrowdale",
            "name": "Marrowdale",
            "type": "capital",
            "x": 70.6,
            "y": 69.7,
            "region": "Arbescar",
            "description": "Capital",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.1,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 10,
            "fontStyle": "Normal"
        },
        {
            "id": "farview",
            "name": "Farview",
            "type": "town",
            "x": 71.9,
            "y": 72.1,
            "region": "Arbescar",
            "description": "Port Town",
            "cityMap": "city-viewer.html?city=farview",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "dire-of-arbescar",
            "name": "Dire of\nArbescar",
            "type": "region",
            "x": 69.4,
            "y": 73.5,
            "region": "Arbescar",
            "description": "Dire of Arbescar",
            "fontFamily": "Sell Your Soul",
            "fontSize": 12,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "nebisill",
            "name": "Nebisill",
            "type": "town",
            "x": 68.25,
            "y": 72.7,
            "region": "Arbescar",
            "description": "Port Town",
            "cityMap": "city-viewer.html?city=nebisill",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -50,
            "labelOffsetY": -5,
            "fontStyle": "Normal"
        },
        {
            "id": "siltbay",
            "name": "Siltbay",
            "type": "water",
            "x": 69,
            "y": 66.52,
            "region": "Arbescar",
            "description": "Port Town",
            "fontFamily": "Quintessential",
            "fontSize": 40,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "longwood",
            "name": "Longwood",
            "type": "nature",
            "x": 71.18,
            "y": 68.75,
            "region": "Arbescar",
            "description": "Forest",
            "fontFamily": "Sell Your Soul",
            "fontSize": 12,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "nebisill-grove",
            "name": "Nebisill\nGrove",
            "type": "nature",
            "x": 69.43,
            "y": 70.91,
            "region": "Arbescar",
            "description": "Grove",
            "fontFamily": "Sell Your Soul",
            "fontSize": 12,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "tomb-of-amberblade",
            "name": "Tomb of\nAmberblade",
            "type": "poi",
            "x": 63.4,
            "y": 61,
            "region": "Baltwood",
            "description": "Tomb",
            "fontFamily": "Simonetta",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 8,
            "labelOffsetY": -4,
            "opacity": 1
        },
        {
            "id": "edgewind",
            "name": "Edgewind",
            "type": "small-city",
            "x": 69.33,
            "y": 61.35,
            "region": "Caristone",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -25,
            "labelOffsetY": -15,
            "fontStyle": "Normal"
        },
        {
            "id": "boldshire",
            "name": "Boldshire",
            "type": "town",
            "x": 67.7,
            "y": 60.2,
            "region": "Caristone",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -25,
            "labelOffsetY": -15,
            "fontStyle": "Normal"
        },
        {
            "id": "caristone-forest",
            "name": "Caristone\nForest",
            "type": "nature",
            "x": 71.09,
            "y": 60.19,
            "region": "Caristone",
            "description": "Woods",
            "fontFamily": "Sell Your Soul",
            "fontSize": 16,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1
        },
        {
            "id": "fakul",
            "name": "Fakul",
            "type": "town",
            "x": 70.2,
            "y": 46.9,
            "region": "Gaelscape",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -27,
            "labelOffsetY": -9,
            "fontStyle": "Normal"
        },
        {
            "id": "igborne",
            "name": "Igburne",
            "type": "town",
            "x": 68.8,
            "y": 46.3,
            "region": "Gaelscape",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -41,
            "labelOffsetY": 17
        },
        {
            "id": "simmerhorn",
            "name": "Simmerhorn",
            "type": "town",
            "x": 66.7,
            "y": 46.8,
            "region": "Gaelscape",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -36,
            "labelOffsetY": 17,
            "fontStyle": "Normal"
        },
        {
            "id": "ulkef",
            "name": "Ulkef",
            "type": "small-city",
            "x": 69.5,
            "y": 48.7,
            "region": "Gaelscape",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -48,
            "labelOffsetY": 1,
            "fontStyle": "Normal"
        },
        {
            "id": "rosevale",
            "name": "Rosevale",
            "type": "town",
            "x": 70.2,
            "y": 49.3,
            "region": "Gaelscape",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -7,
            "labelOffsetY": -9,
            "fontStyle": "Normal"
        },
        {
            "id": "olestack",
            "name": "Ole'stack",
            "type": "town",
            "x": 67.6,
            "y": 45.5,
            "region": "Gaelscape",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -1,
            "labelOffsetY": -11
        },
        {
            "id": "mulshear",
            "name": "Mulshear",
            "type": "town",
            "x": 65.85,
            "y": 74.22,
            "region": "Mulshear",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 5,
            "fontStyle": "Normal"
        },
        {
            "id": "mulbrook",
            "name": "Mulbrook",
            "type": "river",
            "x": 65.4,
            "y": 72.69,
            "region": "Mulshear",
            "description": "Grove",
            "fontFamily": "Simonetta",
            "fontSize": 16,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 0.5
        },
        {
            "id": "multear-swamps",
            "name": "Multear\nSwamps",
            "type": "nature",
            "x": 63.9,
            "y": 75.7,
            "region": "Mulshear",
            "description": "Swamps",
            "fontFamily": "Sell Your Soul",
            "fontSize": 15,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 1
        },
        {
            "id": "bickerfeld",
            "name": "Bickerfeld",
            "type": "town",
            "x": 65.8,
            "y": 70.2,
            "region": "Mulshear",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 5,
            "fontStyle": "Normal"
        },
        {
            "id": "OtesurrMountains",
            "name": "Otesurr\nMountains",
            "type": "region",
            "x": 81.7,
            "y": 25.6,
            "region": "Range of Otesurr",
            "description": "The Otesurr Mountains are a vast mountain range in the far northeast of Myrdae.",
            "fontFamily": "Penumbra Sans Std",
            "fontSize": 20,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "opacity": 0.5
        },
        {
            "id": "lurdoba",
            "name": "Lurdoba",
            "type": "city",
            "x": 77.7,
            "y": 31.7,
            "region": "Range of Otesurr",
            "description": "A tundra city in the far northeast.",
            "fontFamily": "Simonetta",
            "fontSize": 18,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 10,
            "markerOffsetY": 0,
            "labelOffsetX": -2,
            "labelOffsetY": -13,
            "fontStyle": "Normal"
        },
        {
            "id": "kallilos",
            "name": "Kallilos",
            "type": "town",
            "x": 78.3,
            "y": 32.3,
            "region": "Range of Otesurr",
            "description": "A town off the coast of The Broken Deep.",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 12,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "sari-lenora",
            "name": "Sari Lenora",
            "type": "town",
            "x": 77.9,
            "y": 34.4,
            "region": "Range of Otesurr",
            "description": "A rugged northern settlement.",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "clador",
            "name": "Clador",
            "type": "town",
            "x": 77.4,
            "y": 36.3,
            "region": "Range of Otesurr",
            "description": "A rugged mountain settlement.",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "buvero",
            "name": "Buvero",
            "type": "town",
            "x": 76,
            "y": 35.9,
            "region": "Range of Otesurr",
            "description": "A rugged mountain settlement.",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -20,
            "labelOffsetY": -10,
            "fontStyle": "Normal"
        },
        {
            "id": "sulura",
            "name": "Sulura",
            "type": "city",
            "x": 74.34,
            "y": 35.4,
            "region": "Range of Otesurr",
            "description": "A tundra town in the far northeast.",
            "fontFamily": "Simonetta",
            "fontSize": 18,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 10,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "nuwharf",
            "name": "Nuwharf",
            "type": "town",
            "x": 65.55,
            "y": 69.4,
            "region": "Severed Bend",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 5,
            "fontStyle": "Normal"
        },
        {
            "id": "trailpoint",
            "name": "Trailpoint",
            "type": "town",
            "x": 64.7,
            "y": 65.5,
            "region": "Severed Bend",
            "description": "Town",
            "link": "https://docs.google.com/document/d/1fhbQ8CwQYQ7D055Y0pOuxjnBlbhu3zEqUR4rVGeRHuo/edit?tab=t.0",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 5,
            "labelOffsetY": 16,
            "fontStyle": "Normal"
        },
        {
            "id": "farnsby-port",
            "name": "Farnsby\nPort",
            "type": "town",
            "x": 63.67,
            "y": 65.4,
            "region": "Severed Bend",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -30,
            "labelOffsetY": 15,
            "fontStyle": "Normal"
        },
        {
            "id": "bistron",
            "name": "Bistron",
            "type": "town",
            "x": 66.6,
            "y": 64,
            "region": "Severed Bend",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 5,
            "fontStyle": "Normal"
        },
        {
            "id": "sunbay",
            "name": "Sunbay",
            "type": "town",
            "x": 73.6,
            "y": 37.1,
            "region": "The Mahruud",
            "description": "A coastal settlement.",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "sands-of-the-dead",
            "name": "Sands of the\nDead",
            "type": "region",
            "x": 74.48,
            "y": 39.04,
            "region": "The Mahruud",
            "description": "Sands of the Dead",
            "fontFamily": "Sell Your Soul",
            "fontSize": 16,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "labelAlign": "middle",
            "opacity": 0.5,
            "fontStyle": "Normal"
        },
        {
            "id": "boneforge",
            "name": "Boneforge",
            "type": "town",
            "x": 73.3,
            "y": 41.2,
            "region": "The Mahruud",
            "description": "A coastal settlement.",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -5,
            "labelOffsetY": -10,
            "fontStyle": "Normal"
        },
        {
            "id": "deadfield",
            "name": "Deadfield",
            "type": "small-city",
            "x": 74.8,
            "y": 42,
            "region": "The Mahruud",
            "description": "A coastal settlement.",
            "fontFamily": "Simonetta",
            "fontSize": 18,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 15,
            "fontStyle": "Normal"
        },
        {
            "id": "torpoint",
            "name": "Torpoint",
            "type": "town",
            "x": 74.1,
            "y": 42.8,
            "region": "The Mahruud",
            "description": "A coastal settlement.",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -47,
            "labelOffsetY": -10,
            "fontStyle": "Normal"
        },
        {
            "id": "gunikk",
            "name": "Gunikk",
            "type": "town",
            "x": 74.6,
            "y": 45,
            "region": "The Mahruud",
            "description": "Small Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "thrargael",
            "name": "Thrargael",
            "type": "capital",
            "x": 74.95,
            "y": 47.6,
            "region": "The Mahruud",
            "description": "Capital of the Kingdom of Myrdae",
            "fontFamily": "Simonetta",
            "fontSize": 18,
            "fontWeight": "300",
            "markerSize": 0.13,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 16,
            "fontStyle": "Normal"
        },
        {
            "id": "ancientarena",
            "name": "Ancient\nArena",
            "type": "poi",
            "x": 76.7,
            "y": 43.8,
            "region": "The Mahruud",
            "description": "Capital of the Kingdom of Myrdae",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -45,
            "labelOffsetY": -16
        },
        {
            "id": "blistered-highland",
            "name": "Blistered Highland",
            "type": "region",
            "x": 77.35,
            "y": 45.2,
            "region": "The Mahruud",
            "description": "Blistered Highland",
            "fontFamily": "Sell Your Soul",
            "fontSize": 15,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 0.5
        },
        {
            "id": "nalt",
            "name": "Nalt",
            "type": "town",
            "x": 78.5,
            "y": 43.5,
            "region": "The Mahruud",
            "description": "Small Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -35,
            "labelOffsetY": 0,
            "fontStyle": "Normal"
        },
        {
            "id": "the-withered-spire",
            "name": "The\nWithered Spire",
            "type": "poi",
            "x": 77.8,
            "y": 47.2,
            "region": "The Mahruud",
            "description": "Capital of the Kingdom of Myrdae",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3
        },
        {
            "id": "runest",
            "name": "Runest",
            "type": "town",
            "x": 75.5,
            "y": 49.5,
            "region": "The Mahruud",
            "description": "Small Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -45,
            "labelOffsetY": -1,
            "fontStyle": "Normal"
        },
        {
            "id": "cragflight",
            "name": "Cragflight",
            "type": "poi",
            "x": 75.4,
            "y": 50.9,
            "region": "The Mahruud",
            "description": "",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -25,
            "labelOffsetY": 18
        },
        {
            "id": "severyll",
            "name": "Severyll",
            "type": "town",
            "x": 77.15,
            "y": 53.65,
            "region": "The Mahruud",
            "description": "Small Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -55,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "irebend",
            "name": "Ire'bend",
            "type": "town",
            "x": 78.1,
            "y": 53.1,
            "region": "The Mahruud",
            "description": "Small Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 12,
            "labelOffsetY": -5,
            "fontStyle": "Normal"
        },
        {
            "id": "bareford",
            "name": "Bareford",
            "type": "town",
            "x": 79.2,
            "y": 54.9,
            "region": "The Mahruud",
            "description": "Small Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -65,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "porthbay",
            "name": "Porthbay",
            "type": "town",
            "x": 80.8,
            "y": 56.2,
            "region": "The Mahruud",
            "description": "Small Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -15,
            "labelOffsetY": -15,
            "fontStyle": "Normal"
        },
        {
            "id": "dragonstone",
            "name": "Dragonstone",
            "type": "poi",
            "x": 78.7,
            "y": 57.7,
            "region": "The Mahruud",
            "description": "Small Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -35,
            "labelOffsetY": 15
        },
        {
            "id": "dragonspine-mountains",
            "name": "Dragonspine Mountains",
            "type": "region",
            "x": 74,
            "y": 57.62,
            "region": "The Mahruud",
            "description": "Dragonspine Mountains",
            "fontFamily": "Penumbra Sans Std",
            "fontSize": 24,
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "rotation": 11,
            "opacity": 0.5,
            "fontStyle": "Normal"
        },
        {
            "id": "deepspring",
            "name": "Deepspring",
            "type": "town",
            "x": 72.5,
            "y": 43.6,
            "region": "The Mahruud",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -5,
            "labelOffsetY": 20,
            "fontStyle": "Normal"
        },
        {
            "id": "ngundeer",
            "name": "N'gundeer",
            "type": "town",
            "x": 71.8,
            "y": 45.9,
            "region": "The Mahruud",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontStyle": "Normal"
        },
        {
            "id": "kylnn",
            "name": "Kylnn",
            "type": "town",
            "x": 73.6,
            "y": 48.4,
            "region": "The Mahruud",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -41,
            "labelOffsetY": 10,
            "fontStyle": "Normal"
        },
        {
            "id": "searing-flats",
            "name": "Searing\nFlats",
            "type": "region",
            "x": 72.77,
            "y": 47.79,
            "region": "The Mahruud",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 12,
            "fontWeight": "300",
            "markerSize": 1,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 0.5,
            "fontStyle": "Normal"
        },
        {
            "id": "jagged-waste-crags",
            "name": "Jagged Waste Crags",
            "type": "region",
            "x": 73.37,
            "y": 49.4,
            "region": "The Mahruud",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 36,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 1,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "rotation": -95,
            "textCurve": -50,
            "opacity": 0.4
        },
        {
            "id": "sandgrave",
            "name": "Sandgrave",
            "type": "town",
            "x": 72.3,
            "y": 51.5,
            "region": "The Mahruud",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -6,
            "labelOffsetY": -14,
            "fontStyle": "Normal"
        },
        {
            "id": "silvermead-knolls",
            "name": "Silvermead\nKnolls",
            "type": "region",
            "x": 64.09,
            "y": 71.06,
            "region": "Theamis",
            "description": "Knolls",
            "fontFamily": "Sell Your Soul",
            "fontSize": 15,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 0.7
        },
        {
            "id": "hillside-woods",
            "name": "Hillside\nWoods",
            "type": "nature",
            "x": 61.97,
            "y": 73.66,
            "region": "Theamis",
            "description": "Woods",
            "fontFamily": "Sell Your Soul",
            "fontSize": 15,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 1
        },
        {
            "id": "silvermead",
            "name": "Silvermead",
            "type": "town",
            "x": 62.7,
            "y": 69.7,
            "region": "Theamis",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 5,
            "fontStyle": "Normal"
        },
        {
            "id": "eldeff",
            "name": "Eldeff",
            "type": "town",
            "x": 60.2,
            "y": 69.35,
            "region": "Theamis",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 5,
            "fontStyle": "Normal"
        },
        {
            "id": "adamont",
            "name": "Adamont",
            "type": "small-city",
            "x": 61.13,
            "y": 66.35,
            "region": "Theamis",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "markerSize": 0.2,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -62,
            "labelOffsetY": 5,
            "fontStyle": "Normal"
        },
        {
            "id": "ahnassa",
            "name": "Ahnassa",
            "type": "town",
            "x": 72.9,
            "y": 38.2,
            "region": "Yearning Vale",
            "description": "A coastal settlement.",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 15
        },
        {
            "id": "hesfal",
            "name": "Hesfal",
            "type": "town",
            "x": 71.8,
            "y": 40.5,
            "region": "Yearning Vale",
            "description": "A coastal settlement.",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -48,
            "labelOffsetY": 9
        },
        {
            "id": "sulport",
            "name": "Sulport",
            "type": "town",
            "x": 71,
            "y": 38.2,
            "region": "Yearning Vale",
            "description": "A coastal settlement.",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": -10
        },
        {
            "id": "ripshod-bay",
            "name": "Ripshod Bay",
            "type": "water",
            "x": 72.11,
            "y": 37.13,
            "region": "Yearning Vale",
            "description": "Ripshod Bay",
            "fontFamily": "Quintessential",
            "fontSize": 18,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 1
        },
        {
            "id": "tratta",
            "name": "Tratta",
            "type": "city",
            "x": 70.6,
            "y": 35.9,
            "region": "Yearning Vale",
            "description": "Tratta stands as one of the great maritime cities of Myrdae, a vast port capital of the Yearning Vale and a central artery of trade along the Broken Deep.",
            "link": "https://docs.google.com/document/d/1nbv3ZA-BTR3i1qT535PrR0A3sFHzOuxeYAmXDD83TwY/edit?tab=t.0",
            "cityMap": "city-viewer.html?city=tratta",
            "fontFamily": "Simonetta",
            "fontSize": 18,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.2,
            "markerOffsetX": 11,
            "markerOffsetY": 0,
            "labelOffsetX": -20,
            "labelOffsetY": -13
        },
        {
            "id": "del-bris",
            "name": "Del'Bris",
            "type": "town",
            "x": 70.3,
            "y": 38.7,
            "region": "Yearning Vale",
            "description": "Ripshod Bay",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 5,
            "labelOffsetY": 16
        },
        {
            "id": "yearning-slough",
            "name": "Yearning\nSlough",
            "type": "region",
            "x": 69.6,
            "y": 38.2,
            "region": "Yearning Vale",
            "description": "Yearning Slough",
            "fontFamily": "Sell Your Soul",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "labelAlign": "middle",
            "opacity": 0.5
        },
        {
            "id": "greenvale",
            "name": "Greenvale",
            "type": "town",
            "x": 69.5,
            "y": 40.5,
            "region": "Yearning Vale",
            "description": "Ripshod Bay",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 1,
            "labelOffsetY": 16
        },
        {
            "id": "lehnthruakk",
            "name": "Lehnthru'akk",
            "type": "town",
            "x": 68.8,
            "y": 39.3,
            "region": "Yearning Vale",
            "description": "Ripshod Bay",
            "link": "https://docs.google.com/document/d/1OMJ-Jq5iTfG6oabmr79bWLPphvwfWL_xM2qEPPPjamE/edit?tab=t.0",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -82,
            "labelOffsetY": 9
        },
        {
            "id": "zovraesdrias-hollow",
            "name": "Zovraesdria's\nHollow",
            "type": "poi",
            "x": 68.3,
            "y": 38.8,
            "region": "Yearning Vale",
            "description": "Point of Interest",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -60,
            "labelOffsetY": -16,
            "opacity": 1
        },
        {
            "id": "scarwatch-hold",
            "name": "Scarwatch\nHold",
            "type": "poi",
            "x": 71.6,
            "y": 42.4,
            "region": "Yearning Vale",
            "description": "Point of Interest",
            "link": "https://docs.google.com/document/d/1U1YgTimFZtG1VsC4fjWoh1wVCxGGdokU4peu8hh6jx8/edit?tab=t.0",
            "cityMap": "city-viewer.html?city=scarwatch-hold",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -67,
            "labelOffsetY": 4,
            "opacity": 1
        },
        {
            "id": "edgerest-forest",
            "name": "Edgerest\nForest",
            "type": "nature",
            "x": 68.8,
            "y": 43.51,
            "region": "Yearning Vale",
            "description": "Nature",
            "fontFamily": "Sell Your Soul",
            "fontSize": 17,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 1
        },
        {
            "id": "wuldrif",
            "name": "Wuldrif",
            "type": "town",
            "x": 67.7,
            "y": 41.6,
            "region": "Yearning Vale",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -5,
            "labelOffsetY": 18
        },
        {
            "id": "alburest",
            "name": "Alburest",
            "type": "small-city",
            "x": 66.83,
            "y": 42.8,
            "region": "Yearning Vale",
            "description": "Town",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Normal",
            "markerSize": 0.2,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 8,
            "labelOffsetY": 10
        },
        {
            "id": "brokenflow",
            "name": "Brokenflow",
            "type": "river",
            "x": 67.75,
            "y": 41.19,
            "region": "Yearning Vale",
            "description": "Nature",
            "fontFamily": "Simonetta",
            "fontSize": 11,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "rotation": -35,
            "opacity": 0.8
        }
    ],
    "roads": [
        {
            "id": "lurdoba-road",
            "type": "minor",
            "curved": true,
            "points": [
                "lurdoba",
                [
                    78.2,
                    31.8
                ],
                [
                    78.35,
                    32
                ],
                "kallilos"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "kallilos-road",
            "type": "minor",
            "curved": true,
            "points": [
                "kallilos",
                [
                    78.3,
                    32.85
                ],
                [
                    78.4,
                    33.6
                ],
                "sari-lenora"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "sari-lenora-road",
            "type": "minor",
            "curved": true,
            "points": [
                "sari-lenora",
                [
                    77.9,
                    34.9
                ],
                [
                    77.8,
                    36
                ],
                "clador"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "clador-road-1",
            "type": "minor",
            "curved": true,
            "points": [
                "clador",
                [
                    77.2,
                    36.1
                ],
                [
                    76.9,
                    36.2
                ],
                [
                    76.6,
                    36
                ],
                "buvero"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "clador-road-south",
            "type": "minor",
            "curved": true,
            "name": "The Verisle Pass",
            "fontSize": 12,
            "points": [
                "clador",
                [
                    77.55,
                    37.4
                ],
                [
                    77.1,
                    38.5
                ],
                [
                    77.3,
                    40.2
                ],
                [
                    77.2,
                    41
                ],
                [
                    76.9,
                    41.8
                ],
                [
                    75.8,
                    41.6
                ],
                "deadfield"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "buvero-road",
            "type": "minor",
            "curved": true,
            "points": [
                "buvero",
                [
                    75.7,
                    36.1
                ],
                [
                    75.3,
                    35.6
                ],
                [
                    74.8,
                    36.3
                ],
                "sulura"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "sunbay-road",
            "type": "minor",
            "curved": true,
            "points": [
                "sunbay",
                [
                    73.7,
                    38
                ],
                "ahnassa"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "ahnassa-road",
            "type": "minor",
            "curved": true,
            "points": [
                "ahnassa",
                [
                    72.7,
                    38.6
                ],
                [
                    72.6,
                    39.7
                ],
                "hesfal"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "hesfal-road",
            "type": "major",
            "curved": true,
            "points": [
                "hesfal",
                [
                    71.8,
                    40
                ],
                [
                    71.7,
                    38.8
                ],
                "sulport"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "deadfield-road-northeast",
            "type": "major",
            "curved": true,
            "points": [
                "deadfield",
                [
                    74.8,
                    41.5
                ],
                [
                    74.1,
                    40.9
                ],
                "boneforge"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "boneforge-road",
            "type": "major",
            "curved": true,
            "name": "Tor\\nMarch",
            "fontSize": 12,
            "labelReverse": true,
            "points": [
                "boneforge",
                [
                    73.1,
                    41.3
                ],
                [
                    72.3,
                    41.1
                ],
                "hesfal"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "deadfield-road-southeast",
            "type": "minor",
            "curved": true,
            "points": [
                "deadfield",
                [
                    74.5,
                    42.4
                ],
                "torpoint"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "deadfield-road-south",
            "type": "major",
            "curved": true,
            "points": [
                "deadfield",
                [
                    75.4,
                    42.9
                ],
                "gunikk"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "ginikk-road",
            "type": "major",
            "curved": true,
            "points": [
                "gunikk",
                [
                    74.6,
                    46.2
                ],
                "thrargael"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "thrargael-road-northwest",
            "type": "minor",
            "curved": true,
            "points": [
                "thrargael",
                [
                    75.6,
                    47.3
                ],
                [
                    75.6,
                    46.8
                ],
                [
                    76.1,
                    46.1
                ],
                [
                    76.8,
                    43.7
                ],
                [
                    78.1,
                    44.4
                ],
                "nalt"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "torpoint-road",
            "type": "minor",
            "curved": true,
            "points": [
                "torpoint",
                [
                    74.1,
                    43.2
                ],
                [
                    73.4,
                    43.2
                ],
                "deepspring"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "deepspring-road",
            "type": "minor",
            "curved": true,
            "points": [
                "deepspring",
                [
                    72.3,
                    44
                ],
                [
                    72.1,
                    45
                ],
                "ngundeer"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "ngundeer-road",
            "type": "minor",
            "curved": true,
            "points": [
                "ngundeer",
                [
                    71.8,
                    46.1
                ],
                [
                    70.8,
                    46.3
                ],
                "fakul"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "hesfal-road-south",
            "type": "minor",
            "curved": true,
            "points": [
                "hesfal",
                [
                    71.4,
                    41.7
                ],
                "scarwatch-hold"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "ngundeer-road-south",
            "type": "minor",
            "curved": true,
            "points": [
                "ngundeer",
                [
                    71.8,
                    46.5
                ],
                [
                    73.5,
                    46.9
                ],
                "kylnn"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "sulport-road-north",
            "type": "major",
            "curved": true,
            "points": [
                "sulport",
                [
                    70.5,
                    37.3
                ],
                "tratta"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "tratta-road",
            "type": "major",
            "curved": true,
            "fontFamily": "Simonetta",
            "fontStyle": "Italic",
            "points": [
                "del-bris",
                [
                    70.9,
                    37.9
                ],
                [
                    70.74,
                    37.14
                ],
                [
                    70.67,
                    36.53
                ],
                "tratta"
            ]
        },
        {
            "id": "delbris-road",
            "type": "major",
            "curved": true,
            "points": [
                "del-bris",
                [
                    70.1,
                    39.3
                ],
                "greenvale"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "greenvale-road",
            "type": "major",
            "curved": true,
            "name": "Deep Route",
            "fontSize": 10,
            "labelReverse": true,
            "points": [
                "greenvale",
                [
                    69.3,
                    40.8
                ],
                [
                    68.2,
                    41
                ],
                "wuldrif"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "wuldrif-road-east",
            "type": "major",
            "curved": true,
            "points": [
                "wuldrif",
                [
                    67.5,
                    42.1
                ],
                "alburest"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "alburest-road",
            "type": "minor",
            "curved": true,
            "points": [
                "alburest",
                [
                    66.9,
                    44.1
                ],
                "olestack"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "olestack-road-southeast",
            "type": "minor",
            "curved": true,
            "points": [
                "olestack",
                [
                    67.7,
                    45.7
                ],
                "igborne"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "igburne-road",
            "type": "minor",
            "curved": true,
            "points": [
                "igborne",
                [
                    69.4,
                    46.5
                ],
                "ulkef"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "olestack-road-southwest",
            "type": "minor",
            "curved": true,
            "points": [
                "olestack",
                [
                    67.3,
                    46.9
                ],
                "simmerhorn"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "ulkef-road",
            "type": "major",
            "curved": true,
            "points": [
                "ulkef",
                [
                    69.6,
                    49.2
                ],
                "rosevale"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "thrargael-road-south",
            "type": "minor",
            "curved": true,
            "points": [
                "thrargael",
                [
                    74.7,
                    47.8
                ],
                "runest"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "rosevale-road-east",
            "type": "major",
            "curved": true,
            "points": [
                "rosevale",
                [
                    71.2,
                    49.2
                ],
                [
                    71.5,
                    51.1
                ],
                "sandgrave"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "sandgrave-road-east",
            "type": "major",
            "curved": true,
            "points": [
                "sandgrave",
                [
                    73.6,
                    51.9
                ],
                "runest"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "runest-road-south",
            "type": "minor",
            "curved": true,
            "points": [
                "runest",
                [
                    75.8,
                    50
                ],
                "cragflight"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "runest-road-southeast",
            "type": "minor",
            "curved": true,
            "points": [
                "runest",
                [
                    76.3,
                    50.2
                ],
                [
                    76.4,
                    52.3
                ],
                [
                    76.9,
                    53.2
                ],
                "severyll"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "severyll-road",
            "type": "minor",
            "curved": true,
            "points": [
                "severyll",
                [
                    77.6,
                    54
                ],
                [
                    77.9,
                    53.7
                ],
                [
                    78.3,
                    53.9
                ],
                "irebend"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "ire'bend-road",
            "type": "minor",
            "curved": true,
            "points": [
                "irebend",
                [
                    78.4,
                    53.4
                ],
                [
                    79.6,
                    54.5
                ],
                "bareford"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "bareford-road",
            "type": "minor",
            "curved": true,
            "points": [
                "bareford",
                [
                    79.9,
                    54.8
                ],
                [
                    80.4,
                    56.5
                ],
                "porthbay"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "rosevale-road-south",
            "type": "minor",
            "curved": true,
            "points": [
                "rosevale",
                [
                    70,
                    49.9
                ],
                [
                    70.3,
                    50.6
                ],
                "destons-outpost"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "destonsoutpost-road-east",
            "type": "minor",
            "curved": true,
            "points": [
                "destons-outpost",
                [
                    70.3,
                    51.5
                ],
                [
                    71.1,
                    52.5
                ],
                "sandgrave"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "destonsoutpost-road-south",
            "type": "minor",
            "curved": true,
            "points": [
                "destons-outpost",
                [
                    69.9,
                    51.7
                ],
                [
                    69.7,
                    53.1
                ],
                "staghaven"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "middock-road",
            "type": "minor",
            "curved": true,
            "points": [
                "mid-dock",
                [
                    68.1,
                    52.2
                ],
                "willow-lodge"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "willowlodge-road",
            "type": "minor",
            "curved": true,
            "points": [
                "willow-lodge",
                [
                    67.8,
                    53.4
                ],
                [
                    67.9,
                    54.6
                ],
                "tynevale"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "boldshire-road",
            "type": "minor",
            "curved": true,
            "points": [
                "boldshire",
                [
                    68.7,
                    60.7
                ],
                "crossroad-boldshire-edgewind-bistron"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "cross-road-1",
            "type": "minor",
            "curved": true,
            "points": [
                "crossroad-boldshire-edgewind-bistron",
                [
                    68.2,
                    61.6
                ],
                [
                    67.6,
                    63.5
                ],
                "bistron"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "edgewind-road",
            "type": "minor",
            "curved": true,
            "points": [
                "edgewind",
                [
                    68.9,
                    61.4
                ],
                "crossroad-boldshire-edgewind-bistron"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "bistron-road-east",
            "type": "minor",
            "curved": true,
            "points": [
                "bistron",
                [
                    66,
                    63.9
                ],
                [
                    65.5,
                    65.6
                ],
                "trailpoint"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "trailpoint-road",
            "type": "minor",
            "curved": true,
            "points": [
                "trailpoint",
                [
                    64.2,
                    65.6
                ],
                "farnsby-port"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "trailpoint-road-south",
            "type": "minor",
            "curved": true,
            "points": [
                "trailpoint",
                [
                    64.6,
                    66.7
                ],
                [
                    65.8,
                    68.2
                ],
                "nuwharf"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "talbesar-road",
            "type": "minor",
            "curved": true,
            "points": [
                "talbesar",
                [
                    72.8,
                    64.9
                ],
                [
                    73.1,
                    67.1
                ],
                "scarbrook"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "scarbrook-road",
            "type": "major",
            "curved": true,
            "points": [
                "scarbrook",
                [
                    72.1,
                    68.7
                ],
                [
                    71.5,
                    68.9
                ],
                "marrowdale"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "glaspero-road",
            "type": "minor",
            "curved": true,
            "points": [
                "glaspero",
                [
                    70.8,
                    68.8
                ],
                "marrowdale"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "farview-road",
            "type": "minor",
            "curved": true,
            "points": [
                "farview",
                [
                    71.9,
                    70.9
                ],
                [
                    70.8,
                    70.4
                ],
                "marrowdale"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "nebisill-road",
            "type": "minor",
            "curved": true,
            "points": [
                "nebisill",
                [
                    68.7,
                    71.2
                ],
                [
                    70.8,
                    70.6
                ],
                "marrowdale"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "mulshear-road",
            "type": "minor",
            "curved": true,
            "points": [
                "mulshear",
                [
                    66.7,
                    73.2
                ],
                [
                    65.6,
                    71.1
                ],
                "bickerfeld"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "bickerfeld-road",
            "type": "minor",
            "curved": true,
            "points": [
                "bickerfeld",
                [
                    65.3,
                    70.6
                ],
                [
                    64.5,
                    69.2
                ],
                [
                    63.7,
                    69.1
                ],
                [
                    63.1,
                    69.8
                ],
                "silvermead"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "silvermead-road",
            "type": "minor",
            "curved": true,
            "points": [
                "silvermead",
                [
                    62.3,
                    69.7
                ],
                [
                    61,
                    71
                ],
                "eldeff"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "ulgrey-road-southeast",
            "type": "minor",
            "curved": true,
            "points": [
                "ulgrey",
                [
                    62.09,
                    60.98
                ],
                [
                    61.94,
                    62.56
                ],
                "harbok"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "ulgrey-road-southwest",
            "type": "minor",
            "curved": true,
            "name": "South\\nKahlbit Trace",
            "fontSize": 10,
            "points": [
                "ulgrey",
                [
                    63.43,
                    61.2
                ],
                [
                    63.33,
                    63.01
                ],
                [
                    65.14,
                    63.97
                ],
                "trailpoint"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "ulgrey-road-northeast",
            "type": "major",
            "curved": true,
            "points": [
                "ulgrey",
                [
                    62.94,
                    59.81
                ],
                [
                    64.51,
                    59.91
                ],
                [
                    64.48,
                    57.45
                ],
                "dunduar"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "wuldrif-road-west",
            "type": "minor",
            "curved": true,
            "points": [
                "wuldrif",
                [
                    67.29,
                    40.76
                ],
                [
                    66.45,
                    41.25
                ],
                [
                    65.4,
                    40.54
                ],
                [
                    64.69,
                    41.09
                ],
                "ghogam"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "ofwood-road",
            "type": "minor",
            "curved": true,
            "points": [
                "ofwood",
                [
                    64.99,
                    39.75
                ],
                "offwood-crossroad"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "crulfeld-road-northwest",
            "type": "major",
            "curved": true,
            "points": [
                "crulfeld",
                [
                    64.79,
                    41.72
                ],
                "ghogam"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "ghogam-road",
            "type": "major",
            "curved": true,
            "points": [
                "ghogam",
                [
                    63.9,
                    40.78
                ],
                "wrynn"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "wrynn-road",
            "type": "major",
            "curved": true,
            "points": [
                "wrynn",
                [
                    63.32,
                    40.87
                ],
                "stouhg"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "mirstone-road",
            "type": "minor",
            "curved": true,
            "points": [
                "mirstone",
                [
                    64.03,
                    42.92
                ],
                [
                    65,
                    43.4
                ],
                "crulfeld"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "simmerhorn-road-west",
            "type": "minor",
            "curved": true,
            "points": [
                "simmerhorn",
                [
                    66.25,
                    46.65
                ],
                [
                    65.59,
                    45.5
                ],
                "silverhill"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "silverhill-road",
            "type": "minor",
            "curved": true,
            "points": [
                "silverhill",
                [
                    64.28,
                    45.41
                ],
                [
                    63.72,
                    46.6
                ],
                "gur-madihl"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "emberstran-road-east",
            "type": "major",
            "curved": true,
            "name": "Glimmercoast Way",
            "fontFamily": "Simonetta",
            "fontSize": 13,
            "labelOffset": 31,
            "labelSide": "bottom",
            "labelReverse": true,
            "points": [
                "emberstran",
                [
                    60.72,
                    57.14
                ],
                [
                    59.52,
                    57.12
                ],
                [
                    59.35,
                    58.22
                ],
                [
                    58.22,
                    58.37
                ],
                "ahndashere"
            ],
            "fontStyle": "Italic"
        },
        {
            "id": "emberstan-road-north",
            "type": "minor",
            "curved": true,
            "fontFamily": "Simonetta",
            "fontSize": 13,
            "points": [
                "emberstran",
                [
                    60.63,
                    56.1
                ],
                "stonetrace"
            ],
            "fontStyle": "Italic"
        },
        {
            "id": "stonetrace-road",
            "type": "minor",
            "curved": true,
            "name": "North Kahlbit\\nTrace",
            "fontFamily": "Simonetta",
            "fontSize": 13,
            "labelReverse": true,
            "points": [
                "stonetrace",
                [
                    58.25,
                    56.24
                ],
                [
                    57.48,
                    52.95
                ],
                "lasdale"
            ],
            "fontStyle": "Italic"
        },
        {
            "id": "lasdale-road-south",
            "type": "minor",
            "curved": true,
            "fontFamily": "Simonetta",
            "fontSize": 13,
            "points": [
                "lasdale",
                [
                    57.13,
                    53.72
                ],
                [
                    57.31,
                    54.79
                ],
                "glofdale"
            ],
            "fontStyle": "Italic"
        },
        {
            "id": "glofdale-road",
            "type": "minor",
            "curved": true,
            "fontFamily": "Simonetta",
            "fontSize": 13,
            "points": [
                "glofdale",
                [
                    57.11,
                    56.4
                ],
                "crosswind"
            ],
            "fontStyle": "Italic"
        },
        {
            "id": "ahndashere-road",
            "type": "major",
            "curved": true,
            "fontFamily": "Simonetta",
            "fontSize": 13,
            "points": [
                "ahndashere",
                [
                    57.36,
                    57.31
                ],
                "crosswind"
            ],
            "fontStyle": "Italic"
        },
        {
            "id": "crosswind-road",
            "type": "major",
            "curved": true,
            "points": [
                "crosswind",
                [
                    55.68,
                    57.64
                ],
                "flatgarde"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "mistforge-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "mistforge",
                [
                    57.56,
                    49.7
                ],
                "castle-montavein"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "mistforge-road-west",
            "type": "minor",
            "curved": true,
            "name": "Seelie Pass",
            "fontSize": 12,
            "labelOffset": 40,
            "labelReverse": true,
            "points": [
                "mistforge",
                [
                    56.74,
                    50.59
                ],
                "severdale"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "mistforge-road-south",
            "type": "minor",
            "curved": true,
            "points": [
                "mistforge",
                [
                    57.38,
                    51.4
                ],
                [
                    57.41,
                    52.27
                ],
                [
                    57.24,
                    52.54
                ],
                "lasdale"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "driftbend-road",
            "type": "minor",
            "curved": true,
            "fontSize": 12,
            "points": [
                "driftbend",
                [
                    59.26,
                    74.52
                ],
                [
                    58.81,
                    73.12
                ],
                "terandell"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "terandell-road",
            "type": "minor",
            "curved": true,
            "fontSize": 12,
            "points": [
                "terandell",
                [
                    57.77,
                    72.97
                ],
                [
                    57.21,
                    73.87
                ],
                "brokenfall"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "culburn-road",
            "type": "minor",
            "curved": true,
            "points": [
                "culburn",
                [
                    58.25,
                    66.82
                ],
                "next-to-glimmerstone-location"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "glimmerstone-road",
            "type": "minor",
            "curved": true,
            "points": [
                "glimmerstone",
                [
                    57.1,
                    64.72
                ],
                "next-to-glimmerstone-location"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "glimmerstone-unnamed-road-1",
            "type": "minor",
            "curved": true,
            "points": [
                "next-to-glimmerstone-location",
                [
                    57.06,
                    65.84
                ],
                [
                    56.58,
                    66.07
                ],
                "next-to-glimmerstone-location-1"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "unnamed-road-2",
            "type": "minor",
            "curved": true,
            "points": [
                "next-to-glimmerstone-location-1",
                [
                    55.92,
                    65.43
                ],
                "next-to-glimmerstone-location-3"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "nurador-road-northwest",
            "type": "minor",
            "curved": true,
            "points": [
                "nurador",
                [
                    54.96,
                    66.59
                ],
                [
                    55.57,
                    66.05
                ],
                "next-to-glimmerstone-location-3"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "nurador-road-northeast",
            "type": "minor",
            "curved": true,
            "points": [
                "nurador",
                [
                    55.47,
                    66.91
                ],
                [
                    56.06,
                    66.75
                ],
                "next-to-glimmerstone-location-1"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "paendley-road-east",
            "type": "minor",
            "curved": true,
            "points": [
                "paendley",
                [
                    54.19,
                    63.69
                ],
                [
                    54.26,
                    65.33
                ],
                [
                    55.06,
                    64.95
                ],
                "next-to-glimmerstone-location-3"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "nurador-road-southeast",
            "type": "minor",
            "curved": true,
            "points": [
                "nurador",
                [
                    55.25,
                    68.65
                ],
                [
                    56.18,
                    69.29
                ],
                [
                    56.01,
                    71.04
                ],
                "unknown-location-11"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "brokenfall-road",
            "type": "minor",
            "curved": true,
            "points": [
                "brokenfall",
                [
                    56.44,
                    73.55
                ],
                [
                    56.61,
                    72.19
                ],
                "unknown-location-11"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "ulgrey-road-northwest",
            "type": "major",
            "curved": true,
            "fontSize": 10,
            "points": [
                "ulgrey",
                [
                    62.54,
                    59.94
                ],
                [
                    61.85,
                    59.9
                ],
                [
                    61.46,
                    58.09
                ],
                "emberstran"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "flatgarde-road-south",
            "type": "major",
            "curved": true,
            "points": [
                "flatgarde",
                [
                    54.34,
                    58.93
                ],
                [
                    54.26,
                    61.84
                ],
                "crossroads-1"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "beveress-road-south",
            "type": "major",
            "curved": true,
            "points": [
                "Beveress",
                [
                    53.79,
                    61.17
                ],
                "paendley"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "flatgarde-road-southwest",
            "type": "minor",
            "curved": true,
            "points": [
                "flatgarde",
                [
                    54.06,
                    58.17
                ],
                [
                    53.16,
                    60.09
                ],
                "Beveress"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "beveress-road-west",
            "type": "major",
            "curved": true,
            "points": [
                "Beveress",
                [
                    52.28,
                    59.77
                ],
                "hasfen"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "hasfen-road",
            "type": "major",
            "curved": true,
            "name": "Deep Road",
            "fontSize": 10,
            "labelReverse": true,
            "points": [
                "hasfen",
                [
                    50.78,
                    59.65
                ],
                [
                    49.89,
                    60.89
                ],
                [
                    48.74,
                    60.75
                ],
                "stoneshore"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "paendley-road-southwest",
            "type": "minor",
            "curved": true,
            "points": [
                "paendley",
                [
                    53.57,
                    64.13
                ],
                [
                    52.83,
                    64.69
                ],
                "duskwaren"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "duskwaren-road",
            "type": "minor",
            "curved": true,
            "points": [
                "duskwaren",
                [
                    52.53,
                    66.69
                ],
                "heildward"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "heilward-road-west",
            "type": "minor",
            "curved": true,
            "points": [
                "heildward",
                [
                    50.85,
                    66.27
                ],
                "felden"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "heildward-road-southeast",
            "type": "minor",
            "curved": true,
            "points": [
                "heildward",
                [
                    51.51,
                    66.96
                ],
                "morimyr"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "morimyr-road",
            "type": "minor",
            "curved": true,
            "points": [
                "morimyr",
                [
                    52.56,
                    69.34
                ],
                "climbor"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "felden-road-south",
            "type": "minor",
            "curved": true,
            "points": [
                "felden",
                [
                    50.5,
                    67.83
                ],
                [
                    50.88,
                    68.38
                ],
                "climbor"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "nurador-road-west",
            "type": "minor",
            "curved": true,
            "points": [
                "nurador",
                [
                    54.48,
                    67.48
                ],
                [
                    54.36,
                    69.42
                ],
                "unknown-location-10"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "unknown-road-10",
            "type": "minor",
            "curved": true,
            "points": [
                "unknown-location-10",
                [
                    53.02,
                    69.69
                ],
                [
                    52.09,
                    70.3
                ],
                "climbor"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "witguard-road-south",
            "type": "minor",
            "curved": true,
            "points": [
                "witguard",
                [
                    50.09,
                    71.11
                ],
                "unknown-12"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "pelveron-road-northeast",
            "type": "minor",
            "curved": true,
            "points": [
                "pelveron",
                [
                    49.89,
                    72.04
                ],
                "unknown-12"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "pelveron-road-southeast",
            "type": "minor",
            "curved": true,
            "points": [
                "pelveron",
                [
                    49.36,
                    72.64
                ],
                "silviora"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "pelveron-road",
            "type": "minor",
            "curved": true,
            "points": [
                "pelveron",
                [
                    48.94,
                    74.16
                ],
                "tarrarin"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "silviora-road-west",
            "type": "minor",
            "curved": true,
            "points": [
                "silviora",
                [
                    48.79,
                    74.02
                ],
                "tarrarin"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "witguard-road-west",
            "type": "minor",
            "curved": true,
            "points": [
                "witguard",
                [
                    49.31,
                    70.8
                ],
                [
                    48.43,
                    71.13
                ],
                [
                    48.18,
                    70.67
                ],
                "tyrynader"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "climbor-road-northwest",
            "type": "minor",
            "curved": true,
            "points": [
                "climbor",
                [
                    50.82,
                    70
                ],
                [
                    50.21,
                    70.85
                ],
                "witguard"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "climbor-road-southwest",
            "type": "minor",
            "curved": true,
            "points": [
                "climbor",
                [
                    50.95,
                    70.89
                ],
                [
                    50.59,
                    71.37
                ],
                "unknown-12"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "tyrynder-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "tyrynader",
                [
                    48.19,
                    68.87
                ],
                "Valenlun"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "valenlun-road-northeast",
            "type": "minor",
            "curved": true,
            "points": [
                "Valenlun",
                [
                    48.13,
                    67.92
                ],
                [
                    48.75,
                    66.24
                ],
                "basinpass"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "valenlun-road-northwest",
            "type": "minor",
            "curved": true,
            "points": [
                "Valenlun",
                [
                    47.39,
                    67.36
                ],
                [
                    47.3,
                    65.53
                ],
                [
                    46.63,
                    65.14
                ],
                "gevakaln"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "felden-road-west",
            "type": "minor",
            "curved": true,
            "points": [
                "felden",
                [
                    49.87,
                    66.98
                ],
                [
                    49.45,
                    66.19
                ],
                "basinpass"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "basinpass-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "basinpass",
                [
                    48.8,
                    64.93
                ],
                "steenlodge"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "steenloadge-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "steenlodge",
                [
                    48.73,
                    62.79
                ],
                [
                    48.52,
                    61.75
                ],
                "stoneshore"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "hasfen-road-south",
            "type": "minor",
            "curved": true,
            "points": [
                "hasfen",
                [
                    51.39,
                    60.73
                ],
                [
                    51.96,
                    61.55
                ],
                "corebb-keep"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "newbrimhaven-road",
            "type": "major",
            "curved": true,
            "name": "Chasm Way",
            "fontSize": 12,
            "labelOffset": 24,
            "labelSide": "bottom",
            "labelReverse": true,
            "points": [
                "new-brimhaven",
                [
                    60.68,
                    36.6
                ],
                [
                    59.22,
                    36.43
                ],
                "ferndale"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "stouhg-road-west",
            "type": "minor",
            "curved": true,
            "points": [
                "stouhg",
                [
                    61.98,
                    39.27
                ],
                "new-brimhaven"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "newbrimaven-road-south",
            "type": "minor",
            "curved": true,
            "points": [
                "new-brimhaven",
                [
                    60.23,
                    39.84
                ],
                [
                    59.35,
                    41.13
                ],
                "olduktali"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "ferndale-road-north",
            "type": "major",
            "curved": true,
            "points": [
                "ferndale",
                [
                    58.53,
                    34.59
                ],
                [
                    58.58,
                    33.19
                ],
                "padstow"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "padstow-road-west",
            "type": "major",
            "curved": true,
            "points": [
                "padstow",
                [
                    57.91,
                    31.83
                ],
                "basctdelm"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "ferndale-road-south",
            "type": "major",
            "curved": true,
            "name": "Halesworth\\nLoop",
            "fontSize": 10,
            "labelReverse": true,
            "points": [
                "ferndale",
                [
                    58.45,
                    37.24
                ],
                [
                    56.65,
                    37.87
                ],
                "shademoor"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "olduktali-road-west",
            "type": "minor",
            "curved": true,
            "fontSize": 10,
            "points": [
                "olduktali",
                [
                    58.38,
                    40.86
                ],
                [
                    58.09,
                    39.02
                ],
                [
                    56.71,
                    38.64
                ],
                "shademoor"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "padstow-road-north",
            "type": "minor",
            "curved": true,
            "fontSize": 10,
            "points": [
                "padstow",
                [
                    58.38,
                    31.07
                ],
                "dibsley"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "padstow-road-south",
            "type": "minor",
            "curved": true,
            "fontSize": 10,
            "points": [
                "padstow",
                [
                    58.25,
                    32.97
                ],
                [
                    57.07,
                    33.95
                ],
                "murfield"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "murfield-road-north",
            "type": "minor",
            "curved": true,
            "fontSize": 10,
            "points": [
                "murfield",
                [
                    56.51,
                    35.97
                ],
                "shademoor"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "basctdelm-road-north",
            "type": "major",
            "curved": true,
            "fontSize": 10,
            "points": [
                "basctdelm",
                [
                    57.93,
                    30.93
                ],
                "omelle"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "omelle-road-east",
            "type": "minor",
            "curved": true,
            "fontSize": 10,
            "points": [
                "omelle",
                [
                    58.26,
                    30.34
                ],
                [
                    58.65,
                    29.26
                ],
                "baryn"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "omelle-road-west",
            "type": "major",
            "curved": true,
            "fontSize": 10,
            "points": [
                "omelle",
                [
                    57.73,
                    29.39
                ],
                "sharsley"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "sharsley-road-northeast",
            "type": "minor",
            "curved": true,
            "fontSize": 10,
            "points": [
                "sharsley",
                [
                    57.39,
                    28.8
                ],
                [
                    57.64,
                    27.93
                ],
                "haern"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "baryn-road-northwest",
            "type": "minor",
            "curved": true,
            "fontSize": 10,
            "points": [
                "baryn",
                [
                    59.07,
                    28.19
                ],
                [
                    58.24,
                    27.74
                ],
                "haern"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "dolkholdur-road",
            "type": "minor",
            "curved": true,
            "fontSize": 10,
            "points": [
                "dolkholdur",
                [
                    54.75,
                    42.34
                ],
                [
                    53.87,
                    42.02
                ],
                [
                    54.06,
                    39.75
                ],
                [
                    53.38,
                    39.06
                ],
                "falthalor"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "severdale-road-west",
            "type": "minor",
            "curved": true,
            "fontSize": 10,
            "points": [
                "severdale",
                [
                    55.53,
                    50.28
                ],
                [
                    54.72,
                    47.81
                ],
                "slagerum"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "hasfen-road-north",
            "type": "major",
            "curved": true,
            "fontSize": 10,
            "points": [
                "hasfen",
                [
                    52.11,
                    59.34
                ],
                [
                    50.42,
                    57
                ],
                "yunberr"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "yunberr-road-north",
            "type": "major",
            "curved": true,
            "name": "Kholdur Pass",
            "fontSize": 10,
            "labelOffset": 29,
            "points": [
                "yunberr",
                [
                    51.21,
                    54.55
                ],
                [
                    52.09,
                    52.34
                ],
                "inshire"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "yunberr-road-west",
            "type": "minor",
            "curved": true,
            "fontSize": 10,
            "points": [
                "yunberr",
                [
                    49.83,
                    54.27
                ],
                "graeton"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "graeton-road-west",
            "type": "minor",
            "curved": true,
            "fontSize": 10,
            "points": [
                "graeton",
                [
                    48.53,
                    55.31
                ],
                [
                    48.25,
                    56.29
                ],
                "seaway-harbor"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "stonshore-road-north",
            "type": "minor",
            "curved": true,
            "fontSize": 10,
            "points": [
                "stoneshore",
                [
                    48.98,
                    60.05
                ],
                [
                    47.96,
                    59.71
                ],
                [
                    47.89,
                    56.74
                ],
                "seaway-harbor"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "inshire-road-north",
            "type": "major",
            "curved": true,
            "fontSize": 10,
            "points": [
                "inshire",
                [
                    51.97,
                    48.27
                ],
                [
                    54.34,
                    48.65
                ],
                "slagerum"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "slagerum-road-north",
            "type": "major",
            "curved": true,
            "fontSize": 10,
            "points": [
                "slagerum",
                [
                    55.17,
                    46.5
                ],
                "thelkholdur"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "inshire-road-west",
            "type": "minor",
            "curved": true,
            "points": [
                "inshire",
                [
                    49.93,
                    48.64
                ],
                "evostihl"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "seawayharbor-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "seaway-harbor",
                [
                    46.59,
                    54.81
                ],
                [
                    46.39,
                    52.47
                ],
                "nulvara"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "evostihl-road-west",
            "type": "minor",
            "curved": true,
            "points": [
                "evostihl",
                [
                    47.86,
                    50.87
                ],
                "nulvara"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "nulvara-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "nulvara",
                [
                    46.21,
                    49.94
                ],
                [
                    46.11,
                    48.32
                ],
                "amberleen"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "evostihl-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "evostihl",
                [
                    48.22,
                    47.87
                ],
                [
                    49.16,
                    46.11
                ],
                [
                    48.88,
                    44.4
                ],
                [
                    49.4,
                    43.41
                ],
                "skrettel"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "amberleen-road-west",
            "type": "minor",
            "curved": true,
            "points": [
                "amberleen",
                [
                    45.63,
                    46.32
                ],
                [
                    43.71,
                    47.18
                ],
                "sunfelpost"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "sundelpost-road-south",
            "type": "minor",
            "curved": true,
            "points": [
                "sunfelpost",
                [
                    42.91,
                    46.94
                ],
                [
                    43.38,
                    49.53
                ],
                "gulward"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "sundelpost-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "sunfelpost",
                [
                    43.18,
                    45.92
                ],
                [
                    43.25,
                    44.38
                ],
                "deterahn"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "bonegate-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "bonegate",
                [
                    40.85,
                    43.51
                ],
                "everlownlodge"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "deterahn-road-west",
            "type": "minor",
            "curved": true,
            "points": [
                "deterahn",
                [
                    42.92,
                    43.05
                ],
                [
                    42.19,
                    41.92
                ],
                [
                    41.5,
                    42.52
                ],
                "everlownlodge"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "everlownlodge-road-northeast",
            "type": "minor",
            "curved": true,
            "points": [
                "everlownlodge",
                [
                    41.07,
                    41.18
                ],
                [
                    41.94,
                    41.42
                ],
                [
                    42.2,
                    39.61
                ],
                "scarden"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "everlownlodge-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "everlownlodge",
                [
                    40.71,
                    39.72
                ],
                [
                    40.9,
                    37.56
                ],
                [
                    41.1,
                    35.93
                ],
                "kelaad"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "falthalor-road-south",
            "type": "minor",
            "curved": true,
            "points": [
                "falthalor",
                [
                    52.71,
                    38.23
                ],
                [
                    52.42,
                    40.21
                ],
                "endorei"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "shademoor-road-west",
            "type": "major",
            "curved": true,
            "fontSize": 10,
            "points": [
                "shademoor",
                [
                    55.94,
                    37.52
                ],
                [
                    55.44,
                    36.86
                ],
                "southern-arch"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "southernarch-road-west",
            "type": "major",
            "curved": true,
            "fontSize": 10,
            "points": [
                "southern-arch",
                [
                    54.35,
                    35.73
                ],
                [
                    53.58,
                    35.81
                ],
                "caelora"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "falthalor-road-north",
            "type": "minor",
            "curved": true,
            "fontSize": 10,
            "points": [
                "falthalor",
                [
                    53.68,
                    37.15
                ],
                "caelora"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "nauldeaus-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "nauldeaus",
                [
                    60.57,
                    26.73
                ],
                "wellen"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "wellen-road-northeast",
            "type": "minor",
            "curved": true,
            "points": [
                "wellen",
                [
                    61.56,
                    25.99
                ],
                [
                    61.8,
                    26.02
                ],
                "corilas"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "wellen-road-northwest",
            "type": "minor",
            "curved": true,
            "points": [
                "wellen",
                [
                    60.58,
                    24.47
                ],
                "murcomb"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "murcomb-road-south",
            "type": "minor",
            "curved": true,
            "points": [
                "murcomb",
                [
                    59.75,
                    24.65
                ],
                [
                    59.27,
                    24.94
                ],
                "lendahlee"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "hearn-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "haern",
                [
                    58.11,
                    27.36
                ],
                [
                    58.41,
                    26.23
                ],
                [
                    58.81,
                    25.99
                ],
                "lendahlee"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "sharsley-road-northwest",
            "type": "major",
            "curved": true,
            "name": "The North\\nLoop",
            "fontSize": 10,
            "labelReverse": true,
            "points": [
                "sharsley",
                [
                    56.31,
                    28.63
                ],
                "wheldrake"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "sharsley-road-west",
            "type": "minor",
            "curved": true,
            "fontSize": 10,
            "points": [
                "sharsley",
                [
                    56.11,
                    30.18
                ],
                "tarnsport"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "wehldrake-road-west",
            "type": "minor",
            "curved": true,
            "fontSize": 10,
            "points": [
                "wheldrake",
                [
                    55.29,
                    27.84
                ],
                "riverside"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "wheldrake-road-north",
            "type": "major",
            "curved": true,
            "fontSize": 10,
            "points": [
                "wheldrake",
                [
                    56.03,
                    26.9
                ],
                "tibbers"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "tibbers-road-north",
            "type": "major",
            "curved": true,
            "fontSize": 10,
            "points": [
                "tibbers",
                [
                    55.86,
                    23.86
                ],
                "vurnun"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "hemmil-road-south",
            "type": "minor",
            "curved": true,
            "fontSize": 10,
            "points": [
                "hemmil",
                [
                    54.23,
                    31.68
                ],
                [
                    53.42,
                    32.08
                ],
                [
                    52.57,
                    33.53
                ],
                "darafee"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "vurnun-road-northwest",
            "type": "major",
            "curved": true,
            "fontSize": 10,
            "points": [
                "vurnun",
                [
                    55.07,
                    21.94
                ],
                "palason"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "riverside-road-west",
            "type": "minor",
            "curved": true,
            "points": [
                "riverside",
                [
                    53.14,
                    26.42
                ],
                "staghand"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "lenshur-road-south",
            "type": "minor",
            "curved": true,
            "points": [
                "lenshur",
                [
                    52.57,
                    18.99
                ],
                [
                    52.43,
                    19.18
                ],
                "crossroads-lenshur"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "gristavel-road-east",
            "type": "minor",
            "curved": true,
            "points": [
                "gristavel",
                [
                    51.31,
                    20.42
                ],
                [
                    52.26,
                    19.91
                ],
                "crossroads-lenshur"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "palason-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "palason",
                [
                    54.36,
                    21.01
                ],
                [
                    53.08,
                    19.73
                ],
                [
                    52.57,
                    19.93
                ],
                "crossroads-lenshur"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "palason-road-south",
            "type": "major",
            "curved": true,
            "points": [
                "palason",
                [
                    54.28,
                    23.27
                ],
                [
                    53.7,
                    24.99
                ],
                "staghand"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "staghand-road-west",
            "type": "major",
            "curved": true,
            "points": [
                "staghand",
                [
                    52.64,
                    26.18
                ],
                "ringere"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "eringere-road-southwest",
            "type": "major",
            "curved": true,
            "name": "The North\\nLoop",
            "fontFamily": "Simonetta",
            "fontSize": 10,
            "labelOffset": 61,
            "labelReverse": true,
            "points": [
                "ringere",
                [
                    51.42,
                    26.43
                ],
                [
                    50.43,
                    27.5
                ],
                "northernarch"
            ],
            "fontStyle": "Italic"
        },
        {
            "id": "leterboun-road-south",
            "type": "minor",
            "curved": true,
            "points": [
                "leterboun",
                [
                    42.86,
                    32.97
                ],
                [
                    42.75,
                    34.82
                ],
                "kelaad"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "leterboun-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "leterboun",
                [
                    43.59,
                    31.91
                ],
                "raselle"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "caelora-road-north",
            "type": "major",
            "curved": true,
            "points": [
                "caelora",
                [
                    53.09,
                    34.42
                ],
                "darafee"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "darafee-road-west",
            "type": "major",
            "curved": true,
            "name": "Borealian\\nLoop",
            "fontSize": 13,
            "labelOffset": 68,
            "labelReverse": true,
            "points": [
                "darafee",
                [
                    52.19,
                    34.5
                ],
                [
                    51.26,
                    34.92
                ],
                "qaldynn"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "qaldynn-road-west",
            "type": "minor",
            "curved": true,
            "fontSize": 13,
            "points": [
                "qaldynn",
                "onaren"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "qaldynn-road-north",
            "type": "major",
            "curved": true,
            "fontSize": 13,
            "points": [
                "qaldynn",
                [
                    50.72,
                    31.72
                ],
                [
                    49.94,
                    30.9
                ],
                "srenesari"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "srenesari-road-north",
            "type": "major",
            "curved": true,
            "fontSize": 13,
            "points": [
                "srenesari",
                [
                    49.93,
                    29.28
                ],
                "northernarch"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "eringere-road-north",
            "type": "minor",
            "curved": true,
            "fontSize": 13,
            "points": [
                "ringere",
                [
                    51.52,
                    25.97
                ],
                [
                    51.35,
                    25.01
                ],
                "ormsdal"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "raselle-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "raselle",
                [
                    44.05,
                    30.66
                ],
                [
                    44.32,
                    28.96
                ],
                "kaldaros"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "kaldaros-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "kaldaros",
                [
                    45.73,
                    26.2
                ],
                "sahvall"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "sahvall-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "sahvall",
                [
                    45.44,
                    24.17
                ],
                [
                    45.53,
                    23.12
                ],
                "lasborin"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "lasborin-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "lasborin",
                [
                    45.82,
                    21.9
                ],
                "eruvic"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "lasborin-road-east",
            "type": "minor",
            "curved": true,
            "points": [
                "lasborin",
                [
                    47.24,
                    22.59
                ],
                [
                    47.78,
                    21.02
                ],
                "syori"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "gristavel-road-west",
            "type": "minor",
            "curved": true,
            "points": [
                "gristavel",
                [
                    50.13,
                    19.95
                ],
                [
                    49.58,
                    20.74
                ],
                "syori"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "syori-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "syori",
                [
                    48.63,
                    20.49
                ],
                [
                    49.06,
                    18.69
                ],
                "brekka"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "ormsdal-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "ormsdal",
                [
                    49.42,
                    24.5
                ],
                "aerley-syori-ormsdal-crossroads"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "syori-road-south",
            "type": "minor",
            "curved": true,
            "points": [
                "syori",
                [
                    49.34,
                    21.39
                ],
                [
                    49.26,
                    22.82
                ],
                "aerley-syori-ormsdal-crossroads"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "aerley-road-east",
            "type": "minor",
            "curved": true,
            "points": [
                "aerley",
                [
                    49.02,
                    23.42
                ],
                [
                    49.16,
                    23.55
                ],
                "aerley-syori-ormsdal-crossroads"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "everlight-road-south",
            "type": "major",
            "curved": true,
            "name": "Muerg's\\nPass",
            "fontSize": 12,
            "labelReverse": true,
            "points": [
                "everlight",
                [
                    73.24,
                    67.67
                ],
                "scarbrook"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "onaren-road-west",
            "type": "minor",
            "curved": true,
            "points": [
                "onaren",
                [
                    49.37,
                    33.49
                ],
                [
                    48.39,
                    32.64
                ],
                "mossholde"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "onaren-road-south",
            "type": "minor",
            "curved": true,
            "points": [
                "onaren",
                [
                    49.06,
                    34.07
                ],
                "abbeyofmontrest"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "abbeyofmontrest-road-south",
            "type": "minor",
            "curved": true,
            "points": [
                "abbeyofmontrest",
                [
                    49.1,
                    37.13
                ],
                "bastionoforder"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "srenesari-road-south",
            "type": "minor",
            "curved": true,
            "points": [
                "srenesari",
                [
                    49.84,
                    30.49
                ],
                [
                    49.3,
                    31.66
                ],
                [
                    48.25,
                    31.9
                ],
                "mossholde"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "mossholde-road-east",
            "type": "minor",
            "curved": true,
            "points": [
                "mossholde",
                [
                    46.93,
                    32.24
                ],
                [
                    45.96,
                    33.01
                ],
                [
                    45.02,
                    32.45
                ],
                [
                    44.29,
                    33.41
                ],
                "leterboun"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "mossholde-road-south",
            "type": "minor",
            "curved": true,
            "points": [
                "mossholde",
                [
                    48.05,
                    33.19
                ],
                [
                    48.47,
                    33.68
                ],
                [
                    48.27,
                    35.7
                ],
                "abbeyofmontrest"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "olmorrey-road-north",
            "type": "major",
            "curved": true,
            "points": [
                "olmorrey",
                [
                    21.44,
                    43.52
                ],
                [
                    21.22,
                    41.6
                ],
                "bindwatch"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "bindarch-road-north",
            "type": "major",
            "curved": true,
            "points": [
                "bindwatch",
                [
                    21.12,
                    40.53
                ],
                "proth"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "bindwatch-road-east",
            "type": "minor",
            "curved": true,
            "points": [
                "bindwatch",
                [
                    21.68,
                    40.95
                ],
                "gristlow"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "proth-road-northeast",
            "type": "major",
            "curved": true,
            "name": "Celemere Pass",
            "fontSize": 13,
            "points": [
                "proth",
                [
                    21.78,
                    37.99
                ],
                [
                    23.07,
                    37.64
                ],
                [
                    23.33,
                    35.66
                ],
                "kilnock"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "layden-road-northwest",
            "type": "minor",
            "curved": true,
            "fontSize": 13,
            "points": [
                "layden",
                [
                    23.04,
                    37.76
                ],
                "layden-proth-kilnock-crossroad"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "proth-road-northwest",
            "type": "major",
            "curved": true,
            "points": [
                "proth",
                [
                    21.03,
                    38.05
                ],
                [
                    20.67,
                    37.33
                ],
                [
                    19.9,
                    36.72
                ],
                "leoning"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "leoning-road-north",
            "type": "major",
            "curved": true,
            "points": [
                "leoning",
                [
                    19.62,
                    35.57
                ],
                "sheperds-keep"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "timbertown-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "timberdown",
                [
                    24.02,
                    36.72
                ],
                [
                    24.5,
                    35.03
                ],
                "unstead"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "caldwynn-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "caldwynn",
                [
                    24.6,
                    31.88
                ],
                "tirncall"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "gibuldon-road-north",
            "type": "major",
            "curved": true,
            "points": [
                "gibuldon",
                [
                    28.31,
                    27.77
                ],
                [
                    28.03,
                    27.63
                ],
                [
                    27.93,
                    27.04
                ],
                [
                    28.04,
                    25.99
                ],
                "abereth"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "gibuldon-road-south",
            "type": "major",
            "curved": true,
            "points": [
                "gibuldon",
                [
                    28.29,
                    28.82
                ],
                "dryrock"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "tirncall-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "tirncall",
                [
                    24.44,
                    29.97
                ],
                [
                    24.04,
                    29.36
                ],
                "adsuren"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "shepherdskeep-road-north",
            "type": "major",
            "curved": true,
            "points": [
                "sheperds-keep",
                [
                    20.34,
                    33.12
                ],
                "evyndar"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "evyndar-road-north",
            "type": "major",
            "curved": true,
            "points": [
                "evyndar",
                [
                    20.22,
                    30.96
                ],
                "broadmere-rest"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "leoning-road-east",
            "type": "minor",
            "curved": true,
            "points": [
                "leoning",
                [
                    20.75,
                    36.61
                ],
                [
                    21.43,
                    35.04
                ],
                [
                    21.87,
                    34.64
                ],
                [
                    22.56,
                    34.69
                ],
                "babbleglen"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "kilnock-road-east",
            "type": "minor",
            "curved": true,
            "points": [
                "kilnock",
                [
                    23.52,
                    34.77
                ],
                [
                    22.76,
                    35.09
                ],
                "babbleglen"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "layden-road",
            "type": "minor",
            "curved": true,
            "points": [
                "layden",
                [
                    23.17,
                    38.69
                ],
                [
                    23.65,
                    37.6
                ],
                "timberdown"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "tirncall-road-east",
            "type": "minor",
            "curved": true,
            "points": [
                "tirncall",
                [
                    24.24,
                    30.82
                ],
                [
                    23.89,
                    31.91
                ],
                [
                    23.6,
                    32.03
                ],
                "menmythorn"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "adsuren-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "adsuren",
                [
                    24.34,
                    27.07
                ],
                [
                    24.03,
                    26
                ],
                [
                    22.79,
                    25.02
                ],
                "insloe"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "abereth-road-east",
            "type": "major",
            "curved": true,
            "name": "Ridgeclimb",
            "fontSize": 9,
            "labelReverse": true,
            "points": [
                "abereth",
                [
                    27.85,
                    26.09
                ],
                [
                    27.47,
                    24.66
                ],
                "berest"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "lullin-road-northwest",
            "type": "minor",
            "curved": true,
            "fontSize": 14,
            "points": [
                "lullin",
                [
                    26.51,
                    25.53
                ],
                [
                    26.54,
                    24.57
                ],
                "berest"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "broadmererest-road-north",
            "type": "major",
            "curved": true,
            "fontSize": 14,
            "points": [
                "broadmere-rest",
                [
                    20.38,
                    29.09
                ],
                [
                    19.93,
                    27.4
                ],
                "nesulport"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "nesulport-road-north",
            "type": "major",
            "curved": true,
            "fontSize": 14,
            "points": [
                "nesulport",
                [
                    20.06,
                    25.81
                ],
                "Kodderl"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "caldwynn-road-east",
            "type": "major",
            "curved": true,
            "name": "Celemere Pass",
            "fontSize": 14,
            "points": [
                "caldwynn",
                [
                    25.38,
                    31.99
                ],
                [
                    26.04,
                    32.49
                ],
                [
                    26.55,
                    31.79
                ],
                [
                    26.93,
                    31.07
                ],
                [
                    27.63,
                    30.56
                ],
                [
                    27.79,
                    29.47
                ],
                "dryrock"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "berest-road-west",
            "type": "major",
            "curved": true,
            "fontSize": 14,
            "points": [
                "berest",
                [
                    25.22,
                    22.89
                ],
                "habell"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "habell-road-west",
            "type": "major",
            "curved": true,
            "fontSize": 14,
            "points": [
                "habell",
                [
                    23.97,
                    22.9
                ],
                [
                    23.18,
                    23.93
                ],
                "insloe"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "insloe-road-west",
            "type": "major",
            "curved": true,
            "fontSize": 14,
            "points": [
                "insloe",
                [
                    21.67,
                    24.34
                ],
                "Kodderl"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "kodderl-road-northwest",
            "type": "major",
            "curved": true,
            "fontSize": 14,
            "points": [
                "Kodderl",
                [
                    20.38,
                    23.05
                ],
                [
                    19.8,
                    22.02
                ],
                "dregwaypost"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "berest-road-north",
            "type": "major",
            "curved": true,
            "fontSize": 14,
            "points": [
                "berest",
                [
                    26.47,
                    23.52
                ],
                "tovar"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "tovar-road-north",
            "type": "minor",
            "curved": true,
            "fontSize": 14,
            "points": [
                "tovar",
                [
                    26.75,
                    21.86
                ],
                "tovarspan"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "dreghye-road-north",
            "type": "minor",
            "curved": true,
            "fontSize": 14,
            "points": [
                "dreghye",
                [
                    19.26,
                    22.82
                ],
                [
                    19.15,
                    21.71
                ],
                "dregwaypost"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "dregwaypost-road-north",
            "type": "minor",
            "curved": true,
            "fontSize": 14,
            "points": [
                "dregwaypost",
                [
                    20.26,
                    20.62
                ],
                [
                    20.61,
                    19.3
                ],
                [
                    21.55,
                    18.92
                ],
                "frostwellport"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "frostwellport-road-east",
            "type": "minor",
            "curved": true,
            "fontSize": 14,
            "points": [
                "frostwellport",
                [
                    22.03,
                    18.34
                ],
                [
                    22.48,
                    19.25
                ],
                [
                    23.27,
                    19.6
                ],
                "aesenfell"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "tovar-road-northwest",
            "type": "minor",
            "curved": true,
            "fontSize": 14,
            "points": [
                "tovar",
                [
                    26.3,
                    21.96
                ],
                [
                    25.31,
                    21.38
                ],
                "pukett"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "pukett-road-east",
            "type": "minor",
            "curved": true,
            "fontSize": 14,
            "points": [
                "pukett",
                [
                    25.57,
                    19.65
                ],
                "urbank"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "tovarspan-road-north",
            "type": "minor",
            "curved": true,
            "fontSize": 14,
            "points": [
                "tovarspan",
                [
                    26.49,
                    20.78
                ],
                "urbank"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "urbank-road-east",
            "type": "minor",
            "curved": true,
            "name": "Upper Eustera Trail",
            "fontSize": 10,
            "points": [
                "urbank",
                [
                    27.5,
                    19.19
                ],
                [
                    28.8,
                    19.89
                ],
                "alconny"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "dregwaypost-road-west",
            "type": "major",
            "curved": true,
            "points": [
                "dregwaypost",
                [
                    19.5,
                    20.71
                ],
                [
                    18.8,
                    20.26
                ],
                [
                    18.24,
                    19.53
                ],
                [
                    17.98,
                    19.31
                ],
                "claymere"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "claymere-road-south",
            "type": "minor",
            "curved": true,
            "points": [
                "claymere",
                [
                    17.88,
                    19.75
                ],
                "ruinsofdruegend"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "claymere-road-west",
            "type": "major",
            "curved": true,
            "points": [
                "claymere",
                [
                    17.51,
                    19.14
                ],
                [
                    16.94,
                    19.76
                ],
                [
                    16.17,
                    19.52
                ],
                "grobh"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "grobh-road-west",
            "type": "major",
            "curved": true,
            "points": [
                "grobh",
                [
                    15.68,
                    19.76
                ],
                [
                    14.92,
                    21.12
                ],
                "fawrese"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "fawrese-road-northwest",
            "type": "major",
            "curved": true,
            "points": [
                "fawrese",
                [
                    14.31,
                    21.17
                ],
                "porpen"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "porpen-road-east",
            "type": "minor",
            "curved": true,
            "points": [
                "porpen",
                [
                    13.77,
                    18.63
                ],
                [
                    14.78,
                    18.25
                ],
                "thaelshore"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "menmythorn-road-west",
            "type": "minor",
            "curved": true,
            "points": [
                "menmythorn",
                [
                    22.97,
                    30.65
                ],
                [
                    21.47,
                    31.89
                ],
                [
                    20.76,
                    30.33
                ],
                "broadmere-rest"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "alconny-road-south",
            "type": "minor",
            "curved": true,
            "points": [
                "alconny",
                [
                    30.01,
                    19.82
                ],
                [
                    30.77,
                    20.15
                ],
                "bonlightpass"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "strolsworth-road-east",
            "type": "major",
            "curved": true,
            "points": [
                "strolsworth",
                [
                    29.5,
                    27.01
                ],
                [
                    30.66,
                    25.88
                ],
                "tariat"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "tariat-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "tariat",
                [
                    31.01,
                    25.62
                ],
                [
                    31.22,
                    24.72
                ],
                "bronzebellyfort"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "bronzebellyfort-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "bronzebellyfort",
                [
                    31.31,
                    23.85
                ],
                "bonfaduhr"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "aesenfell-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "aesenfell",
                [
                    24.05,
                    17.99
                ],
                [
                    24.58,
                    17.57
                ],
                [
                    25.8,
                    17.03
                ],
                "solwindglaes"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "alconny-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "alconny",
                [
                    30.04,
                    18.42
                ],
                [
                    30.8,
                    18.14
                ],
                [
                    31.11,
                    16.75
                ],
                "snowlightfort"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "snowlightfort-road-east",
            "type": "minor",
            "curved": true,
            "points": [
                "snowlightfort",
                [
                    31.5,
                    16.35
                ],
                "icespring"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "solwindglaes-road",
            "type": "minor",
            "curved": true,
            "points": [
                "solwindglaes",
                [
                    25.24,
                    15.15
                ],
                [
                    25.2,
                    13.76
                ],
                [
                    25.34,
                    13.06
                ],
                "nebendie"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "nedbendie-road-east",
            "type": "minor",
            "curved": true,
            "points": [
                "nebendie",
                [
                    25.78,
                    11.83
                ],
                [
                    26.66,
                    11.89
                ],
                [
                    27.45,
                    10.83
                ],
                "blisteredkeep"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "blisteredkeep-road-east",
            "type": "minor",
            "curved": true,
            "points": [
                "blisteredkeep",
                [
                    28.21,
                    10.56
                ],
                [
                    28.99,
                    11.13
                ],
                [
                    29.52,
                    10.65
                ],
                "mahralkal"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "mahrolkal-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "mahralkal",
                [
                    29.86,
                    10.2
                ],
                [
                    28.91,
                    8.37
                ],
                "avalvein"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "mahralkal-road-east",
            "type": "minor",
            "curved": true,
            "points": [
                "mahralkal",
                [
                    30.41,
                    10.49
                ],
                [
                    30.57,
                    9.79
                ],
                [
                    30.48,
                    8.81
                ],
                "seorneasor"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "snowlightfort-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "snowlightfort",
                [
                    31.19,
                    15.22
                ],
                [
                    30.41,
                    13.64
                ],
                [
                    29.52,
                    13.05
                ],
                "mahralkal"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "icespring-road-east",
            "type": "minor",
            "curved": true,
            "points": [
                "icespring",
                [
                    31.82,
                    15.06
                ],
                [
                    32.62,
                    14.41
                ],
                [
                    33.04,
                    14.44
                ],
                [
                    33.98,
                    15.33
                ],
                [
                    34.65,
                    14.57
                ],
                [
                    34.69,
                    14.09
                ],
                "fjordnahl"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "eastmare-road-north",
            "type": "major",
            "curved": true,
            "points": [
                "eastmare",
                [
                    40.32,
                    30.27
                ],
                "eastmare-greymill-stinson-crossroad"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "greymill-road-south",
            "type": "major",
            "curved": true,
            "points": [
                "greymill",
                [
                    40.62,
                    28.81
                ],
                "eastmare-greymill-stinson-crossroad"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "stinson-road-south",
            "type": "major",
            "curved": true,
            "name": "Barrford Pass",
            "fontSize": 14,
            "labelOffset": 43,
            "labelReverse": true,
            "points": [
                "stinson",
                [
                    43.03,
                    24.67
                ],
                [
                    43.02,
                    25.67
                ],
                [
                    42.93,
                    26.9
                ],
                [
                    42.24,
                    27.48
                ],
                [
                    41.48,
                    29.95
                ],
                "eastmare-greymill-stinson-crossroad"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "greymill-road-northeast",
            "type": "minor",
            "curved": true,
            "fontSize": 14,
            "points": [
                "greymill",
                [
                    40.55,
                    25.03
                ],
                [
                    42.48,
                    24.78
                ],
                "stinson"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "greymill-road-west",
            "type": "minor",
            "curved": true,
            "fontSize": 14,
            "points": [
                "greymill",
                [
                    40.05,
                    26.23
                ],
                [
                    38.81,
                    25.54
                ],
                [
                    38.48,
                    24.81
                ],
                [
                    37.83,
                    23.81
                ],
                [
                    36.26,
                    24.78
                ],
                "peakoftibul"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "eastmare-road-northwest",
            "type": "minor",
            "curved": true,
            "fontSize": 14,
            "points": [
                "eastmare",
                [
                    39.92,
                    29.98
                ],
                "nesbit"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "ingress-road-west",
            "type": "major",
            "curved": true,
            "fontSize": 14,
            "points": [
                "ingress",
                [
                    37.89,
                    30.71
                ],
                [
                    39.48,
                    31.12
                ],
                "eastmare"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "ingriss-road-northwest",
            "type": "major",
            "curved": true,
            "name": "Midpath",
            "fontSize": 14,
            "labelReverse": true,
            "points": [
                "ingress",
                [
                    37.48,
                    29.78
                ],
                [
                    33.33,
                    29.94
                ],
                "ashindel"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "ashindel-road-northwest",
            "type": "major",
            "curved": true,
            "fontSize": 14,
            "points": [
                "ashindel",
                [
                    32.61,
                    28.73
                ],
                [
                    31.25,
                    25.98
                ],
                "tariat"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "ashindel-road-south",
            "type": "minor",
            "curved": true,
            "fontSize": 14,
            "points": [
                "ashindel",
                [
                    32.4,
                    29.5
                ],
                [
                    32.34,
                    32.65
                ],
                [
                    30.91,
                    33.37
                ],
                "mablihod"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "mablihod-road-northwest",
            "type": "major",
            "curved": true,
            "name": "Road to\\nCerule",
            "fontSize": 14,
            "labelReverse": true,
            "points": [
                "mablihod",
                [
                    30.66,
                    33.15
                ],
                [
                    29.2,
                    31.9
                ],
                [
                    28.7,
                    29.64
                ],
                "dryrock"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "oldport-road",
            "type": "major",
            "curved": true,
            "name": "Dunmoor Cross",
            "fontSize": 14,
            "labelOffset": 32,
            "labelReverse": true,
            "points": [
                "oldport",
                [
                    37.33,
                    36.19
                ],
                [
                    37.24,
                    38.02
                ],
                [
                    35.86,
                    38.29
                ],
                [
                    35.72,
                    38.24
                ],
                [
                    34.89,
                    38.63
                ],
                "hennibon"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "hennibon-road-west",
            "type": "major",
            "curved": true,
            "fontSize": 14,
            "points": [
                "hennibon",
                [
                    34.32,
                    39.57
                ],
                [
                    33.98,
                    40.26
                ],
                "larnwik"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "larnwik-road-west",
            "type": "major",
            "curved": true,
            "fontSize": 14,
            "points": [
                "larnwik",
                [
                    32.52,
                    40.82
                ],
                "blackfield"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "blackfield-road-north",
            "type": "major",
            "curved": true,
            "name": "Road to\\nCerule",
            "fontSize": 14,
            "labelReverse": true,
            "points": [
                "blackfield",
                [
                    31.49,
                    39.04
                ],
                "elondale"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "elondale-road-north",
            "type": "major",
            "curved": true,
            "fontSize": 14,
            "points": [
                "elondale",
                [
                    31.39,
                    34.53
                ],
                "mablihod"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "elondale-road-east",
            "type": "minor",
            "curved": true,
            "fontSize": 14,
            "points": [
                "elondale",
                [
                    32.2,
                    37.34
                ],
                [
                    33.07,
                    36.15
                ],
                "bluffhunt"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "bluffhunt-road-south",
            "type": "minor",
            "curved": true,
            "fontSize": 14,
            "points": [
                "bluffhunt",
                [
                    34.18,
                    36.29
                ],
                [
                    34.11,
                    38.57
                ],
                "hennibon"
            ],
            "fontFamily": "Simonetta",
            "fontStyle": "Italic"
        },
        {
            "id": "harelbek-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "harelbek",
                [
                    36.01,
                    46.45
                ],
                [
                    35.29,
                    45.57
                ],
                "spareway"
            ]
        },
        {
            "id": "spareway-road-east",
            "type": "minor",
            "curved": true,
            "points": [
                "spareway",
                [
                    35.58,
                    43.9
                ],
                "braelen"
            ]
        },
        {
            "id": "spareway-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "spareway",
                [
                    35.08,
                    42.55
                ],
                [
                    33.26,
                    41.56
                ],
                "larnwik"
            ]
        },
        {
            "id": "morrey-road-west",
            "type": "major",
            "curved": true,
            "points": [
                "morrey",
                [
                    21.74,
                    44.61
                ],
                [
                    22.28,
                    46.06
                ],
                [
                    23.37,
                    45.57
                ],
                "carnsby"
            ]
        },
        {
            "id": "carnsby-road-north",
            "type": "minor",
            "curved": true,
            "points": [
                "carnsby",
                [
                    23.89,
                    43.16
                ],
                [
                    24.44,
                    40.74
                ],
                [
                    23.91,
                    38.52
                ],
                "timberdown"
            ]
        },
        {
            "id": "carnsby-road-south",
            "type": "minor",
            "curved": true,
            "points": [
                "carnsby",
                [
                    23.73,
                    45.49
                ],
                [
                    24.94,
                    45.76
                ],
                "kelmouth"
            ]
        },
        {
            "id": "carnsby-road-east",
            "type": "major",
            "curved": true,
            "name": "Sutherford\\nMarch",
            "fontSize": 13,
            "labelOffset": 37,
            "points": [
                "carnsby",
                [
                    24.28,
                    44.4
                ],
                [
                    25.26,
                    44.43
                ],
                [
                    26.39,
                    44.84
                ],
                "kith"
            ]
        },
        {
            "id": "denskelber-road-south",
            "type": "minor",
            "curved": true,
            "fontSize": 13,
            "points": [
                "denskelber",
                [
                    26.47,
                    44.29
                ],
                "carnsby-kith-denskelber-crossroad"
            ]
        },
        {
            "id": "dhachaomhnoir-road-east",
            "type": "major",
            "curved": true,
            "name": "Trace of Aelbon",
            "fontSize": 13,
            "points": [
                "dhachaomhnoir",
                [
                    28.07,
                    46.68
                ],
                [
                    28.79,
                    46.34
                ],
                [
                    29.55,
                    45.57
                ],
                "waypoint"
            ]
        },
        {
            "id": "waypoint-road-east",
            "type": "minor",
            "curved": true,
            "fontSize": 13,
            "points": [
                "waypoint",
                [
                    30,
                    46.38
                ],
                [
                    30.87,
                    45.82
                ],
                [
                    31.25,
                    46.09
                ],
                [
                    31.69,
                    45.63
                ],
                "elspire"
            ]
        },
        {
            "id": "elspire-road-north",
            "type": "minor",
            "curved": true,
            "fontSize": 13,
            "points": [
                "elspire",
                [
                    31.86,
                    45.68
                ],
                [
                    32.56,
                    45.04
                ],
                "oakrest"
            ]
        },
        {
            "id": "waypoint-roadnorth",
            "type": "major",
            "curved": true,
            "fontSize": 13,
            "points": [
                "waypoint",
                [
                    30.55,
                    44.82
                ],
                [
                    30.76,
                    43.21
                ],
                "kilgrenney"
            ]
        },
        {
            "id": "kilgrenney-road-north",
            "type": "major",
            "curved": true,
            "fontSize": 13,
            "points": [
                "kilgrenney",
                [
                    32.2,
                    41.84
                ],
                "blackfield"
            ]
        },
        {
            "id": "oakrest-road-north",
            "type": "minor",
            "curved": true,
            "fontSize": 13,
            "points": [
                "oakrest",
                [
                    32.58,
                    43.14
                ],
                [
                    33.13,
                    42.02
                ],
                "larnwik"
            ]
        },
        {
            "id": "oakrest-road-west",
            "type": "minor",
            "curved": true,
            "fontSize": 13,
            "points": [
                "oakrest",
                [
                    32.23,
                    43.18
                ],
                [
                    31.37,
                    43.04
                ],
                "kilgrenney"
            ]
        },
        {
            "id": "oldport-bonegate-sea-route",
            "type": "water-route",
            "curved": true,
            "color": "#1E90FF",
            "width": 1.4,
            "shipName": "The Silver Gull",
            "shipType": "Caravel",
            "captainName": "Captain Edra Mosswick",
            "routePurpose": "merchant",
            "cargo": "Grain, salt, dried fish",
            "riskLevel": "low",
            "points": [
                "oldport",
                [
                    38.88,
                    36.34
                ],
                [
                    38.7,
                    38.2
                ],
                [
                    39.1,
                    40.4
                ],
                [
                    39.7,
                    42.6
                ],
                "bonegate"
            ]
        },
        {
            "id": "bonegate-gulward-sea-route",
            "type": "water-route",
            "curved": true,
            "color": "#4682B4",
            "width": 1.3,
            "points": [
                "bonegate",
                [
                    40.8,
                    45.2
                ],
                [
                    41.08,
                    47.6
                ],
                [
                    41.36,
                    52.23
                ],
                "gulward"
            ],
            "shipName": "Ironkeel",
            "shipType": "Brigantine",
            "captainName": "Captain Torvald Drask",
            "routePurpose": "military",
            "cargo": "Swords, armor, mercenaries",
            "riskLevel": "low"
        },
        {
            "id": "gulward-amberleen-sea-route",
            "type": "water-route",
            "curved": true,
            "color": "#00BFFF",
            "width": 1.3,
            "shipName": "The Amber Star",
            "shipType": "Sloop",
            "captainName": "Captain Lessa Vaine",
            "routePurpose": "merchant",
            "cargo": "Dyes, amber resin, cloth",
            "riskLevel": "low",
            "points": [
                "gulward",
                [
                    42.81,
                    51.35
                ],
                [
                    43.19,
                    49.89
                ],
                "amberleen"
            ]
        },
        {
            "id": "bonegate-harelbek-sea-route",
            "type": "water-route",
            "curved": true,
            "color": "#5DADE2",
            "width": 1.4,
            "shipName": "Stormward",
            "shipType": "Galleon",
            "captainName": "Captain Brannick Holt",
            "routePurpose": "military",
            "cargo": "Soldiers, weapons, supplies",
            "riskLevel": "medium",
            "points": [
                "bonegate",
                [
                    39.3,
                    45.4
                ],
                [
                    38.5,
                    46.5
                ],
                [
                    37.5,
                    47.5
                ],
                [
                    37,
                    48.1
                ],
                "harelbek"
            ]
        },
        {
            "id": "stoneshore-harelbek-sea-route",
            "type": "water-route",
            "curved": true,
            "color": "#5AA2D6",
            "width": 1.4,
            "shipName": "The Pale Tide",
            "shipType": "Merchant Cog",
            "captainName": "Captain Mira Dunhall",
            "routePurpose": "merchant",
            "cargo": "Stone, quarried slate, rope",
            "riskLevel": "low",
            "points": [
                "stoneshore",
                [
                    47.5,
                    60
                ],
                [
                    45.7,
                    57
                ],
                [
                    43.5,
                    54.54
                ],
                [
                    41.2,
                    51.2
                ],
                [
                    38.8,
                    48.4
                ],
                "harelbek"
            ]
        },
        {
            "id": "gevakaln-gulward-sea-route",
            "type": "water-route",
            "curved": true,
            "color": "#3C8FCC",
            "width": 1.3,
            "shipName": "Deepwater Queen",
            "shipType": "Galleon",
            "captainName": "Captain Sevara Keth",
            "routePurpose": "merchant",
            "cargo": "Exotic spices, silks, southern goods",
            "riskLevel": "medium",
            "points": [
                "gevakaln",
                [
                    45.45,
                    65.78
                ],
                [
                    42.31,
                    52.09
                ],
                "gulward"
            ]
        },
        {
            "id": "bonegate-oldport-sea-route",
            "type": "water-route",
            "curved": true,
            "shipName": "The Returning Blade",
            "shipType": "Frigate",
            "captainName": "Captain Aldric Sorn",
            "routePurpose": "military",
            "cargo": "Dispatches, treasury shipments",
            "riskLevel": "medium",
            "points": [
                "bonegate",
                [
                    39.31,
                    43.38
                ],
                [
                    38.91,
                    35.99
                ],
                "oldport"
            ]
        },
        {
            "id": "harelbek-bonegate-sea-route",
            "type": "water-route",
            "curved": true,
            "shipName": "Hearthward",
            "shipType": "Sloop",
            "captainName": "Captain Jennek Farrow",
            "routePurpose": "passenger",
            "cargo": "Passengers, mail, fresh produce",
            "riskLevel": "low",
            "points": [
                "harelbek",
                [
                    37.95,
                    48.17
                ],
                "bonegate"
            ]
        },
        {
            "id": "gulward-gevakaln-sea-route",
            "type": "water-route",
            "curved": true,
            "shipName": "Southstone",
            "shipType": "Merchant Cog",
            "captainName": "Captain Oris Vell",
            "routePurpose": "merchant",
            "cargo": "Pottery, oil, salted meats",
            "riskLevel": "low",
            "points": [
                "gulward",
                [
                    41.98,
                    53.35
                ],
                [
                    46.62,
                    62.15
                ],
                [
                    46.94,
                    63.36
                ],
                "gevakaln"
            ]
        },
        {
            "id": "emberstran-adamont-sea-route",
            "type": "water-route",
            "curved": true,
            "shipName": "The Ember Wind",
            "shipType": "Galleon",
            "captainName": "Captain Carys Ashmore",
            "routePurpose": "merchant",
            "cargo": "Enchanted goods, rare metals, gems",
            "riskLevel": "medium",
            "points": [
                "emberstran",
                [
                    60.44,
                    62.39
                ],
                "adamont"
            ]
        },
        {
            "id": "glimmerstone-emberstan-sea-route",
            "type": "water-route",
            "curved": true,
            "shipName": "Dawnspire",
            "shipType": "Caravel",
            "captainName": "Captain Solwen Bright",
            "routePurpose": "merchant",
            "cargo": "Glimmerstone crystals, refined glass",
            "riskLevel": "low",
            "points": [
                "glimmerstone",
                [
                    58.25,
                    60.77
                ],
                "emberstran"
            ]
        },
        {
            "id": "paendley-emberstran-sea-route",
            "type": "water-route",
            "curved": true,
            "shipName": "The Wandering Lantern",
            "shipType": "Merchant Cog",
            "captainName": "Captain Thessa Dund",
            "routePurpose": "merchant",
            "cargo": "Livestock, grain, lantern oil",
            "riskLevel": "low",
            "points": [
                "paendley",
                [
                    54.47,
                    63.29
                ],
                [
                    54.91,
                    63.17
                ],
                [
                    58.11,
                    60.83
                ],
                "emberstran"
            ]
        },
        {
            "id": "farview-porthbay-sea-route",
            "type": "water-route",
            "curved": true,
            "shipName": "Far Horizon",
            "shipType": "Galleon",
            "captainName": "Captain Emrik Tannes",
            "routePurpose": "exploration",
            "cargo": "Charts, expedition supplies, salvage",
            "riskLevel": "high",
            "points": [
                "farview",
                [
                    73.53,
                    74.53
                ],
                [
                    76.31,
                    72.62
                ],
                [
                    79.01,
                    69.69
                ],
                [
                    81.13,
                    65.74
                ],
                [
                    81.87,
                    59.99
                ],
                [
                    81.87,
                    57.7
                ],
                [
                    81.32,
                    56.92
                ],
                [
                    81.4,
                    56.03
                ],
                "porthbay"
            ]
        },
        {
            "id": "nauldeaus-fardrift-sea-route",
            "type": "water-route",
            "curved": true,
            "shipName": "The Frostspine",
            "shipType": "Longship",
            "captainName": "Captain Runa Iceborn",
            "routePurpose": "exploration",
            "cargo": "Furs, ivory, northern trophies",
            "riskLevel": "high",
            "points": [
                "nauldeaus",
                [
                    61.34,
                    28.01
                ],
                [
                    63.47,
                    27.51
                ],
                [
                    64.25,
                    25.84
                ],
                "fardrift"
            ]
        },
        {
            "id": "tratta-nauldeaus-sea-route",
            "type": "water-route",
            "curved": true,
            "shipName": "The Gilded Oar",
            "shipType": "Galleon",
            "captainName": "Captain Mareth Trell",
            "routePurpose": "merchant",
            "cargo": "Luxury goods, wine, fine textiles",
            "riskLevel": "medium",
            "points": [
                "tratta",
                [
                    70.75,
                    34.91
                ],
                [
                    70.41,
                    34.56
                ],
                [
                    67.06,
                    32.34
                ],
                [
                    65.02,
                    30.94
                ],
                [
                    64.63,
                    29.78
                ],
                [
                    63.92,
                    29.45
                ],
                "nauldeaus"
            ]
        },
        {
            "id": "lurdaba-tratta-sea-route",
            "type": "water-route",
            "curved": true,
            "shipName": "Lurdoban Pride",
            "shipType": "Brigantine",
            "captainName": "Captain Harolt Wex",
            "routePurpose": "merchant",
            "cargo": "Mountain ore, carved stone, pelts",
            "riskLevel": "low",
            "points": [
                "lurdoba",
                [
                    75.16,
                    34.78
                ],
                [
                    73.41,
                    36.01
                ],
                "tratta"
            ]
        },
        {
            "id": "stinson-eruvic-sea-route",
            "type": "water-route",
            "curved": true,
            "shipName": "The Northern Arrow",
            "shipType": "Caravel",
            "captainName": "Captain Finn Breck",
            "routePurpose": "merchant",
            "cargo": "Salted herring, timber, amber",
            "riskLevel": "medium",
            "points": [
                "stinson",
                [
                    43.61,
                    23.81
                ],
                [
                    45.21,
                    21.04
                ],
                "eruvic"
            ]
        },
        {
            "id": "raselle-ingriss-sea-route",
            "type": "water-route",
            "curved": true,
            "shipName": "Sea Rose",
            "shipType": "Sloop",
            "captainName": "Captain Aelith Grayne",
            "routePurpose": "smuggling",
            "cargo": "Contraband, stolen artifacts, black powder",
            "riskLevel": "high",
            "points": [
                "raselle",
                [
                    42.31,
                    31.89
                ],
                [
                    39.07,
                    32.44
                ],
                "ingress"
            ]
        },
        {
            "id": "Porpen-morrey-sea-route",
            "type": "water-route",
            "curved": true,
            "shipName": "The Western Wanderer",
            "shipType": "Merchant Cog",
            "captainName": "Captain Orys Pennel",
            "routePurpose": "merchant",
            "cargo": "Western spices, dyed cloth, livestock",
            "riskLevel": "low",
            "points": [
                "porpen",
                [
                    12.46,
                    20.02
                ],
                [
                    13.12,
                    21.87
                ],
                [
                    16.6,
                    29.28
                ],
                [
                    16.79,
                    35.63
                ],
                [
                    18.82,
                    42.5
                ],
                "morrey"
            ]
        },
        {
            "id": "evyndar-porpen-sea-route",
            "type": "water-route",
            "curved": true,
            "shipName": "Evyndal Runner",
            "shipType": "Brigantine",
            "captainName": "Captain Daws Vark",
            "routePurpose": "merchant",
            "cargo": "Elven goods, rare herbs, moonstone",
            "riskLevel": "medium",
            "points": [
                "evyndar",
                [
                    18.56,
                    32.44
                ],
                [
                    18.43,
                    32.25
                ],
                [
                    14.81,
                    27.15
                ],
                [
                    12.86,
                    22.39
                ],
                [
                    12.68,
                    20.15
                ],
                "porpen"
            ]
        },
        {
            "id": "stinson-fjordnahl-sea-route",
            "type": "water-route",
            "curved": true,
            "shipName": "The Frozen Wake",
            "shipType": "Longship",
            "captainName": "Captain Sigurd Nahl",
            "routePurpose": "exploration",
            "cargo": "Ice trade, frozen goods, northern maps",
            "riskLevel": "high",
            "points": [
                "stinson",
                [
                    42.38,
                    22.07
                ],
                [
                    40.61,
                    19.6
                ],
                [
                    38.17,
                    13.78
                ],
                "fjordnahl"
            ]
        },
        {
            "id": "nebisill-adamont-sea-route",
            "type": "water-route",
            "curved": true,
            "shipName": "The Jade Serpent",
            "shipType": "Galleon",
            "captainName": "Captain Xara Solum",
            "routePurpose": "merchant",
            "cargo": "Nebisill jade, alchemical reagents, silk",
            "riskLevel": "medium",
            "points": [
                "nebisill",
                [
                    67.41,
                    72.05
                ],
                [
                    67.11,
                    70.37
                ],
                [
                    65.52,
                    69.87
                ],
                [
                    65.02,
                    69.13
                ],
                [
                    64.46,
                    68.63
                ],
                [
                    63.7,
                    68.38
                ],
                [
                    61.98,
                    66.61
                ],
                "adamont"
            ]
        },
        {
            "id": "tratta-farview-sea-road",
            "type": "water-route",
            "curved": true,
            "points": [
                "tratta",
                [
                    72.48,
                    34.77
                ],
                [
                    76.63,
                    31.05
                ],
                [
                    77.25,
                    27.97
                ],
                [
                    78.22,
                    23.22
                ],
                [
                    78.58,
                    18.35
                ],
                [
                    78.76,
                    14.91
                ],
                [
                    79.29,
                    10.87
                ],
                [
                    80.61,
                    9.47
                ],
                [
                    82.85,
                    10.26
                ],
                [
                    84.22,
                    11.76
                ],
                [
                    85.16,
                    15.34
                ],
                [
                    85.81,
                    21.46
                ],
                [
                    86.13,
                    26.33
                ],
                [
                    86.29,
                    31.09
                ],
                [
                    85.32,
                    35.42
                ],
                [
                    84.7,
                    39.46
                ],
                [
                    84.88,
                    42.33
                ],
                [
                    85.04,
                    46.62
                ],
                [
                    84.5,
                    49.27
                ],
                [
                    83.85,
                    51.95
                ],
                [
                    83.05,
                    56.85
                ],
                [
                    82.18,
                    60.18
                ],
                [
                    80.86,
                    63.72
                ],
                [
                    80.9,
                    66.59
                ],
                [
                    79.37,
                    69.56
                ],
                [
                    76.99,
                    72.74
                ],
                [
                    73.83,
                    73.21
                ],
                "farview"
            ],
            "shipName": "The Stowaway",
            "shipType": "Merchant Cog",
            "captainName": "Captain Marna Vex",
            "boatColor": "#3366ff",
            "boatSizeMultiplier": 1,
            "routePurpose": "merchant",
            "cargo": "Spices, Silks",
            "riskLevel": "medium"
        }
    ],
    "regions": []
};
