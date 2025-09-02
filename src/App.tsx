import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import { ApiKeyInput } from './components/ApiKeyInput';
import { TopicSelector } from './components/TopicSelector';
import { QuestionControls } from './components/QuestionControls';
import { QuizInterface } from './components/QuizInterface';
import { QuestionManager } from './components/QuestionManager';
import { GeminiApiService } from './services/GeminiApiService';
import { Question } from './types/Question';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('set-theory');
  const [customTopic, setCustomTopic] = useState('');
  const [useCustomTopic, setUseCustomTopic] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showManager, setShowManager] = useState(false);

  const topicLabels: Record<string, string> = {
    'set-theory': 'Lý thuyết tập hợp',
    'functions-mapping': 'Ánh xạ và hàm số',
    'counting-objects': 'Đếm các đối tượng',
    'permutations-combinations': 'Hoán vị - Chỉnh hợp - Tổ hợp',
    'repeated-permutations-combinations': 'Hoán vị lặp - Tổ hợp lặp',
    'advanced-counting': 'Kỹ thuật đếm cao cấp',
    'dirichlet-principle': 'Nguyên lý Dirichlet',
    'relations': 'Các quan hệ',
    'boolean-algebra': 'Đại số Boolean'
  };

  const handleGenerateQuestions = async () => {
    if (!apiKey.trim()) {
      setError('Vui lòng nhập API key trước khi tạo câu hỏi.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setQuestions([]);

    try {
      const apiService = new GeminiApiService(apiKey);
      const topic = useCustomTopic ? customTopic : topicLabels[selectedTopic];
      
      if (!topic.trim()) {
        setError('Vui lòng chọn chủ đề hoặc nhập chủ đề tùy chỉnh.');
        return;
      }

      const generatedQuestions = await apiService.generateQuestions(topic, questionCount, difficulty);
      
      if (generatedQuestions.length === 0) {
        setError('Không thể tạo câu hỏi. Vui lòng thử lại.');
        return;
      }

      setQuestions(generatedQuestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tạo câu hỏi.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewQuiz = () => {
    setQuestions([]);
    setError(null);
  };

  const canGenerate = apiKey.trim() !== '' && 
    (useCustomTopic ? customTopic.trim() !== '' : selectedTopic !== '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Brain className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Discrete Mathematics
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Ứng dụng tạo câu hỏi trắc nghiệm Toán rời rạc với AI
          </p>
        </header>

        {showManager ? (
          <QuestionManager onBack={() => setShowManager(false)} />
        ) : questions.length === 0 ? (
          <div className="space-y-8">
            <ApiKeyInput apiKey={apiKey} onApiKeyChange={setApiKey} />
            
            <TopicSelector
              selectedTopic={selectedTopic}
              customTopic={customTopic}
              onTopicChange={setSelectedTopic}
              onCustomTopicChange={setCustomTopic}
              useCustomTopic={useCustomTopic}
              onUseCustomTopicChange={setUseCustomTopic}
            />

            <QuestionControls
              questionCount={questionCount}
              onQuestionCountChange={setQuestionCount}
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              onGenerate={handleGenerateQuestions}
              isGenerating={isGenerating}
              canGenerate={canGenerate}
              onManageQuestions={() => setShowManager(true)}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <QuizInterface questions={questions} onNewQuiz={handleNewQuiz} />
        )}
      </div>
    </div>
  );
}

export default App;
