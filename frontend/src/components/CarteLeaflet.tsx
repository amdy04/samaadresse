import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Adresse } from '../types';

interface CarteLeafletProps {
  centre: [number, number];
  zoom?: number;
  adresses?: Adresse[];
  adresseSelectionnee?: Adresse | null;
  onSelectAdresse?: (adresse: Adresse) => void;
  pointItineraire?: [number, number][]; // Polyligne de route
  positionUtilisateur?: [number, number] | null;
  hauteur?: string;
}

export const CarteLeaflet: React.FC<CarteLeafletProps> = ({
  centre,
  zoom = 14,
  adresses = [],
  adresseSelectionnee,
  onSelectAdresse,
  pointItineraire,
  positionUtilisateur,
  hauteur = '400px'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialisation de la carte Leaflet
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView(centre, zoom);

      // Fond de carte OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> UASZ',
        maxZoom: 19
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView(centre, zoom);
    }
  }, [centre, zoom]);

  // Mise à jour des marqueurs
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // Marqueur de position de l'utilisateur (bleu pulsing)
    if (positionUtilisateur) {
      const userIcon = L.divIcon({
        className: 'user-marker',
        html: `<div style="background-color: #2563eb; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(37,99,235,0.8);"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });
      L.marker(positionUtilisateur, { icon: userIcon })
        .bindPopup('<b>Votre position actuelle</b>')
        .addTo(markersLayerRef.current);
    }

    // Marqueurs des adresses (vert émeraude SamaAdresse)
    adresses.forEach((adr) => {
      const isSelected = adresseSelectionnee?.codeSamaAdresse === adr.codeSamaAdresse;
      const markerHtml = `
        <div style="background-color: ${isSelected ? '#dc2626' : '#15803d'}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 4px; white-space: nowrap;">
          <span>📍</span> ${adr.codeSamaAdresse}
        </div>
      `;
      const icon = L.divIcon({
        className: 'custom-pin',
        html: markerHtml,
        iconSize: [100, 24],
        iconAnchor: [50, 12]
      });

      const marker = L.marker([adr.latitude, adr.longitude], { icon });
      marker.on('click', () => {
        if (onSelectAdresse) onSelectAdresse(adr);
      });
      marker.addTo(markersLayerRef.current!);
    });

    // Tracé de l'itinéraire routier si fourni
    if (pointItineraire && pointItineraire.length > 1) {
      if (routeLayerRef.current) {
        routeLayerRef.current.remove();
      }
      routeLayerRef.current = L.polyline(pointItineraire, {
        color: '#2563eb',
        weight: 5,
        opacity: 0.85,
        dashArray: '8, 8'
      }).addTo(mapInstanceRef.current);

      mapInstanceRef.current.fitBounds(routeLayerRef.current.getBounds(), { padding: [40, 40] });
    } else if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }
  }, [adresses, adresseSelectionnee, positionUtilisateur, pointItineraire, onSelectAdresse]);

  return (
    <div 
      ref={mapContainerRef} 
      style={{ height: hauteur, width: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
    />
  );
};
