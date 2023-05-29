package org.itdevspace.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.itdevspace.domain.Activite;
import org.itdevspace.repository.ActiviteRepository;
import org.itdevspace.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;


@RestController
@RequestMapping("/api")
@Transactional
public class ActiviteResource {

    private final Logger log = LoggerFactory.getLogger(ActiviteResource.class);

    private static final String ENTITY_NAME = "activite";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ActiviteRepository activiteRepository;

    public ActiviteResource(ActiviteRepository activiteRepository) {
        this.activiteRepository = activiteRepository;
    }

   
    @PostMapping("/activites")
    public ResponseEntity<Activite> createActivite(@Valid @RequestBody Activite activite) throws URISyntaxException {
        log.debug("REST request to save Activite : {}", activite);
        if (activite.getId() != null) {
            throw new BadRequestAlertException("A new activite cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Activite result = activiteRepository.save(activite);
        return ResponseEntity
            .created(new URI("/api/activites/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

   
    @PutMapping("/activites/{id}")
    public ResponseEntity<Activite> updateActivite(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Activite activite
    ) throws URISyntaxException {
        log.debug("REST request to update Activite : {}, {}", id, activite);
        if (activite.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, activite.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!activiteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Activite result = activiteRepository.save(activite);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, activite.getId().toString()))
            .body(result);
    }

    
    @PatchMapping(value = "/activites/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Activite> partialUpdateActivite(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Activite activite
    ) throws URISyntaxException {
        log.debug("REST request to partial update Activite partially : {}, {}", id, activite);
        if (activite.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, activite.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!activiteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Activite> result = activiteRepository
            .findById(activite.getId())
            .map(existingActivite -> {
                if (activite.getRefAct() != null) {
                    existingActivite.setRefAct(activite.getRefAct());
                }
                if (activite.getDescription() != null) {
                    existingActivite.setDescription(activite.getDescription());
                }
                if (activite.getDateDebut() != null) {
                    existingActivite.setDateDebut(activite.getDateDebut());
                }
                if (activite.getDateFin() != null) {
                    existingActivite.setDateFin(activite.getDateFin());
                }
                if (activite.getRaf() != null) {
                    existingActivite.setRaf(activite.getRaf());
                }
                if (activite.getEtat() != null) {
                    existingActivite.setEtat(activite.getEtat());
                }

                return existingActivite;
            })
            .map(activiteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, activite.getId().toString())
        );
    }

    
    @GetMapping("/activites")
    public List<Activite> getAllActivites(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Activites");
        if (eagerload) {
            return activiteRepository.findAllWithEagerRelationships();
        } else {
            return activiteRepository.findAll();
        }
    }

    
    @GetMapping("/activites/{id}")
    public ResponseEntity<Activite> getActivite(@PathVariable Long id) {
        log.debug("REST request to get Activite : {}", id);
        Optional<Activite> activite = activiteRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(activite);
    }

    
    @DeleteMapping("/activites/{id}")
    public ResponseEntity<Void> deleteActivite(@PathVariable Long id) {
        log.debug("REST request to delete Activite : {}", id);
        activiteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
