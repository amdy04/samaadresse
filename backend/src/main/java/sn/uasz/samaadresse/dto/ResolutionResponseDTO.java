package sn.uasz.samaadresse.dto;

import lombok.*;
import sn.uasz.samaadresse.domain.TypeLieu;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResolutionResponseDTO {
    private String codeSamaAdresse;
    private String titre;
    private String descriptionRepere;
    private TypeLieu typeLieu;
    private Double latitude;
    private Double longitude;
    private String nomQuartier;
    private String codeRegion;
    private String photoFacadeUrl;
    private String qrCodeUrl;
    private String nomProprietaireAffichable;
    private String urlPartage;
}
