package sn.uasz.samaadresse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sn.uasz.samaadresse.domain.Quartier;

import java.util.Optional;

@Repository
public interface QuartierRepository extends JpaRepository<Quartier, Long> {
    Optional<Quartier> findByTrigramme(String trigramme);
    Optional<Quartier> findByNomIgnoreCase(String nom);
}
