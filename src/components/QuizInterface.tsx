import React, { useState, useEffect } from 'react';
import { Question, QuizSession } from '../types/Question';
import { QuestionCard } from './QuestionCard';
import { QuestionMinimap } from './QuestionMinimap';
import { QuizResults } from './QuizResults';
import { CheckSquare, AlertCircle } from 'lucide-react';
import { MathJaxContext } from 'better-react-mathjax';

interface QuizInterfaceProps {
  questions: Question[];
  onNewQuiz: () => void;
}

const mathJaxConfig = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    processEscapes: true,
    packages: { '[+]': ['base', 'ams'] },
  },
  options: { enableMenu: false },
};

export const QuizInterface: React.FC<QuizInterfaceProps> = ({ questions, onNewQuiz }) => {
  const [session, setSession] = useState<QuizSession>({
    questions,
    userAnswers: new Array(questions.length).fill(null),
    isCompleted: false,
    score: 0
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    setSession({
      questions,
      userAnswers: new Array(questions.length).fill(null),
      isCompleted: false,
      score: 0
    });
  }, [questions]);

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    if (session.isCompleted) return;
    const newAnswers = [...session.userAnswers];
    newAnswers[questionIndex] = answerIndex;
    setSession(prev => ({ ...prev, userAnswers: newAnswers }));
    setShowWarning(false);
  };

  const handleSubmit = () => {
    const unansweredQuestions = session.userAnswers.some(answer => answer === null);
    if (unansweredQuestions) {
      setShowWarning(true);
      return;
    }
    const score = session.userAnswers.reduce((total, answer, index) => {
      return total + (answer === session.questions[index].correctAnswer ? 1 : 0);
    }, 0);
    setSession(prev => ({ ...prev, isCompleted: true, score }));

    setTimeout(() => {
      if (window.MathJax?.typesetPromise) {
        window.MathJax.typesetPromise();
      } else if (window.MathJax?.typeset) {
        window.MathJax.typeset();
      }
    }, 0);
  };

  const handleQuestionSelect = (questionIndex: number) => {
    setCurrentQuestion(questionIndex);
    const el = document.getElementById(`question-${questionIndex}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handlePrint = (withAnswers: boolean) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const content = session.questions
      .map(
        (q, index) => `
          <div style="margin-bottom:20px;">
            <b>Câu ${index + 1}: </b> ${q.question}<br/>
            ${q.options
              .map((opt, i) => `<div>${String.fromCharCode(65 + i)}. ${opt}</div>`)
              .join("")}
            ${
              withAnswers
                ? `<div style="margin-top:5px;">
                     <b>Đáp án:</b> ${String.fromCharCode(65 + q.correctAnswer)}<br/>
                     <b>Giải thích:</b> ${q.explanation}
                   </div>`
                : ""
            }
          </div>
        `
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>In câu hỏi</title>
          <script>
            window.MathJax = {
              tex: {
                inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
                displayMath: [['$$','$$'], ['\\\\[','\\\\]']],
                processEscapes: true,
                packages: {'[+]': ['base','ams']}
              },
              options: { enableMenu: false }
            };
          </script>
          <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>
        </head>
        <body>
          <h2 style="text-align:center;">Danh sách câu hỏi</h2>
          ${content}
          <script>
            document.addEventListener('DOMContentLoaded', function() {
              function waitForMathJax() {
                if (window.MathJax && MathJax.typesetPromise) {
                  MathJax.typesetPromise().then(() => {
                    setTimeout(() => window.print(), 300); 
                  });
                } else {
                  setTimeout(waitForMathJax, 100); 
                }
              }
              waitForMathJax();
            });
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (session.isCompleted) {
    return (
      <MathJaxContext config={mathJaxConfig}>
        <QuizResults questions={session.questions} userAnswers={session.userAnswers} onRetake={onNewQuiz} />
      </MathJaxContext>
    );
  }

  const allAnswered = session.userAnswers.every(answer => answer !== null);
  const answeredCount = session.userAnswers.filter(answer => answer !== null).length;

  return (
    <MathJaxContext config={mathJaxConfig}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Câu hỏi trắc nghiệm</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={onNewQuiz}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm shadow-sm"
                >
                  Quay lại
                </button>

                <button
                  onClick={async () => {
                    try {
                      const res = await fetch("http://localhost:5000/api/questions", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(session.questions),
                      });
                      alert(res.ok ? "Đã lưu câu hỏi vào MongoDB!" : "Lưu thất bại!");
                    } catch (err) {
                      console.error(err);
                      alert("Có lỗi khi lưu!");
                    }
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm shadow-md"
                >
                  Lưu câu hỏi
                </button>

                <button
                  onClick={() => handlePrint(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm shadow-md"
                >
                  In không đáp án
                </button>
                <button
                  onClick={() => handlePrint(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm shadow-md"
                >
                  In kèm đáp án
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-2">
              Đã trả lời: {answeredCount}/{session.questions.length}
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(answeredCount / session.questions.length) * 100}%` }}></div>
            </div>

            {showWarning && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <p className="text-yellow-800 font-medium">Vui lòng trả lời tất cả câu hỏi trước khi kiểm tra kết quả</p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {session.questions.map((q, idx) => (
                <div id={`question-${idx}`} key={q.id}>
                  <QuestionCard
                    question={q}
                    questionNumber={idx + 1}
                    selectedAnswer={session.userAnswers[idx]}
                    onAnswerSelect={(ans) => handleAnswerSelect(idx, ans)}
                    showResults={false}
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <CheckSquare className="w-5 h-5" />
                <span>{allAnswered ? 'Bạn đã trả lời tất cả câu hỏi' : 'Hãy hoàn thành tất cả câu hỏi'}</span>
              </div>

              <button
                onClick={handleSubmit}
                className={`px-6 py-3 rounded-lg font-semibold text-white transition-all ${
                  allAnswered ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={!allAnswered}
              >
                Xem kết quả
              </button>
            </div>
          </div>
        </div>

        <QuestionMinimap
          totalQuestions={session.questions.length}
          userAnswers={session.userAnswers}
          currentQuestion={currentQuestion}
          onQuestionSelect={handleQuestionSelect}
          onSubmit={handleSubmit}    
          showWarning={showWarning}    
        />
      </div>
    </MathJaxContext>
  );
};
