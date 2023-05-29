package org.itdevspace.repository;

import java.util.List;
import java.util.Optional;
import org.itdevspace.domain.Estimation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Estimation entity.
 */
@Repository
public interface EstimationRepository extends JpaRepository<Estimation, Long> {
    default Optional<Estimation> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Estimation> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Estimation> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct estimation from Estimation estimation left join fetch estimation.projet left join fetch estimation.livrable left join fetch estimation.activite",
        countQuery = "select count(distinct estimation) from Estimation estimation"
    )
    Page<Estimation> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select distinct estimation from Estimation estimation left join fetch estimation.projet left join fetch estimation.livrable left join fetch estimation.activite"
    )
    List<Estimation> findAllWithToOneRelationships();

    @Query(
        "select estimation from Estimation estimation left join fetch estimation.projet left join fetch estimation.livrable left join fetch estimation.activite where estimation.id =:id"
    )
    Optional<Estimation> findOneWithToOneRelationships(@Param("id") Long id);
}
