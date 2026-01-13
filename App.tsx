import React, { useState, useEffect, useMemo } from 'react';
import FlowerGallery from './components/FlowerGallery';
import Quiz from './components/Quiz';
import Results from './components/Results';
import ChatBot from './components/ChatBot';
import { AppPhase, Flower, Scores, Category } from './types';
import { flowers, getQuestionsForFlower } from './data';

function App() {
  // Initialize state from LocalStorage if available
  const [phase, setPhase] = useState<AppPhase>(() => {
    return (localStorage.getItem('app_phase') as AppPhase) || 'gallery';
  });
  
  const [selectedFlowerId, setSelectedFlowerId] = useState<string | null>(() => {
    return localStorage.getItem('selected_flower_id');
  });

  const [scores, setScores] = useState<Scores>(() => {
    const saved = localStorage.getItem('quiz_scores');
    return saved ? JSON.parse(saved) : { Logic: 0, Creative: 0, Human: 0, Systems: 0 };
  });

  // Get specific questions for the selected flower
  const currentQuestions = useMemo(() => {
    if (!selectedFlowerId) return [];
    return getQuestionsForFlower(selectedFlowerId);
  }, [selectedFlowerId]);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('app_phase', phase);
  }, [phase]);

  useEffect(() => {
    if (selectedFlowerId) {
      localStorage.setItem('selected_flower_id', selectedFlowerId);
    } else {
      localStorage.removeItem('selected_flower_id');
    }
  }, [selectedFlowerId]);

  useEffect(() => {
    localStorage.setItem('quiz_scores', JSON.stringify(scores));
  }, [scores]);

  // Reset scroll on phase change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase]);

  const handleFlowerSelect = (id: string) => {
    setSelectedFlowerId(id);
  };

  const startQuiz = () => {
    if (selectedFlowerId) setPhase('quiz');
  };

  const calculateResults = (answers: number[], preQuizCategory: Category) => {
    const newScores = { Logic: 0, Creative: 0, Human: 0, Systems: 0 };

    // 1. Add Pre-Quiz Boost (+3 points)
    newScores[preQuizCategory] += 3;

    // 2. Add Main Quiz Scores
    answers.forEach((optionIndex, questionIndex) => {
      const question = currentQuestions[questionIndex];
      // Safety check in case answers array mismatch
      if (question && question.options[optionIndex]) {
        const selectedOption = question.options[optionIndex];
        newScores[selectedOption.category] += 2;
      }
    });

    setScores(newScores);
    setPhase('results');
  };

  const resetApp = () => {
    // Clear LocalStorage and Reset State
    localStorage.removeItem('app_phase');
    localStorage.removeItem('selected_flower_id');
    localStorage.removeItem('quiz_scores');
    
    setPhase('gallery');
    setSelectedFlowerId(null);
    setScores({ Logic: 0, Creative: 0, Human: 0, Systems: 0 });
  };

  const getSelectedFlower = (): Flower => {
    return flowers.find(f => f.id === selectedFlowerId) || flowers[0];
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-200 selection:text-indigo-900">
      
      {/* Dynamic Content */}
      <main>
        {phase === 'gallery' && (
          <FlowerGallery 
            selectedFlowerId={selectedFlowerId} 
            onSelect={handleFlowerSelect} 
            onNext={startQuiz}
          />
        )}

        {phase === 'quiz' && selectedFlowerId && (
          <Quiz 
            selectedFlower={getSelectedFlower()}
            questions={currentQuestions}
            onFinish={calculateResults}
            onBack={() => setPhase('gallery')}
          />
        )}

        {phase === 'results' && selectedFlowerId && (
          <>
            <Results 
              scores={scores} 
              selectedFlower={getSelectedFlower()} 
              onReset={resetApp}
            />
            <ChatBot scores={scores} />
          </>
        )}
      </main>
      
    </div>
  );
}

export default App;