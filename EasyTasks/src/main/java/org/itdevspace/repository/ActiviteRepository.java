package org.itdevspace.repository;

import java.util.List;
import java.util.Optional;
import org.itdevspace.domain.Activite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Activite entity.
 */
@Repository
public interface ActiviteRepository extends JpaRepository<Activite, Long> {
    default Optional<Activite> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Activite> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Activite> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct activite from Activite activite left join fetch activite.livrable",
        countQuery = "select count(distinct activite) from Activite activite"
    )
    Page<Activite> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct activite from Activite activite left join fetch activite.livrable")
    List<Activite> findAllWithToOneRelationships();

    @Query("select activite from Activite activite left join fetch activite.livrable where activite.id =:id")
    Optional<Activite> findOneWithToOneRelationships(@Param("id") Long id);
}
