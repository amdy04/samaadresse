package sn.uasz.samaadresse.service;

import org.springframework.stereotype.Service;
import sn.uasz.samaadresse.domain.Quartier;
import sn.uasz.samaadresse.repository.QuartierRepository;

import java.util.List;

@Service
public class GeoGridService {

    // Base32 Alphabet sans caractères ambigus (évite 0, O, 1, I, L)
    private static final String ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
    private static final double EARTH_RADIUS_KM = 6371.0;
    // Une cellule de 5 mètres correspond à environ 0.000045 degrés de latitude/longitude
    private static final double CELL_SIZE_DEG = 0.000045; 

    private final QuartierRepository quartierRepository;

    public GeoGridService(QuartierRepository quartierRepository) {
        this.quartierRepository = quartierRepository;
    }

    /**
     * Calcule le quartier le plus proche d'un point GPS par distance de Haversine.
     */
    public Quartier detecterQuartierPlusProche(double latitude, double longitude) {
        List<Quartier> quartiers = quartierRepository.findAll();
        if (quartiers.isEmpty()) {
            return Quartier.builder()
                    .codeRegion("ZIG")
                    .trigramme("CTR")
                    .nom("Centre-ville")
                    .centreLatitude(12.5700)
                    .centreLongitude(-16.2700)
                    .rayonKm(5.0)
                    .build();
        }

        Quartier plusProche = quartiers.get(0);
        double minDistance = calculerDistanceHaversine(latitude, longitude, plusProche.getCentreLatitude(), plusProche.getCentreLongitude());

        for (Quartier q : quartiers) {
            double dist = calculerDistanceHaversine(latitude, longitude, q.getCentreLatitude(), q.getCentreLongitude());
            if (dist < minDistance) {
                minDistance = dist;
                plusProche = q;
            }
        }
        return plusProche;
    }

    /**
     * Génère un code d'adresse court type "ZIG-KBG-4271"
     */
    public String genererCodeAdresse(double latitude, double longitude) {
        Quartier quartier = detecterQuartierPlusProche(latitude, longitude);
        String celluleId = encoderCellule(latitude, longitude, quartier.getCentreLatitude(), quartier.getCentreLongitude());
        return String.format("%s-%s-%s", quartier.getCodeRegion(), quartier.getTrigramme(), celluleId);
    }

    /**
     * Encode l'écart relatif (dx, dy) au centre du quartier en 4 caractères Base32 mémorisables.
     */
    public String encoderCellule(double lat, double lng, double centreLat, double centreLng) {
        // Décalage en nombre de cellules de 5m
        long xIndex = Math.round((lng - centreLng) / CELL_SIZE_DEG) + 10000L;
        long yIndex = Math.round((lat - centreLat) / CELL_SIZE_DEG) + 10000L;

        // Combiner en un hash positif
        long combined = ((xIndex & 0xFFFF) << 16) | (yIndex & 0xFFFF);

        // Extraire 4 caractères du dictionnaire
        StringBuilder sb = new StringBuilder();
        long temp = combined;
        for (int i = 0; i < 4; i++) {
            int index = (int) (temp % ALPHABET.length());
            sb.append(ALPHABET.charAt(Math.abs(index)));
            temp /= ALPHABET.length();
        }
        return sb.reverse().toString();
    }

    /**
     * Formule de Haversine pour distance à vol d'oiseau en kilomètres.
     */
    public double calculerDistanceHaversine(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }
}
