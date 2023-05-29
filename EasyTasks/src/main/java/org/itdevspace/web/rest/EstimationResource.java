package org.itdevspace.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.itdevspace.domain.Estimation;
import org.itdevspace.repository.EstimationRepository;
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
public class EstimationResource {

    private final Logger log = LoggerFactory.getLogger(EstimationResource.class);

    private static final String ENTITY_NAME = "estimation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EstimationRepository estimationRepository;

    public EstimationResource(EstimationRepository estimationRepository) {
        this.estimationRepository = estimationRepository;
    }

    
    @PostMapping("/estimations")
    public ResponseEntity<Estimation> createEstimation(@Valid @RequestBody Estimation estimation) throws URISyntaxException {
        log.debug("REST request to save Estimation : {}", estimation);
        if (estimation.getId() != null) {
            throw new BadRequestAlertException("A new estimation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Estimation result = estimationRepository.save(estimation);
        return ResponseEntity
            .created(new URI("/api/estimations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    
    @PutMapping("/estimations/{id}")
    public ResponseEntity<Estimation> updateEstimation(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Estimation estimation
    ) throws URISyntaxException {
        log.debug("REST request to update Estimation : {}, {}", id, estimation);
        if (estimation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, estimation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!estimationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Estimation result = estimationRepository.save(estimation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, estimation.getId().toString()))
            .body(result);
    }

    
    @PatchMapping(value = "/estimations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Estimation> partialUpdateEstimation(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Estimation estimation
    ) throws URISyntaxException {
        log.debug("REST request to partial update Estimation partially : {}, {}", id, estimation);
        if (estimation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, estimation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!estimationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Estimation> result = estimationRepository
            .findById(estimation.getId())
            .map(existingEstimation -> {
                if (estimation.getDate() != null) {
                    existingEstimation.setDate(estimation.getDate());
                }
                if (estimation.getValeurJour() != null) {
                    existingEstimation.setValeurJour(estimation.getValeurJour());
                }
                if (estimation.getValeurHeure() != null) {
                    existingEstimation.setValeurHeure(estimation.getValeurHeure());
                }
                if (estimation.getPriseEnCharge() != null) {
                    existingEstimation.setPriseEnCharge(estimation.getPriseEnCharge());
                }
                if (estimation.getType() != null) {
                    existingEstimation.setType(estimation.getType());
                }

                return existingEstimation;
            })
            .map(estimationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, estimation.getId().toString())
        );
    }

    
    @GetMapping("/estimations")
    public List<Estimation> getAllEstimations(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Estimations");
        if (eagerload) {
            return estimationRepository.findAllWithEagerRelationships();
        } else {
            return estimationRepository.findAll();
        }
    }

    
    @GetMapping("/estimations/{id}")
    public ResponseEntity<Estimation> getEstimation(@PathVariable Long id) {
        log.debug("REST request to get Estimation : {}", id);
        Optional<Estimation> estimation = estimationRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(estimation);
    }

    
    @DeleteMapping("/estimations/{id}")
    public ResponseEntity<Void> deleteEstimation(@PathVariable Long id) {
        log.debug("REST request to delete Estimation : {}", id);
        estimationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
