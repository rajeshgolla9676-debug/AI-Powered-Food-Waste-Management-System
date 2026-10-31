# Optional FastAPI + Ollama starter

The static frontend runs independently. This backend is a development starter and is not wired into the frontend yet.

## Install
```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

## Optional local model
Install Ollama and pull a model supported by your computer:
```bash
ollama pull llama3.2
```
Set `OLLAMA_MODEL` if using another model.

## Run API
From this folder:
```bash
uvicorn main:app --reload --port 8001
```
- Health: http://127.0.0.1:8001/health
- Interactive API docs: http://127.0.0.1:8001/docs

Example request for `POST /api/assist-listing`:
```json
{
  "name": "Vegetable rice",
  "quantity": "20 portions",
  "prepared_time": "12:30 PM",
  "storage": "Refrigerated",
  "location": "Hyderabad",
  "notes": "Contains dairy"
}
```

## Before production
Restrict CORS to the deployed frontend; add authentication, authorization, verified organizations, a shared database, rate limiting, logging, monitoring, secrets management and HTTPS. Follow applicable food-safety requirements. AI output is advisory and must never be treated as food-safety certification.
