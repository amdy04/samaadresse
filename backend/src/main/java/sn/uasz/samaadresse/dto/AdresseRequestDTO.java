package sn.uasz.samaadresse.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import sn.uasz.samaadresse.domain.TypeLieu;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdresseRequestDTO {

    @NotBlank(message = "Le titre de l'adresse est obligatoire")
    private String titre;

    @NotBlank(message = "La description des repères visuels est obligatoire")
    private String descriptionRepere;

    @NotNull(message = "Le type de lieu est obligatoire")
    private TypeLieu typeLieu;

    @NotNull(message = "La latitude est obligatoire")
    private Double latitude;

    @NotNull(message = "La longitude est obligatoire")
    private Double longitude;

    private Double precisionGpsMetres;

    private String nomProprietaireAffichable;

    private String photoFacadeBase64; // Image de façade envoyée par le smartphone
}
