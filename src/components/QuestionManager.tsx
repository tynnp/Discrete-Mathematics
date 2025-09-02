import React, { useEffect, useState } from "react";
import { Question } from "../types/Question";
import { Trash2, Printer, Eye, EyeOff, ArrowUp } from "lucide-react";
import { QuestionCard } from "./QuestionCard";
import { MathJaxContext } from "better-react-mathjax";

interface QuestionManagerProps {
  onBack: () => void;
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

export const QuestionManager: React.FC<QuestionManagerProps> = ({ onBack }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [showAnswers, setShowAnswers] = useState<boolean>(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/questions")
      .then((res) => res.json())
      .then((data) => {
        const mapped: Question[] = data.map((q: any, i: number) => ({
          ...q,
          id: q.id || q._id || `q_${i}`,
        }));
        setQuestions(mapped);
        if (window.MathJax?.typesetPromise) {
          window.MathJax.typesetPromise();
        } else if (window.MathJax?.typeset) {
          window.MathJax.typeset();
        }

      })
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  useEffect(() => {
    if (window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise();
    } else if (window.MathJax?.typeset) {
      window.MathJax.typeset();
    }

  }, [showAnswers, questions]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa câu hỏi này?")) return;
    await fetch(`http://localhost:5000/api/questions/${id}`, { method: "DELETE" });
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    setSelectedQuestions((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const toggleSelect = (id: string) => {
    setSelectedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handlePrint = (withAnswers: boolean) => {
    const selected = questions.filter((q) => selectedQuestions.has(q.id));
    if (selected.length === 0) {
      alert("Vui lòng chọn ít nhất một câu hỏi để in.");
      return;
    }
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const content = selected
      .map(
        (q, index) => `
          <div style="margin-bottom:20px;">
            <b>Câu ${index + 1}: </b> ${q.question}<br/>
            ${q.options.map((opt, i) => `<div>${String.fromCharCode(65 + i)}. ${opt}</div>`).join("")}
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

  return (
    <MathJaxContext config={mathJaxConfig}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Quản lý câu hỏi</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAnswers((prev) => !prev)}
              className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm"
            >
              {showAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showAnswers ? "Ẩn đáp án" : "Xem đáp án"}
            </button>

            <button
              onClick={() => handlePrint(false)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
            >
              <Printer className="w-4 h-4" />
              In không đáp án
            </button>

            <button
              onClick={() => handlePrint(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
            >
              <Printer className="w-4 h-4" />
              In kèm đáp án
            </button>

            <button
              onClick={onBack}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg shadow-sm"
            >
              Quay lại
            </button>
          </div>
        </div>

        {/* Danh sách câu hỏi */}
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div key={q.id} className="border rounded-lg p-4 hover:shadow-md transition relative">
              <div className="flex flex-col gap-3">
                <div className="flex-1">
                  {/* Câu hỏi */}
                  <QuestionCard
                    question={q}
                    questionNumber={index + 1}
                    selectedAnswer={null}
                    onAnswerSelect={() => {}}
                    showResults={false}
                  />

                  {showAnswers && (
                    <div className="mt-2 text-black">
                      <div className="font-medium text-green-700">
                        Đáp án đúng: {String.fromCharCode(65 + q.correctAnswer)}
                      </div>
                      <div className="mt-1">
                        <b>Giải thích:</b>{" "}
                        <div
                          className="mt-1 text-sm leading-relaxed bg-blue-50 border border-blue-200 rounded-lg p-3"
                          dangerouslySetInnerHTML={{ __html: q.explanation }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Hàng chứa checkbox + nút Xóa */}
                  <div className="flex items-center gap-3 mt-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedQuestions.has(q.id)}
                        onChange={() => toggleSelect(q.id)}
                        className="w-5 h-5 accent-blue-600"
                      />
                      <span className="text-sm text-gray-700">Chọn in</span>
                    </label>

                    <button
                      onClick={() => handleDelete(q.id)}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nút lên đầu trang (floating) */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all"
        title="Lên đầu trang"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </MathJaxContext>
  );
};
