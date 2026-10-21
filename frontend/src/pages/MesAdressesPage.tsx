import React, { useState } from 'react';
import { Plus, QrCode, CreditCard, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Adresse } from '../types';
import { api } from '../services/api';

interface MesAdressesPageProps {
  onNavCreer: () => void;
  onOpenFiche: (adresse: Adresse) => void;
  onOpenQr: (adresse: Adresse) => void;
}

export const MesAdressesPage: React.FC<MesAdressesPageProps> = ({
  onNavCreer,
  onOpenFiche,
  onOpenQr
}) => {
  // Liste des adresses de démonstration locale pour la session
  const [adresses] = useState<Adresse[]>([
    {
      id: 1,
      codeSamaAdresse: 'ZIG-KBG-4271',
      titre: 'Maison Familiale Diallo',
      descriptionRepere: 'Grande porte métallique verte, face école primaire Boucotte',
      typeLieu: 'DOMICILE',
      latitude: 12.5584,
      longitude: -16.2731,
      nomQuartier: 'Kandialang / Boucotte Grand',
      nomProprietaireAffichable: 'Amadou Diallo',
      photoFacadeUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=300&q=80',
      vuesCompteur: 24
    }
  ]);

  const [commandeAdresse, setCommandeAdresse] = useState<Adresse | null>(null);
  const [telLivraison, setTelLivraison] = useState('+221 77 123 45 67');
  const [waveSuccess, setWaveSuccess] = useState<string | null>(null);
  const [loadingWave, setLoadingWave] = useState(false);

  // Simulation commande de plaque métallique physique avec paiement Wave Sandbox
  const handlePaiementWave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandeAdresse) return;

    setLoadingWave(true);
    try {
      const res = await api.commanderPlaque(commandeAdresse.codeSamaAdresse, telLivraison, 5000);
      setWaveSuccess(res.referenceWave || 'WAVE-SANDBOX-SUCCESS');
      setTimeout(() => {
        setWaveSuccess(null);
        setCommandeAdresse(null);
      }, 4000);
    } catch {
      alert('Erreur lors du paiement Wave simulé.');
    } finally {
      setLoadingWave(false);
    }
  };

  return (
    <div className="space-y-4 pb-12 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Mes Adresses Enregistrées</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gérez vos adresses officielles et commandez une plaque physique de rue.
          </p>
        </div>
        <button
          onClick={onNavCreer}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle</span>
        </button>
      </div>

      {/* Liste des adresses */}
      <div className="space-y-3">
        {adresses.map((adr) => (
          <div
            key={adr.codeSamaAdresse}
            className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 shadow-inner">
                  <img
                    src={adr.photoFacadeUrl}
                    alt={adr.titre}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{adr.titre}</h3>
                  <div className="text-xs font-mono font-extrabold text-emerald-700 tracking-wide">
                    {adr.codeSamaAdresse}
                  </div>
                  <span className="text-[11px] text-slate-400">{adr.nomQuartier} · {adr.typeLieu}</span>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Active & Certifiée
              </span>
            </div>

            {/* Actions de gestion */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
              <button
                onClick={() => onOpenFiche(adr)}
                className="text-emerald-700 font-bold hover:underline"
              >
                Voir fiche publique
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => onOpenQr(adr)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition flex items-center gap-1 font-semibold"
                >
                  <QrCode className="w-4 h-4 text-emerald-700" />
                  <span className="hidden sm:inline">QR Code</span>
                </button>

                <button
                  onClick={() => setCommandeAdresse(adr)}
                  className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl transition flex items-center gap-1 font-bold border border-emerald-200"
                >
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  <span>Commander Plaque (Wave)</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Commande Plaque avec Wave Sandbox */}
      {commandeAdresse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative space-y-4">
            
            <div className="text-center">
              <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Commander ma plaque de rue</h3>
              <p className="text-xs text-slate-500">Plaque métallique gravée avec QR Code</p>
            </div>

            {/* Aperçu de la plaque */}
            <div className="p-4 border-2 border-slate-800 rounded-2xl bg-gradient-to-b from-blue-900 to-slate-900 text-white text-center shadow-lg">
              <div className="text-[10px] uppercase font-bold tracking-widest text-blue-300">RÉPUBLIQUE DU SÉNÉGAL</div>
              <div className="text-lg font-mono font-black tracking-wider text-white mt-1">
                {commandeAdresse.codeSamaAdresse}
              </div>
              <div className="text-[10px] text-slate-300 mt-1">{commandeAdresse.nomQuartier} · Ziguinchor</div>
            </div>

            {waveSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-900">Paiement Wave Réussi !</h4>
                <p className="text-xs text-emerald-700 font-mono">Réf : {waveSuccess}</p>
                <p className="text-[11px] text-slate-500">Votre plaque sera livrée sous 48h.</p>
              </div>
            ) : (
              <form onSubmit={handlePaiementWave} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Numéro de téléphone Wave :</label>
                  <input
                    type="tel"
                    required
                    value={telLivraison}
                    onChange={(e) => setTelLivraison(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-600 font-medium">Montant plaque émaillée :</span>
                  <span className="font-extrabold text-sm text-slate-900">5 000 FCFA</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCommandeAdresse(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loadingWave}
                    className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{loadingWave ? 'Traitement...' : 'Payer via Wave'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
