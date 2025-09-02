import { Question } from '../types/Question';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export class GeminiApiService {
  constructor(private apiKey: string) {}

  async generateQuestions(topic: string, count: number, difficulty: string): Promise<Question[]> {
    if (!this.apiKey || this.apiKey.trim() === '') {
      throw new Error('API key is required. Please enter your Google AI Studio API key.');
    }

    const prompt = this.createPrompt(topic, count, difficulty);
    
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('API key không hợp lệ hoặc Generative Language API chưa được kích hoạt. Vui lòng kiểm tra API key tại https://aistudio.google.com/app/apikey');
        } else if (response.status === 403) {
          throw new Error('API key không có quyền truy cập. Vui lòng kiểm tra quyền của API key.');
        } else {
          throw new Error(`API request failed: ${response.status}`);
        }
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid API response format');
      }

      const generatedText = data.candidates[0].content.parts[0].text;
      return this.parseQuestions(generatedText, topic);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to generate questions. Please try again.');
    }
  }

  private createPrompt(topic: string, count: number, difficulty: string): string {
    const difficultyInstruction = difficulty === 'random' 
      ? 'Tạo câu hỏi với độ khó ngẫu nhiên (dễ, trung bình, khó)'
      : `Tạo câu hỏi với độ khó ${this.getDifficultyInVietnamese(difficulty)}`;

    return `
Bạn là một giáo viên Toán rời rạc chuyên nghiệp. Hãy tạo chính xác ${count} câu hỏi trắc nghiệm về chủ đề "${topic}".

Yêu cầu:
- ${difficultyInstruction}
- Mỗi câu hỏi phải có 4 đáp án A, B, C, D
- Phải có công thức toán học sử dụng ký hiệu LaTeX (đặt trong $...$ hoặc $$...$$)
- Câu hỏi phải chính xác về mặt toán học
- Đáp án và giải thích phải chi tiết, rõ ràng
- Sử dụng ký hiệu toán học chuẩn

Format trả về CHÍNH XÁC như sau:
[QUESTION_START]
Question: [Câu hỏi với LaTeX]
A. [Đáp án A]
B. [Đáp án B] 
C. [Đáp án C]
D. [Đáp án D]
Correct: [A/B/C/D]
Difficulty: [easy/medium/hard]
Explanation: [Giải thích chi tiết với LaTeX]
[QUESTION_END]

Ví dụ về sử dụng LaTeX:
- Tập hợp: $A = \\{1, 2, 3\\}$
- Phần tử thuộc: $x \\in A$
- Hợp: $A \\cup B$
- Giao: $A \\cap B$
- Công thức tổ hợp: $C(n,r) = \\frac{n!}{r!(n-r)!}$
- Hoán vị: $P(n,r) = \\frac{n!}{(n-r)!}$

Hãy tạo ${count} câu hỏi ngay bây giờ:
`;
  }

  private getDifficultyInVietnamese(difficulty: string): string {
    switch (difficulty) {
      case 'easy': return 'dễ';
      case 'medium': return 'trung bình';
      case 'hard': return 'khó';
      default: return 'trung bình';
    }
  }

  private parseQuestions(text: string, topic: string): Question[] {
    const questions: Question[] = [];
    const questionBlocks = text.split('[QUESTION_START]').slice(1);

    questionBlocks.forEach((block, index) => {
      const endIndex = block.indexOf('[QUESTION_END]');
      if (endIndex === -1) return;

      const questionContent = block.substring(0, endIndex).trim();
      const lines = questionContent.split('\n').filter(line => line.trim() !== '');

      if (lines.length < 7) return;

      const questionLine = lines.find(line => line.startsWith('Question:'));
      const optionA = lines.find(line => line.startsWith('A.'));
      const optionB = lines.find(line => line.startsWith('B.'));
      const optionC = lines.find(line => line.startsWith('C.'));
      const optionD = lines.find(line => line.startsWith('D.'));
      const correctLine = lines.find(line => line.startsWith('Correct:'));
      const difficultyLine = lines.find(line => line.startsWith('Difficulty:'));
      const explanationLine = lines.find(line => line.startsWith('Explanation:'));

      if (!questionLine || !optionA || !optionB || !optionC || !optionD || !correctLine || !explanationLine) {
        return;
      }

      const question = questionLine.replace('Question:', '').trim();
      const options = [
        optionA.replace('A.', '').trim(),
        optionB.replace('B.', '').trim(),
        optionC.replace('C.', '').trim(),
        optionD.replace('D.', '').trim()
      ];

      const correctAnswerLetter = correctLine.replace('Correct:', '').trim();
      const correctAnswer = ['A', 'B', 'C', 'D'].indexOf(correctAnswerLetter);
      
      const difficultyText = difficultyLine?.replace('Difficulty:', '').trim().toLowerCase() || 'medium';
      const difficulty = ['easy', 'medium', 'hard'].includes(difficultyText) 
        ? difficultyText as 'easy' | 'medium' | 'hard'
        : 'medium';

      const explanation = explanationLine.replace('Explanation:', '').trim();

      if (correctAnswer !== -1) {
        questions.push({
          id: `q-${Date.now()}-${index}`,
          question,
          options,
          correctAnswer,
          difficulty,
          explanation,
          topic
        });
      }
    });

    return questions;
  }
}