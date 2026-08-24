A lightweight **voice-first shopping list manager** built with Flask, JavaScript, and the Web Speech API. VoiceCart allows users to manage shopping lists using natural-language voice commands, search for products, get smart suggestions, and find product substitutes.

🔗 **GitHub Repository:**  
https://github.com/AdityaHatwar22/voice-command-shopping-assistant

---

## ✨ Features

- 🎙️ **Voice-based shopping commands**
  - `Add milk`
  - `I want to buy bananas`
  - `Add 2 bottles of water`
  - `Remove milk`

- 🧠 **Natural-language command parsing**
  - Supports flexible add/remove commands
  - Detects quantities from user commands

- 🌍 **Multilingual voice recognition**
  - English (India)
  - English (US)
  - Hindi
  - Marathi
  - Browser-dependent support

- 💡 **Smart shopping suggestions**
  - Suggestions based on shopping-list history
  - Seasonal item suggestions

- 🔄 **Product substitutes**
  - Example: alternatives for milk such as almond milk

- 🔎 **Product search and filtering**
  - Search products by name
  - Filter by brand
  - Filter by maximum price

- 🗂️ **Automatic product categorization**

- 📱 **Responsive user interface**
  - Real-time voice transcript
  - Confirmation feedback
  - Minimal and lightweight design

- 💾 **LocalStorage support**
  - Shopping list and history are stored locally in the browser

- 🔌 **Flask REST API**
  - Simple API endpoints for commands, search, suggestions, and substitutes

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Python 3 | Backend programming |
| Flask | REST API and web server |
| HTML5 | Application structure |
| CSS3 | UI styling and responsiveness |
| JavaScript | Frontend logic and interactions |
| Web Speech API | Voice recognition |
| LocalStorage | Client-side shopping history |

---

## 📂 Project Structure

```text
voice-command-shopping-assistant/
│
├── app.py
├── requirements.txt
├── .gitignore
│
├── templates/
│   └── index.html
│
└── static/
    ├── style.css
    └── script.js
