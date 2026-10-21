package sn.uasz.samaadresse.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.uasz.samaadresse.domain.Signalement;
import sn.uasz.samaadresse.repository.AdresseRepository;
import sn.uasz.samaadresse.repository.CommandePlaqueRepository;
import sn.uasz.samaadresse.repository.SignalementRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@Tag(name = "Administration", description = "Endpoints de modération et statistiques réservés au rôle ROLE_ADMIN")
public class AdminController {

    private final SignalementRepository signalementRepository;
    private final AdresseRepository adresseRepository;
    private final CommandePlaqueRepository commandePlaqueRepository;

    public AdminController(SignalementRepository signalementRepository,
                           AdresseRepository adresseRepository,
                           CommandePlaqueRepository commandePlaqueRepository) {
        this.signalementRepository = signalementRepository;
        this.adresseRepository = adresseRepository;
        this.commandePlaqueRepository = commandePlaqueRepository;
    }

    @GetMapping("/signalements")
    @Operation(summary = "Lister les signalements non traités")
    public ResponseEntity<List<Signalement>> getSignalementsEnAttente() {
        return ResponseEntity.ok(signalementRepository.findByTraiteFalseOrderByDateSignalementDesc());
    }

    @PatchMapping("/signalements/{id}/traiter")
    @Operation(summary = "Marquer un signalement comme traité")
    public ResponseEntity<Map<String, String>> traiterSignalement(@PathVariable Long id) {
        Signalement s = signalementRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Signalement non trouvé avec l'id : " + id));
        s.setTraite(true);
        signalementRepository.save(s);
        return ResponseEntity.ok(Map.of("message", "Signalement traité avec succès"));
    }

    @GetMapping("/stats")
    @Operation(summary = "Tableau de bord statistique : adresses créées, signalements, commandes de plaques")
    public ResponseEntity<Map<String, Object>> getStatistiques() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAdresses", adresseRepository.count());
        stats.put("totalCommandesPlaques", commandePlaqueRepository.count());
        stats.put("totalSignalementsEnAttente", signalementRepository.findByTraiteFalseOrderByDateSignalementDesc().size());
        return ResponseEntity.ok(stats);
    }
}
