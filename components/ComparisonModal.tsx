import React from 'react';
import { University } from '../types';
import { X, MapPin, BookOpen, Trophy, DollarSign, FileText, Users, Sparkles, GraduationCap, Globe } from 'lucide-react';

interface ComparisonModalProps {
  universities: University[];
  onClose: () => void;
  onRemove: (id: string) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ universities, onClose, onRemove }) => {
  const fields = [
    { key: 'ranking', label: 'Ranking', icon: Trophy, format: (val: any) => (val > 0 ? `#${val}` : 'N/A') },
    { key: 'tuition', label: 'Tuition (Annual)', icon: DollarSign, format: (val: any) => `$${(val || 0).toLocaleString()}` },
    { key: 'acceptanceRate', label: 'Acceptance Rate', icon: Users, format: (val: any) => (val > 0 ? `${val}%` : 'N/A')},
    { key: 'country', label: 'Country', icon: MapPin, format: (val: any) => val },
    { key: 'hasScholarship', label: 'Scholarships', icon: Sparkles, format: (val: any) => (val ? 'Available' : 'No') },
    { key: 'degreeLevels', label: 'Degree Levels', icon: GraduationCap, format: (val: any) => (Array.isArray(val) ? val.join(', ') : 'N/A'), truncate: true },
    { key: 'majors', label: 'Top Majors', icon: BookOpen, format: (val: any) => val },
    { key: 'website', label: 'Website', icon: Globe, format: (val: any) => val },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 flex-shrink-0">
          <h2 className="text-xl font-bold text-slate-800">Compare Universities</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="overflow-auto p-6 flex-grow">
          <div className="grid grid-cols-4 gap-6 min-w-[1000px]">
            {/* Headers */}
            <div className="font-semibold text-slate-600 space-y-4 sticky top-0 bg-white py-2">
              <div className="h-40"></div> {/* Spacer for uni card */}
              {fields.map(field => (
                <div key={field.key} className="h-20 flex items-center gap-2"><field.icon className="w-4 h-4 text-slate-400" />{field.label}</div>
              ))}
            </div>

            {universities.map(uni => (
              <div key={uni.id} className="space-y-4">
                {/* University Card */}
                <div className="h-40 p-4 rounded-xl border border-slate-200 bg-white relative">
                  <button onClick={() => onRemove(uni.id)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500"><X className="w-4 h-4"/></button>
                  <div className="h-12 w-12 mb-2 bg-white rounded-lg border border-slate-100 flex items-center justify-center p-1">
                    <img src={uni.imageUrl || 'https://placehold.co/100?text=Uni'} alt={uni.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2">{uni.name}</h3>
                   <p className="text-xs text-slate-500 line-clamp-1 mt-1">{uni.location}</p>
                </div>
                {/* Data Cells */}
                {fields.map(field => (
                  <div key={field.key} className="h-20 p-3 rounded-lg bg-slate-50 border border-slate-100 text-sm text-slate-700 overflow-hidden flex items-center">
                    {field.key === 'majors' ? (
                      <div className="flex flex-wrap gap-1">
                        {(uni.majors || []).slice(0, 3).map((m, i) => (
                           <span key={i} className="text-[10px] px-1.5 py-0.5 bg-white border rounded-full">{m}</span>
                        ))}
                      </div>
                    ) : field.key === 'website' ? (
                      <a href={uni.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate">Visit Site</a>
                    ) : (
                      <p className={field.truncate ? 'line-clamp-3' : ''}>{field.format(uni[field.key as keyof University])}</p>
                    )}
                  </div>
                ))}
              </div>
            ))}

            {/* Placeholder */}
            {universities.length < 3 && Array.from({ length: 3 - universities.length }).map((_, i) => (
              <div key={`placeholder-${i}`} className="space-y-4">
                <div className="h-40 p-4 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center">
                  <p className="text-slate-400 text-sm text-center">Add a university to compare</p>
                </div>
                {fields.map(field => <div key={field.key} className="h-20 rounded-lg bg-slate-50"></div>)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
