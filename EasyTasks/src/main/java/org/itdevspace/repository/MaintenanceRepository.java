package org.itdevspace.repository;

import java.util.List;
import java.util.Optional;
import org.itdevspace.domain.Maintenance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Maintenance entity.
 */
@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
    default Optional<Maintenance> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Maintenance> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Maintenance> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct maintenance from Maintenance maintenance left join fetch maintenance.ressource",
        countQuery = "select count(distinct maintenance) from Maintenance maintenance"
    )
    Page<Maintenance> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct maintenance from Maintenance maintenance left join fetch maintenance.ressource")
    List<Maintenance> findAllWithToOneRelationships();

    @Query("select maintenance from Maintenance maintenance left join fetch maintenance.ressource where maintenance.id =:id")
    Optional<Maintenance> findOneWithToOneRelationships(@Param("id") Long id);
}
