#!/bin/sh
set -e

# Set default values for environment variables if not provided
export API_UPSTREAM="${API_UPSTREAM:-http://host.docker.internal:8000}"
export API_KEY="${API_KEY:-}"

echo "[Entrypoint] Configuring Nginx reverse proxy..."
echo "[Entrypoint] Target upstream: ${API_UPSTREAM}"

# Inject environment variables into the Nginx configuration template
envsubst '${API_UPSTREAM} ${API_KEY}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Execute the primary container command
exec "$@"
