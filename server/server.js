const PORT = 5000
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect("mongodb://localhost:27017/discrete_math", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema
const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number,
  difficulty: String,
  explanation: String,
  topic: String,
});

const Question = mongoose.model("Question", questionSchema);

// API: lấy tất cả câu hỏi
app.get("/api/questions", async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
});

// API: thêm nhiều câu hỏi
app.post("/api/questions", async (req, res) => {
  try {
    const saved = await Question.insertMany(req.body);
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: xóa 1 câu hỏi
app.delete("/api/questions/:id", async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server chạy ở http://localhost:${PORT}`);
});