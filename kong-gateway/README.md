# Kong Gateway Configuration

Kong Gateway được sử dụng làm API Gateway chính cho dự án MathService, thay thế cho API Gateway tự xây dựng trước đó.

## Tổng quan

Kong Gateway cung cấp:
- **Định tuyến thông minh**: Route requests đến các microservices phù hợp
- **Xác thực JWT**: Tích hợp với Authify service để xác thực người dùng
- **Rate Limiting**: Giới hạn số lượng requests để bảo vệ backend services
- **CORS**: Cấu hình Cross-Origin Resource Sharing
- **Logging**: Ghi log tất cả requests/responses
- **Monitoring**: Metrics cho Prometheus/Grafana
- **Load Balancing**: Cân bằng tải cho các backend services

## Cấu trúc thư mục

```
kong-gateway/
├── kong.yml                 # Declarative configuration
├── Dockerfile              # Kong container image
├── config/
│   └── kong.conf           # Kong configuration file
├── scripts/
│   ├── init-kong.sh        # Initialization script
│   └── setup-jwt.sh        # JWT setup script
├── plugins/                # Custom plugins (if any)
└── logs/                   # Kong logs directory
```

## Services và Routes

### Backend Services
- **authify-service**: User authentication (port 3001)
- **payment-service**: Payment processing (port 3002)
- **agent-policy-service**: Agent policies (port 3003)
- **admin-service**: Admin operations (port 3004)
- **admin-management-service**: Admin management (port 3005)
- **content-service**: Content management (port 3006)
- **botpress-service**: Chatbot service (port 3000)

### API Routes
- `POST /api/auth/login` → authify-service (public)
- `POST /api/auth/register` → authify-service (public)
- `POST /api/auth/refresh` → authify-service (protected)
- `POST /api/auth/logout` → authify-service (protected)
- `GET|PUT /api/auth/profile` → authify-service (protected)
- `GET|POST|PUT|DELETE /api/users` → authify-service (protected)
- `GET|POST|PUT|DELETE /api/payments` → payment-service (protected)
- `GET|POST|PUT|DELETE /api/agent-policies` → agent-policy-service (protected)
- `GET|POST|PUT|DELETE /api/admin` → admin-service (protected)
- `GET|POST|PUT|DELETE /api/admin-management` → admin-management-service (protected)
- `GET|POST|PUT|DELETE /api/content` → content-service (protected)
- `GET|POST|PUT|DELETE /api/chatbot` → botpress-service (protected)
- `GET /api/health` → authify-service (public)

## Plugins Configuration

### Global Plugins
1. **CORS**: Cho phép cross-origin requests từ frontend
2. **Rate Limiting**: 100 requests/minute, 1000/hour, 10000/day
3. **File Log**: Ghi log vào `/tmp/kong-access.log`
4. **Prometheus**: Metrics cho monitoring

### Route-specific Plugins
1. **JWT Authentication**: Áp dụng cho tất cả protected routes
   - Header: `Authorization: Bearer <token>`
   - Cookie: `jwt=<token>`
   - URL param: `?jwt=<token>`

## Consumers

- **frontend-client**: Frontend applications
- **admin-client**: Admin applications
- **agent-client**: Agent applications

## Ports

- **8000**: Kong Proxy (HTTP) - Main API endpoint
- **8443**: Kong Proxy (HTTPS)
- **8001**: Kong Admin API (HTTP)
- **8444**: Kong Admin API (HTTPS)
- **8100**: Kong Status API

## Environment Variables

```bash
KONG_DATABASE=postgres
KONG_PG_HOST=kong-database
KONG_PG_USER=kong
KONG_PG_PASSWORD=kongpass
KONG_PG_DATABASE=kong
KONG_PROXY_LISTEN=0.0.0.0:8000, 0.0.0.0:8443 ssl
KONG_ADMIN_LISTEN=0.0.0.0:8001, 0.0.0.0:8444 ssl
KONG_PLUGINS=bundled,jwt,cors,rate-limiting,file-log,prometheus
KONG_LOG_LEVEL=info
```

## Sử dụng

### Khởi động Kong Gateway

```bash
# Khởi động tất cả services
docker compose up -d

# Chỉ khởi động Kong và database
docker compose up -d kong-database kong-gateway
```

### Kiểm tra trạng thái

```bash
# Kiểm tra Kong status
curl http://localhost:8100/status

# Kiểm tra Kong Admin API
curl http://localhost:8001/

# Kiểm tra services
curl http://localhost:8001/services

# Kiểm tra routes
curl http://localhost:8001/routes
```

### Test API endpoints

```bash
# Public endpoint (không cần authentication)
curl http://localhost:8080/api/health

# Login để lấy JWT token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Sử dụng JWT token cho protected endpoints
curl http://localhost:8080/api/auth/profile \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Setup JWT credentials

```bash
# Chạy script setup JWT
./kong-gateway/scripts/setup-jwt.sh
```

## Monitoring

Kong Gateway tích hợp với Prometheus để cung cấp metrics:

- Request count và latency
- Error rates
- Upstream health status
- Plugin-specific metrics

Truy cập Grafana tại http://localhost:12001 để xem dashboards.

## Logs

Kong logs được ghi vào:
- Container stdout/stderr (docker logs kong-gateway)
- File logs: `/tmp/kong-access.log` (trong container)
- Host logs: `./kong-gateway/logs/` (mounted volume)

## Troubleshooting

### Kong không khởi động được

1. Kiểm tra PostgreSQL database:
```bash
docker compose logs kong-database
```

2. Kiểm tra Kong logs:
```bash
docker compose logs kong-gateway
```

3. Kiểm tra Kong configuration:
```bash
docker compose exec kong-gateway kong config -c /etc/kong/kong.conf
```

### Database migration issues

```bash
# Chạy lại migrations
docker compose exec kong-gateway kong migrations bootstrap --conf /etc/kong/kong.conf

# Reset database (cẩn thận!)
docker compose exec kong-gateway kong migrations reset --conf /etc/kong/kong.conf --yes
```

### JWT authentication không hoạt động

1. Kiểm tra JWT credentials:
```bash
curl http://localhost:8001/consumers/frontend-client/jwt
```

2. Verify JWT token:
```bash
# Decode JWT token tại https://jwt.io
```

3. Kiểm tra JWT plugin configuration:
```bash
curl http://localhost:8001/plugins | jq '.data[] | select(.name=="jwt")'
```

## Security Notes

- Thay đổi default passwords trong production
- Sử dụng HTTPS cho tất cả communications
- Rotate JWT secrets định kỳ
- Monitor và alert cho unusual traffic patterns
- Backup Kong configuration và database thường xuyên