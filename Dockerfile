FROM nginx:alpine

# Install envsubst (gettext package) if not already present in Alpine base
RUN apk add --no-cache gettext

# Copy static frontend files (clean client files without API keys)
COPY index.html /usr/share/nginx/html/index.html
COPY app.js /usr/share/nginx/html/app.js
COPY styles.css /usr/share/nginx/html/styles.css

# Copy Nginx template and entrypoint script
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.sh

# Fix Windows CRLF line endings and grant execution permissions
RUN sed -i 's/\r$//' /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Expose standard HTTP port
EXPOSE 80

# Configure entrypoint and container execution command
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
