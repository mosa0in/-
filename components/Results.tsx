import React, { useMemo } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Flower, Scores, Recommendation } from '../types';
import { recommendations } from '../data';

interface ResultsProps {
  scores: Scores;
  selectedFlower: Flower;
  onReset: () => void;
}

const Results: React.FC<ResultsProps> = ({ scores, selectedFlower, onReset }) => {
  // Prepare Data for Chart
  const chartData = [
    { subject: 'منطق', A: scores.Logic, fullMark: 100 },
    { subject: 'إبداع', A: scores.Creative, fullMark: 100 },
    { subject: 'إنساني', A: scores.Human, fullMark: 100 },
    { subject: 'أنظمة', A: scores.Systems, fullMark: 100 },
  ];

  // Find Top Category
  const topCategory = Object.entries(scores).reduce((a, b) => (a[1] as number) > (b[1] as number) ? a : b)[0] as keyof Scores;
  const primaryRec = recommendations.find(r => r.category === topCategory);

  // Find Secondary (2nd highest)
  const sortedCategories = Object.entries(scores)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .map(([key]) => key as keyof Scores);
    
  const secondaryRec = recommendations.find(r => r.category === sortedCategories[1]);
  
  // Explicitly cast to number[] to avoid type errors in arithmetic operations later
  const totalScore = (Object.values(scores) as number[]).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8">
            <div className="text-center md:text-right flex-1">
                <h2 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2">نتيجتك الشخصية</h2>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
                    أنت تميل لنمط: <span className="text-indigo-600">{primaryRec?.title}</span>
                </h1>
                <p className="text-slate-600 leading-relaxed mb-6">
                    {primaryRec?.description}
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold">
                        {Math.round((scores[topCategory] / totalScore) * 100)}% تطابق
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                        وردة: {selectedFlower.name}
                    </span>
                </div>
            </div>
            
            <div className="w-full md:w-1/3 h-64 bg-slate-50 rounded-2xl border border-slate-100 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                        <Radar
                            name="Skills"
                            dataKey="A"
                            stroke="#6366f1"
                            strokeWidth={3}
                            fill="#818cf8"
                            fillOpacity={0.4}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Detailed Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Path */}
            <div className="bg-white p-8 rounded-3xl border-t-4 border-indigo-500 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="bg-indigo-100 p-2 rounded-lg text-indigo-600">🎯</span>
                    مساراتك المهنية المقترحة
                </h3>
                <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold text-slate-800 mb-2">التخصصات الأكاديمية:</h4>
                        <div className="flex flex-wrap gap-2">
                            {primaryRec?.majors.map(m => (
                                <span key={m} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm">{m}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-800 mb-2">الوظائف المحتملة:</h4>
                        <div className="flex flex-wrap gap-2">
                            {primaryRec?.careers.map(c => (
                                <span key={c} className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm border border-green-100">{c}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Secondary Path */}
            <div className="bg-white p-8 rounded-3xl border-t-4 border-purple-500 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="bg-purple-100 p-2 rounded-lg text-purple-600">✨</span>
                    ميولك الثانوية: {secondaryRec?.title}
                </h3>
                <p className="text-slate-500 text-sm mb-6">
                    قد تجمع بين ميولك الأساسية وهذه المجالات لخلق مسار فريد خاص بك.
                </p>
                <div>
                     <h4 className="font-semibold text-slate-800 mb-2">جرب تعلم:</h4>
                     <ul className="list-disc list-inside text-slate-600 space-y-1 text-sm">
                        {secondaryRec?.majors.slice(0,2).map(m => <li key={m}>{m}</li>)}
                        {secondaryRec?.careers.slice(0,2).map(c => <li key={c}>مهارات {c}</li>)}
                     </ul>
                </div>
            </div>
        </div>

        {/* Action Bar */}
        <div className="text-center pt-8 pb-20">
            <p className="text-slate-400 text-sm mb-6">هذه النتائج إرشادية وتعتمد على مدخلاتك الحالية، وليست حكماً نهائياً.</p>
            <div className="flex justify-center gap-4">
                <button 
                    onClick={onReset}
                    className="px-8 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all shadow-lg hover:shadow-xl"
                >
                    إعادة التجربة ↺
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Results;