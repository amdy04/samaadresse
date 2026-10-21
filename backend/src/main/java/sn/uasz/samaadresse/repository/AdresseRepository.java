package sn.uasz.samaadresse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sn.uasz.samaadresse.domain.Adresse;
import sn.uasz.samaadresse.domain.StatutAdresse;
import sn.uasz.samaadresse.domain.TypeLieu;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdresseRepository extends JpaRepository<Adresse, Long> {

    Optional<Adresse> findByCodeSamaAdresse(String codeSamaAdresse);

    List<Adresse> findByUtilisateurIdOrderByDateCreationDesc(Long utilisateurId);

    List<Adresse> findByStatutOrderByDateCreationDesc(StatutAdresse statut);

    @Query("SELECT a FROM Adresse a WHERE a.statut = 'ACTIVE' AND (" +
           "LOWER(a.codeSamaAdresse) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.titre) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.descriptionRepere) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.nomProprietaireAffichable) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.quartier.nom) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Adresse> searchAdresses(@Param("query") String query);

    @Query("SELECT a FROM Adresse a WHERE a.statut = 'ACTIVE' " +
           "AND (:quartierId IS NULL OR a.quartier.id = :quartierId) " +
           "AND (:typeLieu IS NULL OR a.typeLieu = :typeLieu) " +
           "ORDER BY a.dateCreation DESC")
    List<Adresse> filterAdresses(@Param("quartierId") Long quartierId, @Param("typeLieu") TypeLieu typeLieu);
}
