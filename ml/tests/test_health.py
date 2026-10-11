# It is the function to test the health check endpoint. 

from fastapi.testclient import TestClient
from ml.src.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "attribrix-ml"
    assert "models_loaded" in data

def test_taxonomy_endpoint():
    response = client.get("/api/v1/taxonomy")
    assert response.status_code == 200
    data = response.json()
    assert "categories" in data
    assert "tops" in data["categories"]
    assert "bottoms" in data["categories"]
    assert len(data["categories"]) == 9
    assert "color" in data["vocabularies"]
    assert "pattern" in data["vocabularies"]
