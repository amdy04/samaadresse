export type TypeLieu = 'DOMICILE' | 'COMMERCE' | 'SERVICE_PUBLIC' | 'LIEU_DE_CULTE' | 'SANTE' | 'AUTRE';
export type StatutAdresse = 'ACTIVE' | 'EN_ATTENTE_VALIDATION' | 'SIGNALEE' | 'DESACTIVEE';

export interface Adresse {
  id?: number;
  codeSamaAdresse: string;
  titre: string;
  descriptionRepere: string;
  typeLieu: TypeLieu;
  latitude: number;
  longitude: number;
  precisionGpsMetres?: number;
  nomProprietaireAffichable?: string;
  photoFacadeUrl?: string;
  qrCodeUrl?: string;
  statut?: StatutAdresse;
  vuesCompteur?: number;
  nomQuartier?: string;
  codeRegion?: string;
  urlPartage?: string;
  dateCreation?: string;
}

export interface Quartier {
  id: number;
  codeRegion: string;
  trigramme: string;
  nom: string;
  centreLatitude: number;
  centreLongitude: number;
  rayonKm: number;
}

export interface UserProfile {
  id: number;
  nomComplet: string;
  telephone: string;
  email?: string;
  role: string;
}

export interface ItineraireResult {
  distanceKm: number;
  dureeMinutes: number;
  mode: string;
  points: [number, number][];
}
