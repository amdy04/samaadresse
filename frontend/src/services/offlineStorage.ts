import { Adresse } from '../types';

const OFFLINE_KEY = 'samaadresse_offline_adresses';

export const offlineStorage = {
  // Sauvegarde une adresse consultée pour lecture hors ligne
  sauvegarderAdresse: (adresse: Adresse): void => {
    try {
      const existantes = offlineStorage.recupererAdresses();
      // Filtrer si déjà présente
      const sansDoublon = existantes.filter(a => a.codeSamaAdresse !== adresse.codeSamaAdresse);
      // Mettre la plus récente en premier (max 30 adresses en cache local)
      const nouvelleListe = [adresse, ...sansDoublon].slice(0, 30);
      localStorage.setItem(OFFLINE_KEY, JSON.stringify(nouvelleListe));
    } catch (e) {
      console.warn('Impossible de sauvegarder dans le cache local :', e);
    }
  },

  // Récupère toutes les adresses en cache
  recupererAdresses: (): Adresse[] => {
    try {
      const data = localStorage.getItem(OFFLINE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  // Cherche une adresse par code dans le cache local
  trouverParCode: (code: string): Adresse | undefined => {
    const adresses = offlineStorage.recupererAdresses();
    return adresses.find(a => a.codeSamaAdresse.toUpperCase() === code.toUpperCase());
  }
};
