import React from 'react';
import { University } from '../types';
import { MapPin, Trophy, Heart, Scale, Sparkles } from 'lucide-react';

interface UniversityCardProps {
  university: University;
  onClick: (uni: University) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isCompare: boolean;
  onToggleCompare: (uni: University) => void;
}

export const UniversityCard: React.FC<UniversityCardProps> = ({ 
  university, 
  onClick, 
  isFavorite, 
  onToggleFavorite,
  isCompare,
  onToggleCompare
}) => {
  return (
    <div 
      onClick={() => onClick(university)}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1 relative cursor-pointer"
    >
      {/* Action Buttons Overlay */}
      <div className="absolute top-3 left-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleCompare(university); }}
          className={`p-2 rounded-full shadow-md backdrop-blur-sm border transition ${isCompare ? 'bg-brand-600 text-white border-brand-600' : 'bg-white/90 text-slate-500 hover:text-brand-600 border-slate-200'}`}
          title="Compare"
        >
          <Scale className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute top-3 right-3 z-10">
         <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(university.id); }}
          className={`p-2 rounded-full shadow-md backdrop-blur-sm border transition ${isFavorite ? 'bg-red-500 text-white border-red-500' : 'bg-white/90 text-slate-400 hover:text-red-500 border-slate-200'}`}
          title="Save to Favorites"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="relative h-40 overflow-hidden bg-slate-50 border-b border-slate-100">
        {university.imageUrl ? (
          <img 
            src={university.imageUrl} 
            alt={university.name} 
            className="w-full h-full object-contain p-6 bg-white transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/400x200?text=No+Logo';
              (e.target as HTMLImageElement).className = "w-full h-full object-cover opacity-50";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
            <span className="text-sm">No Image Available</span>
          </div>
        )}
        
        <div className="absolute bottom-2 right-2 flex gap-2">
          {university.hasScholarship && (
            <div className="bg-amber-400/95 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1 border border-amber-300">
              <Sparkles className="w-3 h-3" />
            </div>
          )}
          {university.ranking > 0 && (
            <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-brand-700 shadow-sm flex items-center gap-1 border border-slate-100">
              <Trophy className="w-3 h-3" /> #{university.ranking}
            </div>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-slate-900 font-bold text-lg leading-tight mb-2 line-clamp-1 group-hover:text-brand-600 transition-colors">
          {university.name}
        </h3>

        <div className="flex items-center text-slate-500 text-xs mb-3 bg-slate-50 w-fit px-2 py-1 rounded-md">
          <MapPin className="w-3 h-3 mr-1 text-brand-500 flex-shrink-0" />
          <span className="truncate max-w-[200px]">{university.location}, {university.country}</span>
        </div>

        <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed h-10">
          {university.description}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm mt-auto">
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
            <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-0.5">Tuition</p>
            <p className="font-semibold text-slate-700 text-sm">
              ${(university.tuition || 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
            <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-0.5">Acceptance</p>
            <p className="font-semibold text-slate-700 text-sm">{university.acceptanceRate > 0 ? `${university.acceptanceRate}%` : 'N/A'}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
          {(university.majors || []).slice(0, 2).map((major, i) => (
            <span key={i} className="px-2 py-0.5 bg-brand-50 text-brand-700 text-[10px] rounded-full font-medium truncate max-w-[120px]">
              {major}
            </span>
          ))}
          {(university.majors || []).length > 2 && (
            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-full font-medium">
              +{(university.majors || []).length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
