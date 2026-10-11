"""
Taxonomy and Controlled Vocabularies for Attribrix AI.
Locked according to context/Decisions.md and context/memory.md.
"""

CATEGORIES = {
    "tops": {
        "id": "tops",
        "display_name": "Tops",
        "examples": ["T-shirts", "shirts", "blouses", "polos"],
    },
    "bottoms": {
        "id": "bottoms",
        "display_name": "Bottoms",
        "examples": ["Jeans", "trousers", "shorts", "skirts"],
    },
    "dresses_one_piece": {
        "id": "dresses_one_piece",
        "display_name": "Dresses & One-Piece",
        "examples": ["Dresses", "jumpsuits", "rompers"],
    },
    "outerwear": {
        "id": "outerwear",
        "display_name": "Outerwear",
        "examples": ["Jackets", "coats", "blazers", "cardigans"],
    },
    "footwear": {
        "id": "footwear",
        "display_name": "Footwear",
        "examples": ["Shoes", "sneakers", "sandals", "boots"],
    },
    "bags": {
        "id": "bags",
        "display_name": "Bags",
        "examples": ["Handbags", "backpacks", "totes", "clutches"],
    },
    "accessories": {
        "id": "accessories",
        "display_name": "Accessories",
        "examples": ["Watches", "belts", "jewellery", "scarves", "eyewear"],
    },
    "innerwear_sleepwear": {
        "id": "innerwear_sleepwear",
        "display_name": "Innerwear & Sleepwear",
        "examples": ["Undergarments", "sleepwear", "loungewear", "socks"],
    },
    "ethnic_traditional": {
        "id": "ethnic_traditional",
        "display_name": "Ethnic & Traditional Wear",
        "examples": ["Sarees", "kurtas", "lehengas", "kimonos"],
    },
}

COLOR_VALUES = [
    "black",
    "white",
    "grey",
    "silver",
    "red",
    "pink",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple",
    "brown",
    "beige",
    "gold",
    "multi",
    "unknown",
]

PATTERN_VALUES = [
    "solid",
    "striped",
    "checked",
    "floral",
    "printed",
    "polka_dot",
    "graphic",
    "camo",
    "abstract",
    "unknown",
]

SLEEVE_VALUES = [
    "sleeveless",
    "short_sleeve",
    "three_quarter_sleeve",
    "long_sleeve",
    "not_applicable",
    "unknown",
]

NECKLINE_VALUES = [
    "round_neck",
    "v_neck",
    "collar",
    "hooded",
    "boat_neck",
    "off_shoulder",
    "sweetheart",
    "not_applicable",
    "unknown",
]

MATERIAL_VALUES = [
    "cotton",
    "polyester",
    "denim",
    "leather",
    "silk",
    "wool",
    "linen",
    "nylon",
    "blend",
    "unknown",
]

BRAND_STATUS_VALUES = [
    "unknown",
    "needs_review",
    "verified",
]
