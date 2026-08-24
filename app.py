from flask import Flask, render_template, request, jsonify
from datetime import datetime
import re

app = Flask(__name__)

CATALOG = [
    {"name":"Milk", "category":"Dairy", "price":3.49, "brand":"FreshFarm", "season":"all"},
    {"name":"Almond Milk", "category":"Dairy Alternatives", "price":4.29, "brand":"NutriChoice", "season":"all"},
    {"name":"Bread", "category":"Bakery", "price":2.99, "brand":"DailyBake", "season":"all"},
    {"name":"Apples", "category":"Produce", "price":3.99, "brand":"FarmFresh", "season":"all"},
    {"name":"Oranges", "category":"Produce", "price":4.49, "brand":"CitrusCo", "season":"winter"},
    {"name":"Bananas", "category":"Produce", "price":2.49, "brand":"FarmFresh", "season":"all"},
    {"name":"Eggs", "category":"Dairy", "price":3.99, "brand":"HappyHen", "season":"all"},
    {"name":"Toothpaste", "category":"Personal Care", "price":4.75, "brand":"SmilePlus", "season":"all"},
    {"name":"Rice", "category":"Staples", "price":8.99, "brand":"GoldenGrain", "season":"all"},
    {"name":"Tomatoes", "category":"Produce", "price":2.79, "brand":"FarmFresh", "season":"summer"},
    {"name":"Ice Cream", "category":"Frozen", "price":5.49, "brand":"CoolTreats", "season":"summer"},
]

SUBSTITUTES = {
    "milk": ["Almond Milk", "Soy Milk"],
    "bread": ["Multigrain Bread", "Gluten-Free Bread"],
    "butter": ["Olive Spread", "Vegan Butter"],
    "eggs": ["Tofu", "Egg Substitute"],
}

def normalize_item(text):
    text = re.sub(r"[^a-zA-Z0-9\s-]", "", text.lower()).strip()
    aliases = {
        "apples": "apples", "apple": "apples", "bananas": "bananas",
        "banana": "bananas", "oranges": "oranges", "orange": "oranges",
        "milk": "milk", "bread": "bread", "eggs": "eggs", "egg": "eggs",
        "rice": "rice", "tomato": "tomatoes", "tomatoes": "tomatoes",
        "toothpaste": "toothpaste", "ice cream": "ice cream"
    }
    return aliases.get(text, text.title())

def parse_quantity(text):
    m = re.search(r"\b(\d+)\b", text.lower())
    return int(m.group(1)) if m else 1

def parse_command(text):
    low = text.lower().strip()
    quantity = parse_quantity(low)

    remove_words = ["remove", "delete", "take off", "cancel"]
    add_words = ["add", "buy", "need", "want to buy", "get", "purchase"]

    action = None
    if any(w in low for w in remove_words):
        action = "remove"
    elif any(w in low for w in add_words):
        action = "add"

    cleaned = re.sub(r"\b(remove|delete|take off|cancel|add|buy|need|get|purchase|want to buy)\b", "", low)
    cleaned = re.sub(r"\b\d+\b", "", cleaned)
    cleaned = re.sub(r"\b(bottles?|packs?|kg|kgs|kilograms?|litres?|liters?|pieces?|pcs|of|from my list|to my list)\b", "", cleaned)
    item = cleaned.strip(" ,.-")
    return {"action": action, "item": normalize_item(item), "quantity": quantity}

@app.route("/")
def index():
    return render_template("index.html")

@app.post("/api/command")
def command():
    data = request.get_json(force=True)
    text = data.get("text", "")
    result = parse_command(text)
    if not result["item"]:
        return jsonify({"ok": False, "message": "I couldn't identify a product."}), 400
    return jsonify({"ok": True, **result})

@app.get("/api/search")
def search():
    q = request.args.get("q", "").lower()
    brand = request.args.get("brand", "").lower()
    max_price = request.args.get("max_price", type=float)
    results = []
    for p in CATALOG:
        if q and q not in p["name"].lower() and q not in p["category"].lower():
            continue
        if brand and brand not in p["brand"].lower():
            continue
        if max_price is not None and p["price"] > max_price:
            continue
        results.append(p)
    return jsonify(results)

@app.get("/api/suggestions")
def suggestions():
    # Client history is passed from localStorage so the backend remains stateless.
    history = request.args.get("history", "")
    seen = [x.strip().lower() for x in history.split(",") if x.strip()]
    suggestions = []

    # History-based suggestions.
    for name in seen:
        for p in CATALOG:
            if p["name"].lower() == name:
                suggestions.append({
                    "name": p["name"],
                    "reason": "You bought this before"
                })

    # Seasonal suggestions.
    month = datetime.now().month
    seasonal = []
    if month in [4,5,6,7,8,9]:
        seasonal = ["Tomatoes", "Ice Cream"]
    else:
        seasonal = ["Oranges"]
    for item in seasonal:
        suggestions.append({"name": item, "reason": "Seasonal pick"})

    # Avoid duplicates.
    unique, names = [], set()
    for s in suggestions:
        if s["name"].lower() not in names:
            names.add(s["name"].lower())
            unique.append(s)
    return jsonify(unique[:6])

@app.get("/api/substitutes")
def substitutes():
    item = request.args.get("item", "").lower().strip()
    return jsonify(SUBSTITUTES.get(item, []))

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
