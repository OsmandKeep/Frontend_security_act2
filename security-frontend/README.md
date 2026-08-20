# Security Frontend Repository

Client-side application for the **Security API Exercise** (Part 2).

This project communicates with a protected backend API using the `fetch()` API and authentication via the `x-api-key` HTTP header.

---

## 📁 Repository Structure

```text
security-frontend/
├── index.html     # Webpage structure & user interface
├── styles.css     # Styling & layout
├── app.js         # API integration with fetch() & header handling
└── README.md      # Documentation & testing guide
```

---

## 🚀 How to Run

1. Make sure your Backend API is running (e.g., on `http://localhost:8000`).
2. Open [`index.html`](index.html) in any modern browser:
   - Double-click `index.html`, or
   - Use VS Code **Live Server** extension, or
   - Run a simple local server:
     ```bash
     npx http-server . -p 3000
     # or
     python -m http.server 3000
     ```

---

## ⚙️ Configuration & Features

- **Backend Base URL**: Defaults to `http://localhost:8000`. You can edit it directly in the input field.
- **API Key**: Configure the `x-api-key` header in the input box.
- **Endpoints Tested**:
  - `GET /api/data`: Sends `x-api-key` header to retrieve protected data.
  - `POST /api/data`: Sends `x-api-key` header and JSON body to post protected data.
- **Status & Feedback**: Real-time HTTP status badge and formatted JSON output.

---

## 🧪 Test Verification

| Test # | Action | Input / Header | Expected Status | Expected Result |
|---|---|---|---|---|
| **Test 2** | Click **Get Protected Data** | No API Key (empty) | `401 Unauthorized` | Access denied error message |
| **Test 3** | Click **Get Protected Data** | `x-api-key: wrong-key` | `401 Unauthorized` | Access denied error message |
| **Test 4** | Click **Get Protected Data** | `x-api-key: <correct-key>` | `200 OK` | Protected JSON data returned |
| **Test 5** | Click **Send POST Request** | No API Key (empty) | `401 Unauthorized` | Access denied error message |
| **Test 6** | Click **Send POST Request** | `x-api-key: <correct-key>` | `200 OK` | `{"message": "POST received"}` |
| **Test 7** | Open in Browser | UI Interaction | `200 OK` / `401` | Response displayed dynamically |
