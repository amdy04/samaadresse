package sn.uasz.samaadresse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sn.uasz.samaadresse.domain.CommandePlaque;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommandePlaqueRepository extends JpaRepository<CommandePlaque, Long> {
    Optional<CommandePlaque> findByReferenceWave(String referenceWave);
    List<CommandePlaque> findByUtilisateurIdOrderByDateCommandeDesc(Long utilisateurId);
}
