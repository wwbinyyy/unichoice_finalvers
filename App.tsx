import React, { useEffect, useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Filters } from './components/Filters';
import { UniversityCard } from './components/UniversityCard';
import { UniversityDetails } from './components/UniversityDetails';
import { ComparisonModal } from './components/ComparisonModal';
import { AiAdvisor } from './components/AiAdvisor';
import { Auth } from './components/Auth';
import { getUniversities } from './services/universityService';
import { University, FilterState, UserProfile } from './types';
import { Loader2, Database, WifiOff, RefreshCcw, Heart, ArrowLeft, ChevronsDown } from 'lucide-react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const PAGE_SIZE = 12;

function App() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [view, setView] = useState<'home' | 'favorites' | 'auth'>('home');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [compareList, setCompareList] = useState<University[]>(() => {
    try {
      const saved = localStorage.getItem('compareList');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [showCompare, setShowCompare] = useState(false);

  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [availableMajors, setAvailableMajors] = useState<string[]>([]);
  const [availableDegreeLevels, setAvailableDegreeLevels] = useState<string[]>([]);
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    maxTuition: 500000,
    minRanking: 2500,
    locations: [],
    majors: [],
    hasScholarship: false,
    degreeLevel: []
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }, [compareList]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser ? { uid: fbUser.uid, email: fbUser.email, displayName: fbUser.displayName, photoURL: fbUser.photoURL } : null);
      if (fbUser && view === 'auth') setView('home');
    });
    return () => unsubscribe();
  }, [view]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUniversities();
      setUniversities(data);
      if (data.length > 0) {
        setAvailableLocations(Array.from(new Set(data.map(u => u.country))).filter(Boolean).sort());
        setAvailableMajors(Array.from(new Set(data.flatMap(u => u.majors))).filter(Boolean).sort());
        setAvailableDegreeLevels(Array.from(new Set(data.flatMap(u => u.degreeLevels))).filter(Boolean).sort());
      }
    } catch (err: any) {
      setError("Network Error: Could not connect to the database. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUniversities = useMemo(() => {
    let sourceList = view === 'favorites' ? universities.filter(u => favorites.includes(u.id)) : universities;

    const searchLower = filters.search.toLowerCase();

    return sourceList.filter(uni => {
      const matchesSearch = filters.search.trim() === '' ? true :
        (uni.name?.toLowerCase().includes(searchLower)) ||
        (uni.country?.toLowerCase().includes(searchLower)) ||
        (uni.location?.toLowerCase().includes(searchLower)) ||
        (uni.description?.toLowerCase().includes(searchLower)) ||
        (uni.id?.toLowerCase().includes(searchLower)) || // Search slug
        (uni.majors || []).some(m => m.toLowerCase().includes(searchLower));

      const matchesLocation = filters.locations.length === 0 ? true : filters.locations.includes(uni.country);
      const matchesMajor = filters.majors.length === 0 ? true : (uni.majors || []).some(m => filters.majors.includes(m));
      const matchesTuition = (uni.tuition || 0) <= filters.maxTuition;
      const matchesRanking = filters.minRanking >= 2500 || (uni.ranking > 0 && uni.ranking <= filters.minRanking);
      const matchesScholarship = !filters.hasScholarship || uni.hasScholarship;
      const matchesDegree = filters.degreeLevel.length === 0 ? true : (uni.degreeLevels || []).some(d => filters.degreeLevel.includes(d));
      
      return matchesSearch && matchesLocation && matchesMajor && matchesTuition && matchesRanking && matchesScholarship && matchesDegree;
    });
  }, [universities, filters, view, favorites]);
  
  useEffect(() => {
    setVisibleCount(PAGE_SIZE); // Reset pagination on filter change
  }, [filters, view]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };

  const toggleCompare = (uni: University) => {
    setCompareList(prev => {
      if (prev.some(p => p.id === uni.id)) {
        return prev.filter(p => p.id !== uni.id);
      }
      if (prev.length >= 3) {
        alert("You can compare up to 3 universities at a time.");
        return prev;
      }
      return [...prev, uni];
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
    setView('home');
  };

  const universitiesToShow = useMemo(() => filteredUniversities.slice(0, visibleCount), [filteredUniversities, visibleCount]);

  if (view === 'auth') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar {...{searchTerm: "", onSearch: ()=>{}, user: null, onAuthClick: ()=>{}, onLogout: ()=>{}, favoritesCount: 0, compareCount: 0, currentView: "auth", setView, onOpenCompare: ()=>{}}} />
        <Auth onSuccess={() => setView('home')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <Navbar {...{searchTerm: filters.search, onSearch: (term) => setFilters(prev => ({ ...prev, search: term })), user, onAuthClick: () => setView('auth'), onLogout: handleLogout, favoritesCount: favorites.length, compareCount: compareList.length, currentView: view, setView, onOpenCompare: () => setShowCompare(true)}} />

      {view !== 'favorites' && (
        <div className="bg-brand-900 text-white py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Find Your <span className="text-brand-400">Future</span></h1>
            <p className="text-xl text-brand-100 max-w-2xl mx-auto font-light">Browse our database of world-class universities, filter by your preferences, and get AI-powered advice instantly.</p>
          </div>
        </div>
      )}
      
      {view === 'favorites' && (
        <div className="bg-white border-b border-slate-200 py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <button onClick={() => setView('home')} className="flex items-center text-slate-500 hover:text-brand-600 mb-4 transition">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-full text-red-600"><Heart className="w-6 h-6 fill-current" /></div>
              <h1 className="text-3xl font-bold text-slate-900">Your Favorite Universities</h1>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-1/4 flex-shrink-0">
            <Filters {...{filters, setFilters, availableLocations, availableMajors, availableDegreeLevels}}/>
          </aside>
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-end border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{view === 'favorites' ? `Saved Universities (${filteredUniversities.length})` : "University Listings"}</h2>
                <p className="text-slate-500 mt-1">{loading ? 'Connecting...' : error ? 'Error' : `Showing ${universitiesToShow.length} of ${filteredUniversities.length} institutions`}</p>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64 flex-col gap-4"><Loader2 className="w-12 h-12 text-brand-600 animate-spin" /><p>Fetching data from Firebase...</p></div>
            ) : error ? (
              <div className="bg-red-50 p-8 rounded-2xl border border-red-200 text-center flex flex-col items-center"><div className="bg-red-100 p-4 rounded-full mb-4"><WifiOff className="w-8 h-8 text-red-500" /></div><h3 className="text-lg font-bold text-red-800 mb-2">Connection Failed</h3><p className="text-red-600 mb-6 max-w-md">{error}</p><button onClick={fetchData} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-medium"><RefreshCcw className="w-4 h-4" /> Retry</button></div>
            ) : filteredUniversities.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {universitiesToShow.map(uni => (
                    <UniversityCard key={uni.id} {...{university: uni, onClick: setSelectedUni, isFavorite: favorites.includes(uni.id), onToggleFavorite: toggleFavorite, isCompare: !!compareList.find(c => c.id === uni.id), onToggleCompare: toggleCompare}} />
                  ))}
                </div>
                {visibleCount < filteredUniversities.length && (
                  <div className="text-center mt-12">
                    <button onClick={() => setVisibleCount(c => c + PAGE_SIZE)} className="bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 px-8 rounded-full border border-slate-200 shadow-sm transition flex items-center gap-2 mx-auto">
                      <ChevronsDown className="w-4 h-4" /> Load More Results
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center flex flex-col items-center">
                 <div className="bg-slate-50 p-4 rounded-full mb-4">{view === 'favorites' ? <Heart className="w-8 h-8 text-slate-400" /> : <Database className="w-8 h-8 text-slate-400" />}</div>
                 <h3 className="text-lg font-semibold text-slate-900 mb-2">{view === 'favorites' ? "No Favorites Yet" : "No Universities Found"}</h3>
                 <p className="text-slate-500 mb-6 max-w-sm mx-auto">{view === 'favorites' ? "Click the heart icon to save universities here." : "No universities match your current filters."}</p>
                 {view !== 'favorites' && <button onClick={() => setFilters({ search: '', maxTuition: 500000, minRanking: 2500, locations: [], majors: [], hasScholarship: false, degreeLevel: [] })} className="mt-6 text-brand-600 font-medium hover:underline">Clear all filters</button>}
                 {view === 'favorites' && <button onClick={() => setView('home')} className="mt-6 text-brand-600 font-medium hover:underline">Browse Universities</button>}
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedUni && <UniversityDetails university={selectedUni} onClose={() => setSelectedUni(null)} />}
      {showCompare && <ComparisonModal universities={compareList} onClose={() => setShowCompare(false)} onRemove={(id) => setCompareList(prev => prev.filter(u => u.id !== id))} />}
      <AiAdvisor universities={filteredUniversities} filters={filters} />
    </div>
  );
}

export default App;
