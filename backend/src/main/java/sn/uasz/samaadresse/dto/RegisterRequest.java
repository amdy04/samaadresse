package sn.uasz.samaadresse.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    @NotBlank(message = "Le nom complet est obligatoire")
    private String nomComplet;

    @NotBlank(message = "Le numéro de téléphone est obligatoire")
    private String telephone;

    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    private String motDePasse;
}
