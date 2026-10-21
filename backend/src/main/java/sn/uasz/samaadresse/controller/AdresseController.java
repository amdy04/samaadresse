package sn.uasz.samaadresse.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import sn.uasz.samaadresse.domain.CommandePlaque;
import sn.uasz.samaadresse.domain.Utilisateur;
import sn.uasz.samaadresse.dto.AdresseRequestDTO;
import sn.uasz.samaadresse.dto.AdresseResponseDTO;
import sn.uasz.samaadresse.dto.CommandePlaqueRequestDTO;
import sn.uasz.samaadresse.service.AdresseService;
import sn.uasz.samaadresse.service.AuthService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/adresses")
@Tag(name = "Espace Propriétaire - Adresses", description = "Gestion des adresses personnelles et commande de plaques physiques")
public class AdresseController {

    private final AdresseService adresseService;
    private final AuthService authService;

    public AdresseController(AdresseService adresseService, AuthService authService) {
        this.adresseService = adresseService;
        this.authService = authService;
    }

    @PostMapping
    @Operation(summary = "Créer une nouvelle SamaAdresse à partir de la position GPS capturée")
    public ResponseEntity<AdresseResponseDTO> creerAdresse(
            @Valid @RequestBody AdresseRequestDTO request,
            Authentication authentication) {
        Utilisateur user = authService.getUtilisateurConnecte(authentication.getName());
        AdresseResponseDTO response = adresseService.creerAdresse(request, user);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/mes-adresses")
    @Operation(summary = "Lister toutes les adresses créées par l'utilisateur connecté")
    public ResponseEntity<List<AdresseResponseDTO>> getMesAdresses(Authentication authentication) {
        Utilisateur user = authService.getUtilisateurConnecte(authentication.getName());
        List<AdresseResponseDTO> adresses = adresseService.getMesAdresses(user.getId());
        return ResponseEntity.ok(adresses);
    }

    @PostMapping("/commande-plaque")
    @Operation(summary = "Commander une plaque physique gravée avec simulation Wave Sandbox")
    public ResponseEntity<CommandePlaque> commanderPlaque(
            @Valid @RequestBody CommandePlaqueRequestDTO request,
            Authentication authentication) {
        Utilisateur user = authService.getUtilisateurConnecte(authentication.getName());
        CommandePlaque commande = adresseService.commanderPlaque(request, user);
        return new ResponseEntity<>(commande, HttpStatus.CREATED);
    }
}
