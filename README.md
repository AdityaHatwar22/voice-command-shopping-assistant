# VoiceCart — Voice Command Shopping Assistant

A lightweight voice-first shopping list manager built for the Software Engineering technical assessment.

## Features

- Voice commands such as `Add milk`, `I want to buy bananas`, `Add 2 bottles of water`, and `Remove milk`.
- Natural-language command parsing for add/remove actions and quantities.
- Multilingual voice recognition: English (India), English (US), Hindi and Marathi (browser-dependent).
- Smart suggestions from shopping-list history and seasonal items.
- Product substitutes such as almond milk for milk.
- Voice/search-style product lookup with brand and maximum-price filters.
- Automatic product categorization.
- Responsive, minimalist UI with real-time transcript and confirmation feedback.
- Basic error handling and loading-free lightweight interactions.
- LocalStorage keeps the shopping list/history in the browser.
- Flask REST endpoints keep the application simple and deployable.

## Tech Stack

- Python 3
- Flask
- HTML5 / CSS3 / JavaScript
- Web Speech API for browser voice recognition
- LocalStorage for client-side shopping history

## Run locally

```bash
git clone YOUR_GITHUB_REPO_URL
cd voice-command-shopping-assistant

python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
python app.py
```

Open `http://127.0.0.1:5000`.

Use Chrome or Edge for the best Speech Recognition support.

## Example commands

- `Add milk`
- `I want to buy bananas`
- `Add 5 oranges`
- `Remove milk`
- `Buy 2 bottles of water`

## API

- `POST /api/command` — parse a natural-language shopping command.
- `GET /api/search?q=apples&brand=FarmFresh&max_price=5` — product search/filter.
- `GET /api/suggestions?history=milk,bread` — smart suggestions.
- `GET /api/substitutes?item=milk` — substitute recommendations.

## Deployment

This is a Flask application and can be deployed to a Python-capable hosting service. For a quick demo, create a web service from the GitHub repository and use:

**Build command:** `pip install -r requirements.txt`

**Start command:** `gunicorn app:app`

Add `gunicorn` to `requirements.txt` before deployment if your host does not provide it automatically.

For production, HTTPS is recommended because browser microphone permissions work best on secure origins.

## Assessment approach

The implementation prioritizes the assessment's required voice input, NLP-style flexible commands, multilingual support, smart suggestions, shopping-list management, search/filtering, responsive UI, error handling, documentation, and deployability while keeping the project small enough to understand and demonstrate in an interview.
