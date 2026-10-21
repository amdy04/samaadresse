import React, { useState } from 'react';
import { X, Navigation, Share2, QrCode, Phone, MapPin, Eye, AlertTriangle } from 'lucide-react';
import { Adresse, ItineraireResult } from '../types';
import { api } from '../services/api';

interface FicheAdresseModalProps {
  adresse: Adresse;
  onClose: () => void;
  onOpenQr: (adresse: Adresse) => void;
  onItineraireCalcule: (result: ItineraireResult) => void;
}

export const FicheAdresseModal: React.FC<FicheAdresseModalProps> = ({
  adresse,
  onClose,
  onOpenQr,
  onItineraireCalcule
}) => {
  const [loadingItineraire, setLoadingItineraire] = useState(false);
  const [telSms, setTelSms] = useState('');
  const [showSmsInput, setShowSmsInput] = useState(false);
  const [smsEnvoye, setSmsEnvoye] = useState(false);
  const [copie, setCopie] = useState(false);

  // Copier le lien
  const handleCopierLien = () => {
    const url = adresse.urlPartage || window.location.origin + '/?code=' + adresse.codeSamaAdresse;
    navigator.clipboard.writeText(url);
    setCopie(true);
    setTimeout(() => setCopie(false), 2000);
  };

  // Envoi de SMS via backend simulation
  const handleEnvoyerSms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!telSms) return;
    try {
      await api.partagerParSms(adresse.codeSamaAdresse, telSms);
      setSmsEnvoye(true);
      setTimeout(() => {
        setSmsEnvoye(false);
        setShowSmsInput(false);
      }, 2500);
    } catch (err) {
      alert('Erreur lors de l’envoi du SMS.');
    }
  };

  // Calcul d'itinéraire avec la géolocalisation courante
  const handleLancerItineraire = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setLoadingItineraire(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await api.calculerItineraire(
            pos.coords.latitude,
            pos.coords.longitude,
            adresse.latitude,
            adresse.longitude
          );
          onItineraireCalcule(res);
          onClose(); // Ferme la modal pour laisser voir le tracé sur la carte
        } catch (err) {
          alert("Erreur lors du calcul de l'itinéraire.");
        } finally {
          setLoadingItineraire(false);
        }
      },
      (err) => {
        setLoadingItineraire(false);
        alert('Impossible de récupérer votre position : ' + err.message);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header avec photo de façade */}
        <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
          <img
            src={adresse.photoFacadeUrl || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80'}
            alt="Façade du bâtiment"
            className="w-full h-full object-cover opacity-90"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge Code SamaAdresse */}
          <div className="absolute bottom-3 left-3 bg-emerald-600 text-white font-extrabold text-sm px-3.5 py-1.5 rounded-xl shadow-lg border border-emerald-400/40">
            {adresse.codeSamaAdresse}
          </div>
        </div>

        {/* Corps de la fiche */}
        <div className="p-5 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">{adresse.titre}</h2>
              <span className="text-[11px] font-bold px-2 py-1 rounded bg-slate-100 text-slate-700">
                {adresse.typeLieu}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {adresse.nomQuartier || 'Ziguinchor'} ({adresse.codeRegion || 'ZIG'}) · Précision ±{adresse.precisionGpsMetres ? Math.round(adresse.precisionGpsMetres) : 3} m
            </p>
          </div>

          {/* Repères visuels */}
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3.5 text-xs text-emerald-950">
            <span className="font-bold block mb-1">Repères visuels :</span>
            {adresse.descriptionRepere}
          </div>

          {/* Boutons d'actions rapides (Itinéraire, QR, Partage) */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleLancerItineraire}
              disabled={loadingItineraire}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition active:scale-95"
            >
              <Navigation className="w-5 h-5" />
              <span>{loadingItineraire ? 'Calcul...' : 'Itinéraire'}</span>
            </button>

            <button
              onClick={() => onOpenQr(adresse)}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition active:scale-95"
            >
              <QrCode className="w-5 h-5 text-emerald-700" />
              <span>QR Code</span>
            </button>

            <button
              onClick={() => setShowSmsInput(!showSmsInput)}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition active:scale-95"
            >
              <Share2 className="w-5 h-5 text-emerald-700" />
              <span>Partager</span>
            </button>
          </div>

          {/* Formulaire de partage SMS si activé */}
          {showSmsInput && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 animate-fade-in text-xs space-y-2">
              <span className="font-bold text-slate-800 block">Envoyer par SMS (Twilio / SendFlash Sandbox) :</span>
              {smsEnvoye ? (
                <div className="p-2 bg-emerald-100 text-emerald-800 font-medium rounded-lg text-center">
                  ✅ SMS envoyé avec succès !
                </div>
              ) : (
                <form onSubmit={handleEnvoyerSms} className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="+221 77 000 00 00"
                    value={telSms}
                    onChange={(e) => setTelSms(e.target.value)}
                    required
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl font-bold transition"
                  >
                    Envoyer
                  </button>
                </form>
              )}

              <button
                type="button"
                onClick={handleCopierLien}
                className="w-full text-center text-emerald-700 font-medium pt-1 hover:underline"
              >
                {copie ? '✅ Lien copié !' : 'Ou copier le lien de la fiche'}
              </button>
            </div>
          )}

          {/* Métadonnées & Vues */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {adresse.vuesCompteur || 1} consultation(s)
            </span>
            <span>Coordonnées : {adresse.latitude.toFixed(4)}, {adresse.longitude.toFixed(4)}</span>
          </div>

        </div>
      </div>
    </div>
  );
};
