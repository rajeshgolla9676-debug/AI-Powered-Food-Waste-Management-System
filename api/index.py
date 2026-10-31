import os
from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="FoodLoop AI API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# NOTE: This lightweight store is temporary. Use a managed database for durable shared records.
listings = {}

class ListingIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    category: str = Field(default="Other", max_length=50)
    quantity: str = Field(min_length=1, max_length=80)
    location: str = Field(min_length=1, max_length=200)
    provider: str = Field(default="Community donor", max_length=120)
    deadline: Optional[str] = Field(default=None, max_length=80)
    prepared_time: Optional[str] = Field(default=None, max_length=80)
    storage: Optional[str] = Field(default=None, max_length=500)
    notes: Optional[str] = Field(default=None, max_length=1000)

class ListingAssistRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    quantity: str = Field(min_length=1, max_length=80)
    prepared_time: Optional[str] = Field(default=None, max_length=80)
    storage: Optional[str] = Field(default=None, max_length=500)
    location: Optional[str] = Field(default=None, max_length=200)
    notes: Optional[str] = Field(default=None, max_length=1000)

@app.get("/")
@app.get("/api")
@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "FoodLoop AI API", "version": "1.0.0"}

@app.get("/api/listings")
async def get_listings():
    return {"items": list(listings.values()), "count": len(listings)}

@app.post("/api/listings", status_code=201)
async def create_listing(payload: ListingIn):
    item = payload.model_dump()
    item.update({"id": str(uuid4()), "status": "Available",
                 "created_at": datetime.now(timezone.utc).isoformat()})
    listings[item["id"]] = item
    return item

@app.patch("/api/listings/{listing_id}/reserve")
async def reserve_listing(listing_id: str):
    item = listings.get(listing_id)
    if not item:
        raise HTTPException(status_code=404, detail="Listing not found")
    if item["status"] != "Available":
        raise HTTPException(status_code=409, detail="Listing is not available")
    item["status"] = "Reserved"
    return item

@app.delete("/api/listings/{listing_id}")
async def delete_listing(listing_id: str):
    if listing_id not in listings:
        raise HTTPException(status_code=404, detail="Listing not found")
    del listings[listing_id]
    return {"ok": True, "id": listing_id}

@app.post("/api/assist-listing")
async def assist_listing(payload: ListingAssistRequest):
    missing = []
    if not payload.prepared_time: missing.append("preparation or packing time")
    if not payload.storage: missing.append("storage conditions")
    if not payload.location: missing.append("pickup location")
    if not payload.notes: missing.append("allergens and additional notes, if applicable")
    return {
        "mode": "checklist",
        "result": {
            "category_suggestion": "Review and select manually",
            "missing_fields": missing,
            "summary": f"{payload.quantity} of {payload.name}",
            "human_review_note": "A person must verify handling and applicable food-safety requirements. AI cannot certify food safety."
        },
        "notice": "Checklist assistance only; not an AI food-safety certification."
    }
