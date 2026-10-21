package sn.uasz.samaadresse.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import sn.uasz.samaadresse.domain.TypeLieu;
import sn.uasz.samaadresse.dto.ResolutionResponseDTO;
import sn.uasz.samaadresse.service.AdresseService;
import sn.uasz.samaadresse.service.OpenRouteService;
import sn.uasz.samaadresse.service.SmsService;

import java.util.Map;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class PublicApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AdresseService adresseService;

    @MockBean
    private OpenRouteService openRouteService;

    @MockBean
    private SmsService smsService;

    @Test
    void testResoudreCode_Succes() throws Exception {
        ResolutionResponseDTO dto = ResolutionResponseDTO.builder()
                .codeSamaAdresse("ZIG-KBG-4271")
                .titre("Maison Diallo")
                .descriptionRepere("Grande porte bleue, face école primaire")
                .typeLieu(TypeLieu.DOMICILE)
                .latitude(12.5584)
                .longitude(-16.2731)
                .nomQuartier("Kandialang / Boucotte Grand")
                .codeRegion("ZIG")
                .photoFacadeUrl("https://images.example.com/photo.jpg")
                .qrCodeUrl("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...")
                .nomProprietaireAffichable("Amadou Diallo")
                .urlPartage("https://samaadresse.sn/adresses/ZIG-KBG-4271")
                .build();

        when(adresseService.resoudreAdresse("ZIG-KBG-4271")).thenReturn(dto);

        mockMvc.perform(get("/api/v1/public/resolve/ZIG-KBG-4271")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.codeSamaAdresse").value("ZIG-KBG-4271"))
                .andExpect(jsonPath("$.nomQuartier").value("Kandialang / Boucotte Grand"))
                .andExpect(jsonPath("$.latitude").value(12.5584))
                .andExpect(jsonPath("$.longitude").value(-16.2731));
    }

    @Test
    void testCalculerItineraire_Succes() throws Exception {
        Map<String, Object> mockItineraire = Map.of(
                "distanceKm", 2.45,
                "dureeMinutes", 6,
                "mode", "driving-car"
        );

        when(openRouteService.estimerItineraire(12.55, -16.27, 12.58, -16.28))
                .thenReturn(mockItineraire);

        mockMvc.perform(get("/api/v1/public/itineraire")
                        .param("startLat", "12.55")
                        .param("startLng", "-16.27")
                        .param("endLat", "12.58")
                        .param("endLng", "-16.28")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.distanceKm").value(2.45))
                .andExpect(jsonPath("$.dureeMinutes").value(6));
    }
}
