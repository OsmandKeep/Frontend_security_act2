// Relative API endpoint handled by Nginx reverse proxy
const apiEndpoint = "/api/data";

const output = document.getElementById("response-output");
const statusTag = document.getElementById("status-tag");
const btnGet = document.getElementById("btn-get");
const btnPost = document.getElementById("btn-post");

/**
 * Builds HTTP headers for client requests.
 * Note: x-api-key is NOT included here; it is injected server-side by the Nginx reverse proxy.
 *
 * @param {boolean} isJson - Whether the request payload is JSON.
 * @returns {HeadersInit} - Request headers object.
 */
function getHeaders(isJson = false) {
    const headers = {};
    if (isJson) {
        headers["Content-Type"] = "application/json";
    }
    return headers;
}

/**
 * Updates UI status badge with response status.
 *
 * @param {number|string} status - HTTP status code or state label.
 * @param {string} statusText - HTTP status description text.
 * @param {boolean} isError - Flag indicating if status is an error.
 */
function updateStatus(status, statusText, isError = false) {
    if (!statusTag) return;
    statusTag.textContent = `${status} ${statusText}`;
    statusTag.className = "status-tag " + (isError ? "error" : "success");
}

/**
 * Formats and displays API response in the output box.
 *
 * @param {number} status - HTTP status code.
 * @param {string} statusText - Status description.
 * @param {any} data - Response body content.
 */
function displayResponse(status, statusText, data) {
    const isSuccess = status >= 200 && status < 300;
    updateStatus(status, statusText, !isSuccess);
    
    const formattedData = typeof data === "object" 
        ? JSON.stringify(data, null, 2) 
        : data;
    
    output.textContent = `Status: ${status} ${statusText}\n\n${formattedData}`;
}

// Execute protected GET request via Nginx Reverse Proxy
btnGet.addEventListener("click", async () => {
    output.textContent = `Fetching GET ${apiEndpoint}...`;
    if (statusTag) {
        statusTag.textContent = "Loading...";
        statusTag.className = "status-tag";
    }

    try {
        const response = await fetch(apiEndpoint, {
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
        if (statusTag) {
            statusTag.textContent = "Connection Error";
            statusTag.className = "status-tag error";
        }
        output.textContent = `Connection Error: ${error.message}\n\nPlease ensure Nginx container and backend upstream are running.`;
    }
});

// Execute protected POST request via Nginx Reverse Proxy
btnPost.addEventListener("click", async () => {
    output.textContent = `Fetching POST ${apiEndpoint}...`;
    if (statusTag) {
        statusTag.textContent = "Loading...";
        statusTag.className = "status-tag";
    }

    try {
        const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: getHeaders(true),
            body: JSON.stringify({ message: "Request sent via Nginx Reverse Proxy" })
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
        output.textContent = `Connection Error: ${error.message}\n\nPlease ensure Nginx container and backend upstream are running.`;
    }
});
