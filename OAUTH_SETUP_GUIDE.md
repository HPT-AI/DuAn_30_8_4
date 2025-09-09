# OAuth Setup Guide - Google & Facebook Authentication

Hướng dẫn này sẽ giúp bạn thiết lập đăng nhập bằng Google và Facebook cho ứng dụng.

## 🔧 Thiết lập Google OAuth

### 1. Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Kích hoạt Google+ API và Google Identity Services

### 2. Tạo OAuth 2.0 Credentials

1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth Client ID**
3. Chọn **Web Application**
4. Thêm các **Authorized JavaScript origins**:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
5. Thêm các **Authorized redirect URIs**:
   - `http://localhost:8001/api/v1/auth/google/callback` (backend callback)
6. Lưu **Client ID** và **Client Secret**

### 3. Cấu hình Environment Variables

Thêm vào file `.env`:

```env
# Frontend
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# Backend
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## 📘 Thiết lập Facebook OAuth

### 1. Tạo Facebook App

1. Truy cập [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** > **Create App**
3. Chọn **Consumer** hoặc **Business** tùy theo nhu cầu
4. Điền thông tin app và tạo

### 2. Cấu hình Facebook Login

1. Trong dashboard app, thêm **Facebook Login** product
2. Vào **Facebook Login** > **Settings**
3. Thêm **Valid OAuth Redirect URIs**:
   - `http://localhost:8001/api/v1/auth/facebook/callback` (backend callback)
4. Thêm **Valid JavaScript Origins**:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)

### 3. Lấy App Credentials

1. Vào **Settings** > **Basic**
2. Copy **App ID** và **App Secret**

### 4. Cấu hình Environment Variables

Thêm vào file `.env`:

```env
# Frontend
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id_here

# Backend
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here
```

## 🚀 Cách hoạt động

### Google Authentication Flow

1. **Frontend**: User click "Đăng nhập với Google"
2. **Google**: Hiển thị popup đăng nhập Google
3. **Google**: Trả về ID token sau khi user đăng nhập thành công
4. **Frontend**: Gửi ID token đến backend endpoint `/api/v1/auth/google/token`
5. **Backend**: Verify ID token với Google, tạo/tìm user, trả về JWT tokens
6. **Frontend**: Lưu JWT tokens và redirect user

### Facebook Authentication Flow

1. **Frontend**: User click "Đăng nhập với Facebook"
2. **Facebook**: Hiển thị popup đăng nhập Facebook
3. **Facebook**: Trả về access token sau khi user đăng nhập thành công
4. **Frontend**: Gửi access token đến backend endpoint `/api/v1/auth/facebook/token`
5. **Backend**: Verify access token với Facebook, tạo/tìm user, trả về JWT tokens
6. **Frontend**: Lưu JWT tokens và redirect user

## 🔒 Bảo mật

### Google
- Sử dụng Google ID token thay vì access token để tăng bảo mật
- Verify token với Google's official library
- Kiểm tra issuer và audience của token

### Facebook
- Verify access token bằng Facebook's debug endpoint
- Kiểm tra token validity và app ownership
- Sử dụng app token để verify user token

## 🐛 Troubleshooting

### Lỗi thường gặp

1. **"Invalid Google token"**
   - Kiểm tra GOOGLE_CLIENT_ID có đúng không
   - Đảm bảo domain được thêm vào Authorized JavaScript origins

2. **"Facebook OAuth service not configured"**
   - Kiểm tra FACEBOOK_APP_ID và FACEBOOK_APP_SECRET
   - Đảm bảo Facebook Login product đã được thêm vào app

3. **CORS errors**
   - Kiểm tra BACKEND_CORS_ORIGINS có chứa frontend URL
   - Đảm bảo OAuth redirect URIs được cấu hình đúng

### Debug Tips

1. Kiểm tra browser console để xem logs chi tiết
2. Kiểm tra backend logs để xem lỗi server-side
3. Verify environment variables được load đúng
4. Test OAuth flow trên localhost trước khi deploy production

## 📝 Environment Variables Summary

```env
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8001
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id

# Backend
DATABASE_URL=sqlite:///./user_service.db
JWT_SECRET_KEY=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
OAUTH_REDIRECT_URI=http://localhost:8001/api/v1/auth/google/callback
BACKEND_CORS_ORIGINS=http://localhost:3000,http://localhost:8080,http://localhost:12000
```

## 🎯 Testing

Sau khi cấu hình xong:

1. Start backend service: `cd backend/user-service && python -m uvicorn app.main:app --reload --port 8001`
2. Start frontend: `npm run dev`
3. Truy cập `http://localhost:3000`
4. Click "Đăng nhập" và test cả Google và Facebook login
5. Kiểm tra browser console và backend logs để debug nếu có lỗi

## 📚 Tham khảo

- [Google Identity Services](https://developers.google.com/identity/gsi/web)
- [Facebook Login for the Web](https://developers.facebook.com/docs/facebook-login/web)
- [Keycloak Social Login Documentation](https://www.keycloak.org/docs/latest/server_admin/index.html#_identity_provider_federation)