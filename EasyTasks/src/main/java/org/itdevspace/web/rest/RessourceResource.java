package org.itdevspace.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.itdevspace.domain.Ressource;
import org.itdevspace.repository.RessourceRepository;
import org.itdevspace.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.itdevspace.domain.Ressource}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RessourceResource {

    private final Logger log = LoggerFactory.getLogger(RessourceResource.class);

    private static final String ENTITY_NAME = "ressource";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RessourceRepository ressourceRepository;

    public RessourceResource(RessourceRepository ressourceRepository) {
        this.ressourceRepository = ressourceRepository;
    }

    /**
     * {@code POST  /ressources} : Create a new ressource.
     *
     * @param ressource the ressource to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ressource, or with status {@code 400 (Bad Request)} if the ressource has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ressources")
    public ResponseEntity<Ressource> createRessource(@Valid @RequestBody Ressource ressource) throws URISyntaxException {
        log.debug("REST request to save Ressource : {}", ressource);
        if (ressource.getId() != null) {
            throw new BadRequestAlertException("A new ressource cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Ressource result = ressourceRepository.save(ressource);
        return ResponseEntity
            .created(new URI("/api/ressources/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ressources/:id} : Updates an existing ressource.
     *
     * @param id the id of the ressource to save.
     * @param ressource the ressource to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ressource,
     * or with status {@code 400 (Bad Request)} if the ressource is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ressource couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ressources/{id}")
    public ResponseEntity<Ressource> updateRessource(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Ressource ressource
    ) throws URISyntaxException {
        log.debug("REST request to update Ressource : {}, {}", id, ressource);
        if (ressource.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ressource.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ressourceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Ressource result = ressourceRepository.save(ressource);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ressource.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /ressources/:id} : Partial updates given fields of an existing ressource, field will ignore if it is null
     *
     * @param id the id of the ressource to save.
     * @param ressource the ressource to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ressource,
     * or with status {@code 400 (Bad Request)} if the ressource is not valid,
     * or with status {@code 404 (Not Found)} if the ressource is not found,
     * or with status {@code 500 (Internal Server Error)} if the ressource couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/ressources/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Ressource> partialUpdateRessource(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Ressource ressource
    ) throws URISyntaxException {
        log.debug("REST request to partial update Ressource partially : {}, {}", id, ressource);
        if (ressource.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ressource.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ressourceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Ressource> result = ressourceRepository
            .findById(ressource.getId())
            .map(existingRessource -> {
                if (ressource.getNom() != null) {
                    existingRessource.setNom(ressource.getNom());
                }
                if (ressource.getPrenom() != null) {
                    existingRessource.setPrenom(ressource.getPrenom());
                }

                return existingRessource;
            })
            .map(ressourceRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ressource.getId().toString())
        );
    }

    /**
     * {@code GET  /ressources} : get all the ressources.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ressources in body.
     */
    @GetMapping("/ressources")
    public List<Ressource> getAllRessources() {
        log.debug("REST request to get all Ressources");
        return ressourceRepository.findAll();
    }

    /**
     * {@code GET  /ressources/:id} : get the "id" ressource.
     *
     * @param id the id of the ressource to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ressource, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ressources/{id}")
    public ResponseEntity<Ressource> getRessource(@PathVariable Long id) {
        log.debug("REST request to get Ressource : {}", id);
        Optional<Ressource> ressource = ressourceRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(ressource);
    }

    /**
     * {@code DELETE  /ressources/:id} : delete the "id" ressource.
     *
     * @param id the id of the ressource to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ressources/{id}")
    public ResponseEntity<Void> deleteRessource(@PathVariable Long id) {
        log.debug("REST request to delete Ressource : {}", id);
        ressourceRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
