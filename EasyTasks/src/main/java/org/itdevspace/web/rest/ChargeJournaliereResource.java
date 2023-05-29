package org.itdevspace.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.itdevspace.domain.ChargeJournaliere;
import org.itdevspace.repository.ChargeJournaliereRepository;
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
public class ChargeJournaliereResource {

    private final Logger log = LoggerFactory.getLogger(ChargeJournaliereResource.class);

    private static final String ENTITY_NAME = "chargeJournaliere";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChargeJournaliereRepository chargeJournaliereRepository;

    public ChargeJournaliereResource(ChargeJournaliereRepository chargeJournaliereRepository) {
        this.chargeJournaliereRepository = chargeJournaliereRepository;
    }

    
    @PostMapping("/charge-journalieres")
    public ResponseEntity<ChargeJournaliere> createChargeJournaliere(@Valid @RequestBody ChargeJournaliere chargeJournaliere)
        throws URISyntaxException {
        log.debug("REST request to save ChargeJournaliere : {}", chargeJournaliere);
        if (chargeJournaliere.getId() != null) {
            throw new BadRequestAlertException("A new chargeJournaliere cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ChargeJournaliere result = chargeJournaliereRepository.save(chargeJournaliere);
        return ResponseEntity
            .created(new URI("/api/charge-journalieres/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    
    @PutMapping("/charge-journalieres/{id}")
    public ResponseEntity<ChargeJournaliere> updateChargeJournaliere(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ChargeJournaliere chargeJournaliere
    ) throws URISyntaxException {
        log.debug("REST request to update ChargeJournaliere : {}, {}", id, chargeJournaliere);
        if (chargeJournaliere.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chargeJournaliere.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chargeJournaliereRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ChargeJournaliere result = chargeJournaliereRepository.save(chargeJournaliere);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chargeJournaliere.getId().toString()))
            .body(result);
    }

    
    @PatchMapping(value = "/charge-journalieres/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ChargeJournaliere> partialUpdateChargeJournaliere(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ChargeJournaliere chargeJournaliere
    ) throws URISyntaxException {
        log.debug("REST request to partial update ChargeJournaliere partially : {}, {}", id, chargeJournaliere);
        if (chargeJournaliere.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chargeJournaliere.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chargeJournaliereRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ChargeJournaliere> result = chargeJournaliereRepository
            .findById(chargeJournaliere.getId())
            .map(existingChargeJournaliere -> {
                if (chargeJournaliere.getDescription() != null) {
                    existingChargeJournaliere.setDescription(chargeJournaliere.getDescription());
                }
                if (chargeJournaliere.getDate() != null) {
                    existingChargeJournaliere.setDate(chargeJournaliere.getDate());
                }
                if (chargeJournaliere.getType() != null) {
                    existingChargeJournaliere.setType(chargeJournaliere.getType());
                }
                if (chargeJournaliere.getDuree() != null) {
                    existingChargeJournaliere.setDuree(chargeJournaliere.getDuree());
                }

                return existingChargeJournaliere;
            })
            .map(chargeJournaliereRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chargeJournaliere.getId().toString())
        );
    }

    
    @GetMapping("/charge-journalieres")
    public List<ChargeJournaliere> getAllChargeJournalieres(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all ChargeJournalieres");
        if (eagerload) {
            return chargeJournaliereRepository.findAllWithEagerRelationships();
        } else {
            return chargeJournaliereRepository.findAll();
        }
    }

    
    @GetMapping("/charge-journalieres/{id}")
    public ResponseEntity<ChargeJournaliere> getChargeJournaliere(@PathVariable Long id) {
        log.debug("REST request to get ChargeJournaliere : {}", id);
        Optional<ChargeJournaliere> chargeJournaliere = chargeJournaliereRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(chargeJournaliere);
    }

    
    @DeleteMapping("/charge-journalieres/{id}")
    public ResponseEntity<Void> deleteChargeJournaliere(@PathVariable Long id) {
        log.debug("REST request to delete ChargeJournaliere : {}", id);
        chargeJournaliereRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
