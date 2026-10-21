import { Adresse, ItineraireResult, Quartier, UserProfile } from '../types';
import { offlineStorage } from './offlineStorage';

const BASE_URL = '/api/v1';

// Token JWT dans localStorage
const TOKEN_KEY = 'samaadresse_jwt_token';

export const api = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),

  getHeaders: () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = api.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  // 1. Résolution de code (avec support hors ligne automatique)
  resoudreAdresse: async (code: string): Promise<Adresse> => {
    try {
      const response = await fetch(`${BASE_URL}/public/resolve/${encodeURIComponent(code)}`);
      if (!response.ok) {
        throw new Error('Code introuvable sur le serveur');
      }
      const data: Adresse = await response.json();
      // Mettre en cache pour consultation hors ligne
      offlineStorage.sauvegarderAdresse(data);
      return data;
    } catch (err) {
      // Tenter la résolution depuis le cache local si hors-ligne !
      const cached = offlineStorage.trouverParCode(code);
      if (cached) {
        console.log('[API] Récupéré depuis le cache hors ligne !', cached);
        return cached;
      }
      throw err;
    }
  },

  // 2. Recherche annuaire public
  rechercherAdresses: async (query?: string): Promise<Adresse[]> => {
    try {
      const url = query ? `${BASE_URL}/public/search?query=${encodeURIComponent(query)}` : `${BASE_URL}/public/search`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Erreur de recherche');
      return await response.json();
    } catch (err) {
      // Fallback hors ligne : recherche dans le cache
      const cached = offlineStorage.recupererAdresses();
      if (!query) return cached;
      const q = query.toLowerCase();
      return cached.filter(a => 
        a.codeSamaAdresse.toLowerCase().includes(q) ||
        a.titre.toLowerCase().includes(q) ||
        a.descriptionRepere.toLowerCase().includes(q)
      );
    }
  },

  // 3. Calcul d'itinéraire
  calculerItineraire: async (startLat: number, startLng: number, endLat: number, endLng: number): Promise<ItineraireResult> => {
    const url = `${BASE_URL}/public/itineraire?startLat=${startLat}&startLng=${startLng}&endLat=${endLat}&endLng=${endLng}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Impossible de calculer l’itinéraire');
    return await response.json();
  },

  // 4. Création d'une nouvelle adresse
  creerAdresse: async (payload: {
    titre: string;
    descriptionRepere: string;
    typeLieu: string;
    latitude: number;
    longitude: number;
    precisionGpsMetres?: number;
    nomProprietaireAffichable?: string;
    photoFacadeBase64?: string;
  }): Promise<Adresse> => {
    const response = await fetch(`${BASE_URL}/adresses`, {
      method: 'POST',
      headers: api.getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || 'Erreur lors de la création de l’adresse');
    }
    const data: Adresse = await response.json();
    offlineStorage.sauvegarderAdresse(data);
    return data;
  },

  // 5. Partage par SMS
  partagerParSms: async (codeSamaAdresse: string, telephoneDestinataire: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/public/share/sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codeSamaAdresse, telephoneDestinataire })
    });
    if (!response.ok) throw new Error('Erreur lors de l’envoi du SMS');
  },

  // 6. Commande de plaque physique (Wave Sandbox)
  commanderPlaque: async (codeSamaAdresse: string, telephoneLivraison: string, montant: number = 5000) => {
    const response = await fetch(`${BASE_URL}/adresses/commande-plaque`, {
      method: 'POST',
      headers: api.getHeaders(),
      body: JSON.stringify({ codeSamaAdresse, telephoneLivraison, montant })
    });
    if (!response.ok) throw new Error('Erreur lors de la commande de la plaque');
    return await response.json();
  },

  // 7. Liste des quartiers
  getQuartiers: async (): Promise<Quartier[]> => {
    try {
      const res = await fetch(`${BASE_URL}/quartiers`);
      return await res.json();
    } catch {
      return [];
    }
  },

  // 8. Inscription & Connexion
  login: async (telephone: string, motDePasse: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telephone, motDePasse })
    });
    if (!res.ok) throw new Error('Identifiants invalides');
    const data = await res.json();
    api.setToken(data.token);
    return data;
  },

  register: async (nomComplet: string, telephone: string, motDePasse: string, email?: string) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nomComplet, telephone, motDePasse, email })
    });
    if (!res.ok) throw new Error('Numéro de téléphone déjà utilisé');
    const data = await res.json();
    api.setToken(data.token);
    return data;
  },

  getProfile: async (): Promise<UserProfile | null> => {
    const token = api.getToken();
    if (!token) return null;
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, { headers: api.getHeaders() });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
};
