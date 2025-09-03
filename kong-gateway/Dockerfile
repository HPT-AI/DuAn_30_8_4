# Kong Gateway Dockerfile
# Based on official Kong image with custom configuration

FROM kong:3.4-alpine

# Set environment variables
ENV KONG_DATABASE=postgres
ENV KONG_PG_HOST=kong-database
ENV KONG_PG_USER=kong
ENV KONG_PG_PASSWORD=kongpass
ENV KONG_PG_DATABASE=kong
ENV KONG_PROXY_ACCESS_LOG=/dev/stdout
ENV KONG_ADMIN_ACCESS_LOG=/dev/stdout
ENV KONG_PROXY_ERROR_LOG=/dev/stderr
ENV KONG_ADMIN_ERROR_LOG=/dev/stderr
ENV KONG_ADMIN_LISTEN="0.0.0.0:8001, 0.0.0.0:8444 ssl"
ENV KONG_PROXY_LISTEN="0.0.0.0:8000, 0.0.0.0:8443 ssl"
ENV KONG_PLUGINS="bundled,jwt,cors,rate-limiting,file-log,prometheus,request-transformer,response-transformer"
ENV KONG_LOG_LEVEL=info

# Install additional packages
USER root
RUN apk add --no-cache postgresql-client curl jq

# Create necessary directories
RUN mkdir -p /etc/kong/ssl /usr/local/kong/logs /tmp

# Copy configuration files
COPY config/kong.conf /etc/kong/kong.conf
COPY kong.yml /etc/kong/kong.yml
COPY scripts/init-kong.sh /usr/local/bin/init-kong.sh

# Set permissions
RUN chmod +x /usr/local/bin/init-kong.sh
RUN chown -R kong:kong /etc/kong /usr/local/kong /tmp

# Switch back to kong user
USER kong

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8001/status || exit 1

# Expose ports
EXPOSE 8000 8001 8443 8444 8100

# Use custom initialization script
ENTRYPOINT ["/usr/local/bin/init-kong.sh"]