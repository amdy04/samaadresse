package sn.uasz.samaadresse.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "signalements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Signalement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String motif;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String details;

    @Column(length = 50)
    private String contactSignaleur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "adresse_id", nullable = false)
    private Adresse adresse;

    @Column(nullable = false)
    @Builder.Default
    private Boolean traite = false;

    @Column(nullable = false)
    private LocalDateTime dateSignalement;

    @PrePersist
    public void prePersist() {
        if (this.dateSignalement == null) {
            this.dateSignalement = LocalDateTime.now();
        }
        if (this.traite == null) {
            this.traite = false;
        }
    }
}
