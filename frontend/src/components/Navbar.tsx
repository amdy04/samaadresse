import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Wifi, WifiOff, Compass } from 'lucide-react';

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo SamaAdresse */}
        <div 
          onClick={() => setPageActive('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-black text-xl tracking-tight text-slate-900">
                Sama<span className="text-emerald-600">Adresse</span>
              </span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 tracking-wide">
                UASZ
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Ziguinchor · Sénégal</p>
          </div>
        </div>

        {/* Actions de droite */}
        <div className="flex items-center gap-2.5">
          {/* Badge PWA Online/Offline */}
          <div className={`hidden sm:flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border transition ${
            isOnline 
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800' 
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            {isOnline ? 'PWA En ligne' : 'Mode Hors Ligne'}
          </div>

          {/* Bouton Créer une adresse */}
          <button
            onClick={() => setPageActive('creer')}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-sm shadow-emerald-600/30 transition"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden xs:inline">Nouvelle adresse</span>
          </button>
        </div>

      </div>
    </header>
  );
};
