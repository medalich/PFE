package org.itdevspace.repository;

import org.itdevspace.domain.Ressource;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Ressource entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RessourceRepository extends JpaRepository<Ressource, Long> {}
