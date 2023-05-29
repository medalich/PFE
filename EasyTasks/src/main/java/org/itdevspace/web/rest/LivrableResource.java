package org.itdevspace.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.itdevspace.domain.Livrable;
import org.itdevspace.repository.LivrableRepository;
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
public class LivrableResource {

    private final Logger log = LoggerFactory.getLogger(LivrableResource.class);

    private static final String ENTITY_NAME = "livrable";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LivrableRepository livrableRepository;

    public LivrableResource(LivrableRepository livrableRepository) {
        this.livrableRepository = livrableRepository;
    }

    
    @PostMapping("/livrables")
    public ResponseEntity<Livrable> createLivrable(@Valid @RequestBody Livrable livrable) throws URISyntaxException {
        log.debug("REST request to save Livrable : {}", livrable);
        if (livrable.getId() != null) {
            throw new BadRequestAlertException("A new livrable cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Livrable result = livrableRepository.save(livrable);
        return ResponseEntity
            .created(new URI("/api/livrables/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    
    @PutMapping("/livrables/{id}")
    public ResponseEntity<Livrable> updateLivrable(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Livrable livrable
    ) throws URISyntaxException {
        log.debug("REST request to update Livrable : {}, {}", id, livrable);
        if (livrable.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, livrable.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!livrableRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Livrable result = livrableRepository.save(livrable);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, livrable.getId().toString()))
            .body(result);
    }

    
    @PatchMapping(value = "/livrables/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Livrable> partialUpdateLivrable(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Livrable livrable
    ) throws URISyntaxException {
        log.debug("REST request to partial update Livrable partially : {}, {}", id, livrable);
        if (livrable.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, livrable.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!livrableRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Livrable> result = livrableRepository
            .findById(livrable.getId())
            .map(existingLivrable -> {
                if (livrable.getRefLivrable() != null) {
                    existingLivrable.setRefLivrable(livrable.getRefLivrable());
                }
                if (livrable.getDateDebut() != null) {
                    existingLivrable.setDateDebut(livrable.getDateDebut());
                }
                if (livrable.getDateFin() != null) {
                    existingLivrable.setDateFin(livrable.getDateFin());
                }
                if (livrable.getDescription() != null) {
                    existingLivrable.setDescription(livrable.getDescription());
                }
                if (livrable.getEtat() != null) {
                    existingLivrable.setEtat(livrable.getEtat());
                }

                return existingLivrable;
            })
            .map(livrableRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, livrable.getId().toString())
        );
    }

    
    @GetMapping("/livrables")
    public List<Livrable> getAllLivrables(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Livrables");
        if (eagerload) {
            return livrableRepository.findAllWithEagerRelationships();
        } else {
            return livrableRepository.findAll();
        }
    }

    
    @GetMapping("/livrables/{id}")
    public ResponseEntity<Livrable> getLivrable(@PathVariable Long id) {
        log.debug("REST request to get Livrable : {}", id);
        Optional<Livrable> livrable = livrableRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(livrable);
    }

    
    @DeleteMapping("/livrables/{id}")
    public ResponseEntity<Void> deleteLivrable(@PathVariable Long id) {
        log.debug("REST request to delete Livrable : {}", id);
        livrableRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
