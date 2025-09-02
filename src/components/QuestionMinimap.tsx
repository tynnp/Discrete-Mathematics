import React from 'react';
import { CheckCircle, AlertCircle, CheckSquare } from 'lucide-react';

interface QuestionMinimapProps {
  totalQuestions: number;
  userAnswers: (number | null)[];
  currentQuestion: number;
  onQuestionSelect: (questionIndex: number) => void;
  showResults?: boolean;
  correctAnswers?: boolean[];
  onSubmit?: () => void;
  showWarning?: boolean;
}

export const QuestionMinimap: React.FC<QuestionMinimapProps> = ({
  totalQuestions,
  userAnswers,
  currentQuestion,
  onQuestionSelect,
  showResults = false,
  correctAnswers = [],
  onSubmit,
  showWarning = false
}) => {
  const getQuestionStatus = (index: number) => {
    if (showResults) {
      return correctAnswers[index] ? 'correct' : 'incorrect';
    }
    return userAnswers[index] !== null ? 'answered' : 'unanswered';
  };

  const getQuestionClassName = (index: number) => {
    const status = getQuestionStatus(index);
    const isActive = index === currentQuestion;
    
    let baseClass =
      'relative w-10 h-10 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 font-bold text-xs shadow-sm';
    
    if (isActive && !showResults) {
      baseClass += ' ring-2 ring-blue-300 ring-offset-1 transform scale-110';
    }
    
    switch (status) {
      case 'correct':
        return `${baseClass} border-green-500 bg-gradient-to-br from-green-50 to-green-100 text-green-700 shadow-green-200`;
      case 'incorrect':
        return `${baseClass} border-red-500 bg-gradient-to-br from-red-50 to-red-100 text-red-700 shadow-red-200`;
      case 'answered':
        return `${baseClass} border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 shadow-blue-200`;
      default:
        return `${baseClass} border-gray-300 bg-gradient-to-br from-white to-gray-50 text-gray-600 hover:border-blue-300 hover:shadow-md`;
    }
  };

  const getStatusIcon = (index: number) => {
    const status = getQuestionStatus(index);
    
    switch (status) {
      case 'correct':
        return <CheckCircle className="absolute -top-1 -right-1 w-3.5 h-3.5 text-green-600 bg-white rounded-full" />;
      case 'incorrect':
        return <AlertCircle className="absolute -top-1 -right-1 w-3.5 h-3.5 text-red-600 bg-white rounded-full" />;
      case 'answered':
        return <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white"></div>;
      default:
        return null;
    }
  };

  const answeredCount = userAnswers.filter(answer => answer !== null).length;
  const allAnswered = userAnswers.every(answer => answer !== null);
  const progressPercentage = (answeredCount / totalQuestions) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sticky top-6 min-w-[300px] max-h-[370px] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
        <h4 className="font-bold text-gray-900 text-base">Điều hướng</h4>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-700">Tiến độ</span>
          <span className="text-xs font-bold text-blue-600">{answeredCount}/{totalQuestions}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Question Grid */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {Array.from({ length: totalQuestions }, (_, index) => (
          <button
            key={index}
            onClick={() => onQuestionSelect(index)}
            className={getQuestionClassName(index)}
            title={`Câu ${index + 1} - ${getQuestionStatus(index) === 'answered' ? 'Đã trả lời' : 'Chưa trả lời'}`}
          >
            {index + 1}
            {getStatusIcon(index)}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-2 mb-6 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Chú thích</div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md border-2 border-gray-300 bg-white flex items-center justify-center text-gray-600 font-bold text-[11px]">1</div>
            <span className="text-gray-600">Chưa trả lời</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-700 font-bold text-[11px] relative">
              1
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border border-white"></div>
            </div>
            <span className="text-gray-600">Đã trả lời</span>
          </div>
          {showResults && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md border-2 border-green-500 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-green-700 font-bold text-[11px] relative">
                  1
                  <CheckCircle className="absolute -top-1 -right-1 w-3.5 h-3.5 text-green-600 bg-white rounded-full" />
                </div>
                <span className="text-gray-600">Đúng</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md border-2 border-red-500 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center text-red-700 font-bold text-[11px] relative">
                  1
                  <AlertCircle className="absolute -top-1 -right-1 w-3.5 h-3.5 text-red-600 bg-white rounded-full" />
                </div>
                <span className="text-gray-600">Sai</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Submit Button */}
      {!showResults && onSubmit && (
        <div className="space-y-3">
          {showWarning && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                <p className="text-yellow-800 text-xs font-medium">
                  Vui lòng trả lời tất cả câu hỏi
                </p>
              </div>
            </div>
          )}
          
          <button
            onClick={onSubmit}
            disabled={!allAnswered}
            className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 text-sm ${
              allAnswered
                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            {allAnswered ? 'Kiểm tra kết quả' : `Còn ${totalQuestions - answeredCount} câu`}
          </button>
        </div>
      )}
    </div>
  );
};
