import React, { useState, useEffect } from 'react';
import { Search, MapPin, QrCode, Navigation, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { Adresse, ItineraireResult } from '../types';
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
  const [adressesRecentes, setAdressesRecentes] = useState<Adresse[]>([]);
  const [adressesMap, setAdressesMap] = useState<Adresse[]>([]);
  const [centreMap, setCentreMap] = useState<[number, number]>([12.565, -16.272]); // Ziguinchor

  // Charger les adresses du cache hors ligne et les adresses par défaut
  useEffect(() => {
    const cached = offlineStorage.recupererAdresses();
    setAdressesRecentes(cached);

    // Charger les adresses disponibles sur le serveur pour la carte
    api.rechercherAdresses()
      .then((data) => {
        setAdressesMap(data);
      })
      .catch(() => {
        // En mode hors ligne, utiliser les adresses en cache
        setAdressesMap(cached);
      });
  }, []);

  const handleResoudreCode = async (codeToResolve?: string) => {
    const code = (codeToResolve || codeRecherche).trim().toUpperCase();
    if (!code) return;

    setLoading(true);
    setErreur(null);

    try {
      const adresse = await api.resoudreAdresse(code);
      setCentreMap([adresse.latitude, adresse.longitude]);
      onOpenFiche(adresse);
      // Mettre à jour la liste des adresses récentes
      setAdressesRecentes(offlineStorage.recupererAdresses());
    } catch (err: any) {
      setErreur(err.message || 'Impossible de trouver cette adresse.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 pb-10">
      
      {/* Hero Banner & Résolveur de Code */}
      <section className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-lg space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold backdrop-blur border border-emerald-400/20">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Système d'adressage souverain du Sénégal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Trouvez ou partagez une adresse précise à la porte près.
          </h1>

          <p className="text-emerald-100/90 text-xs sm:text-sm">
            Fini les repères approximatifs. Un code court type <code className="bg-emerald-900/60 px-1.5 py-0.5 rounded font-mono font-bold text-white">ZIG-KBG-4271</code> suffit pour localiser n'importe quel bâtiment.
          </p>

          {/* Formulaire de saisie du Code */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleResoudreCode(); }}
            className="pt-2 flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Ex: ZIG-KBG-4271 ou KBG-4271"
                value={codeRecherche}
                onChange={(e) => setCodeRecherche(e.target.value)}
                className="w-full bg-white text-slate-900 placeholder-slate-400 font-bold tracking-wider px-4 py-3 rounded-2xl outline-none border-2 border-transparent focus:border-emerald-400 shadow-md text-sm uppercase"
              />
              <span className="absolute right-3 top-3 text-slate-400 text-xs">📍</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-extrabold text-sm px-5 py-3 rounded-2xl shadow-md transition flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Recherche...' : 'Résoudre'}</span>
            </button>
          </form>

          {/* Suggestions d'adresses démo pour le jury */}
          <div className="pt-1 flex items-center gap-1.5 flex-wrap text-[11px] text-emerald-200">
            <span className="font-semibold">Exemples démo :</span>
            {['ZIG-KBG-4271', 'ZIG-ESC-1042', 'ZIG-DIB-9031'].map((code) => (
              <button
                key={code}
                onClick={() => { setCodeRecherche(code); handleResoudreCode(code); }}
                className="bg-emerald-900/50 hover:bg-emerald-900/80 px-2 py-0.5 rounded-lg border border-emerald-400/20 font-mono text-white transition"
              >
                {code}
              </button>
            ))}
          </div>

          {erreur && (
            <div className="p-3 bg-rose-500/20 border border-rose-400/30 rounded-xl text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-300" />
              <span>{erreur}</span>
            </div>
          )}
        </div>
      </section>

      {/* Carte interactive Leaflet */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Carte interactive de Ziguinchor</span>
          </h2>
          {pointItineraire && (
            <button
              onClick={() => setPointItineraire(undefined)}
              className="text-xs text-rose-600 hover:underline font-semibold"
            >
              Effacer l'itinéraire
            </button>
          )}
        </div>

        <CarteLeaflet
          centre={centreMap}
          zoom={14}
          adresses={adressesMap}
          onSelectAdresse={(adr) => onOpenFiche(adr)}
          pointItineraire={pointItineraire}
          hauteur="380px"
        />
      </section>

      {/* Adresses récemment consultées / Disponibles hors ligne */}
      {adressesRecentes.length > 0 && (
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Consultées récemment (Disponibles Hors Ligne)</span>
            </h3>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {adressesRecentes.length} en cache
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {adressesRecentes.slice(0, 4).map((adr) => (
              <div
                key={adr.codeSamaAdresse}
                onClick={() => onOpenFiche(adr)}
                className="bg-white border border-slate-200/80 hover:border-emerald-300 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition shadow-sm hover:shadow active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                    <img
                      src={adr.photoFacadeUrl || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=150&q=80'}
                      alt={adr.titre}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{adr.titre}</h4>
                    <p className="text-[11px] text-slate-500 font-mono font-semibold text-emerald-700">
                      {adr.codeSamaAdresse}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[170px]">
                      {adr.nomQuartier || 'Ziguinchor'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); onOpenQr(adr); }}
                  className="p-2 text-slate-400 hover:text-emerald-700 rounded-xl hover:bg-emerald-50 transition"
                  title="Afficher QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
