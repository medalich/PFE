package org.itdevspace.repository;

import java.util.List;
import java.util.Optional;
import org.itdevspace.domain.Facture;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Facture entity.
 */
@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {
    default Optional<Facture> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Facture> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Facture> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct facture from Facture facture left join fetch facture.client left join fetch facture.projet",
        countQuery = "select count(distinct facture) from Facture facture"
    )
    Page<Facture> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct facture from Facture facture left join fetch facture.client left join fetch facture.projet")
    List<Facture> findAllWithToOneRelationships();

    @Query("select facture from Facture facture left join fetch facture.client left join fetch facture.projet where facture.id =:id")
    Optional<Facture> findOneWithToOneRelationships(@Param("id") Long id);
}
