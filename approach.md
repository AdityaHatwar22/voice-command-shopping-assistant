# Brief Approach

VoiceCart is designed as a small, production-oriented voice shopping assistant. The browser handles speech recognition through the Web Speech API, which keeps the architecture lightweight and avoids sending raw microphone audio to a server. A Flask backend exposes focused REST endpoints for command parsing, product search, suggestions, and substitutes.

Natural-language commands are normalized and parsed into an action, product name, and quantity. The frontend immediately reflects the recognized command and updates the shopping list. Items are automatically assigned simple product categories. Shopping history is retained in browser LocalStorage, allowing the suggestion engine to recommend previously purchased products and seasonal products without requiring a database.

The product catalog is intentionally small and public-test-data friendly for the assessment demo. Search supports product text, brand, and maximum price filters. Substitute mappings demonstrate recommendation behavior when an alternative product may be useful.

The UI is responsive and minimalist, with microphone controls, language selection, transcript feedback, confirmation messages, suggestions, and search results. The application is stateless on the server side and can be deployed easily as a Flask web service.
