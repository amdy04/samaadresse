package sn.uasz.samaadresse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sn.uasz.samaadresse.domain.Signalement;

import java.util.List;

@Repository
public interface SignalementRepository extends JpaRepository<Signalement, Long> {
    List<Signalement> findByTraiteFalseOrderByDateSignalementDesc();
    List<Signalement> findByAdresseId(Long adresseId);
}
