import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { CreerAdressePage } from './pages/CreerAdressePage';
import { AnnuairePage } from './pages/AnnuairePage';
import { MesAdressesPage } from './pages/MesAdressesPage';
import { FicheAdresseModal } from './components/FicheAdresseModal';
import { QrCodeModal } from './components/QrCodeModal';
import { Adresse, ItineraireResult } from './types';
import { api } from './services/api';
import { Map, Search, PlusCircle, Bookmark, Shield } from 'lucide-react';

export const App: React.FC = () => {
  const [pageActive, setPageActive] = useState('home');
  const [ficheAdresse, setFicheAdresse] = useState<Adresse | null>(null);
  const [qrAdresse, setQrAdresse] = useState<Adresse | null>(null);
  const [pointItineraire, setPointItineraire] = useState<[number, number][] | undefined>(undefined);

  // Vérifier si un code est passé dans l'URL (?code=ZIG-KBG-4271)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('code');
    if (codeParam) {
      api.resoudreAdresse(codeParam)
        .then((adr) => setFicheAdresse(adr))
        .catch(() => console.log('Code dans URL non trouvé'));
    }
  }, []);

  const handleAdresseCreee = (nouvelleAdresse: Adresse) => {
    setPageActive('home');
    setFicheAdresse(nouvelleAdresse);
  };

  const handleItineraireCalcule = (result: ItineraireResult) => {
    setPointItineraire(result.points);
    setPageActive('home');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between antialiased">
      <div>
        {/* Top Navbar */}
        <Navbar pageActive={pageActive} setPageActive={setPageActive} />

        {/* Contenu principal */}
        <main className="max-w-4xl mx-auto px-4 pt-4 sm:pt-6 pb-24">
          {pageActive === 'home' && (
            <HomePage
              onOpenFiche={(adr) => setFicheAdresse(adr)}
              onOpenQr={(adr) => setQrAdresse(adr)}
              pointItineraire={pointItineraire}
              setPointItineraire={setPointItineraire}
            />
          )}

          {pageActive === 'creer' && (
            <CreerAdressePage
              onAdresseCreee={handleAdresseCreee}
              onAnnuler={() => setPageActive('home')}
            />
          )}

          {pageActive === 'annuaire' && (
            <AnnuairePage
              onOpenFiche={(adr) => setFicheAdresse(adr)}
              onOpenQr={(adr) => setQrAdresse(adr)}
            />
          )}

          {pageActive === 'mes-adresses' && (
            <MesAdressesPage
              onNavCreer={() => setPageActive('creer')}
              onOpenFiche={(adr) => setFicheAdresse(adr)}
              onOpenQr={(adr) => setQrAdresse(adr)}
            />
          )}

          {pageActive === 'admin' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 text-center space-y-4 max-w-lg mx-auto shadow-xs">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-3xl flex items-center justify-center mx-auto text-2xl font-bold">
                🛡️
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Administration & Gouvernance UASZ</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Surveillance de la grille spatiale de Ziguinchor et modération des adresses signalées.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="text-2xl font-black text-emerald-700">8</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Quartiers</div>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="text-2xl font-black text-emerald-700">0</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Litiges</div>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="text-2xl font-black text-emerald-700">100%</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Conformité</div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Barre de navigation mobile Native-Like (Fixée en bas) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
          
          <button
            onClick={() => setPageActive('home')}
            className={`flex flex-col items-center gap-1 text-[11px] font-bold py-1 px-3 rounded-2xl transition ${
              pageActive === 'home' ? 'text-emerald-700 scale-105' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <Map className="w-5 h-5" />
            <span>Carte</span>
          </button>

          <button
            onClick={() => setPageActive('annuaire')}
            className={`flex flex-col items-center gap-1 text-[11px] font-bold py-1 px-3 rounded-2xl transition ${
              pageActive === 'annuaire' ? 'text-emerald-700 scale-105' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <Search className="w-5 h-5" />
            <span>Annuaire</span>
          </button>

          {/* Bouton central flottant Créer */}
          <button
            onClick={() => setPageActive('creer')}
            className="flex flex-col items-center -mt-5 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/40 group-active:scale-95 transition-transform">
              <PlusCircle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-bold text-slate-700 mt-1">Créer</span>
          </button>

          <button
            onClick={() => setPageActive('mes-adresses')}
            className={`flex flex-col items-center gap-1 text-[11px] font-bold py-1 px-3 rounded-2xl transition ${
              pageActive === 'mes-adresses' ? 'text-emerald-700 scale-105' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <Bookmark className="w-5 h-5" />
            <span>Mes adresses</span>
          </button>

          <button
            onClick={() => setPageActive('admin')}
            className={`flex flex-col items-center gap-1 text-[11px] font-bold py-1 px-3 rounded-2xl transition ${
              pageActive === 'admin' ? 'text-emerald-700 scale-105' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span>Admin</span>
          </button>

        </div>
      </nav>

      {/* Modals globales */}
      {ficheAdresse && (
        <FicheAdresseModal
          adresse={ficheAdresse}
          onClose={() => setFicheAdresse(null)}
          onOpenQr={(adr) => setQrAdresse(adr)}
          onItineraireCalcule={handleItineraireCalcule}
        />
      )}

      {qrAdresse && (
        <QrCodeModal
          adresse={qrAdresse}
          onClose={() => setQrAdresse(null)}
        />
      )}
    </div>
  );
};
