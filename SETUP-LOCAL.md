# 🚀 Hướng dẫn Setup Local Development

## 📋 Yêu cầu hệ thống
- Node.js 18+ 
- Python 3.8+
- Git

## 🔧 Setup Frontend (Next.js)

### 1. Cài đặt dependencies
```bash
npm install
# hoặc
yarn install
```

### 2. Chạy development server
```bash
npm run dev
# hoặc  
yarn dev
```

**Frontend sẽ chạy tại: http://localhost:3000** ✅

## 🔧 Setup Backend (FastAPI)

### 1. Di chuyển vào thư mục backend
```bash
cd backend/user-service
```

### 2. Tạo virtual environment
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux  
source venv/bin/activate
```

### 3. Cài đặt dependencies
```bash
pip install -r requirements.txt
```

### 4. Chạy backend server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

**Backend sẽ chạy tại: http://localhost:8001** ✅

## 🔑 Cấu hình Google OAuth

### 1. Google Cloud Console
- Truy cập: https://console.cloud.google.com/
- Tạo project mới hoặc chọn project có sẵn
- Bật Google+ API và Google OAuth2 API
- Tạo OAuth 2.0 Client ID

### 2. Authorized redirect URIs
Thêm các URL sau vào Google OAuth settings:
```
http://localhost:3000/api/auth/callback/google
http://localhost:8001/api/v1/auth/google/callback
```

### 3. Environment Variables
File `.env.local` (frontend):
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_API_URL=http://localhost:8001
```

File `backend/user-service/.env` (backend):
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OAUTH_REDIRECT_URI=http://localhost:8001/api/v1/auth/google/callback
BACKEND_CORS_ORIGINS=http://localhost:3000,http://localhost:8001
```

## 🧪 Test Google OAuth

### 1. Kiểm tra Backend API
```bash
curl http://localhost:8001/health
curl http://localhost:8001/api/v1/auth/google
```

### 2. Test Frontend
- Mở http://localhost:3000
- Click vào nút Login
- Chọn "Sign in with Google"
- Hoàn thành OAuth flow

## 📁 Cấu trúc Project

```
DuAn_30_8_3/
├── app/                    # Next.js pages & API routes
├── components/             # React components  
├── contexts/              # React contexts (auth, language)
├── lib/                   # Utility libraries
├── backend/
│   └── user-service/      # FastAPI backend
├── .env.local             # Frontend environment variables
└── README.md
```

## 🐛 Troubleshooting

### Lỗi CORS
- Kiểm tra `BACKEND_CORS_ORIGINS` trong backend/.env
- Đảm bảo frontend URL được thêm vào CORS origins

### Lỗi Google OAuth
- Kiểm tra Google Client ID/Secret
- Xác nhận redirect URIs trong Google Console
- Kiểm tra `OAUTH_REDIRECT_URI` trong backend/.env

### Database lỗi
- Project sử dụng SQLite (file `authify.db`)
- Không cần cài đặt PostgreSQL
- Database sẽ tự động tạo khi chạy backend lần đầu

## 🎯 Ports Summary

| Service | Local Port | URL |
|---------|------------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 8001 | http://localhost:8001 |

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Tất cả dependencies đã được cài đặt
2. Environment variables đã được cấu hình đúng
3. Google OAuth settings đã được setup
4. Ports 3000 và 8001 không bị conflict

---
**Chúc bạn code vui vẻ! 🎉**