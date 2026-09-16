#!/bin/sh
set -e

# Set default values for environment variables if not provided
export API_UPSTREAM="${API_UPSTREAM:-http://backend:8000}"
export API_SECRET="${API_SECRET:-my-secret-key}"

# If shared secret file exists, use it
if [ -f /shared_secrets/current_secret.txt ]; then
    export API_SECRET="$(cat /shared_secrets/current_secret.txt)"
fi

echo "[Entrypoint] Configuring Nginx reverse proxy..."
echo "[Entrypoint] Target upstream: ${API_UPSTREAM}"

# Inject environment variables into the Nginx configuration template
envsubst '${API_UPSTREAM} ${API_SECRET}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Setup dynamic shell resolution for API_SECRET in /etc/profile so echo $API_SECRET works
echo 'if [ -f /shared_secrets/current_secret.txt ]; then export API_SECRET=$(cat /shared_secrets/current_secret.txt); fi' >> /etc/profile
echo 'if [ -f /shared_secrets/current_secret.txt ]; then export API_SECRET=$(cat /shared_secrets/current_secret.txt); fi' >> /root/.shrc
export ENV=/root/.shrc

# Background watcher to auto-reload Nginx when secret rotates
(
    LAST_SECRET="${API_SECRET}"
    while true; do
        sleep 2
        if [ -f /shared_secrets/current_secret.txt ]; then
            CURRENT="$(cat /shared_secrets/current_secret.txt 2>/dev/null)"
            if [ -n "$CURRENT" ] && [ "$CURRENT" != "$LAST_SECRET" ]; then
                echo "[Nginx Watcher] Detected new API_SECRET. Updating config and reloading..."
                export API_SECRET="$CURRENT"
                envsubst '${API_UPSTREAM} ${API_SECRET}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf
                nginx -s reload 2>/dev/null || true
                LAST_SECRET="$CURRENT"
            fi
        fi
    done
) &

# Execute the primary container command
exec "$@"

