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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Navbar pageActive={pageActive} setPageActive={setPageActive} />

        <main className="max-w-4xl mx-auto px-4 pt-4 sm:pt-6">
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
            <div className="bg-white rounded-3xl p-6 border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
                🛡️
              </div>
              <h2 className="text-lg font-bold text-slate-900">Espace Administration & Modération</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Surveillance de la grille spatiale de Ziguinchor, validation des signalements et audit des codes générés.
              </p>
              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto pt-2 text-xs">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="text-xl font-black text-emerald-700">8</div>
                  <div className="text-[11px] text-slate-500">Quartiers</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="text-xl font-black text-emerald-700">0</div>
                  <div className="text-[11px] text-slate-500">Signalements</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="text-xl font-black text-emerald-700">100%</div>
                  <div className="text-[11px] text-slate-500">Conformité</div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

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

      {/* Footer Institutionnel UASZ */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400 bg-white">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Université Assane Seck de Ziguinchor · Licence 3 Ingénierie Informatique</span>
          <span className="font-semibold text-slate-500">Projet 12 : SamaAdresse (2025-2026)</span>
        </div>
      </footer>
    </div>
  );
};
