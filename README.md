# FoodLoop AI — AI-Powered Food Waste Management System

**Tagline:** Don't Waste Food. Share Hope. Save the Planet.

A responsive hackathon prototype that demonstrates how restaurants and food providers could share surplus food with NGOs and food banks.

## Run locally
1. Open this repository on GitHub and click **Code → Download ZIP**, or clone it.
2. Open `index.html` in a modern browser.

No build step or package installation is required.

## Included
- Overview dashboard with illustrative impact metrics
- Food discovery with search and category filters
- Create food listings with quantity, location, preparation time, storage details and pickup deadline
- Listing management table
- Demo pickup request workflow
- Impact analytics and CSV export
- Responsive desktop/mobile styling
- Browser localStorage for demo listings

## Important prototype notes
- Initial food listings and impact metrics are sample data, not verified real-world results.
- Pickup requests only change the local browser demo status. They do not contact an NGO or restaurant.
- There is no real authentication, shared cloud database, organization verification, live map, or notification service.
- The UI is a functional frontend prototype. The AI assistant/backend integration is not connected in this GitHub version yet.
- This software does not determine or certify whether food is safe. People must verify food handling, storage, allergens and applicable food-safety requirements, including relevant FSSAI guidance, before collection.

## Suggested next steps for a production version
1. Add authenticated roles for providers, NGOs and administrators.
2. Connect a shared database such as Firebase/Firestore and configure security rules.
3. Add verified partner onboarding, real notifications and pickup coordination.
4. Integrate an AI service only for assisting with listing information, with human review.
5. Test food-safety workflows and privacy/security controls before real-world use.

## Stack
HTML, CSS, vanilla JavaScript. Optional backend integrations can be added with Python, FastAPI, Ollama and Firebase.