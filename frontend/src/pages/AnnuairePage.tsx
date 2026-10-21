import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, QrCode } from 'lucide-react';
import { Adresse, Quartier, TypeLieu } from '../types';
import { api } from '../services/api';

interface AnnuairePageProps {
  onOpenFiche: (adresse: Adresse) => void;
  onOpenQr: (adresse: Adresse) => void;
}

export const AnnuairePage: React.FC<AnnuairePageProps> = ({ onOpenFiche, onOpenQr }) => {
  const [adresses, setAdresses] = useState<Adresse[]>([]);
  const [quartiers, setQuartiers] = useState<Quartier[]>([]);
  const [query, setQuery] = useState('');
  const [selectedQuartier, setSelectedQuartier] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    chargerAdresses();
    api.getQuartiers().then(setQuartiers);
  }, []);

  const chargerAdresses = async () => {
    setLoading(true);
    try {
      const data = await api.rechercherAdresses(query);
      setAdresses(data);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    chargerAdresses();
  };

  // Filtrage local supplémentaire
  const adressesFiltrees = adresses.filter((a) => {
    const matchQuartier = !selectedQuartier || a.nomQuartier === selectedQuartier;
    const matchType = !selectedType || a.typeLieu === selectedType;
    return matchQuartier && matchType;
  });

  return (
    <div className="space-y-4 pb-12 animate-fade-in">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Annuaire Public des Adresses</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Recherchez par nom de famille, commerce, code ou quartier de Ziguinchor.
        </p>
      </div>

      {/* Barre de Recherche */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Rechercher (ex: Diallo, pharmacie, KBG-4271...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-sm transition"
        >
          Chercher
        </button>
      </form>

      {/* Filtres par Quartier et Type */}
      <div className="flex gap-2 text-xs">
        <select
          value={selectedQuartier}
          onChange={(e) => setSelectedQuartier(e.target.value)}
          className="flex-1 py-2 px-3 rounded-xl border border-slate-300 bg-white text-slate-700 outline-none"
        >
          <option value="">Tous les quartiers</option>
          {quartiers.map((q) => (
            <option key={q.id} value={q.nom}>{q.nom}</option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="flex-1 py-2 px-3 rounded-xl border border-slate-300 bg-white text-slate-700 outline-none"
        >
          <option value="">Tous types de lieux</option>
          <option value="DOMICILE">Domicile</option>
          <option value="COMMERCE">Commerce</option>
          <option value="SERVICE_PUBLIC">Service Public</option>
          <option value="SANTE">Santé</option>
          <option value="LIEU_DE_CULTE">Lieu de culte</option>
        </select>
      </div>

      {/* Liste des Résultats */}
      <div className="space-y-3 pt-1">
        {loading ? (
          <div className="text-center py-10 text-xs text-slate-400">Chargement de l'annuaire...</div>
        ) : adressesFiltrees.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-slate-500 text-xs border border-dashed border-slate-300">
            Aucune adresse trouvée pour ces critères de recherche.
          </div>
        ) : (
          adressesFiltrees.map((adr) => (
            <div
              key={adr.codeSamaAdresse}
              onClick={() => onOpenFiche(adr)}
              className="bg-white border border-slate-200/90 hover:border-emerald-400 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition shadow-sm hover:shadow active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 shadow-inner">
                  <img
                    src={adr.photoFacadeUrl || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=200&q=80'}
                    alt={adr.titre}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">{adr.titre}</h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {adr.typeLieu}
                    </span>
                  </div>
                  <div className="text-xs font-mono font-extrabold text-emerald-700 tracking-wide mt-0.5">
                    {adr.codeSamaAdresse}
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    {adr.nomQuartier || 'Ziguinchor'}
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); onOpenQr(adr); }}
                className="p-2.5 text-slate-400 hover:text-emerald-700 rounded-xl hover:bg-emerald-50 transition"
                title="QR Code"
              >
                <QrCode className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
