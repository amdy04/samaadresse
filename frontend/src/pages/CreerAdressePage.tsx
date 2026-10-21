import React, { useState } from 'react';
import { Crosshair, Camera, CheckCircle2, AlertCircle, ArrowLeft, MapPin } from 'lucide-react';
import { api } from '../services/api';
import { Adresse, TypeLieu } from '../types';

interface CreerAdressePageProps {
  onAdresseCreee: (adresse: Adresse) => void;
  onAnnuler: () => void;
}

export const CreerAdressePage: React.FC<CreerAdressePageProps> = ({
  onAdresseCreee,
  onAnnuler
}) => {
  const [titre, setTitre] = useState('');
  const [descriptionRepere, setDescriptionRepere] = useState('');
  const [typeLieu, setTypeLieu] = useState<TypeLieu>('DOMICILE');
  const [nomProprietaire, setNomProprietaire] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [precisionGps, setPrecisionGps] = useState<number | null>(null);
  const [loadingGps, setLoadingGps] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Capture GPS native du smartphone
  const handleCapturerGps = () => {
    if (!navigator.geolocation) {
      setErreur("La géolocalisation n'est pas supportée par cet appareil.");
      return;
    }

    setLoadingGps(true);
    setErreur(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setPrecisionGps(pos.coords.accuracy);
        setLoadingGps(false);
      },
      (err) => {
        setLoadingGps(false);
        // Fallback démo si pas d'accès GPS en local ou permissions refusées
        setLatitude(12.5584);
        setLongitude(-16.2731);
        setPrecisionGps(3.5);
        setErreur("Signal GPS simulé sur Ziguinchor (Boucotte) : " + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Upload photo de façade
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (latitude === null || longitude === null) {
      setErreur("Veuillez capturer votre position GPS avant de continuer.");
      return;
    }

    setSubmitting(true);
    setErreur(null);

    try {
      const nouvelleAdresse = await api.creerAdresse({
        titre,
        descriptionRepere,
        typeLieu,
        latitude,
        longitude,
        precisionGpsMetres: precisionGps || 3,
        nomProprietaireAffichable: nomProprietaire || 'Résident',
        photoFacadeBase64: photoPreview || undefined
      });

      onAdresseCreee(nouvelleAdresse);
    } catch (err: any) {
      setErreur(err.message || "Erreur lors de la création de l'adresse.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-4 pb-12 animate-fade-in">
      
      {/* Bouton Retour */}
      <button
        onClick={onAnnuler}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour à l'accueil</span>
      </button>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-5">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Générer ma SamaAdresse</h2>
          <p className="text-xs text-slate-500 mt-1">
            Capturez votre position GPS et ajoutez des repères visuels pour générer votre code officiel.
          </p>
        </div>

        {erreur && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{erreur}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
          
          {/* Bloc Capture GPS */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-3">
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={handleCapturerGps}
                disabled={loadingGps}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs shadow transition active:scale-95 ${
                  latitude !== null
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white gps-pulse'
                }`}
              >
                <Crosshair className={`w-4 h-4 ${loadingGps ? 'animate-spin' : ''}`} />
                <span>
                  {loadingGps
                    ? 'Capture satellite en cours...'
                    : latitude !== null
                    ? 'Position GPS capturée ✅'
                    : 'Capturer ma position GPS (Satellite)'}
                </span>
              </button>
            </div>

            {latitude !== null && longitude !== null && (
              <div className="text-[11px] text-slate-600 bg-white border border-slate-200 p-2.5 rounded-xl font-mono">
                <div>📍 Lat: <span className="font-bold">{latitude.toFixed(6)}</span> | Lng: <span className="font-bold">{longitude.toFixed(6)}</span></div>
                <div className="text-emerald-700 font-semibold mt-0.5">Précision estimée : ±{precisionGps?.toFixed(1) || 3} mètres</div>
              </div>
            )}
          </div>

          {/* Titre du lieu */}
          <div className="space-y-1">
            <label className="text-slate-700 font-bold">Nom ou désignation du lieu *</label>
            <input
              type="text"
              required
              placeholder="Ex: Maison Diallo, Boutique Al-Baraka, Cabinet Dr Sané..."
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Type de lieu */}
          <div className="space-y-1">
            <label className="text-slate-700 font-bold">Type de bâtiment</label>
            <select
              value={typeLieu}
              onChange={(e) => setTypeLieu(e.target.value as TypeLieu)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
            >
              <option value="DOMICILE">🏠 Domicile / Résidence familiale</option>
              <option value="COMMERCE">🛒 Commerce / Boutique / Quincaillerie</option>
              <option value="SERVICE_PUBLIC">🏛️ Service Public / Administration</option>
              <option value="LIEU_DE_CULTE">🕌 Mosquée / Église</option>
              <option value="SANTE">🏥 Pharmacie / Dispensaire / Clinique</option>
              <option value="AUTRE">📍 Autre</option>
            </select>
          </div>

          {/* Nom du propriétaire affichable */}
          <div className="space-y-1">
            <label className="text-slate-700 font-bold">Nom du titulaire (facultatif)</label>
            <input
              type="text"
              placeholder="Ex: Famille Diallo, Amadou Diallo..."
              value={nomProprietaire}
              onChange={(e) => setNomProprietaire(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Repères visuels */}
          <div className="space-y-1">
            <label className="text-slate-700 font-bold">Repères visuels pour les livreurs *</label>
            <textarea
              required
              rows={3}
              placeholder="Ex: Portail métallique vert, en face du grand manguier, 50m après la boutique de Modou..."
              value={descriptionRepere}
              onChange={(e) => setDescriptionRepere(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Photo de façade */}
          <div className="space-y-1.5">
            <label className="text-slate-700 font-bold">Photo de façade du bâtiment</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl cursor-pointer transition">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>Prendre / Choisir photo</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              {photoPreview && (
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                  <img src={photoPreview} alt="Aperçu" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Bouton de soumission */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={submitting || latitude === null}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-md transition active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Génération du code...' : 'Générer mon Code et QR Code'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
