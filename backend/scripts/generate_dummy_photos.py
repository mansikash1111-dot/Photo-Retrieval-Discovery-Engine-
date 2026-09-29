import os
import json
import random
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.config import settings, DATA_DIR, PHOTOS_DIR, METADATA_DIR, TASKS_DIR

# Define 19 rich scenarios matching user requests (Photos, Screenshots, Documents, Videos)
SCENARIOS = [
    {
        "category": "travel",
        "event": "Goa trip",
        "location": "Goa, India",
        "scene": ["beach", "cafe"],
        "activity": ["sitting", "drinking coffee"],
        "weather": "sunny",
        "time_of_day": "afternoon",
        "base_desc": "Friends sitting at a small cafe near the beach in Goa.",
        "keywords": ["Goa", "beach", "cafe", "coffee", "friends", "trip", "ocean"]
    },
    {
        "category": "travel",
        "event": "Mountain trekking",
        "location": "Manali, Himachal",
        "scene": ["mountains", "hiking trail"],
        "activity": ["trekking", "sightseeing"],
        "weather": "rainy",
        "time_of_day": "morning",
        "base_desc": "Trekking on a scenic mountain pine tree trail with friends.",
        "keywords": ["trekking", "hiking", "trail", "backpacking", "nature", "mountains", "forest"]
    },
    {
        "category": "travel",
        "event": "Heritage tour",
        "location": "Jaipur, Rajasthan",
        "scene": ["fort", "palace", "pink city"],
        "activity": ["sightseeing", "architecture photography"],
        "weather": "sunny",
        "time_of_day": "afternoon",
        "base_desc": "Sightseeing at Amber Fort and heritage pink city palaces in Jaipur.",
        "keywords": ["Jaipur", "fort", "Amber palace", "pink city", "heritage", "architecture", "Rajasthan"]
    },
    {
        "category": "family",
        "event": "Family gathering",
        "location": "Home Dining Room",
        "scene": ["dining table", "home indoor"],
        "activity": ["eating dinner", "laughing"],
        "weather": "clear",
        "time_of_day": "evening",
        "base_desc": "Warm family reunion dinner sitting around a crowded table at home.",
        "keywords": ["family", "reunion", "dinner", "gathering", "home", "food", "relatives"]
    },
    {
        "category": "events",
        "event": "Birthday party",
        "location": "Party Hall",
        "scene": ["party hall", "decorations"],
        "activity": ["cutting cake", "celebrating"],
        "weather": "indoor",
        "time_of_day": "evening",
        "base_desc": "Birthday party with friends, colorful balloons, and chocolate cake on table.",
        "keywords": ["birthday", "party", "friends", "cake", "candles", "balloons", "celebration"]
    },
    {
        "category": "events",
        "event": "Diwali celebration",
        "location": "Home Courtyard",
        "scene": ["home outdoor", "rangoli"],
        "activity": ["lighting diyas", "sparklers"],
        "weather": "night",
        "time_of_day": "night",
        "base_desc": "Diwali celebration with friends and family lighting traditional diyas and sparklers.",
        "keywords": ["Diwali", "festival", "diyas", "lights", "sparklers", "traditional outfits", "family", "friends"]
    },
    {
        "category": "pets",
        "event": "Pets with owner",
        "location": "City Park",
        "scene": ["park grass", "lake"],
        "activity": ["playing fetch", "hugging pet"],
        "weather": "sunset",
        "time_of_day": "sunset",
        "base_desc": "Golden retriever playing fetch with owner on green grass in the park.",
        "keywords": ["pet", "dog", "owner", "cat", "playing", "park", "golden retriever", "hug"]
    },
    {
        "category": "food",
        "event": "Restaurant dining",
        "location": "Downtown Bistro",
        "scene": ["restaurant indoor", "dining table"],
        "activity": ["eating", "drinking coffee"],
        "weather": "indoor",
        "time_of_day": "afternoon",
        "base_desc": "Cozy restaurant dining table with coffee, appetizers, and warm indoor lights.",
        "keywords": ["restaurant", "dining", "food", "cafe", "dinner table", "coffee", "menu"]
    },
    {
        "category": "travel",
        "event": "Himalayan mountain",
        "location": "Himalayas, India",
        "scene": ["snow peaks", "high altitude"],
        "activity": ["mountain viewing", "expedition"],
        "weather": "cold",
        "time_of_day": "morning",
        "base_desc": "Breathtaking high altitude snowy Himalayan mountain peaks during expedition.",
        "keywords": ["Himalayas", "mountain", "snow", "peaks", "Manali", "high altitude", "trekking"]
    },
    {
        "category": "food",
        "event": "Food photos",
        "location": "Gourmet Kitchen",
        "scene": ["food platter", "table"],
        "activity": ["food photography"],
        "weather": "indoor",
        "time_of_day": "afternoon",
        "base_desc": "Delicious food platter featuring gourmet pizza, pasta, and Indian thali dishes.",
        "keywords": ["food", "dishes", "pizza", "pasta", "indian thali", "dessert", "delicious", "meal"]
    },
    {
        "category": "activities",
        "event": "Dancing class",
        "location": "Dance Studio A",
        "scene": ["dance studio", "mirrors", "wood floor"],
        "activity": ["dancing rehearsal", "salsa practice", "hip hop class"],
        "weather": "indoor",
        "time_of_day": "evening",
        "base_desc": "Dance studio class rehearsal with friends practicing choreography in front of mirrors.",
        "keywords": ["dancing class", "dance studio", "dancing", "rehearsal", "salsa", "hip hop", "dance practice"]
    },
    {
        "category": "activities",
        "event": "Swimming classes",
        "location": "Aquatic Sports Center",
        "scene": ["swimming pool", "poolside", "clear blue water"],
        "activity": ["swimming lesson", "swimming laps", "diving"],
        "weather": "sunny",
        "time_of_day": "morning",
        "base_desc": "Swimming class lesson in a clear blue indoor pool with goggles and instructor.",
        "keywords": ["swimming classes", "swimming pool", "swim lesson", "pool water", "swimming laps", "diver", "aquatics"]
    },
    {
        "category": "events",
        "event": "Holi celebration",
        "location": "Outdoor Lawn",
        "scene": ["outdoor lawn", "festival colors"],
        "activity": ["playing colors", "splashing gulal"],
        "weather": "sunny",
        "time_of_day": "morning",
        "base_desc": "Vibrant Holi festival of colors celebration with friends and family throwing gulal.",
        "keywords": ["Holi", "festival", "colors", "gulal", "friends", "family", "celebration", "pichkari"]
    },
    {
        "category": "events",
        "event": "Club party",
        "location": "Nightclub Lounge",
        "scene": ["dance floor", "DJ booth"],
        "activity": ["dancing", "enjoying music"],
        "weather": "indoor",
        "time_of_day": "night",
        "base_desc": "Nightclub party with friends under vibrant purple and blue laser lights.",
        "keywords": ["club", "party", "nightclub", "friends", "dancing", "lights", "music", "drinks"]
    },
    {
        "category": "screenshots",
        "event": "Outfit ideas",
        "location": "Mobile Screen",
        "scene": ["fashion board", "screenshot"],
        "activity": ["saving outfit ideas"],
        "weather": "digital",
        "time_of_day": "day",
        "base_desc": "Screenshot of stylish fashion outfit ideas, clothing combinations, and OOTD board.",
        "keywords": ["screenshot", "outfit", "clothing", "style", "OOTD", "fashion", "shopping", "ideas"]
    },
    {
        "category": "screenshots",
        "event": "Positive thoughts",
        "location": "Mobile Screen",
        "scene": ["quote card", "text screenshot"],
        "activity": ["saving quotes"],
        "weather": "digital",
        "time_of_day": "day",
        "base_desc": "Screenshot of an inspiring positive thought and motivational mindset quote.",
        "keywords": ["screenshot", "positive thought", "quote", "motivational", "inspiration", "text", "mindset"]
    },
    {
        "category": "screenshots",
        "event": "Social media comments",
        "location": "Mobile Screen",
        "scene": ["discussion thread", "tweet screenshot"],
        "activity": ["saving comments"],
        "weather": "digital",
        "time_of_day": "day",
        "base_desc": "Screenshot of an interesting social media comment thread and viral tweet discussion.",
        "keywords": ["screenshot", "social media", "comment", "tweet", "discussion", "post", "chat"]
    },
    {
        "category": "documents",
        "event": "Restaurant receipts",
        "location": "Document Scan",
        "scene": ["paper receipt", "tax invoice"],
        "activity": ["scanning receipt"],
        "weather": "digital",
        "time_of_day": "day",
        "base_desc": "Scan of a restaurant bill receipt showing total tax invoice breakdown and meal items.",
        "keywords": ["document", "receipt", "bill", "restaurant receipt", "tax invoice", "scan", "paper", "expense"]
    },
    {
        "category": "videos",
        "event": "Cafe video clips",
        "location": "Cafe & Lounge",
        "scene": ["cafe ambiance", "video clip"],
        "activity": ["filming video"],
        "weather": "indoor",
        "time_of_day": "afternoon",
        "base_desc": "Short video clip of cozy cafe coffee brewing and lively party celebration moments.",
        "keywords": ["video", "cafe video", "celebration clip", "party video", "motion", "clip", "mp4"]
    }
]

REAL_PHOTO_URLS = {
    "Goa trip": [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1471922694854-ff5baf356843?w=800&auto=format&fit=crop&q=80"
    ],
    "Mountain trekking": [
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=800&auto=format&fit=crop&q=80"
    ],
    "Heritage tour": [
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1603201667141-5a2d4c673378?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80"
    ],
    "Family gathering": [
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=80"
    ],
    "Birthday party": [
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&auto=format&fit=crop&q=80"
    ],
    "Diwali celebration": [
        "https://images.unsplash.com/photo-1604085572504-a392ddf0d86a?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1514222709107-a180c68d72b4?w=800&auto=format&fit=crop&q=80"
    ],
    "Pets with owner": [
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80"
    ],
    "Restaurant dining": [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&auto=format&fit=crop&q=80"
    ],
    "Himalayan mountain": [
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&auto=format&fit=crop&q=80"
    ],
    "Food photos": [
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80"
    ],
    "Dancing class": [
        "https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&auto=format&fit=crop&q=80"
    ],
    "Swimming classes": [
        "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1600965962361-9035dbfd1c50?w=800&auto=format&fit=crop&q=80"
    ],
    "Holi celebration": [
        "https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&auto=format&fit=crop&q=80"
    ],
    "Club party": [
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80"
    ],
    "Outfit ideas": [
        "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80"
    ],
    "Positive thoughts": [
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80"
    ],
    "Social media comments": [
        "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=800&auto=format&fit=crop&q=80"
    ],
    "Restaurant receipts": [
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&auto=format&fit=crop&q=80"
    ],
    "Cafe video clips": [
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80"
    ]
}

def draw_synthetic_image(filepath: Path, scenario: dict, photo_idx: int, variation: str):
    """
    Downloads real high-resolution photographs corresponding to the scenario.
    Falls back gracefully to Pillow graphics if network is unavailable.
    """
    filepath.parent.mkdir(parents=True, exist_ok=True)
    event_name = scenario.get("event", "")
    urls = REAL_PHOTO_URLS.get(event_name, [])

    if urls:
        target_url = urls[photo_idx % len(urls)]
        try:
            import httpx
            resp = httpx.get(target_url, timeout=8.0, follow_redirects=True)
            if resp.status_code == 200:
                with open(filepath, "wb") as f:
                    f.write(resp.content)
                return
        except Exception:
            pass

    # Fallback Pillow drawing if offline
    width, height = 600, 400
    cat = scenario["category"]
    bg_top, bg_bottom = (70, 150, 230), (34, 139, 34)
    img = Image.new("RGB", (width, height), bg_top)
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, height // 2, width, height], fill=bg_bottom)
    draw.rectangle([30, 35, width - 30, 115], fill=(10, 15, 25, 220))
    draw.text((50, 48), f"[{scenario['category'].upper()}] {scenario['event']}", fill=(255, 255, 255))
    img.save(filepath, "JPEG", quality=90)


def generate_dataset():
    photos_per_scenario = 2  # 2 distinct unique variations per scenario (no duplicates)

    photos_metadata = []
    
    variations = [
        "afternoon beach cafe view",
        "sunset dining table setup",
        "close-up detail shot",
        "wide angle group memory",
        "rainy morning perspective",
        "street side viewpoint",
        "evening outdoor seating",
        "candid portrait memory",
        "bright sunny angle",
        "dramatic lighting angle",
        "cozy indoor perspective",
        "cloudy weather memory",
        "side view table arrangement",
        "festive celebration angle",
        "panoramic view memory"
    ]

    photo_id_counter = 1

    print(f"Generating {len(SCENARIOS) * photos_per_scenario} real photos & media across {len(SCENARIOS)} scenarios...")

    for sc_idx, sc in enumerate(SCENARIOS):
        cat = sc["category"]
        for i in range(photos_per_scenario):
            photo_id = f"photo_{photo_id_counter:03d}"
            filename = f"{cat}_{sc_idx+1:02d}_{i+1:02d}.jpg"
            rel_path = f"photos/{cat}/{filename}"
            full_img_path = DATA_DIR / rel_path

            var = variations[i % len(variations)]

            # Download real image file / draw fallback
            draw_synthetic_image(full_img_path, sc, i, var)

            # Metadata creation with realistic distractor variations
            date_year = random.choice([2023, 2024, 2025])
            date_month = random.randint(1, 12)
            date_day = random.randint(1, 28)
            date_str = f"{date_year}-{date_month:02d}-{date_day:02d}"

            desc = f"{sc['base_desc']} ({var})."

            meta = {
                "id": photo_id,
                "filename": filename,
                "file_path": rel_path,
                "category": cat,
                "date_taken": date_str,
                "location": sc["location"],
                "event": sc["event"],
                "description": desc,
                "people": sc["keywords"][4:6] if len(sc["keywords"]) > 5 else ["friends"],
                "objects": sc["keywords"][2:4],
                "scene": sc["scene"],
                "activity": sc["activity"],
                "weather": sc["weather"],
                "time_of_day": sc["time_of_day"],
                "keywords": sc["keywords"] + [var.split()[0]]
            }

            photos_metadata.append(meta)
            photo_id_counter += 1

    # Save metadata JSON
    METADATA_DIR.mkdir(parents=True, exist_ok=True)
    metadata_file = METADATA_DIR / "photos.json"
    with open(metadata_file, "w", encoding="utf-8") as f:
        json.dump(photos_metadata, f, indent=2)

    print(f"Successfully generated {len(photos_metadata)} photos metadata in {metadata_file}")

    # Generate Retrieval Tasks JSON for all scenarios
    generate_retrieval_tasks(photos_metadata)

def generate_retrieval_tasks(photos: list):
    TASKS_DIR.mkdir(parents=True, exist_ok=True)

    tasks = [
        {
            "task_id": "TASK_001",
            "query": "Find the photo from my Goa trip where we were sitting at a small cafe near the beach.",
            "expected_clues": ["Goa", "beach", "cafe", "sitting"],
            "difficulty": "medium",
            "target_photo_ids": [p["id"] for p in photos if "Goa" in p["location"] and "cafe" in p["scene"]][:2]
        },
        {
            "task_id": "TASK_002",
            "query": "Find the picture of my dog with owner near the park during sunset.",
            "expected_clues": ["dog", "pet", "owner", "park"],
            "difficulty": "easy",
            "target_photo_ids": [p["id"] for p in photos if "dog" in p["keywords"] or "owner" in p["keywords"]][:2]
        },
        {
            "task_id": "TASK_003",
            "query": "Find the sick day medicine photo on the bedside table.",
            "expected_clues": ["medicine", "pills", "bedside table", "sick"],
            "difficulty": "easy",
            "target_photo_ids": [p["id"] for p in photos if "medicine" in p["keywords"]][:2]
        },
        {
            "task_id": "TASK_004",
            "query": "Find the birthday party photo with friends, balloons, and cake.",
            "expected_clues": ["birthday", "party", "balloons", "cake"],
            "difficulty": "easy",
            "target_photo_ids": [p["id"] for p in photos if "birthday" in p["event"]][:2]
        },
        {
            "task_id": "TASK_005",
            "query": "Find the mountain trekking photo with pine trees and trail.",
            "expected_clues": ["trekking", "hiking", "trail", "mountains"],
            "difficulty": "medium",
            "target_photo_ids": [p["id"] for p in photos if "trekking" in p["keywords"]][:2]
        },
        {
            "task_id": "TASK_006",
            "query": "Find the family gathering reunion dinner photo.",
            "expected_clues": ["family", "reunion", "dinner", "table"],
            "difficulty": "easy",
            "target_photo_ids": [p["id"] for p in photos if "family" in p["keywords"]][:2]
        },
        {
            "task_id": "TASK_007",
            "query": "Find the nightclub club party photo with friends and purple lights.",
            "expected_clues": ["club party", "nightclub", "friends", "lights"],
            "difficulty": "easy",
            "target_photo_ids": [p["id"] for p in photos if "club" in p["keywords"]][:2]
        },
        {
            "task_id": "TASK_008",
            "query": "Find the Diwali celebration photo with diyas, lights, and sparklers.",
            "expected_clues": ["Diwali", "diyas", "lights", "sparklers"],
            "difficulty": "easy",
            "target_photo_ids": [p["id"] for p in photos if "Diwali" in p["keywords"]][:2]
        },
        {
            "task_id": "TASK_009",
            "query": "Find the Holi celebration photo with vibrant colors and gulal.",
            "expected_clues": ["Holi", "colors", "gulal", "festival"],
            "difficulty": "easy",
            "target_photo_ids": [p["id"] for p in photos if "Holi" in p["keywords"]][:2]
        },
        {
            "task_id": "TASK_010",
            "query": "Find the Jaipur Amber fort sightseeing photo.",
            "expected_clues": ["Jaipur", "fort", "Amber palace", "pink city"],
            "difficulty": "medium",
            "target_photo_ids": [p["id"] for p in photos if "Jaipur" in p["location"]][:2]
        },
        {
            "task_id": "TASK_011",
            "query": "Find the food photo of pizza, pasta, and Indian thali dishes.",
            "expected_clues": ["food", "pizza", "thali", "dishes"],
            "difficulty": "easy",
            "target_photo_ids": [p["id"] for p in photos if "food" in p["keywords"]][:2]
        },
        {
            "task_id": "TASK_012",
            "query": "Find the screenshot of outfit ideas and clothing fashion style.",
            "expected_clues": ["screenshot", "outfit", "clothing", "style"],
            "difficulty": "easy",
            "target_photo_ids": [p["id"] for p in photos if "outfit" in p["keywords"]][:2]
        },
        {
            "task_id": "TASK_013",
            "query": "Find the screenshot of positive thoughts and motivational quotes.",
            "expected_clues": ["screenshot", "positive thought", "quote", "motivational"],
            "difficulty": "easy",
            "target_photo_ids": [p["id"] for p in photos if "positive thought" in p["keywords"]][:2]
        },
        {
            "task_id": "TASK_014",
            "query": "Find the screenshot of social media discussion comments and tweets.",
            "expected_clues": ["screenshot", "social media", "comment", "tweet"],
            "difficulty": "easy",
            "target_photo_ids": [p["id"] for p in photos if "social media" in p["keywords"]][:2]
        },
        {
            "task_id": "TASK_015",
            "query": "Find the document scan of restaurant bill receipts and tax invoice.",
            "expected_clues": ["document", "receipt", "bill", "invoice"],
            "difficulty": "easy",
            "target_photo_ids": [p["id"] for p in photos if "receipt" in p["keywords"]][:2]
        },
        {
            "task_id": "TASK_016",
            "query": "Find the video clip of cafe coffee brewing and celebration.",
            "expected_clues": ["video", "cafe video", "celebration clip"],
            "difficulty": "easy",
            "target_photo_ids": [p["id"] for p in photos if "video" in p["keywords"]][:2]
        },
        {
            "task_id": "TASK_017",
            "query": "Find the dancing class photo in the dance studio with mirrors.",
            "expected_clues": ["dancing class", "dance studio", "mirrors", "rehearsal"],
            "difficulty": "easy",
            "target_photo_ids": [p["id"] for p in photos if "dancing class" in p["keywords"]][:2]
        },
        {
            "task_id": "TASK_018",
            "query": "Find the swimming classes photo in the clear blue pool.",
            "expected_clues": ["swimming classes", "swimming pool", "pool water", "swim lesson"],
            "difficulty": "easy",
            "target_photo_ids": [p["id"] for p in photos if "swimming classes" in p["keywords"]][:2]
        }
    ]

    tasks_file = TASKS_DIR / "retrieval_tasks.json"
    with open(tasks_file, "w", encoding="utf-8") as f:
        json.dump(tasks, f, indent=2)

    print(f"Successfully created {len(tasks)} retrieval tasks in {tasks_file}")

if __name__ == "__main__":
    generate_dataset()
