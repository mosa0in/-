import React, { useState } from 'react';
import { Flower, Question, Category } from '../types';
import { questions, preQuizOptions } from '../data';

interface QuizProps {
  selectedFlower: Flower;
  onFinish: (answers: number[], preQuizCategory: Category) => void;
  onBack: () => void;
}

const Quiz: React.FC<QuizProps> = ({ selectedFlower, onFinish, onBack }) => {
  const [showPreQuiz, setShowPreQuiz] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [preQuizCategory, setPreQuizCategory] = useState<Category | null>(null);

  const handlePreQuizAnswer = (category: Category) => {
    setPreQuizCategory(category);
    // Add small delay for animation
    setTimeout(() => {
      setShowPreQuiz(false);
    }, 300);
  };

  const handleOptionSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 250);
    } else {
       // Finish
       if (preQuizCategory) {
         onFinish(newAnswers, preQuizCategory);
       }
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      setShowPreQuiz(true);
    }
  };

  // --- Pre-Quiz View ---
  if (showPreQuiz) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100 text-center">
            <div className="text-6xl mb-6">{selectedFlower.icon}</div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">لماذا اخترت {selectedFlower.name}؟</h2>
            <p className="text-slate-500 mb-8">إجابتك ستساعدنا في فهمك بشكل أدق.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {preQuizOptions.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePreQuizAnswer(opt.category)}
                  className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-slate-700 font-medium text-right hover:shadow-md"
                >
                  {opt.text}
                </button>
              ))}
            </div>
            <button 
              onClick={onBack}
              className="mt-8 text-slate-400 hover:text-slate-600 underline text-sm"
            >
              الرجوع لاختيار وردة أخرى
            </button>
        </div>
      </div>
    );
  }

  // --- Main Quiz View ---
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentQuestion: Question = questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
            <span className="text-3xl">{selectedFlower.icon}</span>
            <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">الوردة المختارة</p>
                <p className="font-bold text-slate-800">{selectedFlower.name}</p>
            </div>
        </div>
        <div className="text-slate-400 text-sm font-medium">
            سؤال {currentQuestionIndex + 1} من {questions.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 mb-12 overflow-hidden">
        <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="flex-grow flex flex-col justify-center animate-slide-up">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 leading-snug">
            {currentQuestion.text}
        </h2>

        <div className="space-y-4">
            {currentQuestion.options.map((option, idx) => {
                const isSelected = answers[currentQuestionIndex] === idx;
                return (
                    <button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        className={`
                            w-full p-5 rounded-2xl border-2 text-right transition-all duration-200 group
                            flex items-center justify-between
                            ${isSelected 
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-900' 
                                : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                            }
                        `}
                    >
                        <span className="font-medium text-lg">{option.text}</span>
                        <span className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center
                            ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 group-hover:border-slate-400'}
                        `}>
                            {isSelected && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                        </span>
                    </button>
                );
            })}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="mt-12 flex justify-between items-center">
        <button 
            onClick={handlePrev}
            className="px-6 py-2 text-slate-500 font-medium hover:bg-slate-100 rounded-lg transition-colors"
        >
            السابق
        </button>
        {/* We auto-advance, but could put a skip button here if needed */}
      </div>
    </div>
  );
};

export default Quiz;