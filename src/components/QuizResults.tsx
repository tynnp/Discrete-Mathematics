import React from 'react';
import { Question } from '../types/Question';
import { Trophy, Target, RotateCcw, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import { MathJaxContext } from 'better-react-mathjax';

interface QuizResultsProps {
  questions: Question[];
  userAnswers: (number | null)[];
  onRetake: () => void;
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

export const QuizResults: React.FC<QuizResultsProps> = ({ questions, userAnswers, onRetake }) => {
  const [expandedExplanations, setExpandedExplanations] = React.useState<Set<number>>(new Set());

  const toggleExplanation = (questionIndex: number) => {
    const next = new Set(expandedExplanations);
    next.has(questionIndex) ? next.delete(questionIndex) : next.add(questionIndex);
    setExpandedExplanations(next);
  };

  React.useEffect(() => {
    if ((window as any).MathJax) (window as any).MathJax.typesetPromise();
  }, [expandedExplanations]);

  const correctAnswers = userAnswers.filter((answer, index) => answer === questions[index]?.correctAnswer).length;
  const totalQuestions = questions.length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  const getScoreColor = () => (percentage >= 80 ? 'text-green-600' : percentage >= 60 ? 'text-yellow-600' : 'text-red-600');
  const getScoreMessage = () =>
    percentage >= 90 ? 'Xuất sắc! 🎉' : percentage >= 80 ? 'Rất tốt! 👍' : percentage >= 60 ? 'Khá tốt! 📚' : percentage >= 40 ? 'Cần cải thiện 💪' : 'Hãy ôn tập thêm 📖';

  return (
    <MathJaxContext config={mathJaxConfig}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">Kết quả bài thi</h2>
          </div>

          <div className={`text-4xl font-bold mb-2 ${getScoreColor()}`}>{percentage}%</div>
          <div className="text-lg text-gray-600 mb-2">{getScoreMessage()}</div>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>{correctAnswers}/{totalQuestions} câu đúng</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Chi tiết từng câu:</h3>
          <div className="space-y-4">
            {questions.map((question, index) => {
              const isCorrect = userAnswers[index] === question.correctAnswer;
              const userAnswer = userAnswers[index];
              const isExpanded = expandedExplanations.has(index);

              return (
                <div key={question.id} className={`rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleExplanation(index)}>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">Câu {index + 1}</span>
                      <span className="text-xs text-gray-600">Bạn chọn: {userAnswer !== null ? String.fromCharCode(65 + userAnswer) : 'Không chọn'}</span>
                      <span className="text-xs text-gray-600">Đáp án: {String.fromCharCode(65 + question.correctAnswer)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {isCorrect ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                      <BookOpen className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''} text-gray-500`} />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-200 p-4 bg-white">
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Câu hỏi:</h4>
                        <div className="text-gray-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: question.question }} />
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Các đáp án:</h4>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={`p-2 rounded text-sm ${
                                optionIndex === question.correctAnswer
                                  ? 'bg-green-100 border border-green-300 text-green-800'
                                  : userAnswer === optionIndex
                                  ? 'bg-red-100 border border-red-300 text-red-800'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              <span className="font-medium mr-2">{String.fromCharCode(65 + optionIndex)}.</span>
                              <span dangerouslySetInnerHTML={{ __html: option }} />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Lời giải:</h4>
                        <div className="text-gray-700 text-sm leading-relaxed bg-blue-50 border border-blue-200 rounded-lg p-3" dangerouslySetInnerHTML={{ __html: question.explanation }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={onRetake}
          className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
        >
          <RotateCcw className="w-5 h-5" />
          Tạo bài thi mới
        </button>
      </div>
    </MathJaxContext>
  );
};
