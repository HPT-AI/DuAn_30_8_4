# TÀI LIỆU HOÀN CHỈNH - HỆ THỐNG BÁO CÁO THI CÔNG

## **1. YÊU CẦU ĐẦY ĐỦ CHI TIẾT**

### **A. KHỞI TẠO BÁO CÁO TỪ FILE WORD MẪU**
- **File mẫu**: Có **n trang** (không cố định - có thể 5, 8, 10, 15... trang)
- **Trang cuối (trang n)**: Luôn là trang trắng
- **Khi bấm "Tạo báo cáo"**:
  - Tạo báo cáo có đúng **n trang**
  - Chèn nội dung **(n-1) trang đầu** từ file mẫu vào báo cáo
  - **Giữ nguyên tất cả định dạng** (fonts, tables, images, styles)
  - **Trang thứ n (trang cuối)** để trống cho việc chèn ảnh

### **B. TỰ ĐỘNG CHÈN 4 Ô ẢNH VÀO TRANG CUỐI**
- **Vị trí**: Trang cuối (trang n) của báo cáo
- **Điều kiện khung ảnh**:
  - Nằm trong khổ A4, **không tràn ra ngoài**
  - **4 ô có kích thước như nhau**
  - **Không phụ thuộc vào kích cỡ ảnh gốc**
- **Khi chèn ảnh**: Ảnh **mở rộng đầy ô**

### **C. NÚT "TẠO THÊM BÁO CÁO"**
- **Chức năng**: Sao chép **2 trang cuối** thành 2 trang mới
- **Logic**: Copy trang (n-1) và (n) thành trang (n+1) và (n+2)
- **Mỗi lần bấm**: Thêm đúng **2 trang**
- **Số thứ tự trang**: Tăng theo số lần bấm
- **Trạng thái 2 trang copy**: "Người dùng chưa sửa"

### **D. QUYỀN CHỈNH SỬA PHÂN BIỆT**
- **Tất cả các trang thường**:
  - Xóa dữ liệu được
  - Sửa dữ liệu được  
  - Viết thêm chữ được
  - Thay đổi định dạng được
- **Riêng trang ảnh (trang n)**:
  - **Chỉ thay được ảnh** bằng cách bấm vào ảnh
  - **KHÔNG được xóa ảnh**
  - **Chữ tiêu đề trên trang ảnh vẫn sửa được**

### **E. NÚT KHÓA/MỞ KHÓA TRANG**
- **Nút khóa trang**: Cho phép **chọn các trang cụ thể** để khóa
- **Khi trang bị khóa**: Người dùng **không tác động được** vào để sửa
- **Muốn sửa trang đã khóa**: Phải chọn **nút mở khóa** trước

### **F. NÚT CHIA SẺ BÁO CÁO**
- **Nút chia sẻ**: Chọn **thành viên cụ thể** để chia sẻ
- **Nút chia sẻ tất cả**: **Ai là thành viên cũng thấy**
- **Khi đã bấm nút chia sẻ**:
  - **Tất cả các trang báo cáo được tạo ra sẽ bị khóa lại**
  - **Không thể mở để sửa được**
  - **Chỉ được phép "Tạo thêm"**
  - **Phần tạo thêm nếu cũng chia sẻ thì cũng bị khóa lại**
  - **Báo cáo chia sẻ sẽ tăng thêm số trang chia sẻ**

## **2. CÔNG NGHỆ SỬ DỤNG**

### **Frontend:**
- **Next.js 14** với App Router
- **React** cho UI components
- **TypeScript** cho type safety
- **Tailwind CSS** cho styling
- **Shadcn/ui** cho UI components

### **Backend:**
- **Next.js API Routes** cho server endpoints
- **ONLYOFFICE Document Server** cho document processing
- **ONLYOFFICE Document Builder API** cho Word manipulation

### **Document Processing:**
- **File format**: .docx (Microsoft Word)
- **Image processing**: Automatic resize và fit A4
- **Page manipulation**: Copy, duplicate, insert content

## **3. TÌNH TRẠNG ĐÃ LÀM**

### **✅ HOÀN THÀNH:**
- **Giao diện upload file Word** (`/app/construction-reports/page.tsx`)
- **Validation file .docx** với thông báo "trang cuối luôn trắng"
- **Layout editor** với sidebar và document viewer A4 (`/app/construction-reports/editor/[reportId]/page.tsx`)
- **CRUD cơ bản** cho công trình, hạng mục, báo cáo
- **UI components** cho khóa/mở khóa, navigation trang
- **API structure** cơ bản (`/app/api/construction-reports/`)
- **Document processor skeleton** (`/lib/construction-reports/document-processor.ts`)

## **4. NHỮNG GÌ CHƯA LÀM ĐƯỢC**

### **❌ THIẾU HOÀN TOÀN:**
1. **Logic đọc số trang n từ file Word mẫu**
2. **Function chèn nội dung (n-1) trang đầu vào báo cáo với định dạng**
3. **Logic tự động tạo 4 ô ảnh fit A4 ở trang cuối**
4. **Function copy 2 trang cuối: (n-1, n) → (n+1, n+2)**
5. **Hệ thống quyền chỉnh sửa phân biệt theo từng trang**
6. **Logic khóa/mở khóa selective pages**
7. **Hệ thống chia sẻ với user management**
8. **Auto-lock khi chia sẻ báo cáo**
9. **ONLYOFFICE Document Server integration**

### **LÝ DO CHƯA LÀM ĐƯỢC:**
- **Cần ONLYOFFICE Document Server** chạy riêng biệt
- **Cần Document Builder API** để xử lý Word files
- **Cần User Management System** cho chia sẻ
- **Cần Database schema** cho permissions và sharing

## **5. CÁC BƯỚC HOÀN THÀNH**

### **Bước 1: Setup ONLYOFFICE Server** ⚠️ **BẮT BUỘC**
\`\`\`bash
# Cài đặt Docker (nếu chưa có)
# Windows: Download Docker Desktop
# Linux: sudo apt install docker.io

# Chạy ONLYOFFICE Document Server
docker run -i -t -d -p 8080:80 onlyoffice/documentserver

# Kiểm tra server chạy
# Mở browser: http://localhost:8080

# Set environment variable trong v0 project settings
NEXT_PUBLIC_ONLYOFFICE_SERVER_URL=http://localhost:8080
\`\`\`

### **Bước 2: Implement Document Processing Logic**
**File cần code**: `/lib/construction-reports/document-processor.ts`

**Functions cần viết**:
\`\`\`typescript
// Đọc số trang từ Word file
async getPageCount(wordFile: File): Promise<number>

// Lấy nội dung n-1 trang đầu
async extractContent(wordFile: File, pageCount: number): Promise<DocumentContent>

// Tạo 4 ô ảnh fit A4 ở trang cuối
async createImageGrid(pageNumber: number): Promise<ImageGrid>

// Nhân bản 2 trang cuối
async duplicatePages(pageNumbers: [number, number]): Promise<void>

// Chèn nội dung vào báo cáo mới
async insertContentToReport(content: DocumentContent, targetDoc: Document): Promise<void>
\`\`\`

### **Bước 3: API Endpoints Implementation**
**Files cần code**:
- `/app/api/construction-reports/create/route.ts` - Tạo báo cáo từ template
- `/app/api/construction-reports/add-pages/[reportId]/route.ts` - Thêm 2 trang
- `/app/api/construction-reports/lock-pages/[reportId]/route.ts` - Khóa trang
- `/app/api/construction-reports/share/[reportId]/route.ts` - Chia sẻ báo cáo

### **Bước 4: User Management & Sharing System**
**Cần tạo**:
- Database schema cho users, permissions, sharing
- Authentication system
- Permission middleware
- Share management UI

### **Bước 5: Advanced Features**
- Page-level editing permissions
- Auto-lock khi share
- Real-time collaboration
- Version control

## **6. VỊ TRÍ CODE HIỆN TẠI**

### **Frontend:**
- **Main page**: `/app/construction-reports/page.tsx` ✅
- **Editor page**: `/app/construction-reports/editor/[reportId]/page.tsx` ✅
- **Components**: `/components/construction-reports/` ✅

### **Backend:**
- **API routes**: `/app/api/construction-reports/` ⚠️ Cần implement logic
- **Document processor**: `/lib/construction-reports/document-processor.ts` ⚠️ Cần implement
- **Utils**: `/lib/construction-reports/` ⚠️ Cần tạo thêm

### **Database:**
- **Schema**: Chưa có ❌
- **Models**: Chưa có ❌
- **Migrations**: Chưa có ❌

## **7. TESTING & DEPLOYMENT**

### **Local Testing:**
1. Setup ONLYOFFICE Server
2. Upload Word template file
3. Test tạo báo cáo
4. Test chèn ảnh
5. Test nhân bản trang
6. Test khóa/mở khóa
7. Test chia sẻ

### **Production Deployment:**
- ONLYOFFICE Server trên cloud
- Database setup (PostgreSQL/MySQL)
- File storage (AWS S3/Vercel Blob)
- User authentication
- SSL certificates

---

**Tóm tắt**: Frontend và UI đã hoàn thành 90%. Cần setup ONLYOFFICE Server và implement document processing logic để hoàn thành 100% tính năng.
