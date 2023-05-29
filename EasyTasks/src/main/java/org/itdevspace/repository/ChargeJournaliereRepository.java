package org.itdevspace.repository;

import java.util.List;
import java.util.Optional;
import org.itdevspace.domain.ChargeJournaliere;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ChargeJournaliere entity.
 */
@Repository
public interface ChargeJournaliereRepository extends JpaRepository<ChargeJournaliere, Long> {
    default Optional<ChargeJournaliere> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ChargeJournaliere> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ChargeJournaliere> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct chargeJournaliere from ChargeJournaliere chargeJournaliere left join fetch chargeJournaliere.ressource",
        countQuery = "select count(distinct chargeJournaliere) from ChargeJournaliere chargeJournaliere"
    )
    Page<ChargeJournaliere> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct chargeJournaliere from ChargeJournaliere chargeJournaliere left join fetch chargeJournaliere.ressource")
    List<ChargeJournaliere> findAllWithToOneRelationships();

    @Query(
        "select chargeJournaliere from ChargeJournaliere chargeJournaliere left join fetch chargeJournaliere.ressource where chargeJournaliere.id =:id"
    )
    Optional<ChargeJournaliere> findOneWithToOneRelationships(@Param("id") Long id);
}
