# 📋 Execution Guide & Testing Steps (Nginx Reverse Proxy)

This document provides instructions to run and verify the containerized Frontend client with Nginx reverse proxy and server-side authentication.

---

## 🛠️ Prerequisites

1. **Backend Server:** Running on `http://localhost:8000`.
2. **Docker & Docker Compose:** Installed and running on your system.
3. **Web Browser:** Any modern browser (Chrome, Edge, Firefox, Safari).

---

## 🚀 Step 1: Start the Backend Server

Start your backend API server on port 8000:

- **Python (FastAPI / Uvicorn):**
  ```powershell
  uvicorn main:app --reload --port 8000
  ```
- **Python (Flask):**
  ```powershell
  python app.py
  ```
- **Node.js (Express):**
  ```powershell
  npm start
  ```

---

## 🐳 Step 2: Start Frontend with Docker Compose

Open a terminal in the `Frontend` directory and launch the Nginx container:

```powershell
docker compose up -d --build
```

This starts the Nginx reverse proxy on port `80`, mapping:
- Upstream backend: `API_UPSTREAM=http://host.docker.internal:8000`
- Server-side injected key: `API_KEY=my-secret-key`

---

## 🌐 Step 3: Open the Frontend

Navigate to:
```text
http://localhost
```

---

## 🧪 Step 4: Verification Steps

### 🔹 Test 1 — Health Check (Direct Backend)
* **Action:** Open `http://localhost:8000/health` (or `http://localhost/health` through proxy).
* **Expected Result:** `200 OK`

### 🔹 Test 2 — Protected GET Request
* **Action:** Click **"Get Protected Data (GET)"** in the UI.
* **Expected Result:**
  - Status Tag: `200 OK` (green badge).
  - Nginx injected `x-api-key: my-secret-key` server-side and fetched data from backend `/api/data`.
  - Browser console / network shows request sent to relative URL `/api/data` without exposing any API key in headers.

### 🔹 Test 3 — Protected POST Request
* **Action:** Click **"Send Protected Data (POST)"** in the UI.
* **Expected Result:**
  - Status Tag: `200 OK` (green badge).
  - Response displays JSON payload returned by the backend.

### 🔹 Test 4 — Environment Variable Override (Testing 401 Unauthorized)
* **Action:** Run container with an invalid API key to test backend rejection:
  ```powershell
  docker compose down
  $env:API_KEY="invalid-key"; docker compose up -d
  ```
* Click **"Get Protected Data (GET)"** on `http://localhost`.
* **Expected Result:**
  - Status Tag: `401 Unauthorized` (red badge).
  - Demonstrates that server-side proxy correctly injects the configured key.
* Reset back to default:
  ```powershell
  Remove-Item env:API_KEY -ErrorAction SilentlyContinue
  docker compose up -d
  ```

---

## 🛑 Step 5: Stop the Container

```powershell
docker compose down
```
