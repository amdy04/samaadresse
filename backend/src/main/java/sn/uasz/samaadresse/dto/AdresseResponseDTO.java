package sn.uasz.samaadresse.dto;

import lombok.*;
import sn.uasz.samaadresse.domain.StatutAdresse;
import sn.uasz.samaadresse.domain.TypeLieu;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdresseResponseDTO {
    private Long id;
    private String codeSamaAdresse;
    private String titre;
    private String descriptionRepere;
    private TypeLieu typeLieu;
    private Double latitude;
    private Double longitude;
    private Double precisionGpsMetres;
    private String nomProprietaireAffichable;
    private String photoFacadeUrl;
    private String qrCodeUrl;
    private StatutAdresse statut;
    private Long vuesCompteur;
    private String nomQuartier;
    private String codeRegion;
    private LocalDateTime dateCreation;
}
