import React, { useState, useEffect } from 'react';
import { Search, MapPin, QrCode, Navigation, Share2, Compass, AlertCircle, X, ExternalLink } from 'lucide-react';
import { Adresse, TypeLieu } from '../types';
import { api } from '../services/api';
import { offlineStorage } from '../services/offlineStorage';
import { CarteLeaflet } from '../components/CarteLeaflet';

interface HomePageProps {
  onOpenFiche: (adresse: Adresse) => void;
  onOpenQr: (adresse: Adresse) => void;
  pointItineraire: [number, number][] | undefined;
  setPointItineraire: (points: [number, number][] | undefined) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenFiche,
  onOpenQr,
  pointItineraire,
  setPointItineraire
}) => {
  const [codeRecherche, setCodeRecherche] = useState('');
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [adresses, setAdresses] = useState<Adresse[]>([]);
  const [adresseActive, setAdresseActive] = useState<Adresse | null>(null);
  const [filtreType, setFiltreType] = useState<string>('TOUS');
  const [centreMap, setCentreMap] = useState<[number, number]>([12.565, -16.272]); // Ziguinchor centre

  // Charger les adresses disponibles
  useEffect(() => {
    api.rechercherAdresses()
      .then((data) => {
        setAdresses(data);
        if (data.length > 0 && !adresseActive) {
          setAdresseActive(data[0]); // Sélectionner la première adresse par défaut
        }
      })
      .catch(() => {
        const cached = offlineStorage.recupererAdresses();
        setAdresses(cached);
        if (cached.length > 0) setAdresseActive(cached[0]);
      });
  }, []);

  // Résolution de code d'adresse
  const handleResoudre = async (codeToSearch?: string) => {
    const code = (codeToSearch || codeRecherche).trim().toUpperCase();
    if (!code) return;

    setLoading(true);
    setErreur(null);

    try {
      const adresse = await api.resoudreAdresse(code);
      setAdresseActive(adresse);
      setCentreMap([adresse.latitude, adresse.longitude]);
      // Rafraîchir la liste si elle n'y figure pas
      setAdresses((prev) => {
        if (!prev.some(a => a.codeSamaAdresse === adresse.codeSamaAdresse)) {
          return [adresse, ...prev];
        }
        return prev;
      });
    } catch (err: any) {
      setErreur(err.message || 'Adresse introuvable. Vérifiez le code (ex: ZIG-KBG-4271).');
    } finally {
      setLoading(false);
    }
  };

  // Filtrage par type
  const adressesAffichees = adresses.filter((a) => {
    if (filtreType === 'TOUS') return true;
    return a.typeLieu === filtreType;
  });

  return (
    <div className="space-y-4 pb-16 animate-fade-in max-w-3xl mx-auto">
      
      {/* 1. Barre de recherche principale moderne */}
      <section className="bg-white rounded-3xl p-3 shadow-sm border border-slate-200/80">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleResoudre(); }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1 flex items-center">
            <Search className="w-5 h-5 text-emerald-600 absolute left-3.5" />
            <input
              type="text"
              placeholder="Entrez un code (ex: ZIG-KBG-4271)..."
              value={codeRecherche}
              onChange={(e) => setCodeRecherche(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 font-bold tracking-wider pl-11 pr-4 py-3 rounded-2xl outline-none border border-transparent focus:border-emerald-500 focus:bg-white text-sm uppercase transition"
            />
            {codeRecherche && (
              <button 
                type="button" 
                onClick={() => setCodeRecherche('')}
                className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-sm px-5 py-3 rounded-2xl shadow-sm transition flex items-center gap-1.5"
          >
            <span>{loading ? 'Recherche...' : 'Résoudre'}</span>
          </button>
        </form>

        {/* Boutons d'exemples rapides (1 clic) */}
        <div className="flex items-center gap-2 pt-2 px-1 text-xs overflow-x-auto no-scrollbar">
          <span className="text-slate-400 font-medium text-[11px] flex-shrink-0">Exemples :</span>
          {[
            { code: 'ZIG-KBG-4271', label: 'Boucotte' },
            { code: 'ZIG-ESC-1042', label: 'Pharmacie Escale' },
            { code: 'ZIG-DIB-9031', label: 'Campus UASZ' },
            { code: 'ZIG-NEM-3024', label: 'Néma' }
          ].map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => {
                setCodeRecherche(item.code);
                handleResoudre(item.code);
              }}
              className="flex-shrink-0 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition border border-slate-200/60"
            >
              {item.code} <span className="text-slate-400">({item.label})</span>
            </button>
          ))}
        </div>

        {erreur && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{erreur}</span>
          </div>
        )}
      </section>

      {/* 2. Filtres par catégorie au-dessus de la carte */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold no-scrollbar">
        {[
          { id: 'TOUS', label: '📍 Toutes' },
          { id: 'DOMICILE', label: '🏠 Domiciles' },
          { id: 'SANTE', label: '🏥 Santé' },
          { id: 'COMMERCE', label: '🛒 Commerces' },
          { id: 'SERVICE_PUBLIC', label: '🏛️ Établissements' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFiltreType(tab.id)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full border transition ${
              filtreType === tab.id
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Carte interactive Leaflet */}
      <div className="relative rounded-3xl overflow-hidden shadow-sm border border-slate-200 bg-white">
        {pointItineraire && (
          <div className="absolute top-3 right-3 z-30 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 shadow-md border border-slate-200 flex items-center gap-2">
            <span>🚗 Itinéraire en cours</span>
            <button
              onClick={() => setPointItineraire(undefined)}
              className="text-rose-600 hover:text-rose-700 ml-1 font-extrabold"
              title="Fermer"
            >
              ✕
            </button>
          </div>
        )}

        <CarteLeaflet
          centre={centreMap}
          zoom={14}
          adresses={adressesAffichees}
          adresseSelectionnee={adresseActive}
          onSelectAdresse={(adr) => {
            setAdresseActive(adr);
            setCentreMap([adr.latitude, adr.longitude]);
          }}
          pointItineraire={pointItineraire}
          hauteur="360px"
        />
      </div>

      {/* 4. Fiche d'adresse active mise en valeur */}
      {adresseActive && (
        <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/90 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 shadow-xs">
                <img
                  src={adresseActive.photoFacadeUrl || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=300&q=80'}
                  alt={adresseActive.titre}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900">{adresseActive.titre}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {adresseActive.typeLieu}
                  </span>
                </div>
                <div className="text-emerald-700 font-mono font-black text-sm tracking-wide mt-0.5">
                  {adresseActive.codeSamaAdresse}
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{adresseActive.nomQuartier || 'Ziguinchor'}</span>
                  <span>· Titulaire : {adresseActive.nomProprietaireAffichable || 'Habitant'}</span>
                </p>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => onOpenFiche(adresseActive)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <Navigation className="w-4 h-4" />
                <span>Itinéraire & Détails</span>
              </button>

              <button
                onClick={() => onOpenQr(adresseActive)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-xl transition"
                title="Afficher QR Code"
              >
                <QrCode className="w-4 h-4 text-emerald-700" />
              </button>
            </div>
          </div>

          {/* Repères visuels */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-slate-900">📍 Repères visuels pour se repérer : </span>
            {adresseActive.descriptionRepere}
          </div>
        </section>
      )}

    </div>
  );
};
