import React from 'react';
import { Settings } from 'lucide-react';

interface QuestionControlsProps {
  questionCount: number;
  onQuestionCountChange: (count: number) => void;
  difficulty: string;
  onDifficultyChange: (difficulty: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  canGenerate: boolean;
  onManageQuestions: () => void; 
}

const difficulties = [
  { value: 'easy', label: 'Dễ', color: 'text-green-600 bg-green-50 border-green-200' },
  { value: 'medium', label: 'Trung bình', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  { value: 'hard', label: 'Khó', color: 'text-red-600 bg-red-50 border-red-200' },
  { value: 'random', label: 'Ngẫu nhiên', color: 'text-purple-600 bg-purple-50 border-purple-200' }
];

export const QuestionControls: React.FC<QuestionControlsProps> = ({
  questionCount,
  onQuestionCountChange,
  difficulty,
  onDifficultyChange,
  onGenerate,
  isGenerating,
  canGenerate,
  onManageQuestions
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Cài đặt câu hỏi</h3>
        </div>

        {/* Nút Quản lý câu hỏi (ngang hàng) */}
        <button
          onClick={onManageQuestions}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          Quản lý câu hỏi
        </button>
      </div>

      {/* Nội dung controls */}
      <div className="space-y-6">
        <div>
          <label htmlFor="question-count" className="block text-sm font-medium text-gray-700 mb-3">
            Số lượng câu hỏi: {questionCount}
          </label>
          <input
            id="question-count"
            type="range"
            min="1"
            max="10"
            value={questionCount}
            onChange={(e) => onQuestionCountChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(questionCount - 1) * 11.11}%, #E5E7EB ${(questionCount - 1) * 11.11}%, #E5E7EB 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>10</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Mức độ khó
          </label>
          <div className="grid grid-cols-4 gap-3">
            {difficulties.map((diff) => (
              <button
                key={diff.value}
                onClick={() => onDifficultyChange(diff.value)}
                className={`p-3 rounded-lg border-2 font-medium transition-all ${
                  difficulty === diff.value
                    ? diff.color
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={!canGenerate || isGenerating}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-3 ${
            !canGenerate || isGenerating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-lg hover:shadow-xl'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Đang tạo câu hỏi...
            </>
          ) : (
            <>Tạo câu hỏi</>
          )}
        </button>
      </div>
    </div>
  );
};
