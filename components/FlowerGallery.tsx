import React from 'react';
import { Flower } from '../types';
import { flowers } from '../data';

interface FlowerGalleryProps {
  selectedFlowerId: string | null;
  onSelect: (id: string) => void;
  onNext: () => void;
}

const FlowerGallery: React.FC<FlowerGalleryProps> = ({ selectedFlowerId, onSelect, onNext }) => {
  return (
    <div className="animate-fade-in py-8 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 mb-4 tracking-tight">
          اختَر وردتك
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          كل وردة تمثّل أسلوبًا وطريقة تفكير. تأملها بعمق واختر الأقرب لروحك.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {flowers.map((flower) => {
          const isSelected = selectedFlowerId === flower.id;
          return (
            <button
              key={flower.id}
              onClick={() => onSelect(flower.id)}
              className={`
                group relative p-6 rounded-3xl transition-all duration-300 border-2 text-right
                flex flex-col h-full hover:shadow-xl hover:-translate-y-1
                ${isSelected 
                  ? `${flower.color} shadow-lg ring-2 ring-offset-2 ring-indigo-300 transform -translate-y-1` 
                  : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'
                }
              `}
            >
              <div className="flex justify-between items-start mb-4 w-full">
                <span className="text-5xl drop-shadow-sm filter">{flower.icon}</span>
                {isSelected && (
                  <span className="bg-white/80 backdrop-blur-sm rounded-full p-1 text-green-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </span>
                )}
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isSelected ? 'text-current' : 'text-slate-800'}`}>
                {flower.name}
              </h3>
              <span className={`
                inline-block text-xs font-semibold px-2 py-1 rounded-md mb-3 w-fit
                ${isSelected ? 'bg-white/30' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}
              `}>
                {flower.tag}
              </span>
              <p className={`text-sm leading-relaxed ${isSelected ? 'opacity-90' : 'text-slate-400'}`}>
                {flower.description}
              </p>
            </button>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t p-4 md:p-6 flex justify-between items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="hidden md:block text-slate-500 font-medium">
          {selectedFlowerId ? 'رائع.. اختيار ملهم!' : 'اختر وردة واحدة للمتابعة'}
        </div>
        <button
          onClick={onNext}
          disabled={!selectedFlowerId}
          className={`
            w-full md:w-auto px-8 py-3 rounded-xl font-bold text-lg transition-all transform shadow-lg
            ${selectedFlowerId 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105 hover:shadow-indigo-500/25' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }
          `}
        >
          ابدأ الرحلة
          <span className="mr-2 inline-block transition-transform group-hover:-translate-x-1">←</span>
        </button>
      </div>
      <div className="h-20 md:h-24"></div> {/* Spacer for fixed footer */}
    </div>
  );
};

export default FlowerGallery;