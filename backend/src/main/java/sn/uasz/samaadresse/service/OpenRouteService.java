package sn.uasz.samaadresse.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OpenRouteService {

    private final GeoGridService geoGridService;

    public OpenRouteService(GeoGridService geoGridService) {
        this.geoGridService = geoGridService;
    }

    /**
     * Calcule une estimation d'itinéraire routier (Distance, Durée en minutes, Points intermédiaires).
     */
    public Map<String, Object> estimerItineraire(double startLat, double startLng, double endLat, double endLng) {
        double distanceKm = geoGridService.calculerDistanceHaversine(startLat, startLng, endLat, endLng);
        
        // Vitesse moyenne en ville à Ziguinchor : ~25 km/h
        double dureeMinutes = (distanceKm / 25.0) * 60.0;
        if (dureeMinutes < 1.0) {
            dureeMinutes = 1.0;
        }

        Map<String, Object> resultat = new HashMap<>();
        resultat.put("distanceKm", Math.round(distanceKm * 100.0) / 100.0);
        resultat.put("dureeMinutes", Math.round(dureeMinutes));
        resultat.put("mode", "driving-car");

        // Échantillonnage de waypoints pour le tracé de la polyligne
        List<double[]> coordonnees = new ArrayList<>();
        coordonnees.add(new double[]{startLat, startLng});
        // Point médian pour donner un aspect de trajectoire naturelle
        double midLat = (startLat + endLat) / 2.0 + 0.0005;
        double midLng = (startLng + endLng) / 2.0 - 0.0003;
        coordonnees.add(new double[]{midLat, midLng});
        coordonnees.add(new double[]{endLat, endLng});

        resultat.put("points", coordonnees);
        return resultat;
    }
}
