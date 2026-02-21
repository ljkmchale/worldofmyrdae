/**
 * World of Myrdae - Default Location Database
 * 
 * This file contains the default data for locations, roads, and regions.
 * It is loaded as a script to bypass CORS restrictions when running locally via file:// protocol.
 */

const WORLD_LOCATIONS = {
    "locations": [
        {
            "id": "otesurr-mountains",
            "name": "Otesurr\nMountains",
            "type": "region",
            "x": 81.7,
            "y": 25.6,
            "region": "Otesurr Mountains",
            "description": "The Otesurr Mountains are a vast mountain range in the far northeast of Myrdae.",
            "fontSize": 20,
            "opacity": 0.5,
            "markerSize": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3,
            "fontFamily": "Cinzel Decorative"
        },
        {
            "id": "lurdoba",
            "name": "Lurdoba",
            "type": "city",
            "x": 77.7,
            "y": 31.7,
            "region": "Otesurr Mountains",
            "description": "Testing save bug",
            "fontFamily": "Garamond MT",
            "fontSize": 18,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.15,
            "markerOffsetX": 10,
            "markerOffsetY": 0,
            "labelOffsetX": -2,
            "labelOffsetY": -13
        },
        {
            "id": "kallilos",
            "name": "Kallilos",
            "type": "town",
            "x": 78.3,
            "y": 32.3,
            "region": "Otesurr Mountains",
            "description": "A town off the coast of The Broken Deep.",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 12,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3
        },
        {
            "id": "sari-lenora",
            "name": "Sari Lenora",
            "type": "town",
            "x": 77.9,
            "y": 34.4,
            "region": "Otesurr Mountains",
            "description": "A rugged northern settlement.",
            "fontFamily": "Garamond MT",
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
            "id": "clador",
            "name": "Clador",
            "type": "town",
            "x": 77.4,
            "y": 36.3,
            "region": "Otesurr Mountains",
            "description": "A rugged northern settlement.",
            "fontFamily": "Garamond MT",
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
            "id": "buvero",
            "name": "Buvero",
            "type": "town",
            "x": 76,
            "y": 35.9,
            "region": "Otesurr Mountains",
            "description": "A rugged mountain settlement.",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -20,
            "labelOffsetY": -10
        },
        {
            "id": "sulura",
            "name": "Sulura",
            "type": "city",
            "x": 74.34,
            "y": 35.4,
            "region": "Otesurr Mountains",
            "description": "A tundra town in the far northeast.",
            "fontFamily": "Garamond MT",
            "fontSize": 18,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.15,
            "markerOffsetX": 10,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3
        },
        {
            "id": "sunbay",
            "name": "Sunbay",
            "type": "town",
            "x": 73.6,
            "y": 37.1,
            "region": "Otesurr Mountains",
            "description": "A coastal settlement.",
            "fontFamily": "Garamond MT",
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
            "id": "sands-of-the-dead",
            "name": "Sands of the\nDead",
            "type": "region",
            "x": 75,
            "y": 39.8,
            "region": "Sands of the Dead",
            "description": "Sands of the Dead",
            "fontSize": 16,
            "opacity": 0.5,
            "fontFamily": "Garamond MT",
            "fontWeight": "300",
            "markerSize": 0,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3
        },
        {
            "id": "ahnassa",
            "name": "Ahnassa",
            "type": "town",
            "x": 72.9,
            "y": 38.2,
            "region": "Otesurr Mountains",
            "description": "A coastal settlement.",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 15
        },
        {
            "id": "hesfal",
            "name": "Hesfal",
            "type": "town",
            "x": 71.8,
            "y": 40.5,
            "region": "Sands of the Dead",
            "description": "A coastal settlement.",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -48,
            "labelOffsetY": 9
        },
        {
            "id": "boneforge",
            "name": "Boneforge",
            "type": "town",
            "x": 73.3,
            "y": 41.2,
            "region": "Sands of the Dead",
            "description": "A coastal settlement.",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -5,
            "labelOffsetY": -10
        },
        {
            "id": "deadfield",
            "name": "Deadfield",
            "type": "city",
            "x": 74.8,
            "y": 42,
            "region": "Sands of the Dead",
            "description": "A coastal settlement.",
            "fontFamily": "Garamond MT",
            "fontSize": 18,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.15,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 15
        },
        {
            "id": "torpoint",
            "name": "Torpoint",
            "type": "town",
            "x": 74.1,
            "y": 42.8,
            "region": "Sands of the Dead",
            "description": "A coastal settlement.",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -47,
            "labelOffsetY": -10
        },
        {
            "id": "sulport",
            "name": "Sulport",
            "type": "town",
            "x": 71,
            "y": 38.2,
            "region": "Sands of the Dead",
            "description": "A coastal settlement.",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": -10
        },
        {
            "id": "ripshod-bay",
            "name": "Ripshod Bay",
            "type": "water",
            "x": 72.4,
            "y": 37.8,
            "region": "Ripshod Bay",
            "description": "Ripshod Bay",
            "fontFamily": "Garamond MT",
            "fontSize": 18,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "opacity": 0.5,
            "markerSize": 0,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0
        },
        {
            "id": "tratta",
            "name": "Tratta",
            "type": "city",
            "x": 70.6,
            "y": 35.9,
            "region": "Sands of the Dead",
            "description": "A coastal settlement.",
            "fontFamily": "Garamond MT",
            "fontSize": 18,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.15,
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
            "region": "Ripshod Bay",
            "description": "Ripshod Bay",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
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
            "y": 39.1,
            "region": "Yearning Slough",
            "description": "Yearning Slough",
            "fontFamily": "Garamond MT",
            "fontSize": 16,
            "fontWeight": "300",
            "opacity": 0.5,
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0
        },
        {
            "id": "greenvale",
            "name": "Greenvale",
            "type": "town",
            "x": 69.5,
            "y": 40.5,
            "region": "Yearning Slough",
            "description": "Ripshod Bay",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
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
            "region": "Yearning Slough",
            "description": "Ripshod Bay",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -82,
            "labelOffsetY": 9
        },
        {
            "id": "zovraesdrias-hollow",
            "name": "Zovraesdria's\n   Hollow",
            "type": "poi",
            "x": 68.3,
            "y": 38.8,
            "region": "Yearning Slough",
            "description": "",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -60,
            "labelOffsetY": -16
        },
        {
            "id": "gunikk",
            "name": "Gunikk",
            "type": "town",
            "x": 74.6,
            "y": 45,
            "region": "Blistered Highland",
            "description": "Small Town",
            "fontFamily": "Garamond MT",
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
            "id": "thrargael",
            "name": "Thrargael",
            "type": "capital",
            "x": 74.95,
            "y": 47.6,
            "region": "Yearning Slough",
            "description": "Capital of the Kingdom of Myrdae",
            "fontFamily": "Garamond MT",
            "fontSize": 18,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.13,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 16
        },
        {
            "id": "ancientarena",
            "name": "Ancient\nArena",
            "type": "poi",
            "x": 76.7,
            "y": 43.8,
            "region": "Yearning Slough",
            "description": "Capital of the Kingdom of Myrdae",
            "fontFamily": "Garamond MT",
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
            "x": 78.3,
            "y": 46,
            "region": "Blistered Highland",
            "description": "Blistered Highland",
            "fontFamily": "Copperplate Gothic",
            "fontSize": 12,
            "fontWeight": "300",
            "rotation": 0,
            "opacity": 0.5,
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0
        },
        {
            "id": "nalt",
            "name": "Nalt",
            "type": "town",
            "x": 78.5,
            "y": 43.5,
            "region": "Blistered Highland",
            "description": "Small Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -35,
            "labelOffsetY": 0
        },
        {
            "id": "the-withered-spire",
            "name": "The\nWithered Spire",
            "type": "poi",
            "x": 77.8,
            "y": 47.2,
            "region": "Yearning Slough",
            "description": "Capital of the Kingdom of Myrdae",
            "fontFamily": "Garamond MT",
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
            "region": "Blistered Highland",
            "description": "Small Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -45,
            "labelOffsetY": -1
        },
        {
            "id": "cragflight",
            "name": "Cragflight",
            "type": "poi",
            "x": 75.4,
            "y": 50.9,
            "region": "Blistered Highland",
            "description": "",
            "fontFamily": "Garamond MT",
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
            "region": "Blistered Highland",
            "description": "Small Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -55,
            "labelOffsetY": 3
        },
        {
            "id": "irebend",
            "name": "Ire'bend",
            "type": "town",
            "x": 78.1,
            "y": 53.1,
            "region": "Blistered Highland",
            "description": "Small Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 12,
            "labelOffsetY": -5
        },
        {
            "id": "bareford",
            "name": "Bareford",
            "type": "town",
            "x": 79.3,
            "y": 54.9,
            "region": "Blistered Highland",
            "description": "Small Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -65,
            "labelOffsetY": 3
        },
        {
            "id": "porthbay",
            "name": "Porthbay",
            "type": "town",
            "x": 80.8,
            "y": 56.2,
            "region": "Blistered Highland",
            "description": "Small Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -15,
            "labelOffsetY": -15
        },
        {
            "id": "dragonstone",
            "name": "Dragonstone",
            "type": "poi",
            "x": 78.7,
            "y": 57.7,
            "region": "Blistered Highland",
            "description": "Small Town",
            "fontFamily": "Garamond MT",
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
            "x": 76.5,
            "y": 59.4,
            "region": "Dragonspine Mountains",
            "description": "Dragonspine Mountains",
            "fontFamily": "Copperplate Gothic",
            "fontSize": 24,
            "fontWeight": "300",
            "rotation": 11,
            "opacity": 0.5,
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0
        },
        {
            "id": "blustery-waste",
            "name": "Blustery\nWaste",
            "type": "region",
            "x": 74.5,
            "y": 65.2,
            "region": "Blustery Waste",
            "description": "Blustery Waste",
            "fontFamily": "Copperplate Gothic",
            "fontSize": 20,
            "fontWeight": "300",
            "rotation": 0,
            "opacity": 0.5,
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0
        },
        {
            "id": "talbesar",
            "name": "Tal'besar",
            "type": "town",
            "x": 73.1,
            "y": 64.7,
            "region": "Blustery Waste",
            "description": "Small Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
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
            "region": "Blustery Waste",
            "description": "Small Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -65,
            "labelOffsetY": -5
        },
        {
            "id": "eye-of-arbescar",
            "name": "Eye of\nArbescar",
            "type": "water",
            "x": 72.8,
            "y": 69.4,
            "region": "Eye of Arbescar",
            "description": "Eye of Arbescar",
            "fontFamily": "Garamond MT",
            "fontSize": 12,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "opacity": 0.5,
            "markerSize": 0,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0
        },
        {
            "id": "glaspero",
            "name": "Glaspero",
            "type": "town",
            "x": 70.3,
            "y": 68.3,
            "region": "Arbescar",
            "description": "Small Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -40,
            "labelOffsetY": -10
        },
        {
            "id": "marrowdale",
            "name": "Marrowdale",
            "type": "capital",
            "x": 70.6,
            "y": 69.7,
            "region": "Arbescar",
            "description": "Capital",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.1,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 10
        },
        {
            "id": "farview",
            "name": "Farview",
            "type": "town",
            "x": 71.9,
            "y": 72.1,
            "region": "Arbescar",
            "description": "Port Town",
            "fontFamily": "Garamond MT",
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
            "id": "dire-of-arbescar",
            "name": "Dire of\nArbescar",
            "type": "region",
            "x": 69.4,
            "y": 73.5,
            "region": "Dire of Arbescar",
            "description": "Dire of Arbescar",
            "fontFamily": "Garamond MT",
            "fontSize": 12,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3
        },
        {
            "id": "nebisill",
            "name": "Nebisill",
            "type": "town",
            "x": 68.25,
            "y": 72.7,
            "region": "Arbescar",
            "description": "Port Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -50,
            "labelOffsetY": -5
        },
        {
            "id": "siltbay",
            "name": "Siltbay",
            "type": "water",
            "x": 69.7,
            "y": 67,
            "region": "Arbescar",
            "description": "Port Town",
            "fontFamily": "Garamond MT",
            "fontSize": 30,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "opacity": 0.5,
            "markerSize": 0,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0
        },
        {
            "id": "stillbluff",
            "name": "Stillbluff",
            "type": "nature",
            "x": 76.5,
            "y": 69.3,
            "region": "Arbescar",
            "description": "Forest",
            "fontFamily": "Cinzel Decorative",
            "fontSize": 12,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "opacity": 0.5,
            "markerSize": 0,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0
        },
        {
            "id": "longwood",
            "name": "Longwood",
            "type": "nature",
            "x": 71.7,
            "y": 69.7,
            "region": "Arbescar",
            "description": "Forest",
            "fontFamily": "Cinzel Decorative",
            "fontSize": 12,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "opacity": 0.5,
            "markerSize": 0,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0
        },
        {
            "id": "nebisill-grove",
            "name": "Nebisill\nGrove",
            "type": "nature",
            "x": 70.1,
            "y": 71.7,
            "region": "Arbescar",
            "description": "Grove",
            "fontFamily": "Cinzel Decorative",
            "fontSize": 12,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "opacity": 0.5,
            "markerSize": 0,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0
        },
        {
            "id": "mulshear",
            "name": "Mulshear",
            "type": "town",
            "x": 65.85,
            "y": 74.22,
            "region": "Mulbrook",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 5
        },
        {
            "id": "mulbrook",
            "name": "Mulbrook",
            "type": "nature",
            "x": 65.3,
            "y": 73.5,
            "region": "Mulbrook",
            "description": "Grove",
            "fontFamily": "Cinzel Decorative",
            "fontSize": 10,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "opacity": 0.5,
            "markerSize": 0,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0
        },
        {
            "id": "multear-swamps",
            "name": "Multear\nSwamps",
            "type": "nature",
            "x": 63.9,
            "y": 75.7,
            "region": "Mulbrook",
            "description": "Swamps",
            "fontFamily": "Cinzel Decorative",
            "fontSize": 12,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "opacity": 0.5,
            "markerSize": 0,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0
        },
        {
            "id": "silvermead-knolls",
            "name": "Silvermead\nKnolls",
            "type": "nature",
            "x": 63.9,
            "y": 71.9,
            "region": "Mulbrook",
            "description": "Knolls",
            "fontFamily": "Cinzel Decorative",
            "fontSize": 12,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "opacity": 0.5,
            "markerSize": 0,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0
        },
        {
            "id": "hillside-woods",
            "name": "Hillside\nWoods",
            "type": "nature",
            "x": 62.5,
            "y": 74.3,
            "region": "Mulbrook",
            "description": "Woods",
            "fontFamily": "Cinzel Decorative",
            "fontSize": 12,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "opacity": 0.5,
            "markerSize": 0,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0
        },
        {
            "id": "bickerfeld",
            "name": "Bickerfeld",
            "type": "town",
            "x": 65.8,
            "y": 70.2,
            "region": "Mulbrook",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 5
        },
        {
            "id": "nuwharf",
            "name": "Nuwharf",
            "type": "town",
            "x": 65.55,
            "y": 69.4,
            "region": "Mulbrook",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 5
        },
        {
            "id": "silvermead",
            "name": "Silvermead",
            "type": "town",
            "x": 62.7,
            "y": 69.7,
            "region": "Mulbrook",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 5
        },
        {
            "id": "eldeff",
            "name": "Eldeff",
            "type": "town",
            "x": 60.2,
            "y": 69.35,
            "region": "Mulbrook",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 5
        },
        {
            "id": "adamont",
            "name": "Adamont",
            "type": "city",
            "x": 61.14,
            "y": 66.3,
            "region": "Mulbrook",
            "description": "City",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.15,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 5
        },
        {
            "id": "trailpoint",
            "name": "Trailpoint",
            "type": "town",
            "x": 64.7,
            "y": 65.5,
            "region": "Mulbrook",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 5
        },
        {
            "id": "farnsby-port",
            "name": "Farnsby\nPort",
            "type": "town",
            "x": 63.65,
            "y": 65.3,
            "region": "Mulbrook",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -30,
            "labelOffsetY": 15
        },
        {
            "id": "bistron",
            "name": "Bistron",
            "type": "town",
            "x": 66.6,
            "y": 64,
            "region": "Mulbrook",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 5
        },
        {
            "id": "unknown-1",
            "name": "",
            "type": "town",
            "x": 68.5,
            "y": 61.6,
            "region": "Mulbrook",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -25,
            "labelOffsetY": -15
        },
        {
            "id": "edgewind",
            "name": "Edgewind",
            "type": "city",
            "x": 69.4,
            "y": 61.2,
            "region": "Mulbrook",
            "description": "City",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.15,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -25,
            "labelOffsetY": -15
        },
        {
            "id": "boldshire",
            "name": "Boldshire",
            "type": "town",
            "x": 67.7,
            "y": 60.2,
            "region": "Mulbrook",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -25,
            "labelOffsetY": -15
        },
        {
            "id": "caristone-forest",
            "name": "Caristone\nForest",
            "type": "nature",
            "x": 71.2,
            "y": 60.9,
            "region": "Mulbrook",
            "description": "Woods",
            "fontFamily": "Cinzel Decorative",
            "fontSize": 12,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "opacity": 0.5,
            "markerSize": 0,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0
        },
        {
            "id": "tomb-of-amberblade",
            "name": "Tomb of\nAmberblade",
            "type": "poi",
            "x": 63.4,
            "y": 61,
            "region": "Mulbrook",
            "description": "Tomb",
            "fontFamily": "Cinzel Decorative",
            "fontSize": 12,
            "fontStyle": "Italic",
            "fontWeight": "300",
            "opacity": 0.5,
            "markerSize": 0,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0
        },
        {
            "id": "deepspring",
            "name": "Deepspring",
            "type": "town",
            "x": 72.5,
            "y": 43.6,
            "region": "",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -5,
            "labelOffsetY": 20
        },
        {
            "id": "ngundeer",
            "name": "N'gundeer",
            "type": "town",
            "x": 71.8,
            "y": 45.9,
            "region": "Searing Flats",
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
            "id": "fakul",
            "name": "Fakul",
            "type": "town",
            "x": 70.2,
            "y": 46.9,
            "region": "",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -27,
            "labelOffsetY": -9
        },
        {
            "id": "scarwatch-hold",
            "name": "Scarwatch\nHold",
            "type": "poi",
            "x": 71.6,
            "y": 42.4,
            "region": "",
            "description": "Point of Interest",
            "fontFamily": "Garamond MT",
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
            "id": "kylnn",
            "name": "Kylnn",
            "type": "town",
            "x": 73.4,
            "y": 48.4,
            "region": "",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -41,
            "labelOffsetY": 10
        },
        {
            "id": "searing-flats",
            "name": "Searing\nFlats",
            "type": "region",
            "x": 71.5,
            "y": 47.5,
            "region": "",
            "description": "",
            "fontFamily": "Copperplate Gothic",
            "fontSize": 12,
            "markerSize": 1,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "opacity": 0.5
        },
        {
            "id": "jagged-waste-crags",
            "name": "Jagged Waste Crags",
            "type": "region",
            "x": 72.5,
            "y": 49.4,
            "region": "",
            "description": "",
            "fontFamily": "Copperplate Gothic",
            "fontSize": 24,
            "markerSize": 1,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "rotation": -95,
            "textCurve": -50,
            "opacity": 0.2
        },
        {
            "id": "edgerest-forest",
            "name": "Edgerest\nForest",
            "type": "region",
            "x": 68.3,
            "y": 43.1,
            "region": "",
            "description": "",
            "fontFamily": "Cinzel Decorative",
            "fontSize": 12,
            "markerSize": 1,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "opacity": 0.3
        },
        {
            "id": "wuldrif",
            "name": "Wuldrif",
            "type": "town",
            "x": 67.7,
            "y": 41.6,
            "region": "",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -5,
            "labelOffsetY": 18
        },
        {
            "id": "alburest",
            "name": "Alburest",
            "type": "city",
            "x": 66.83,
            "y": 42.8,
            "region": "",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.15,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 8,
            "labelOffsetY": 10
        },
        {
            "id": "olestack",
            "name": "Ole'stack",
            "type": "town",
            "x": 67.5,
            "y": 45.2,
            "region": "",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -1,
            "labelOffsetY": -11
        },
        {
            "id": "lochlorn",
            "name": "Lochlorn",
            "type": "water",
            "x": 66.2,
            "y": 42.7,
            "region": "",
            "description": "Nature",
            "fontFamily": "Cinzel Decorative",
            "fontSize": 9,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 0.5
        },
        {
            "id": "igborne",
            "name": "Igburne",
            "type": "town",
            "x": 68.8,
            "y": 46.3,
            "region": "",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
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
            "region": "",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -36,
            "labelOffsetY": 17
        },
        {
            "id": "ulkef",
            "name": "Ulkef",
            "type": "city",
            "x": 69.5,
            "y": 48.7,
            "region": "",
            "description": "City",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.15,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -48,
            "labelOffsetY": 1
        },
        {
            "id": "rosevale",
            "name": "Rosevale",
            "type": "town",
            "x": 70.2,
            "y": 49.3,
            "region": "",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -7,
            "labelOffsetY": -9
        },
        {
            "id": "sandgrave",
            "name": "Sandgrave",
            "type": "town",
            "x": 72.3,
            "y": 51.5,
            "region": "",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -6,
            "labelOffsetY": -14
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
            ]
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
            ]
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
            ]
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
            ]
        },
        {
            "id": "clador-road-2",
            "type": "minor",
            "curved": true,
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
            ]
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
            ]
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
            ]
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
            ]
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
            ]
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
            ]
        },
        {
            "id": "boneforge-road",
            "type": "major",
            "curved": true,
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
            ]
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
            ]
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
            ]
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
            ]
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
            ]
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
            ]
        },
        {
            "id": "d-road",
            "type": "minor",
            "curved": true,
            "points": []
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
            ]
        },
        {
            "id": "n-road",
            "type": "minor",
            "curved": true,
            "points": []
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
            ]
        },
        {
            "id": "h-road",
            "type": "minor",
            "curved": true,
            "points": []
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
            ]
        },
        {
            "id": "n-road",
            "type": "minor",
            "curved": true,
            "points": []
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
            ]
        },
        {
            "id": "s-road",
            "type": "minor",
            "curved": true,
            "points": []
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
            ]
        },
        {
            "id": "t-road",
            "type": "minor",
            "curved": true,
            "points": []
        },
        {
            "id": "tratta-road",
            "type": "major",
            "curved": true,
            "points": [
                "del-bris",
                [
                    70.9,
                    37.9
                ],
                [
                    70.74,
                    37.1
                ],
                ""
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
            ]
        },
        {
            "id": "g-road",
            "type": "minor",
            "curved": true,
            "points": []
        },
        {
            "id": "greenvale-road",
            "type": "major",
            "curved": true,
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
            ]
        },
        {
            "id": "w-road",
            "type": "minor",
            "curved": true,
            "points": []
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
            ]
        },
        {
            "id": "a-road",
            "type": "minor",
            "curved": true,
            "points": []
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
            ]
        },
        {
            "id": "o-road",
            "type": "minor",
            "curved": true,
            "points": []
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
            ]
        },
        {
            "id": "i-road",
            "type": "minor",
            "curved": true,
            "points": []
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
            ]
        },
        {
            "id": "o-road",
            "type": "minor",
            "curved": true,
            "points": []
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
            ]
        },
        {
            "id": "u-road",
            "type": "minor",
            "curved": true,
            "points": []
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
            ]
        },
        {
            "id": "t-road",
            "type": "minor",
            "curved": true,
            "points": []
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
            ]
        },
        {
            "id": "r-road",
            "type": "minor",
            "curved": true,
            "points": []
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
            ]
        },
        {
            "id": "s-road",
            "type": "minor",
            "curved": true,
            "points": []
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
            ]
        },
        {
            "id": "r-road",
            "type": "minor",
            "curved": true,
            "points": []
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
            ]
        },
        {
            "id": "r-road",
            "type": "minor",
            "curved": true,
            "points": []
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
            ]
        },
        {
            "id": "s-road",
            "type": "minor",
            "curved": true,
            "points": []
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
            ]
        }
    ],
    "regions": []
};
