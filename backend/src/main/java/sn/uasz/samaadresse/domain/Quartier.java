package sn.uasz.samaadresse.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "quartiers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quartier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 10)
    private String codeRegion; // e.g. "ZIG"

    @Column(nullable = false, unique = true, length = 10)
    private String trigramme; // e.g. "KBG"

    @Column(nullable = false, length = 100)
    private String nom; // e.g. "Kandialang / Boucotte Grand"

    @Column(nullable = false)
    private Double centreLatitude;

    @Column(nullable = false)
    private Double centreLongitude;

    @Column(nullable = false)
    private Double rayonKm;
}
