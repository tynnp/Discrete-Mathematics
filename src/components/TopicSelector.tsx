import React from 'react';
import { BookOpen, Edit3 } from 'lucide-react';

interface TopicSelectorProps {
  selectedTopic: string;
  customTopic: string;
  onTopicChange: (topic: string) => void;
  onCustomTopicChange: (topic: string) => void;
  useCustomTopic: boolean;
  onUseCustomTopicChange: (use: boolean) => void;
}

const predefinedTopics = [
  {
    value: 'set-theory',
    label: 'Lý thuyết tập hợp',
    description: 'Tập hợp, phép toán tập hợp, quan hệ bao hàm'
  },
  {
    value: 'functions-mapping',
    label: 'Ánh xạ và hàm số',
    description: 'Hàm số, ánh xạ, tính chất đơn ánh, toàn ánh'
  },
  {
    value: 'counting-objects',
    label: 'Đếm các đối tượng',
    description: 'Nguyên lý cộng, nguyên lý nhân, bài toán đếm cơ bản'
  },
  {
    value: 'permutations-combinations',
    label: 'Hoán vị - Chỉnh hợp - Tổ hợp',
    description: 'Hoán vị, chỉnh hợp, tổ hợp không lặp'
  },
  {
    value: 'repeated-permutations-combinations',
    label: 'Hoán vị lặp - Tổ hợp lặp',
    description: 'Hoán vị có lặp, tổ hợp có lặp'
  },
  {
    value: 'advanced-counting',
    label: 'Kỹ thuật đếm cao cấp',
    description: 'Nguyên lý bao hàm - loại trừ, hàm sinh'
  },
  {
    value: 'dirichlet-principle',
    label: 'Nguyên lý Dirichlet',
    description: 'Nguyên lý chuồng bồ câu và ứng dụng'
  },
  {
    value: 'relations',
    label: 'Các quan hệ',
    description: 'Quan hệ tương đương, quan hệ thứ tự, đồ thị quan hệ'
  },
  {
    value: 'boolean-algebra',
    label: 'Đại số Boolean',
    description: 'Phép toán logic, biểu thức Boolean, bảng chân trị'
  }
];

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  selectedTopic,
  customTopic,
  onTopicChange,
  onCustomTopicChange,
  useCustomTopic,
  onUseCustomTopicChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Chọn chủ đề</h3>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={() => onUseCustomTopicChange(false)}
            className={`flex-1 p-3 rounded-lg border-2 transition-all ${
              !useCustomTopic
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="font-medium">Chủ đề có sẵn</span>
            </div>
          </button>
          
          <button
            onClick={() => onUseCustomTopicChange(true)}
            className={`flex-1 p-3 rounded-lg border-2 transition-all ${
              useCustomTopic
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Edit3 className="w-4 h-4" />
              <span className="font-medium">Chủ đề tùy chỉnh</span>
            </div>
          </button>
        </div>

        {!useCustomTopic ? (
          <div className="grid gap-3">
            {predefinedTopics.map((topic) => (
              <div
                key={topic.value}
                onClick={() => onTopicChange(topic.value)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedTopic === topic.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-gray-900 mb-1">{topic.label}</div>
                <div className="text-sm text-gray-600">{topic.description}</div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <label htmlFor="custom-topic" className="block text-sm font-medium text-gray-700 mb-2">
              Nhập chủ đề tùy chỉnh
            </label>
            <textarea
              id="custom-topic"
              value={customTopic}
              onChange={(e) => onCustomTopicChange(e.target.value)}
              placeholder="Ví dụ: Đồ thị phẳng và định lý Euler, Thuật toán Dijkstra..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};