# ConstructVN Admin Frontend

Giao diện quản trị cho hệ thống ConstructVN.

## Tính năng

### Dashboard chính
- Thống kê tổng quan (người dùng, doanh thu, gói dịch vụ)
- Biểu đồ phân tích
- Hoạt động gần đây
- Thông báo hệ thống

### Quản lý người dùng
- Danh sách người dùng
- Thông tin chi tiết
- Quản lý gói dịch vụ
- Lịch sử hoạt động

### Quản lý gói dịch vụ
- Danh sách subscription
- Trạng thái thanh toán
- Gia hạn/hủy gói
- Báo cáo doanh thu

### Cài đặt hệ thống
- Cấu hình chung
- Bảo mật
- Thông báo
- Backup/Restore

## Cấu trúc thư mục

\`\`\`
AdminFrontend/
├── page.tsx              # Dashboard chính
├── layout.tsx            # Layout admin
├── components/           # Components admin
│   └── admin-sidebar.tsx # Sidebar navigation
└── README.md            # Tài liệu
\`\`\`

## Thiết kế

- **Màu chủ đạo**: Đỏ/Cam (red-500 to orange-500)
- **Background**: Slate-900 (tối)
- **Accent**: Red-400, Orange-400
- **Typography**: GeistSans font
- **Components**: shadcn/ui

## Tính năng nâng cao

- Responsive design
- Dark theme
- Multi-language (VI/EN)
- Real-time notifications
- Export/Import data
- Advanced filtering
- Role-based access control
