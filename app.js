// ==========================================================================
// SecureAuth Gateway - Client Application Logic
// ==========================================================================

const API_LOGIN = "/api/login";
const API_DATA = "/api/data";
const API_STATUS = "/api/status";

// Views
const viewLogin = document.getElementById("view-login");
const viewDashboard = document.getElementById("view-dashboard");

// Login Elements
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const btnLogin = document.getElementById("btn-login");
const btnLoginText = document.getElementById("btn-login-text");
const btnTogglePwd = document.getElementById("btn-toggle-pwd");
const eyeIcon = document.getElementById("eye-icon");
const chipAlice = document.getElementById("chip-alice");
const chipBob = document.getElementById("chip-bob");

// Dashboard Elements
const dashAvatar = document.getElementById("dash-avatar");
const dashFullname = document.getElementById("dash-fullname");
const dashUsername = document.getElementById("dash-username");
const dashDn = document.getElementById("dash-dn");
const specSecret = document.getElementById("spec-secret");
const btnLogout = document.getElementById("btn-logout");
const btnGet = document.getElementById("btn-get");
const btnPost = document.getElementById("btn-post");
const btnStatus = document.getElementById("btn-status");
const postMessageInput = document.getElementById("post-message");

// Console & Toast Elements
const output = document.getElementById("response-output");
const statusTag = document.getElementById("status-tag");
const toast = document.getElementById("toast");
const toastIcon = document.getElementById("toast-icon");
const toastContent = document.getElementById("toast-content");

let toastTimer = null;

/**
 * Shows smooth floating toast notification.
 */
function showToast(message, type = "info") {
    clearTimeout(toastTimer);
    toast.className = `toast ${type}`;
    
    let iconSvg = "";
    if (type === "success") {
        iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else if (type === "error") {
        iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
        iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toastIcon.innerHTML = iconSvg;
    toastContent.textContent = message;
    toast.classList.remove("hidden");

    toastTimer = setTimeout(() => {
        toast.classList.add("hidden");
    }, 4500);
}

/**
 * Updates Console Status Badge.
 */
function setConsoleStatus(badgeText, type = "idle") {
    statusTag.textContent = badgeText;
    statusTag.className = `status-badge ${type}`;
}

/**
 * Displays API responses in the sleek console window.
 */
function displayConsole(status, statusText, data) {
    const isSuccess = status >= 200 && status < 300;
    setConsoleStatus(`HTTP ${status} ${statusText}`, isSuccess ? "success" : "error");

    const formatted = typeof data === "object"
        ? JSON.stringify(data, null, 2)
        : data;

    output.textContent = `// Timestamp: ${new Date().toLocaleTimeString()}\n// Status: HTTP ${status} ${statusText}\n\n${formatted}`;
}

/**
 * Toggles between Login Card and Authenticated Dashboard.
 */
function setAuthState(user) {
    if (user) {
        viewLogin.classList.add("hidden");
        viewDashboard.classList.remove("hidden");

        const fullName = user.user_info?.fullName || user.username.toUpperCase();
        dashFullname.textContent = fullName;
        dashUsername.textContent = user.username;
        dashDn.textContent = user.dn || `uid=${user.username},ou=users,dc=example,dc=com`;

        // Generate initials
        const parts = fullName.split(" ");
        const initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : user.username.substring(0, 2).toUpperCase();
        dashAvatar.textContent = initials;

        showToast(`Welcome, ${fullName}. Authenticated successfully with OpenLDAP.`, "success");
    } else {
        viewDashboard.classList.add("hidden");
        viewLogin.classList.remove("hidden");
        passwordInput.value = "";
        showToast("Signed out successfully.", "info");
    }
}

// --------------------------------------------------------------------------
// Quick Account Selector Chips (Alice / Bob)
// --------------------------------------------------------------------------
function selectChip(activeChip, otherChip, username, password) {
    activeChip.classList.add("active");
    otherChip.classList.remove("active");
    usernameInput.value = username;
    passwordInput.value = password;
}

chipAlice.addEventListener("click", () => {
    selectChip(chipAlice, chipBob, "alice", "alice123");
});

chipBob.addEventListener("click", () => {
    selectChip(chipBob, chipAlice, "bob", "bob123");
});

// --------------------------------------------------------------------------
// Password Visibility Toggle
// --------------------------------------------------------------------------
btnTogglePwd.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    eyeIcon.innerHTML = isPassword
        ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>`
        : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>`;
});

// --------------------------------------------------------------------------
// 1. LDAP Authentication Submit
// --------------------------------------------------------------------------
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    btnLogin.disabled = true;
    btnLoginText.textContent = "Verifying with OpenLDAP...";
    setConsoleStatus("Authenticating...", "loading");
    output.textContent = `// Submitting credentials via Nginx Reverse Proxy...\n// POST ${API_LOGIN}\n// Target: Backend (server-side x-api-key injection) -> OpenLDAP (:389)`;

    try {
        const res = await fetch(API_LOGIN, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        let data;
        const ct = res.headers.get("content-type");
        if (ct && ct.includes("application/json")) {
            data = await res.json();
        } else {
            data = await res.text();
        }

        displayConsole(res.status, res.statusText || (res.ok ? "OK" : "Unauthorized"), data);

        if (res.ok && data.authenticated) {
            setAuthState(data);
        } else {
            showToast(data.detail || "Error: Invalid LDAP credentials.", "error");
        }
    } catch (err) {
        setConsoleStatus("Error", "error");
        showToast(`Connection error: ${err.message}`, "error");
        output.textContent = `// Connection error: ${err.message}\n// Ensure Nginx and OpenLDAP containers are running.`;
    } finally {
        btnLogin.disabled = false;
        btnLoginText.textContent = "Sign In to System";
    }
});

// Logout
btnLogout.addEventListener("click", () => {
    setAuthState(null);
    setConsoleStatus("Signed Out", "idle");
    output.textContent = "// Session ended. Enter your credentials to authenticate again with OpenLDAP.";
});

// --------------------------------------------------------------------------
// 2. Protected Data GET
// --------------------------------------------------------------------------
btnGet.addEventListener("click", async () => {
    setConsoleStatus("Requesting...", "loading");
    output.textContent = `// Requesting GET ${API_DATA} via Nginx...\n// Nginx injects rotated x-api-key header without exposing it to the browser.`;

    try {
        const res = await fetch(API_DATA);
        let data;
        const ct = res.headers.get("content-type");
        if (ct && ct.includes("application/json")) {
            data = await res.json();
        } else {
            data = await res.text();
        }

        displayConsole(res.status, res.statusText || "OK", data);
        if (res.ok) {
            showToast("Record successfully decrypted from database.", "success");
        }
    } catch (err) {
        displayConsole(500, "Error", err.message);
        showToast("Connection error while fetching data.", "error");
    }
});

// --------------------------------------------------------------------------
// 3. Protected Data POST (Encrypted write)
// --------------------------------------------------------------------------
btnPost.addEventListener("click", async () => {
    const msg = postMessageInput.value.trim() || "Confidential secure record";
    setConsoleStatus("Encrypting...", "loading");
    output.textContent = `// Submitting POST ${API_DATA} via Nginx...\n// Backend encrypts payload with 256-bit Fernet before storing in SQLite.`;

    try {
        const res = await fetch(API_DATA, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msg })
        });

        let data;
        const ct = res.headers.get("content-type");
        if (ct && ct.includes("application/json")) {
            data = await res.json();
        } else {
            data = await res.text();
        }

        displayConsole(res.status, res.statusText || "OK", data);
        if (res.ok) {
            showToast("Message encrypted and saved into SQLite successfully.", "success");
        }
    } catch (err) {
        displayConsole(500, "Error", err.message);
        showToast("Connection error while storing data.", "error");
    }
});

// --------------------------------------------------------------------------
// 4. Status Check
// --------------------------------------------------------------------------
btnStatus.addEventListener("click", async () => {
    setConsoleStatus("Diagnostics...", "loading");
    output.textContent = `// Requesting GET ${API_STATUS}...\n// Inspecting active secret injected by Nginx and LDAP directory health.`;

    try {
        const res = await fetch(API_STATUS);
        let data;
        const ct = res.headers.get("content-type");
        if (ct && ct.includes("application/json")) {
            data = await res.json();
            if (data.active_api_secret_sample) {
                specSecret.textContent = data.active_api_secret_sample;
            }
        } else {
            data = await res.text();
        }

        displayConsole(res.status, res.statusText || "OK", data);
        if (res.ok) {
            showToast("System diagnostics and secret status updated.", "info");
        }
    } catch (err) {
        displayConsole(500, "Error", err.message);
        showToast("Error while checking status.", "error");
    }
});
