package sn.uasz.samaadresse.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import sn.uasz.samaadresse.domain.Quartier;
import sn.uasz.samaadresse.repository.QuartierRepository;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class GeoGridServiceTest {

    private QuartierRepository quartierRepository;
    private GeoGridService geoGridService;

    @BeforeEach
    void setUp() {
        quartierRepository = Mockito.mock(QuartierRepository.class);
        geoGridService = new GeoGridService(quartierRepository);

        Quartier boucotte = Quartier.builder()
                .id(1L)
                .codeRegion("ZIG")
                .trigramme("KBG")
                .nom("Kandialang / Boucotte Grand")
                .centreLatitude(12.5584)
                .centreLongitude(-16.2731)
                .rayonKm(3.0)
                .build();

        Quartier escale = Quartier.builder()
                .id(2L)
                .codeRegion("ZIG")
                .trigramme("ESC")
                .nom("Escale")
                .centreLatitude(12.5833)
                .centreLongitude(-16.2719)
                .rayonKm(2.5)
                .build();

        when(quartierRepository.findAll()).thenReturn(List.of(boucotte, escale));
    }

    @Test
    void testDetecterQuartierPlusProche_Boucotte() {
        // Point proche de Boucotte
        Quartier q = geoGridService.detecterQuartierPlusProche(12.5580, -16.2730);
        assertNotNull(q);
        assertEquals("KBG", q.getTrigramme());
    }

    @Test
    void testDetecterQuartierPlusProche_Escale() {
        // Point proche d'Escale
        Quartier q = geoGridService.detecterQuartierPlusProche(12.5830, -16.2720);
        assertNotNull(q);
        assertEquals("ESC", q.getTrigramme());
    }

    @Test
    void testGenererCodeAdresse_FormatValide() {
        String code = geoGridService.genererCodeAdresse(12.5584, -16.2731);
        assertNotNull(code);
        assertTrue(code.startsWith("ZIG-KBG-"), "Le code doit commencer par la région et le quartier : " + code);
        assertEquals(3, code.split("-").length, "Le code doit contenir 3 segments séparés par un tiret");
    }

    @Test
    void testCalculerDistanceHaversine() {
        // Distance entre deux points connus
        double dist = geoGridService.calculerDistanceHaversine(12.5584, -16.2731, 12.5833, -16.2719);
        assertTrue(dist > 2.0 && dist < 4.0, "La distance entre Boucotte et Escale doit être d'environ 2.7 km");
    }

    @Test
    void testEncoderCellule_Deterministe() {
        String code1 = geoGridService.encoderCellule(12.5584, -16.2731, 12.5584, -16.2731);
        String code2 = geoGridService.encoderCellule(12.5584, -16.2731, 12.5584, -16.2731);
        assertEquals(code1, code2, "L'encodage doit être 100% déterministe pour les mêmes coordonnées");
        assertEquals(4, code1.length(), "L'identifiant de cellule doit faire 4 caractères");
    }
}
