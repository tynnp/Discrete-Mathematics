import React, { useEffect } from 'react';
import { Question } from '../types/Question';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  selectedAnswer: number | null;
  onAnswerSelect: (answer: number) => void;
  showResults: boolean;
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  hard: 'bg-red-100 text-red-800 border-red-200'
};

const difficultyLabels = {
  easy: 'Dễ',
  medium: 'Trung bình',
  hard: 'Khó'
};

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  selectedAnswer,
  onAnswerSelect,
  showResults
}) => {
  useEffect(() => {
    if (window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise();
    } else if (window.MathJax?.typeset) {
      window.MathJax.typeset();
    }
  }, [question, selectedAnswer, showResults]);

  const getOptionClassName = (optionIndex: number) => {
    if (!showResults) {
      return `p-4 rounded-lg border-2 cursor-pointer transition-all ${
        selectedAnswer === optionIndex
          ? 'border-blue-500 bg-blue-50 text-blue-700'
          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
      }`;
    }
    if (optionIndex === question.correctAnswer) return 'p-4 rounded-lg border-2 border-green-500 bg-green-50 text-green-700';
    if (selectedAnswer === optionIndex && optionIndex !== question.correctAnswer)
      return 'p-4 rounded-lg border-2 border-red-500 bg-red-50 text-red-700';
    return 'p-4 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-600';
  };

  const getOptionIcon = (optionIndex: number) => {
    if (!showResults) return null;
    if (optionIndex === question.correctAnswer) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (selectedAnswer === optionIndex && optionIndex !== question.correctAnswer) return <XCircle className="w-5 h-5 text-red-600" />;
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Ô tròn xanh hiển thị số thứ tự */}
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
            {questionNumber}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${difficultyColors[question.difficulty]}`}>
            {difficultyLabels[question.difficulty]}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-gray-900 text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: question.question }} />
      </div>

      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <div key={index} onClick={() => !showResults && onAnswerSelect(index)} className={getOptionClassName(index)}>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-sm w-6">{String.fromCharCode(65 + index)}.</span>
              <div className="flex-1" dangerouslySetInnerHTML={{ __html: option }} />
              {getOptionIcon(index)}
            </div>
          </div>
        ))}
      </div>

      {showResults && (
        <div className="border-t border-gray-200 pt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Giải thích:</h4>
            <div className="text-blue-800 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: question.explanation }} />
          </div>
        </div>
      )}
    </div>
  );
};
