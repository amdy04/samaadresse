package sn.uasz.samaadresse.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignalementRequestDTO {

    @NotBlank(message = "Le code de l'adresse signalée est obligatoire")
    private String codeSamaAdresse;

    @NotBlank(message = "Le motif du signalement est obligatoire")
    private String motif;

    @NotBlank(message = "Les détails du signalement sont obligatoires")
    private String details;

    private String contactSignaleur;
}
