const defaultEndpoint = "/api/data";

const output = document.getElementById("response-output");
const statusTag = document.getElementById("status-tag");
const apiUrlInput = document.getElementById("api-url");
const apiKeyInput = document.getElementById("api-key-input");
const btnGet = document.getElementById("btn-get");
const btnPost = document.getElementById("btn-post");

function getEndpointUrl() {
    let base = apiUrlInput ? apiUrlInput.value.trim() : "http://localhost:8000";
    if (!base) base = "http://localhost:8000";
    // Remove trailing slash if present
    base = base.replace(/\/+$/, "");
    return `${base}${defaultEndpoint}`;
}

function getHeaders(isJson = false) {
    const headers = {};
    const key = apiKeyInput.value.trim();
    if (key) {
        headers["x-api-key"] = key;
    }
    if (isJson) {
        headers["Content-Type"] = "application/json";
    }
    return headers;
}

function updateStatus(status, statusText, isError = false) {
    if (!statusTag) return;
    statusTag.textContent = `${status} ${statusText}`;
    statusTag.className = "status-tag " + (isError ? "error" : "success");
}

function displayResponse(status, statusText, data) {
    const isSuccess = status >= 200 && status < 300;
    updateStatus(status, statusText, !isSuccess);
    
    const formattedData = typeof data === "object" 
        ? JSON.stringify(data, null, 2) 
        : data;
    
    output.textContent = `Status: ${status} ${statusText}\n\n${formattedData}`;
}

// Consumo de GET protegido
btnGet.addEventListener("click", async () => {
    const url = getEndpointUrl();
    output.textContent = `Fetching GET ${url}...`;
    if (statusTag) {
        statusTag.textContent = "Loading...";
        statusTag.className = "status-tag";
    }

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: getHeaders()
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
        if (statusTag) {
            statusTag.textContent = "Connection Error";
            statusTag.className = "status-tag error";
        }
        output.textContent = `Connection Error: ${error.message}\n\nMake sure the backend server is running and CORS is enabled.`;
    }
});

// Consumo de POST protegido
btnPost.addEventListener("click", async () => {
    const url = getEndpointUrl();
    output.textContent = `Fetching POST ${url}...`;
    if (statusTag) {
        statusTag.textContent = "Loading...";
        statusTag.className = "status-tag";
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: getHeaders(true),
            body: JSON.stringify({ message: "Request from Frontend" })
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
        if (statusTag) {
            statusTag.textContent = "Connection Error";
            statusTag.className = "status-tag error";
        }
        output.textContent = `Connection Error: ${error.message}\n\nMake sure the backend server is running and CORS is enabled.`;
    }
});
