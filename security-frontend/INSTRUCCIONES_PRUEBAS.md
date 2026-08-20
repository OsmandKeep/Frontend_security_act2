# 📋 Guía de Ejecución y Pasos de Pruebas

Este documento contiene la guía completa para poner en marcha el proyecto y verificar paso a paso las **7 pruebas requeridas** de la práctica de seguridad de API.

---

## 🛠️ Requisitos Previos

1. **Backend:** Servidor API ejecutándose en `http://localhost:8000` (o el puerto configurado).
2. **CORS:** El backend debe permitir peticiones cruzadas (CORS) y la cabecera personalizada `x-api-key`.
3. **Navegador Web:** Google Chrome, Microsoft Edge, Firefox, etc.

---

## 🚀 Paso 1: Iniciar el Servidor Backend

Abre una terminal en la carpeta de tu backend y arráncalo según la tecnología que estés usando:

- **Si usas Python (FastAPI / Uvicorn):**
  ```powershell
  uvicorn main:app --reload --port 8000
  ```
- **Si usas Python (Flask):**
  ```powershell
  python app.py
  ```
- **Si usas Node.js (Express):**
  ```powershell
  npm start
  # o
  node index.js
  ```

> 💡 **Nota sobre CORS:** Asegúrate de que tu backend tenga habilitado CORS para aceptar peticiones desde el navegador y admita el header `x-api-key`.

---

## 🌐 Paso 2: Abrir el Frontend

Tienes tres opciones sencillas para abrir la interfaz:

* **Opción A (Recomendada y directa):**
  Abre el explorador de archivos, entra a `security-frontend` y haz **doble clic en `index.html`**.
* **Opción B (Con VS Code Live Server):**
  Haz clic derecho sobre `index.html` dentro de VS Code y selecciona **"Open with Live Server"**.
* **Opción C (Servidor local por consola):**
  ```powershell
  cd "c:\Users\Osman\OneDrive\Escritorio\Frontend\security-frontend"
  python -m http.server 3000
  ```
  Luego abre `http://localhost:3000` en tu navegador.

---

## 🧪 Paso 3: Guía Paso a Paso de las 7 Pruebas Requeridas

---

### 🔹 Test 1 — Health Check (Endpoint Público)
* **Objetivo:** Verificar que el endpoint de salud responde correctamente sin requerir autenticación.
* **Cómo probarlo:**
  1. Abre una nueva pestaña en tu navegador.
  2. Ingresa a la URL: `http://localhost:8000/health` (o haz la petición mediante Postman/Thunder Client).
* **Resultado Esperado:**
  - Código HTTP: `200 OK`
  - No debe solicitar cabecera `x-api-key`.

---

### 🔹 Test 2 — GET sin API Key
* **Objetivo:** Comprobar que el endpoint protegido bloquea peticiones GET sin credenciales.
* **Cómo probarlo en la interfaz:**
  1. En el campo **API Key (Header `x-api-key`)**, borra todo el texto y déjalo **completamente vacío**.
  2. Presiona el botón azul: **`[ Get Protected Data ]`**.
* **Resultado Esperado en pantalla:**
  - Badge de Estado: `401 Unauthorized` (en color rojo).
  - Mensaje de respuesta del backend denegando el acceso.

---

### 🔹 Test 3 — GET con API Key Incorrecta
* **Objetivo:** Comprobar que el endpoint protegido rechaza claves no autorizadas.
* **Cómo probarlo en la interfaz:**
  1. En el campo **API Key (Header `x-api-key`)**, escribe: `wrong-key` o cualquier texto falso.
  2. Presiona el botón azul: **`[ Get Protected Data ]`**.
* **Resultado Esperado en pantalla:**
  - Badge de Estado: `401 Unauthorized` (en color rojo).
  - Mensaje de respuesta del backend indicando clave inválida.

---

### 🔹 Test 4 — GET con API Key Correcta
* **Objetivo:** Obtener la información protegida cuando se envía la clave correcta.
* **Cómo probarlo en la interfaz:**
  1. En el campo **API Key (Header `x-api-key`)**, escribe tu clave secreta válida (por ejemplo: `mi-clave-secreta-123` o la definida en tu backend).
  2. Presiona el botón azul: **`[ Get Protected Data ]`**.
* **Resultado Esperado en pantalla:**
  - Badge de Estado: `200 OK` (en color verde).
  - Se visualiza el JSON con los datos protegidos devueltos por el backend.

---

### 🔹 Test 5 — POST sin API Key
* **Objetivo:** Comprobar que las peticiones POST protegidas requieren autenticación obligatoria.
* **Cómo probarlo en la interfaz:**
  1. Borra el campo **API Key (Header `x-api-key`)** dejándolo vacío.
  2. Presiona el botón: **`[ Send POST Request ]`**.
* **Resultado Esperado en pantalla:**
  - Badge de Estado: `401 Unauthorized` (en color rojo).
  - Mensaje de acceso denegado.

---

### 🔹 Test 6 — POST con API Key Correcta
* **Objetivo:** Realizar con éxito una petición POST enviando la clave autorizada.
* **Cómo probarlo en la interfaz:**
  1. Ingresa tu clave secreta correcta en el campo **API Key (Header `x-api-key`)**.
  2. Presiona el botón: **`[ Send POST Request ]`**.
* **Resultado Esperado en pantalla:**
  - Badge de Estado: `200 OK` (en color verde).
  - Respuesta JSON:
    ```json
    {
      "message": "POST received"
    }
    ```

---

### 🔹 Test 7 — Verificación y Demostración en Frontend
* **Objetivo:** Demostrar la interacción fluida del cliente web con el backend.
* **Criterios de éxito:**
  1. El botón GET llama con éxito al endpoint protegido.
  2. El botón POST llama con éxito al endpoint protegido.
  3. Las respuestas (tanto códigos de estado como datos JSON) se renderizan en tiempo real dentro del cuadro de respuesta en la página web.

---

## 🔍 Solución de Problemas Comunes

| Síntoma / Error | Posible Causa | Solución |
|---|---|---|
| `Connection Error: Failed to fetch` | El backend no está iniciado o el puerto es diferente. | Revisa que el backend esté corriendo en `http://localhost:8000` o actualiza el campo **Backend Base URL** en la web. |
| `CORS Error` en la consola del navegador | El backend no tiene configurado el middleware de CORS. | Habilita CORS en el backend permitiendo orígenes `*` y cabeceras `["x-api-key", "Content-Type"]`. |
| Estado `404 Not Found` | La ruta no coincide. | Comprueba que el backend tenga registrada la ruta `/api/data`. |
