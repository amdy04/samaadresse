package sn.uasz.samaadresse.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "commandes_plaques")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommandePlaque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String referenceWave;

    @Column(nullable = false)
    private Double montant;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String statutPaiement = "EN_ATTENTE"; // EN_ATTENTE, PAYE, LITIGE

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String statutLivraison = "EN_PREPARATION"; // EN_PREPARATION, EN_LIVRAISON, LIVRE

    @Column(nullable = false, length = 30)
    private String telephoneLivraison;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "adresse_id", nullable = false)
    private Adresse adresse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Utilisateur utilisateur;

    @Column(nullable = false)
    private LocalDateTime dateCommande;

    @PrePersist
    public void prePersist() {
        if (this.dateCommande == null) {
            this.dateCommande = LocalDateTime.now();
        }
        if (this.statutPaiement == null) {
            this.statutPaiement = "EN_ATTENTE";
        }
        if (this.statutLivraison == null) {
            this.statutLivraison = "EN_PREPARATION";
        }
    }
}
