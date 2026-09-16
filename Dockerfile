FROM nginx:alpine

# Install envsubst (gettext package)
RUN apk add --no-cache gettext

# Copy static frontend files
COPY index.html /usr/share/nginx/html/index.html
COPY app.js /usr/share/nginx/html/app.js
COPY styles.css /usr/share/nginx/html/styles.css

# Copy Nginx template and entrypoint script
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.sh

# Fix Windows CRLF line endings and grant execution permissions
RUN sed -i 's/\r$//' /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Wrap /bin/sh with busybox so all sh calls resolve the rotated API_SECRET
RUN mv /bin/sh /bin/sh.bak && \
    printf '#!/bin/busybox sh\nif [ -f /shared_secrets/current_secret.txt ]; then export API_SECRET="$(cat /shared_secrets/current_secret.txt 2>/dev/null)"; fi\nexec /bin/busybox sh "$@"\n' > /bin/sh && \
    chmod +x /bin/sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
