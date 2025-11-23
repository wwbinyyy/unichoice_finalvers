import React, { useState, useMemo } from 'react';
import { FilterState } from '../types';
import { SlidersHorizontal, MapPin, BookOpen, DollarSign, Trophy, ChevronDown, ChevronUp, Check, Sparkles, GraduationCap, X } from 'lucide-react';

interface FiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  availableLocations: string[];
  availableMajors: string[];
  availableDegreeLevels: string[];
}

const MultiSelectItem: React.FC<{ label: string; isSelected: boolean; onToggle: () => void; }> = ({ label, isSelected, onToggle }) => (
  <div onClick={onToggle} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer text-sm transition ${isSelected ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-50 text-slate-600'}`}>
    <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-brand-600 border-brand-600' : 'border-slate-300 bg-white'}`}>
      {isSelected && <Check className="w-3 h-3 text-white" />}
    </div>
    <span>{label}</span>
  </div>
);

const FilterSection: React.FC<{ title: string; icon: React.ElementType; sectionKey: string; expandedSection: string | null; onToggle: (key: string) => void; count: number; children: React.ReactNode; }> = ({ title, icon: Icon, sectionKey, expandedSection, onToggle, count, children }) => (
  <div className="border border-slate-200 rounded-xl overflow-hidden">
    <button onClick={() => onToggle(sectionKey)} className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <Icon className="w-4 h-4 text-slate-400" /> 
        {title} {count > 0 && <span className="bg-brand-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{count}</span>}
      </div>
      {expandedSection === sectionKey ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
    </button>
    {expandedSection === sectionKey && (
      <div className="p-3 max-h-48 overflow-y-auto space-y-2 bg-white scrollbar-thin">
        {children}
      </div>
    )}
  </div>
);


export const Filters: React.FC<FiltersProps> = ({ 
  filters, 
  setFilters, 
  availableLocations, 
  availableMajors, 
  availableDegreeLevels 
}) => {
  
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [locationInput, setLocationInput] = useState('');
  const [isLocationFocus, setIsLocationFocus] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const createToggleHandler = (field: 'majors' | 'degreeLevel') => (value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(item => item !== value) 
        : [...prev[field], value]
    }));
  };
  
  const handleLocationSelect = (loc: string) => {
    if (!filters.locations.includes(loc)) {
      setFilters(prev => ({...prev, locations: [...prev.locations, loc]}));
    }
    setLocationInput('');
  };
  
  const handleLocationRemove = (loc: string) => {
    setFilters(prev => ({...prev, locations: prev.locations.filter(l => l !== loc)}));
  };

  const locationSuggestions = useMemo(() => {
    if (!locationInput) return [];
    return availableLocations
      .filter(loc => loc.toLowerCase().includes(locationInput.toLowerCase()))
      .filter(loc => !filters.locations.includes(loc));
  }, [locationInput, availableLocations, filters.locations]);

  const toggleMajor = createToggleHandler('majors');
  const toggleDegreeLevel = createToggleHandler('degreeLevel');

  const handleChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit sticky top-24">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
        <SlidersHorizontal className="w-5 h-5 text-brand-600" />
        {/* FIX: Changed invalid 'hh2' tag to a standard 'h2' tag. */}
        <h2 className="font-semibold text-slate-800">Filter Results</h2>
      </div>

      <div className="space-y-6">
        {/* Scholarship */}
        <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-xl">
           <label className="flex items-center gap-2 text-sm font-medium text-amber-800">
              <Sparkles className="w-4 h-4" /> Scholarship Available
            </label>
            <button
              onClick={() => handleChange('hasScholarship', !filters.hasScholarship)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                filters.hasScholarship ? 'bg-amber-400' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  filters.hasScholarship ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
        </div>
        
        {/* Ranking */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Trophy className="w-4 h-4 text-slate-400" /> Max Ranking
            </label>
            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
              {filters.minRanking >= 2500 ? "All" : `Top ${filters.minRanking}`}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="2500"
            step="10"
            value={filters.minRanking}
            onChange={(e) => handleChange('minRanking', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
          />
        </div>

        {/* Tuition */}
        <div>
          <div className="flex justify-between mb-2">
             <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <DollarSign className="w-4 h-4 text-slate-400" /> Max Tuition
            </label>
             <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">${(filters.maxTuition / 1000)}k</span>
          </div>
          <input
            type="range"
            min="0"
            max="500000"
            step="5000"
            value={filters.maxTuition}
            onChange={(e) => handleChange('maxTuition', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
          />
        </div>
        
        {/* New Location Filter */}
        <div className="border border-slate-200 rounded-xl p-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
              <MapPin className="w-4 h-4 text-slate-400" /> Locations {filters.locations.length > 0 && <span className="bg-brand-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{filters.locations.length}</span>}
            </label>
            {filters.locations.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {filters.locations.map(loc => (
                        <div key={loc} className="flex items-center gap-1.5 bg-brand-50 text-brand-700 text-xs font-medium px-2 py-1 rounded-full">
                            <span>{loc}</span>
                            <button onClick={() => handleLocationRemove(loc)} className="text-brand-500 hover:text-brand-700">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <div className="relative">
                <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    onFocus={() => setIsLocationFocus(true)}
                    onBlur={() => setTimeout(() => setIsLocationFocus(false), 150)}
                    placeholder="Search for a country..."
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                {isLocationFocus && locationSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {locationSuggestions.map(loc => (
                            <div
                                key={loc}
                                onMouseDown={() => handleLocationSelect(loc)}
                                className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer"
                            >
                                {loc}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Multi-Select Major */}
        <FilterSection title="Majors" icon={BookOpen} sectionKey="major" {...{expandedSection, onToggle: toggleSection}} count={filters.majors.length}>
          {availableMajors.map(m => (
            <MultiSelectItem key={m} label={m} isSelected={filters.majors.includes(m)} onToggle={() => toggleMajor(m)} />
          ))}
        </FilterSection>

        {/* Multi-Select Degree Level */}
        <FilterSection title="Degree Level" icon={GraduationCap} sectionKey="degree" {...{expandedSection, onToggle: toggleSection}} count={filters.degreeLevel.length}>
          {availableDegreeLevels.map(level => (
            <MultiSelectItem key={level} label={level} isSelected={filters.degreeLevel.includes(level)} onToggle={() => toggleDegreeLevel(level)} />
          ))}
        </FilterSection>
        
        <button 
          onClick={() => setFilters({ search: '', maxTuition: 500000, minRanking: 2500, locations: [], majors: [], hasScholarship: false, degreeLevel: [] })}
          className="w-full py-2.5 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
};