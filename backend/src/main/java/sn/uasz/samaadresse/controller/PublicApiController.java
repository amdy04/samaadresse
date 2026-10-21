package sn.uasz.samaadresse.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.uasz.samaadresse.domain.TypeLieu;
import sn.uasz.samaadresse.dto.AdresseResponseDTO;
import sn.uasz.samaadresse.dto.ResolutionResponseDTO;
import sn.uasz.samaadresse.dto.SignalementRequestDTO;
import sn.uasz.samaadresse.dto.SmsShareRequestDTO;
import sn.uasz.samaadresse.service.AdresseService;
import sn.uasz.samaadresse.service.OpenRouteService;
import sn.uasz.samaadresse.service.SmsService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/public")
@Tag(name = "API Publique SamaAdresse", description = "Endpoints publics ouverts pour résolution de codes, annuaire, itinéraire et partage")
public class PublicApiController {

    private final AdresseService adresseService;
    private final OpenRouteService openRouteService;
    private final SmsService smsService;

    public PublicApiController(AdresseService adresseService,
                               OpenRouteService openRouteService,
                               SmsService smsService) {
        this.adresseService = adresseService;
        this.openRouteService = openRouteService;
        this.smsService = smsService;
    }

    @GetMapping("/resolve/{code}")
    @Operation(summary = "Résoudre un code SamaAdresse en coordonnées GPS, photo et repères")
    public ResponseEntity<?> resoudreCode(@PathVariable String code) {
        try {
            ResolutionResponseDTO dto = adresseService.resoudreAdresse(code.trim().toUpperCase());
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage(), "code", code));
        }
    }

    @GetMapping("/search")
    @Operation(summary = "Recherche textuelle dans l'annuaire d'adresses publiques (par code, quartier, repère, nom)")
    public ResponseEntity<List<AdresseResponseDTO>> rechercher(@RequestParam(required = false) String query) {
        List<AdresseResponseDTO> resultats = adresseService.rechercherAdresses(query);
        return ResponseEntity.ok(resultats);
    }

    @GetMapping("/filter")
    @Operation(summary = "Filtrer les adresses par quartier et type de lieu")
    public ResponseEntity<List<AdresseResponseDTO>> filtrer(
            @RequestParam(required = false) Long quartierId,
            @RequestParam(required = false) TypeLieu typeLieu) {
        List<AdresseResponseDTO> resultats = adresseService.filtrerAdresses(quartierId, typeLieu);
        return ResponseEntity.ok(resultats);
    }

    @GetMapping("/itineraire")
    @Operation(summary = "Calculer l'itinéraire entre la position actuelle du client et l'adresse cible")
    public ResponseEntity<Map<String, Object>> calculerItineraire(
            @RequestParam double startLat,
            @RequestParam double startLng,
            @RequestParam double endLat,
            @RequestParam double endLng) {
        Map<String, Object> itineraire = openRouteService.estimerItineraire(startLat, startLng, endLat, endLng);
        return ResponseEntity.ok(itineraire);
    }

    @PostMapping("/signalement")
    @Operation(summary = "Signaler une adresse avec coordonnées inexactes ou contenu inapproprié")
    public ResponseEntity<Map<String, String>> signalerAdresse(@Valid @RequestBody SignalementRequestDTO dto) {
        adresseService.signalerAdresse(dto);
        return ResponseEntity.ok(Map.of("message", "Signalement enregistré avec succès. Merci pour votre contribution."));
    }

    @PostMapping("/share/sms")
    @Operation(summary = "Partager une adresse par SMS automatique (Simulation SendFlash / Twilio Sandbox)")
    public ResponseEntity<Map<String, String>> partagerParSms(@Valid @RequestBody SmsShareRequestDTO dto) {
        ResolutionResponseDTO adresse = adresseService.resoudreAdresse(dto.getCodeSamaAdresse());
        smsService.envoyerSmsPartage(dto.getTelephoneDestinataire(), adresse.getCodeSamaAdresse(), adresse.getUrlPartage());
        return ResponseEntity.ok(Map.of("message", "SMS de partage envoyé au " + dto.getTelephoneDestinataire()));
    }
}
