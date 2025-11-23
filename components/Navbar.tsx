import React from 'react';
import { GraduationCap, Menu, Search, Heart, Scale, LogOut, User as UserIcon } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  onSearch: (term: string) => void;
  searchTerm: string;
  user: UserProfile | null;
  onAuthClick: () => void;
  onLogout: () => void;
  favoritesCount: number;
  compareCount: number;
  currentView: string;
  setView: (view: 'home' | 'favorites' | 'auth') => void;
  onOpenCompare: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onSearch, 
  searchTerm, 
  user, 
  onAuthClick, 
  onLogout,
  favoritesCount,
  compareCount,
  currentView,
  setView,
  onOpenCompare
}) => {
  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
            <div className="bg-brand-600 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:block">UniChoice</span>
          </div>

          {/* Search Desktop */}
          {currentView !== 'auth' && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full text-slate-500 focus-within:text-brand-600">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent sm:text-sm transition duration-150 ease-in-out"
                  placeholder="Search universities, countries..."
                  value={searchTerm}
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            
            {/* Compare Button */}
            {currentView !== 'auth' && (
              <button 
                onClick={onOpenCompare}
                className={`relative p-2 rounded-full hover:bg-slate-100 transition ${compareCount > 0 ? 'text-brand-600' : 'text-slate-500'}`}
                title="Compare Universities"
              >
                <Scale className="h-6 w-6" />
                {compareCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-brand-600 rounded-full">
                    {compareCount}
                  </span>
                )}
              </button>
            )}

            {/* Favorites Button */}
            {currentView !== 'auth' && (
              <button 
                onClick={() => setView('favorites')}
                className={`relative p-2 rounded-full hover:bg-slate-100 transition ${currentView === 'favorites' ? 'text-red-500' : 'text-slate-500 hover:text-red-500'}`}
                title="Saved Universities"
              >
                <Heart className="h-6 w-6" />
                {favoritesCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                    {favoritesCount}
                  </span>
                )}
              </button>
            )}

            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-medium text-slate-900">{user.displayName || 'User'}</span>
                  <span className="text-xs text-slate-500">{user.email}</span>
                </div>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User" className="h-9 w-9 rounded-full border border-slate-200" />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                    <UserIcon className="h-5 w-5" />
                  </div>
                )}
                <button 
                  onClick={onLogout}
                  className="p-2 text-slate-500 hover:text-red-600 transition"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={onAuthClick}
                className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-full text-sm font-medium transition shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <UserIcon className="h-4 w-4" /> Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};