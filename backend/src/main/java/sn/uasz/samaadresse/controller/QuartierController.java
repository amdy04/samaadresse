package sn.uasz.samaadresse.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.uasz.samaadresse.domain.Quartier;
import sn.uasz.samaadresse.repository.QuartierRepository;

import java.util.List;

@RestController
@RequestMapping("/api/v1/quartiers")
@Tag(name = "Référentiel Quartiers", description = "Consultation du maillage territorial de Ziguinchor")
public class QuartierController {

    private final QuartierRepository quartierRepository;

    public QuartierController(QuartierRepository quartierRepository) {
        this.quartierRepository = quartierRepository;
    }

    @GetMapping
    @Operation(summary = "Lister tous les quartiers référencés avec leurs coordonnées centrales")
    public ResponseEntity<List<Quartier>> listerQuartiers() {
        return ResponseEntity.ok(quartierRepository.findAll());
    }
}
