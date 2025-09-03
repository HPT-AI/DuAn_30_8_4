# Hướng dẫn Docker Compose - Dự án Tích hợp

## Tổng quan

File `docker-compose.yml` đã được hợp nhất để chứa tất cả các dịch vụ cần thiết cho dự án, bao gồm:

### Các dịch vụ chính:

1. **nextjs-app** (Frontend)
   - Port: 12000 → 3000
   - Container: khuongcuoicung-app
   - Mô tả: Ứng dụng Next.js chính

2. **api-gateway** (API Gateway)
   - Port: 8080 → 8080
   - Container: api-gateway
   - Mô tả: Cổng API chính để định tuyến các request

3. **redis** (Cache & Rate Limiting)
   - Port: 6379 → 6379
   - Container: api-gateway-redis
   - Mô tả: Redis cho caching và rate limiting

### Backend Microservices (7 services):

4. **user-service**
   - Port: 3001 → 80
   - Container: user-service
   - Mô tả: Dịch vụ quản lý người dùng

5. **content-service**
   - Port: 3002 → 80
   - Container: content-service
   - Mô tả: Dịch vụ quản lý nội dung

6. **payment-service**
   - Port: 3003 → 80
   - Container: payment-service
   - Mô tả: Dịch vụ thanh toán

7. **admin-service**
   - Port: 3004 → 80
   - Container: admin-service
   - Mô tả: Dịch vụ quản trị

8. **botpress**
   - Port: 3005 → 3000
   - Container: botpress
   - Mô tả: Chatbot platform

9. **agent-policy-service**
   - Port: 3006 → 80
   - Container: agent-policy-service
   - Mô tả: Dịch vụ chính sách agent

10. **agent-management-service**
    - Port: 3007 → 80
    - Container: agent-management-service
    - Mô tả: Dịch vụ quản lý agent

### Monitoring Services:

11. **prometheus**
    - Port: 9090 → 9090
    - Container: api-gateway-prometheus
    - Mô tả: Thu thập metrics

12. **grafana**
    - Port: 12001 → 3000
    - Container: api-gateway-grafana
    - Mô tả: Dashboard monitoring
    - Login: admin/admin

## Thứ tự khởi động (depends_on)

```
redis (cơ sở)
↓
7 Backend Microservices:
- user-service
- content-service  
- payment-service
- admin-service
- botpress
- agent-policy-service
- agent-management-service
↓
api-gateway (phụ thuộc vào redis và tất cả 7 microservices)
↓
nextjs-app (phụ thuộc vào api-gateway)
↓
prometheus (phụ thuộc vào api-gateway)
↓
grafana (phụ thuộc vào prometheus)
```

## Cấu hình Network

- **Network name**: `khuongcuoicung-network`
- **Driver**: bridge
- **Subnet**: 172.20.0.0/16
- Tất cả services đều sử dụng cùng một network để giao tiếp nội bộ

## Ports mapping

| Service | External Port | Internal Port | URL |
|---------|---------------|---------------|-----|
| nextjs-app | 12000 | 3000 | http://localhost:12000 |
| api-gateway | 8080 | 8080 | http://localhost:8080 |
| redis | 6379 | 6379 | redis://localhost:6379 |
| user-service | 3001 | 80 | http://localhost:3001 |
| content-service | 3002 | 80 | http://localhost:3002 |
| payment-service | 3003 | 80 | http://localhost:3003 |
| admin-service | 3004 | 80 | http://localhost:3004 |
| botpress | 3005 | 3000 | http://localhost:3005 |
| agent-policy-service | 3006 | 80 | http://localhost:3006 |
| agent-management-service | 3007 | 80 | http://localhost:3007 |
| prometheus | 9090 | 9090 | http://localhost:9090 |
| grafana | 12001 | 3000 | http://localhost:12001 |

## Volumes

- `redis-data`: Lưu trữ dữ liệu Redis
- `prometheus-data`: Lưu trữ dữ liệu metrics
- `grafana-data`: Lưu trữ cấu hình Grafana
- `botpress-data`: Lưu trữ dữ liệu Botpress
- `./api-gateway/logs`: Logs của API Gateway

## Cách sử dụng

### Khởi động tất cả services:
```bash
docker compose up -d
```

### Khởi động services cụ thể:
```bash
docker compose up -d nextjs-app api-gateway redis
```

### Xem logs:
```bash
docker compose logs -f [service-name]
```

### Dừng tất cả services:
```bash
docker compose down
```

### Dừng và xóa volumes:
```bash
docker compose down -v
```

## Health Checks

Các services sau có health check:
- **nextjs-app**: Kiểm tra HTTP endpoint
- **api-gateway**: Kiểm tra /health endpoint
- **redis**: Kiểm tra ping command

## Environment Variables

### API Gateway:
- `NODE_ENV=production`
- `PORT=8080`
- `REDIS_HOST=redis`
- `REDIS_PORT=6379`
- `JWT_SECRET=your-super-secret-jwt-key-change-in-production`
- `LOG_LEVEL=info`
- `MONITORING_ENABLED=true`

### Grafana:
- `GF_SECURITY_ADMIN_PASSWORD=admin`

## Lưu ý quan trọng

1. **Port conflicts**: Grafana đã được chuyển từ port 3000 sang 12001 để tránh xung đột với Next.js app
2. **Dependencies**: Các service sẽ khởi động theo đúng thứ tự đã cấu hình
3. **Network**: Tất cả services sử dụng cùng network để giao tiếp nội bộ
4. **Security**: Đổi JWT_SECRET và Grafana password trong production
5. **Logs**: API Gateway logs được lưu trong `./api-gateway/logs`

## Troubleshooting

### Kiểm tra trạng thái services:
```bash
docker compose ps
```

### Kiểm tra logs lỗi:
```bash
docker compose logs [service-name]
```

### Restart service cụ thể:
```bash
docker compose restart [service-name]
```

### Kiểm tra network:
```bash
docker network ls
docker network inspect khuongcuoicung-network
```