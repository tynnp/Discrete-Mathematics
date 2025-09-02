# Discrete Math MCQ Generator

Ứng dụng tạo câu hỏi trắc nghiệm môn Toán rời rạc bằng Google Gemini API và lưu trữ câu hỏi trong MongoDB.  
Frontend viết bằng React + Vite, Backend viết bằng Node.js + Express + MongoDB.

## Yêu cầu hệ thống

- Node.js >= 18  
- npm hoặc yarn  
- MongoDB (cài local hoặc dùng MongoDB Atlas)  
- API key từ Google AI Studio (https://aistudio.google.com/app/apikey)

## Cài đặt

1. Clone dự án
   ```bash
   git clone https://github.com/tynnp/discrete-math-mcq.git
   cd discrete-math-mcq
   ```

2. Cài đặt dependencies
   ```bash
   npm install
   ```
   hoặc:
   ```bash
   yarn install
   ```

3. Cấu hình MongoDB  
   Mặc định, backend kết nối tới MongoDB local tại:
   ```
   mongodb://localhost:27017/discrete_math
   ```
   Nếu dùng MongoDB Atlas, hãy sửa trong `server.js`:
   ```js
   mongoose.connect("mongodb+srv://<username>:<password>@cluster0.mongodb.net/discrete_math");
   ```

4. Cấu hình API key  
   Khi chạy frontend, bạn sẽ nhập API key Gemini trực tiếp vào giao diện (thành phần ApiKeyInput).  
   Không cần lưu vào .env, chỉ cần copy từ Google AI Studio.

## Chạy ứng dụng

### 1. Chạy backend
```bash
node server.js
```
Server sẽ chạy tại: http://localhost:5000

### 2. Chạy frontend
```bash
npm run dev
```
Frontend chạy mặc định tại: http://localhost:5173

## Các API backend (server.js)

- GET /api/questions → Lấy toàn bộ câu hỏi trong MongoDB  
- POST /api/questions → Thêm nhiều câu hỏi (dạng JSON)  
- DELETE /api/questions/:id → Xóa câu hỏi theo ID  

## Quy trình sử dụng

1. Chạy `node server.js` để bật backend (lưu câu hỏi vào MongoDB).  
2. Chạy `npm run dev` để mở frontend.  
3. Dán API key Gemini vào ô nhập API key.  
4. Chọn chủ đề, số lượng câu hỏi, độ khó → Nhấn Tạo câu hỏi.  
5. Câu hỏi sinh ra sẽ hiển thị, có thể lưu vào MongoDB hoặc quản lý trong giao diện.  
