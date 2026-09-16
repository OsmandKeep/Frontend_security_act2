// Endpoints handled through Nginx reverse proxy
const API_LOGIN = "/api/login";
const API_DATA = "/api/data";
const API_STATUS = "/api/status";

// DOM Elements
const output = document.getElementById("response-output");
const statusTag = document.getElementById("status-tag");
const loginSection = document.getElementById("login-section");
const sessionSection = document.getElementById("session-section");
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const btnQuickFill = document.getElementById("btn-quick-fill");
const btnLogout = document.getElementById("btn-logout");
const userDisplayName = document.getElementById("user-display-name");
const userDisplayUsername = document.getElementById("user-display-username");
const userDisplayDn = document.getElementById("user-display-dn");

const btnGet = document.getElementById("btn-get");
const btnPost = document.getElementById("btn-post");
const btnStatus = document.getElementById("btn-status");
const postMessageInput = document.getElementById("post-message");

// State
let currentUser = null;

/**
 * Builds HTTP headers for client requests.
 * Note: x-api-key is NEVER included here; it is injected server-side by the Nginx reverse proxy.
 */
function getHeaders(isJson = false) {
    const headers = {};
    if (isJson) {
        headers["Content-Type"] = "application/json";
    }
    return headers;
}

/**
 * Updates UI status badge.
 */
function updateStatus(status, statusText, isError = false) {
    if (!statusTag) return;
    statusTag.textContent = `${status} ${statusText}`;
    statusTag.className = "status-tag " + (isError ? "error" : "success");
}

/**
 * Formats and displays API response in the output box.
 */
function displayResponse(status, statusText, data) {
    const isSuccess = status >= 200 && status < 300;
    updateStatus(status, statusText, !isSuccess);
    
    const formattedData = typeof data === "object" 
        ? JSON.stringify(data, null, 2) 
        : data;
    
    output.textContent = `[HTTP ${status} ${statusText}]\n\n${formattedData}`;
}

/**
 * Sets session UI state.
 */
function setSessionState(user) {
    currentUser = user;
    if (user) {
        loginSection.classList.add("hidden");
        sessionSection.classList.remove("hidden");
        userDisplayName.textContent = user.user_info?.fullName || user.username;
        userDisplayUsername.textContent = user.username;
        userDisplayDn.textContent = user.dn || `uid=${user.username},ou=users,dc=example,dc=com`;
    } else {
        loginSection.classList.remove("hidden");
        sessionSection.classList.add("hidden");
        passwordInput.value = "";
    }
}

// ---------------------------------------------------------------------------
// 1. LDAP Login Handler
// ---------------------------------------------------------------------------
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    output.textContent = `Autenticando usuario '${username}' con el servidor OpenLDAP...`;
    statusTag.textContent = "Verificando credenciales...";
    statusTag.className = "status-tag info";

    try {
        const response = await fetch(API_LOGIN, {
            method: "POST",
            headers: getHeaders(true),
            body: JSON.stringify({ username, password })
        });

        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        displayResponse(response.status, response.statusText || (response.ok ? "OK" : "Unauthorized"), data);

        if (response.ok && data.authenticated) {
            setSessionState(data);
        } else {
            setSessionState(null);
        }
    } catch (error) {
        updateStatus("ERROR", "Error de conexión", true);
        output.textContent = `Error de conexión al autenticar: ${error.message}\n\nAsegúrate de que los contenedores Nginx, Backend y OpenLDAP estén ejecutándose.`;
    }
});

// Quick fill toggle between alice and bob
btnQuickFill.addEventListener("click", () => {
    if (usernameInput.value === "alice") {
        usernameInput.value = "bob";
        passwordInput.value = "bob123";
        btnQuickFill.textContent = "👤 Cambiar a Alice (alice / alice123)";
    } else {
        usernameInput.value = "alice";
        passwordInput.value = "alice123";
        btnQuickFill.textContent = "👤 Cambiar a Bob (bob / bob123)";
    }
});

// Logout handler
btnLogout.addEventListener("click", () => {
    setSessionState(null);
    updateStatus("200", "Sesión cerrada", false);
    output.textContent = "Sesión cerrada correctamente. Ingresa nuevas credenciales LDAP para autenticarte.";
});

// ---------------------------------------------------------------------------
// 2. Protected Data GET
// ---------------------------------------------------------------------------
btnGet.addEventListener("click", async () => {
    output.textContent = `Consultando GET ${API_DATA} a través de Nginx Reverse Proxy...`;
    statusTag.textContent = "Cargando...";
    statusTag.className = "status-tag info";

    try {
        const response = await fetch(API_DATA, {
            method: "GET",
            headers: getHeaders(false)
        });

        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        displayResponse(response.status, response.statusText || (response.ok ? "OK" : "Error"), data);
    } catch (error) {
        updateStatus("ERROR", "Fallo de red", true);
        output.textContent = `Error de conexión: ${error.message}\nVerifica que Nginx y Backend estén activos.`;
    }
});

// ---------------------------------------------------------------------------
// 3. Protected Data POST (Encrypted DB write)
// ---------------------------------------------------------------------------
btnPost.addEventListener("click", async () => {
    const message = postMessageInput.value.trim() || "Dato confidencial enviado desde frontend";
    output.textContent = `Enviando POST ${API_DATA} a través de Nginx Reverse Proxy...`;
    statusTag.textContent = "Cifrando y guardando...";
    statusTag.className = "status-tag info";

    try {
        const response = await fetch(API_DATA, {
            method: "POST",
            headers: getHeaders(true),
            body: JSON.stringify({ message: message })
        });

        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        displayResponse(response.status, response.statusText || (response.ok ? "OK" : "Error"), data);
    } catch (error) {
        updateStatus("ERROR", "Fallo de red", true);
        output.textContent = `Error de conexión: ${error.message}\nVerifica que Nginx y Backend estén activos.`;
    }
});

// ---------------------------------------------------------------------------
// 4. Status Check
// ---------------------------------------------------------------------------
btnStatus.addEventListener("click", async () => {
    output.textContent = `Consultando diagnóstico GET ${API_STATUS}...`;
    statusTag.textContent = "Consultando...";
    statusTag.className = "status-tag info";

    try {
        const response = await fetch(API_STATUS, {
            method: "GET",
            headers: getHeaders(false)
        });

        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        displayResponse(response.status, response.statusText || (response.ok ? "OK" : "Error"), data);
    } catch (error) {
        updateStatus("ERROR", "Fallo de red", true);
        output.textContent = `Error de conexión: ${error.message}`;
    }
});

