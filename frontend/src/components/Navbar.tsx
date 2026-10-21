import React, { useState, useEffect } from 'react';
import { MapPin, PlusCircle, Search, Compass, Shield, Wifi, WifiOff } from 'lucide-react';

interface NavbarProps {
  pageActive: string;
  setPageActive: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ pageActive, setPageActive }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo SamaAdresse */}
        <div 
          onClick={() => setPageActive('home')}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">Sama<span className="text-emerald-600">Adresse</span></span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">UASZ</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Ziguinchor · Sénégal</p>
          </div>
        </div>

        {/* Statut Réseau (Online / Offline PWA indicator) */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
            isOnline ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-100 text-amber-800 animate-pulse'
          }`}>
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isOnline ? 'En ligne' : 'Mode Hors Ligne'}</span>
          </div>

          {/* Bouton d'action rapide Créer */}
          <button
            onClick={() => setPageActive('creer')}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden xs:inline">Créer</span>
          </button>
        </div>
      </div>

      {/* Navigation Mobile en bas / Tabs */}
      <nav className="flex border-t border-slate-100 text-xs font-medium text-slate-600 overflow-x-auto">
        <button
          onClick={() => setPageActive('home')}
          className={`flex-1 min-w-[75px] py-2.5 flex flex-col items-center gap-1 border-b-2 transition ${
            pageActive === 'home' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Accueil</span>
        </button>

        <button
          onClick={() => setPageActive('annuaire')}
          className={`flex-1 min-w-[75px] py-2.5 flex flex-col items-center gap-1 border-b-2 transition ${
            pageActive === 'annuaire' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Annuaire</span>
        </button>

        <button
          onClick={() => setPageActive('mes-adresses')}
          className={`flex-1 min-w-[75px] py-2.5 flex flex-col items-center gap-1 border-b-2 transition ${
            pageActive === 'mes-adresses' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Mes Adresses</span>
        </button>

        <button
          onClick={() => setPageActive('admin')}
          className={`flex-1 min-w-[75px] py-2.5 flex flex-col items-center gap-1 border-b-2 transition ${
            pageActive === 'admin' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Admin</span>
        </button>
      </nav>
    </header>
  );
};
