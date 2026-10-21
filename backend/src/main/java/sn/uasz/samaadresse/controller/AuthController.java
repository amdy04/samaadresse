package sn.uasz.samaadresse.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import sn.uasz.samaadresse.domain.Utilisateur;
import sn.uasz.samaadresse.dto.AuthRequest;
import sn.uasz.samaadresse.dto.AuthResponse;
import sn.uasz.samaadresse.dto.RegisterRequest;
import sn.uasz.samaadresse.service.AuthService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentification", description = "Endpoints d'inscription, connexion et gestion de session JWT")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Inscription d'un nouvel utilisateur (Propriétaire / Citoyen)")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Connexion utilisateur avec téléphone et mot de passe")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @Operation(summary = "Récupérer le profil de l'utilisateur actuellement connecté")
    public ResponseEntity<Map<String, Object>> getProfile(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Utilisateur user = authService.getUtilisateurConnecte(authentication.getName());
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("nomComplet", user.getNomComplet());
        profile.put("telephone", user.getTelephone());
        profile.put("email", user.getEmail());
        profile.put("role", user.getRole().name());
        return ResponseEntity.ok(profile);
    }
}
