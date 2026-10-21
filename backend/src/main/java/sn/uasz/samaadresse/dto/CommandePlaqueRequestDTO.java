package sn.uasz.samaadresse.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommandePlaqueRequestDTO {

    @NotBlank(message = "Le code SamaAdresse est obligatoire")
    private String codeSamaAdresse;

    @NotBlank(message = "Le numéro pour la livraison est obligatoire")
    private String telephoneLivraison;

    private Double montant; // Ex: 5000 FCFA
}
