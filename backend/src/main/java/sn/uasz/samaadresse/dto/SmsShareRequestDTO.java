package sn.uasz.samaadresse.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SmsShareRequestDTO {

    @NotBlank(message = "Le code d'adresse est obligatoire")
    private String codeSamaAdresse;

    @NotBlank(message = "Le numéro du destinataire est obligatoire")
    private String telephoneDestinataire;
}
