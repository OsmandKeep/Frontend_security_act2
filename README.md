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

# Secure Frontend Gateway - Nginx Reverse Proxy & OpenLDAP Login

Containerized Frontend client featuring an **OpenLDAP login interface**, session management, encrypted database interactions, and **Nginx Reverse Proxy** with automatic secret rotation reloading.

---

## 🛡️ Security Architecture

```
[ Browser / Client ]
       │
       │  1. POST /api/login  {"username":"alice", "password":"..."}
       │     GET/POST /api/data (No API key in client request)
       ▼
[ Nginx Reverse Proxy (Port 80) ]
       │
       │  2. Injects Header: `x-api-key: ${API_SECRET}` (dynamically rotated)
       │  3. Forwards to: `${API_UPSTREAM}/api/...`
       ▼
[ Backend API (Port 8000) ]
       │
       ▼
[ OpenLDAP Directory (Port 389) ]
```

- **Zero Credentials in Browser**: The browser never sees `API_SECRET` or sensitive internal endpoints.
- **Dynamic Secret Watcher**: The background watcher in `docker-entrypoint.sh` reloads Nginx dynamically whenever `API_SECRET` rotates, ensuring zero downtime.
- **OpenLDAP Authentication**: Users authenticate with LDAP accounts (`alice` / `alice123` or `bob` / `bob123`).

---

## 🚀 Running the Frontend

```bash
docker compose up -d --build
```

Access the interface at: `http://localhost`

---

## 🧪 Testing Verification

1. **LDAP Login**:
   - Enter `alice` / `alice123` -> Click **Iniciar Sesión con LDAP**.
   - Interface transitions to show active user session, LDAP Distinguished Name (`dn`), and full name.
2. **Protected Data Operations**:
   - Click **Consultar y Descifrar (GET /api/data)** to read decrypted data from SQLite.
   - Click **Cifrar y Guardar en BD (POST /api/data)** to encrypt and insert new data into SQLite.
3. **Secret Rotation Verification**:
   - When the secret rotation script runs, Nginx automatically reloads with the new `API_SECRET`.
   - All requests continue working without browser reloads or authentication failure!

