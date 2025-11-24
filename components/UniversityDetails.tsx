import React from 'react';
import { University } from '../types';
import { X, MapPin, Globe, Users, Award, Book, DollarSign, Sparkles, Linkedin, Building, FileText, Languages } from 'lucide-react';

interface UniversityDetailsProps {
  university: University;
  onClose: () => void;
}

const DetailSection: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
      <Icon className="w-5 h-5 text-slate-400" /> {title}
    </h3>
    {children}
  </div>
);

const renderNestedObject = (data: any): React.ReactNode => {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return <p className="text-sm text-slate-600">{String(data)}</p>;
  }

  return (
    <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
      {Object.entries(data).map(([key, value]) => (
        <li key={key}>
          <strong className="font-semibold capitalize text-slate-800">{key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}:</strong>{' '}
          {typeof value === 'object' && value !== null ? (
            <div className="pl-4 mt-1">{renderNestedObject(value)}</div>
          ) : (
            String(value ?? '')
          )}
        </li>
      ))}
    </ul>
  );
};

export const UniversityDetails: React.FC<UniversityDetailsProps> = ({ university, onClose }) => {

  const hasAdmissionData = university.admissionRequirements && 
    (typeof university.admissionRequirements === 'string' ? university.admissionRequirements.trim() !== '' : Object.keys(university.admissionRequirements).length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:max-w-7xl md:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        
        {/* Mobile Close Button - Highly Visible */}
        <button 
            onClick={onClose}
            className="md:hidden absolute top-4 right-4 z-[60] bg-white text-slate-900 p-2.5 rounded-full shadow-lg border border-slate-200 active:scale-95 transition-transform"
            aria-label="Close details"
        >
            <X className="w-6 h-6" />
        </button>

        <div className="relative w-full md:w-2/5 h-64 md:h-auto bg-slate-100 flex-shrink-0">
          <img 
            src={university.imageUrl} 
            alt={university.name} 
            className="w-full h-full object-contain p-8 bg-white"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent md:hidden"></div>
        </div>

        <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col relative overflow-y-auto bg-white">
          {/* Desktop Close Button */}
          <button 
            onClick={onClose}
            className="hidden md:block absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition p-2 hover:bg-slate-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="mb-6 mt-2 md:mt-0">
            <div className="flex items-center gap-2 text-brand-600 font-semibold text-sm mb-2 uppercase tracking-wide">
              {university.ranking > 0 && <><Award className="w-4 h-4" /> Ranked #{university.ranking} Globally</>}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 leading-tight pr-8">{university.name}</h2>
            <div className="flex items-center text-slate-500">
              <MapPin className="w-4 h-4 mr-1" /> {university.location}, {university.country}
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
            <div className="bg-indigo-50 p-3 md:p-4 rounded-xl">
              <div className="flex items-center gap-2 text-indigo-600 mb-1">
                <DollarSign className="w-4 h-4" /> <span className="font-semibold text-xs md:text-sm">Tuition</span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-slate-800">${university.tuition.toLocaleString()}</p>
            </div>
            <div className="bg-emerald-50 p-3 md:p-4 rounded-xl">
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <Users className="w-4 h-4" /> <span className="font-semibold text-xs md:text-sm">Acceptance</span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-slate-800">{university.acceptanceRate > 0 ? `${university.acceptanceRate}%` : 'N/A'}</p>
            </div>
             <div className="bg-sky-50 p-3 md:p-4 rounded-xl">
              <div className="flex items-center gap-2 text-sky-600 mb-1">
                <Globe className="w-4 h-4" /> <span className="font-semibold text-xs md:text-sm">Intl. Students</span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-slate-800">{(university.internationalStudentsPercent ?? 0) > 0 ? `${university.internationalStudentsPercent}%` : 'N/A'}</p>
            </div>
            <div className="bg-amber-50 p-3 md:p-4 rounded-xl">
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <Sparkles className="w-4 h-4" /> <span className="font-semibold text-xs md:text-sm">Scholarships</span>
              </div>
              <p className={`text-xl md:text-2xl font-bold ${university.hasScholarship ? 'text-slate-800' : 'text-slate-500'}`}>{university.hasScholarship ? 'Available' : 'N/A'}</p>
            </div>
          </div>


          <div className="mb-8 prose prose-slate text-slate-600 max-w-none text-sm md:text-base">
            <p>{university.description}</p>
          </div>
          
          {university.majors && university.majors.length > 0 && (
            <DetailSection title="Top Majors" icon={Book}>
              <div className="flex flex-wrap gap-2">
                {university.majors.map(major => (
                  <span key={major} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200">
                    {major}
                  </span>
                ))}
              </div>
            </DetailSection>
          )}

          {hasAdmissionData && (
            <DetailSection title="Admission Requirements" icon={FileText}>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                {renderNestedObject(university.admissionRequirements)}
              </div>
            </DetailSection>
          )}

          {/* NOTE: Deadlines section removed as requested */}
          
          {university.languages && university.languages.length > 0 && (
            <DetailSection title="Languages" icon={Languages}>
               <div className="flex flex-wrap gap-2">
                {university.languages.map(lang => (
                  <span key={lang} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200">
                    {lang}
                  </span>
                ))}
              </div>
            </DetailSection>
          )}

          {university.alumni && university.alumni.length > 0 && (
            <DetailSection title="Alumni Success" icon={Building}>
              <div className="space-y-4">
                {university.alumni.map((alumnus, index) => (
                  <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 transition hover:bg-slate-100 text-center sm:text-left">
                    <img src={alumnus.photo} alt={alumnus.name} className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-white shadow-md flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start">
                        <div>
                          <p className="font-bold text-slate-900 text-lg">{alumnus.name}</p>
                          <p className="text-sm text-slate-500">{alumnus.role} @ {alumnus.company}</p>
                        </div>
                        <a href={alumnus.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors mt-2 sm:mt-0" title={`Source: ${alumnus.name}'s LinkedIn`}>
                          <Linkedin className="w-5 h-5" />
                        </a>
                      </div>
                      <p className="text-sm text-slate-700 mt-2 italic line-clamp-3">&ldquo;{alumnus.result}&rdquo;</p>
                    </div>
                  </div>
                ))}
              </div>
            </DetailSection>
          )}

          <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-3">
             <div className="flex gap-4">
                <a 
                href={university.website} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 py-3 rounded-xl font-medium transition"
                >
                <Globe className="w-4 h-4" /> <span className="hidden sm:inline">Visit</span> Website
                </a>
                <a 
                href={`${university.website}/admissions` || university.website} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 flex items-center justify-center bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-medium transition shadow-lg shadow-brand-200"
                >
                Apply Now
                </a>
            </div>
             {/* Secondary Mobile Close Button for long content */}
             <button 
                onClick={onClose}
                className="md:hidden w-full py-3 text-slate-400 hover:text-slate-600 text-sm font-medium"
             >
                Close Details
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};