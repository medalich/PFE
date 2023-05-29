package org.itdevspace.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.itdevspace.domain.Maintenance;
import org.itdevspace.repository.MaintenanceRepository;
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
 * REST controller for managing {@link org.itdevspace.domain.Maintenance}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MaintenanceResource {

    private final Logger log = LoggerFactory.getLogger(MaintenanceResource.class);

    private static final String ENTITY_NAME = "maintenance";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MaintenanceRepository maintenanceRepository;

    public MaintenanceResource(MaintenanceRepository maintenanceRepository) {
        this.maintenanceRepository = maintenanceRepository;
    }

   
    @PostMapping("/maintenances")
    public ResponseEntity<Maintenance> createMaintenance(@Valid @RequestBody Maintenance maintenance) throws URISyntaxException {
        log.debug("REST request to save Maintenance : {}", maintenance);
        if (maintenance.getId() != null) {
            throw new BadRequestAlertException("A new maintenance cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Maintenance result = maintenanceRepository.save(maintenance);
        return ResponseEntity
            .created(new URI("/api/maintenances/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    
    @PutMapping("/maintenances/{id}")
    public ResponseEntity<Maintenance> updateMaintenance(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Maintenance maintenance
    ) throws URISyntaxException {
        log.debug("REST request to update Maintenance : {}, {}", id, maintenance);
        if (maintenance.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, maintenance.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!maintenanceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Maintenance result = maintenanceRepository.save(maintenance);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, maintenance.getId().toString()))
            .body(result);
    }

    
    @PatchMapping(value = "/maintenances/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Maintenance> partialUpdateMaintenance(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Maintenance maintenance
    ) throws URISyntaxException {
        log.debug("REST request to partial update Maintenance partially : {}, {}", id, maintenance);
        if (maintenance.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, maintenance.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!maintenanceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Maintenance> result = maintenanceRepository
            .findById(maintenance.getId())
            .map(existingMaintenance -> {
                if (maintenance.getDescription() != null) {
                    existingMaintenance.setDescription(maintenance.getDescription());
                }
                if (maintenance.getProduit() != null) {
                    existingMaintenance.setProduit(maintenance.getProduit());
                }
                if (maintenance.getSolution() != null) {
                    existingMaintenance.setSolution(maintenance.getSolution());
                }
                if (maintenance.getEtat() != null) {
                    existingMaintenance.setEtat(maintenance.getEtat());
                }
                if (maintenance.getDateDebut() != null) {
                    existingMaintenance.setDateDebut(maintenance.getDateDebut());
                }
                if (maintenance.getDateFin() != null) {
                    existingMaintenance.setDateFin(maintenance.getDateFin());
                }
                if (maintenance.getDuree() != null) {
                    existingMaintenance.setDuree(maintenance.getDuree());
                }

                return existingMaintenance;
            })
            .map(maintenanceRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, maintenance.getId().toString())
        );
    }

    
    @GetMapping("/maintenances")
    public List<Maintenance> getAllMaintenances(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Maintenances");
        if (eagerload) {
            return maintenanceRepository.findAllWithEagerRelationships();
        } else {
            return maintenanceRepository.findAll();
        }
    }

    
    @GetMapping("/maintenances/{id}")
    public ResponseEntity<Maintenance> getMaintenance(@PathVariable Long id) {
        log.debug("REST request to get Maintenance : {}", id);
        Optional<Maintenance> maintenance = maintenanceRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(maintenance);
    }

    
    @DeleteMapping("/maintenances/{id}")
    public ResponseEntity<Void> deleteMaintenance(@PathVariable Long id) {
        log.debug("REST request to delete Maintenance : {}", id);
        maintenanceRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
