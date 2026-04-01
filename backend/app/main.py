from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import router as api_router

app = FastAPI(title="VectorVault API")

# This tells the backend to accept requests from your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # This is the default Vite port. Change if yours is different.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routes we defined in api.py
app.include_router(api_router)

@app.get("/")
def read_root():
    return {"message": "The brain is online, no thanks to you."}

@app.get("/health")
def health_check():
    return {"status": "healthy", "vector_index_loaded": False}