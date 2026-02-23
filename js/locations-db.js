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
            "x": 79.2,
            "y": 54.9,
            "region": "Blistered Highland",
            "description": "Small Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
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
            "type": "river",
            "x": 65.4,
            "y": 73.36,
            "region": "Mulbrook",
            "description": "Grove",
            "fontFamily": "Garamond MT",
            "fontSize": 10,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 0.5
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
            "x": 61.13,
            "y": 66.35,
            "region": "Mulbrook",
            "description": "City",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.15,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": -62,
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
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 16,
            "markerOffsetY": 0,
            "labelOffsetX": 5,
            "labelOffsetY": 16
        },
        {
            "id": "farnsby-port",
            "name": "Farnsby\nPort",
            "type": "town",
            "x": 63.67,
            "y": 65.4,
            "region": "Mulbrook",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
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
            "id": "c",
            "name": "",
            "type": "town",
            "x": 68.5,
            "y": 61.6,
            "region": "Mulbrook",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
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
            "x": 69.33,
            "y": 61.35,
            "region": "Mulbrook",
            "description": "City",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
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
            "x": 73.6,
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
            "x": 67.6,
            "y": 45.5,
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
        },
        {
            "id": "destons-outpost",
            "name": "Deston's\nOutpost",
            "type": "poi",
            "x": 70.4,
            "y": 51.1,
            "region": "",
            "description": "Point of Interest",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 11,
            "labelOffsetY": -7,
            "opacity": 0.5
        },
        {
            "id": "annagos",
            "name": "Annagos",
            "type": "town",
            "x": 69.55,
            "y": 51.05,
            "region": "",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -57,
            "labelOffsetY": 3
        },
        {
            "id": "staghaven",
            "name": "Staghaven",
            "type": "town",
            "x": 69.3,
            "y": 53.5,
            "region": "",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 8,
            "labelOffsetY": 11
        },
        {
            "id": "witherwood",
            "name": "Witherwood",
            "type": "region",
            "x": 70.4,
            "y": 53.1,
            "region": "",
            "description": "Nature",
            "fontFamily": "Cinzel Decorative",
            "fontSize": 10,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 0.3
        },
        {
            "id": "tynevale",
            "name": "Tyne'vale",
            "type": "town",
            "x": 67.35,
            "y": 54.7,
            "region": "",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -64,
            "labelOffsetY": 7
        },
        {
            "id": "willow-lodge",
            "name": "Willow\nLodge",
            "type": "poi",
            "x": 67.93,
            "y": 53.1,
            "region": "",
            "description": "Outpost",
            "fontFamily": "Garamond MT",
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
            "type": "poi",
            "x": 67.7,
            "y": 51.3,
            "region": "",
            "description": "Outpost",
            "fontFamily": "Garamond MT",
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
            "fontFamily": "Garamond MT",
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
            "type": "city",
            "x": 65.47,
            "y": 57.3,
            "region": "",
            "description": "City",
            "fontFamily": "Simonetta",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.15,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -57,
            "labelOffsetY": -6
        },
        {
            "id": "mount-emberstrand",
            "name": "Mount\nEmberstrand",
            "type": "region",
            "x": 62.7,
            "y": 55.5,
            "region": "",
            "description": "Nature",
            "fontFamily": "Cinzel Decorative",
            "fontSize": 24,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
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
            "fontFamily": "Garamond MT",
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
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -40,
            "labelOffsetY": 17
        },
        {
            "id": "ulgrey",
            "name": "Ulgrey",
            "type": "town",
            "x": 62.87,
            "y": 60.8,
            "region": "",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -56,
            "labelOffsetY": 0
        },
        {
            "id": "tower-of-zibeus",
            "name": "Tower of\nZibeus",
            "type": "poi",
            "x": 62.6,
            "y": 61.7,
            "region": "",
            "description": "Point of Interest",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -19,
            "labelOffsetY": 17,
            "opacity": 0.5
        },
        {
            "id": "kahlbits-veil",
            "name": "Kahlbit's\nVeil",
            "type": "region",
            "x": 64.2,
            "y": 62.5,
            "region": "",
            "description": "Nature",
            "fontFamily": "Cinzel Decorative",
            "fontSize": 12,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 0.5
        },
        {
            "id": "the-glimmering-sea",
            "name": "The\nGlimmering\nSea",
            "type": "water",
            "x": 59.1,
            "y": 61.9,
            "region": "",
            "description": "Nature",
            "fontFamily": "Cinzel Decorative",
            "fontSize": 30,
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
            "id": "silverhill",
            "name": "Silverhill",
            "type": "poi",
            "x": 64.87,
            "y": 45.5,
            "region": "",
            "description": "Point of Interest",
            "fontFamily": "Garamond MT",
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
            "region": "",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
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
            "region": "",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
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
            "id": "ofwood",
            "name": "Ofwood",
            "type": "town",
            "x": 65.4,
            "y": 38.96,
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
            "id": "crimson-pins",
            "name": "Crimson Pines",
            "type": "region",
            "x": 64.4,
            "y": 38.3,
            "region": "",
            "description": "Nature",
            "fontFamily": "Cinzel Decorative",
            "fontSize": 10,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 0.5
        },
        {
            "id": "mirstone",
            "name": "Mirstone",
            "type": "town",
            "x": 63.6,
            "y": 43.6,
            "region": "",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
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
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.15,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -38,
            "labelOffsetY": 19
        },
        {
            "id": "offwood-crossroad",
            "name": "",
            "type": "town",
            "x": 65.16,
            "y": 40.74,
            "region": "",
            "description": "Town",
            "fontFamily": "Garamond MT",
            "fontSize": 1,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.01,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 10,
            "labelOffsetY": 3
        },
        {
            "id": "gur-madihl",
            "name": "Gur\nMadihl",
            "type": "city",
            "x": 63.1,
            "y": 46.04,
            "region": "",
            "description": "City",
            "fontFamily": "Garamond MT",
            "fontSize": 14,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.15,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": -37,
            "labelOffsetY": 5
        },
        {
            "id": "stonewood",
            "name": "Stonewood",
            "type": "region",
            "x": 65.4,
            "y": 44.3,
            "region": "",
            "description": "Nature",
            "fontFamily": "Cinzel Decorative",
            "fontSize": 10,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 0.5
        },
        {
            "id": "brokenflow",
            "name": "Brokenflow",
            "type": "river",
            "x": 67.99,
            "y": 41.07,
            "region": "",
            "description": "Nature",
            "fontFamily": "Garamond MT",
            "fontSize": 7,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "rotation": -35,
            "opacity": 0.5
        },
        {
            "id": "witherwood-river",
            "name": "Witherwood River",
            "type": "river",
            "x": 71.61,
            "y": 54.63,
            "region": "",
            "description": "Nature",
            "fontFamily": "Garamond MT",
            "fontSize": 10,
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
            "x": 68.87,
            "y": 54.82,
            "region": "",
            "description": "Nature",
            "fontFamily": "Garamond MT",
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
            "x": 66.6,
            "y": 51.84,
            "region": "",
            "description": "Nature",
            "fontFamily": "Garamond MT",
            "fontSize": 10,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 0.5
        },
        {
            "id": "stillbluff",
            "name": "Stillbluff",
            "type": "region",
            "x": 74.29,
            "y": 70.63,
            "region": "",
            "description": "Nature",
            "fontFamily": "Cinzel Decorative",
            "fontSize": 8,
            "fontWeight": "300",
            "fontStyle": "Italic",
            "markerSize": 0.25,
            "markerOffsetX": 0,
            "markerOffsetY": 0,
            "labelOffsetX": 0,
            "labelOffsetY": 0,
            "opacity": 0.5
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
            ]
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
            ]
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
            ]
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
            ]
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
            ]
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
            ]
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
            ]
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
            ]
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
                "c"
            ]
        },
        {
            "id": "cross-road-1",
            "type": "minor",
            "curved": true,
            "points": [
                "c",
                [
                    68.2,
                    61.6
                ],
                [
                    67.6,
                    63.5
                ],
                "bistron"
            ]
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
                "c"
            ]
        },
        {
            "id": "bistron-road",
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
            ]
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
            ]
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
            ]
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
            ]
        },
        {
            "id": "scarbrook-road",
            "type": "minor",
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
            ]
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
            ]
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
            ]
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
            ]
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
            ]
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
            ]
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
            ]
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
            ]
        },
        {
            "id": "ulgrey-road-southwest",
            "type": "minor",
            "curved": true,
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
            ]
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
            ]
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
            ]
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
            ]
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
            ]
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
            ]
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
            ]
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
            ]
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
            ]
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
            ]
        }
    ],
    "regions": []
};
