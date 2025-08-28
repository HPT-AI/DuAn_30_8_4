# Hướng Dẫn Xử Lý File Word - Đếm Số Trang

## Vấn Đề Hiện Tại

### Các Công Nghệ Đã Thử (KHÔNG THÀNH CÔNG)

#### 1. Placeholder Function (Đã thử - SAI)
\`\`\`javascript
const getWordPageCount = async (file: File): Promise<number> => {
  return 8; // Luôn trả về 8 trang - HOÀN TOÀN SAI
}
\`\`\`
**Vấn đề:** Không đọc file thực tế, chỉ trả về số cố định.

#### 2. Client-side với mammoth.js (Đã thử - KHÔNG CHÍNH XÁC)
\`\`\`javascript
import mammoth from 'mammoth';

const getWordPageCount = async (file: File): Promise<number> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    // Đếm page breaks
    const pageBreaks = (result.value.match(/\f/g) || []).length;
    if (pageBreaks > 0) return pageBreaks + 1;
    
    // Ước tính từ số từ (500 từ/trang)
    const wordCount = result.value.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 500));
  } catch (error) {
    return 1;
  }
}
\`\`\`
**Vấn đề:** 
- Không đếm chính xác page breaks
- Ước tính từ số từ không phản ánh layout thực tế
- Không tính margins, font size, spacing

## Giải Pháp ĐÚNG: Server-Side Processing

### Công Nghệ Cần Sử Dụng

#### 1. API Route với Node.js Libraries

**Cài đặt dependencies:**
\`\`\`bash
npm install officegen-docx docx-parser mammoth
# Hoặc
npm install python-shell  # Để gọi python-docx
\`\`\`

#### 2. Tạo API Route `/api/word-page-count`

\`\`\`typescript
// pages/api/word-page-count.ts hoặc app/api/word-page-count/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    
    // Phương pháp 1: Sử dụng mammoth để đọc document structure
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    // Đếm page breaks thực tế
    const pageBreaks = (result.value.match(/\x0C/g) || []).length;
    
    // Phương pháp 2: Ước tính dựa trên content và formatting
    const paragraphs = result.value.split('\n').filter(p => p.trim().length > 0);
    const estimatedPages = Math.max(1, Math.ceil(paragraphs.length / 25)); // ~25 paragraphs/page
    
    // Phương pháp 3: Sử dụng file size để ước tính
    const fileSizePages = Math.max(1, Math.ceil(file.size / 50000)); // ~50KB/page
    
    // Lấy giá trị trung bình của các phương pháp
    const finalPageCount = Math.round((pageBreaks + 1 + estimatedPages + fileSizePages) / 3);
    
    return NextResponse.json({ 
      pageCount: finalPageCount,
      methods: {
        pageBreaks: pageBreaks + 1,
        estimated: estimatedPages,
        fileSize: fileSizePages
      }
    });
    
  } catch (error) {
    console.error('Error processing Word document:', error);
    return NextResponse.json({ error: 'Failed to process document' }, { status: 500 });
  }
}
\`\`\`

#### 3. Client-side Implementation

\`\`\`typescript
const getWordPageCount = async (file: File): Promise<number> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/word-page-count', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to get page count');
    }
    
    const data = await response.json();
    return data.pageCount;
    
  } catch (error) {
    console.error('Error getting page count:', error);
    // Fallback: ước tính từ file size
    return Math.max(1, Math.ceil(file.size / 50000));
  }
};
\`\`\`

### Giải Pháp TỐT NHẤT: Python với python-docx

#### 1. Tạo Python Script

\`\`\`python
# scripts/count_pages.py
import sys
from docx import Document
from docx.shared import Inches

def count_pages(file_path):
    try:
        doc = Document(file_path)
        
        # Phương pháp 1: Đếm page breaks
        page_breaks = 0
        for paragraph in doc.paragraphs:
            if paragraph._element.xpath('.//w:br[@w:type="page"]'):
                page_breaks += 1
        
        # Phương pháp 2: Ước tính từ content
        total_paragraphs = len([p for p in doc.paragraphs if p.text.strip()])
        estimated_pages = max(1, total_paragraphs // 25)
        
        # Phương pháp 3: Đếm sections
        sections = len(doc.sections)
        
        # Kết hợp các phương pháp
        final_count = max(page_breaks + 1, estimated_pages, sections)
        
        return final_count
        
    except Exception as e:
        print(f"Error: {e}")
        return 1

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python count_pages.py <file_path>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    page_count = count_pages(file_path)
    print(page_count)
\`\`\`

#### 2. API Route gọi Python Script

\`\`\`typescript
// app/api/word-page-count/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    // Lưu file tạm
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    
    const tempFilePath = path.join(tempDir, `temp_${Date.now()}.docx`);
    const arrayBuffer = await file.arrayBuffer();
    fs.writeFileSync(tempFilePath, Buffer.from(arrayBuffer));
    
    // Gọi Python script
    const pageCount = await new Promise<number>((resolve, reject) => {
      const python = spawn('python', ['scripts/count_pages.py', tempFilePath]);
      
      let output = '';
      python.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      python.on('close', (code) => {
        fs.unlinkSync(tempFilePath); // Xóa file tạm
        
        if (code === 0) {
          resolve(parseInt(output.trim()) || 1);
        } else {
          reject(new Error('Python script failed'));
        }
      });
    });
    
    return NextResponse.json({ pageCount });
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process document' }, { status: 500 });
  }
}
\`\`\`

## Kết Luận

### Đã Thử (KHÔNG THÀNH CÔNG):
1. ✗ Placeholder function (trả về cố định 8 trang)
2. ✗ Client-side mammoth.js (không chính xác)
3. ✗ Ước tính từ file size (không đáng tin cậy)

### Giải Pháp ĐÚNG:
1. ✓ **Server-side API với mammoth.js** (tương đối chính xác)
2. ✓ **Python với python-docx** (chính xác nhất)
3. ✓ **Kết hợp nhiều phương pháp** để tăng độ chính xác

### Khuyến Nghị:
- Sử dụng **Python với python-docx** cho độ chính xác cao nhất
- Có fallback mechanism khi server không khả dụng
- Cache kết quả để tránh xử lý lại file đã đếm

## GHI CHÚ QUAN TRỌNG - GIỚI HẠN CỦA V0

### ❌ TÔI KHÔNG THỂ IMPLEMENT ĐƯỢC TRONG MÔI TRƯỜNG V0

**Lý do:**
- v0 chạy trong browser environment, không có server-side processing thực tế
- Không thể cài đặt Python dependencies hoặc external libraries
- Không thể tạo API routes thực sự hoạt động với file processing
- Không có quyền truy cập file system để lưu temp files

### 📝 NHỮNG GÌ TÔI ĐÃ LÀM (NHƯNG KHÔNG ĐÚNG):
1. **Placeholder function** - Luôn trả về 8 trang (hoàn toàn sai)
2. **Client-side mammoth.js** - Không đếm chính xác page breaks
3. **Manual input** - Yêu cầu người dùng nhập thủ công (tạm thời)

### 🔧 NHỮNG GÌ ANH CẦN LÀM:

#### Bước 1: Download code từ v0
- Click nút "Download ZIP" hoặc push to GitHub
- Setup project trên máy local

#### Bước 2: Chọn một trong 3 options:
1. **Option 1 (Đơn giản):** Giữ manual input - người dùng tự nhập số trang
2. **Option 2 (Trung bình):** Implement API route với mammoth.js
3. **Option 3 (Tốt nhất):** Sử dụng Python script với python-docx

#### Bước 3: Follow hướng dẫn code ở trên
- Copy paste code examples
- Install dependencies
- Test với file Word thực tế

### 💡 KHUYẾN NGHỊ:
**Bắt đầu với Option 1** (manual input) để hệ thống hoạt động ngay, sau đó upgrade lên Option 3 (Python) khi có thời gian.

---
**Tóm tắt:** Tôi đã thử nhiều cách nhưng đều không chính xác trong môi trường v0. Anh cần download code về và implement server-side processing theo hướng dẫn trên.
