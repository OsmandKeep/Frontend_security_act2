# Secure Frontend Gateway (Nginx Reverse Proxy)

Secure containerized Frontend client for the **Security API Exercise**.

This architecture demonstrates the **Backend-For-Frontend / Reverse Proxy Gateway pattern** to protect API credentials. Sensitive keys (`x-api-key`) and upstream endpoints (`API_UPSTREAM`) are kept strictly on the server side in Nginx and never exposed to the client-side JavaScript or browser.

---

## 📁 Repository Structure

```text
Frontend/
├── Dockerfile                 # Container image definition using nginx:alpine
├── docker-compose.yml         # Container orchestration with environment variables
├── docker-entrypoint.sh       # Startup script injecting environment variables into Nginx
├── nginx.conf.template        # Nginx configuration template with reverse proxy & header injection
├── index.html                 # Frontend user interface (zero credentials)
├── app.js                     # Client-side fetch logic (no client-side API keys)
├── styles.css                 # Dark cybersecurity UI theme
├── .env.example               # Template environment variable configuration
├── .gitignore                 # Git ignore rules for .env and system artifacts
├── README.md                  # Main project documentation
└── TESTING_INSTRUCTIONS.md    # Detailed test execution guide
```

---

## 🛡️ Security Architecture

```
[ Browser Client ]
       │
       │  1. GET/POST /api/data (No API key in client request)
       ▼
[ Nginx Reverse Proxy (Port 80) ]
       │
       │  2. Injects Header: `x-api-key: ${API_KEY}`
       │  3. Forwards to: `${API_UPSTREAM}/api/data`
       ▼
[ Backend API (Port 8000) ]
```

---

## 🚀 How to Run

### 1. Configure Environment (Optional)
If you wish to customize variables, copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default values:
- `API_UPSTREAM=http://host.docker.internal:8000`
- `API_KEY=my-secret-key`

### 2. Start with Docker Compose
```bash
docker compose up -d --build
```

### 3. Open in Browser
Open your browser and navigate to:
```text
http://localhost
```

### 4. Stop the Container
```bash
docker compose down
```

---

## 🧪 Testing Verification

1. **GET Request (`GET /api/data`)**: Click **"Get Protected Data (GET)"** to test data retrieval through the secure reverse proxy.
2. **POST Request (`POST /api/data`)**: Click **"Send Protected Data (POST)"** to test payload delivery through the secure reverse proxy.
3. **Inspect Network Tab**: Notice that the browser never sends or receives `x-api-key`. All authentication is handled transparently by Nginx.
