# 📋 Execution Guide & Testing Steps

This document provides complete instructions to run the project and verify all **7 required tests** for the Security API assignment.

---

## 🛠️ Prerequisites

1. **Backend:** API server running on `http://localhost:8000` (or your configured port).
2. **CORS:** The backend must allow Cross-Origin Resource Sharing (CORS) and the custom `x-api-key` header.
3. **Web Browser:** Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.

---

## 🚀 Step 1: Start the Backend Server

Open a terminal inside your backend folder and launch the server according to your stack:

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
  # or
  node index.js
  ```

> 💡 **Note on CORS:** Ensure your backend middleware enables CORS for incoming browser requests and allows the `x-api-key` header.

---

## 🌐 Step 2: Open the Frontend

Choose one of these easy options:

* **Option A (Recommended & Direct):**
  Open File Explorer, go to the `Frontend` folder, and **double-click `index.html`**.
* **Option B (VS Code Live Server):**
  Right-click `index.html` inside VS Code and select **"Open with Live Server"**.
* **Option C (Local CLI Server):**
  ```powershell
  cd "C:\Users\Osman\OneDrive\Escritorio\Frontend"
  python -m http.server 3000
  ```
  Then open `http://localhost:3000` in your browser.

---

## 🧪 Step 3: Step-by-Step Guide for the 7 Required Tests

---

### 🔹 Test 1 — Health Check (Public Endpoint)
* **Goal:** Verify that the health endpoint responds without requiring authentication.
* **How to test:**
  1. Open a new tab in your browser.
  2. Navigate to: `http://localhost:8000/health` (or send a request via Postman / Thunder Client).
* **Expected Result:**
  - HTTP Status: `200 OK`
  - No `x-api-key` header required.

---

### 🔹 Test 2 — GET without API Key
* **Goal:** Confirm that the protected endpoint rejects GET requests without credentials.
* **How to test in the UI:**
  1. In the **API Key (Header `x-api-key`)** input field, clear all text so it is **completely empty**.
  2. Click the **`[ Get Protected Data ]`** button.
* **Expected Result on Screen:**
  - Status Tag: `401 Unauthorized` (red badge).
  - Error response message from the backend denying access.

---

### 🔹 Test 3 — GET with Incorrect API Key
* **Goal:** Confirm that the protected endpoint rejects unauthorized keys.
* **How to test in the UI:**
  1. In the **API Key (Header `x-api-key`)** input field, enter: `wrong-key` (or any invalid string).
  2. Click the **`[ Get Protected Data ]`** button.
* **Expected Result on Screen:**
  - Status Tag: `401 Unauthorized` (red badge).
  - Backend response indicating invalid API key.

---

### 🔹 Test 4 — GET with Correct API Key
* **Goal:** Successfully retrieve protected data when supplying the correct key.
* **How to test in the UI:**
  1. In the **API Key (Header `x-api-key`)** input field, enter your valid secret key (e.g., `my-secret-key` as configured in your backend).
  2. Click the **`[ Get Protected Data ]`** button.
* **Expected Result on Screen:**
  - Status Tag: `200 OK` (green badge).
  - Formatted JSON containing the protected data returned by the backend.

---

### 🔹 Test 5 — POST without API Key
* **Goal:** Confirm that protected POST requests require authentication.
* **How to test in the UI:**
  1. Clear the **API Key (Header `x-api-key`)** input field (leave it empty).
  2. Click the **`[ Send POST Request ]`** button.
* **Expected Result on Screen:**
  - Status Tag: `401 Unauthorized` (red badge).
  - Access denied response.

---

### 🔹 Test 6 — POST with Correct API Key
* **Goal:** Successfully perform a POST request by supplying the authorized API key.
* **How to test in the UI:**
  1. Enter your valid secret key in the **API Key (Header `x-api-key`)** field.
  2. Click the **`[ Send POST Request ]`** button.
* **Expected Result on Screen:**
  - Status Tag: `200 OK` (green badge).
  - JSON response:
    ```json
    {
      "message": "POST received"
    }
    ```

---

### 🔹 Test 7 — Frontend Verification & Demonstration
* **Goal:** Demonstrate interactive communication between the browser client and the backend API.
* **Acceptance Criteria:**
  1. The GET button calls the protected GET endpoint successfully.
  2. The POST button calls the protected POST endpoint successfully.
  3. All API responses (status codes and JSON payload) dynamically render inside the response area on the web page.

---

## 🔍 Troubleshooting Common Issues

| Issue / Error | Potential Cause | Solution |
|---|---|---|
| `Connection Error: Failed to fetch` | The backend is not running or the port differs. | Check that your backend is running at `http://localhost:8000` or update the **Backend Base URL** input field on the page. |
| `CORS Error` in browser console | Backend CORS middleware is missing or misconfigured. | Enable CORS in the backend allowing origin `*` and headers `["x-api-key", "Content-Type"]`. |
| HTTP `404 Not Found` | Route mismatch. | Verify that the backend has registered the `/api/data` route. |
