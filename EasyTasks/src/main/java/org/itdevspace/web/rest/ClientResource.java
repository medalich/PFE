package org.itdevspace.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.itdevspace.domain.Client;
import org.itdevspace.repository.ClientRepository;
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
public class ClientResource {

    private final Logger log = LoggerFactory.getLogger(ClientResource.class);

    private static final String ENTITY_NAME = "client";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ClientRepository clientRepository;

    public ClientResource(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    
    @PostMapping("/clients")
    public ResponseEntity<Client> createClient(@Valid @RequestBody Client client) throws URISyntaxException {
        log.debug("REST request to save Client : {}", client);
        if (client.getId() != null) {
            throw new BadRequestAlertException("A new client cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Client result = clientRepository.save(client);
        return ResponseEntity
            .created(new URI("/api/clients/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

   
    @PutMapping("/clients/{id}")
    public ResponseEntity<Client> updateClient(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Client client
    ) throws URISyntaxException {
        log.debug("REST request to update Client : {}, {}", id, client);
        if (client.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, client.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!clientRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Client result = clientRepository.save(client);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, client.getId().toString()))
            .body(result);
    }

   
    @PatchMapping(value = "/clients/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Client> partialUpdateClient(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Client client
    ) throws URISyntaxException {
        log.debug("REST request to partial update Client partially : {}, {}", id, client);
        if (client.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, client.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!clientRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Client> result = clientRepository
            .findById(client.getId())
            .map(existingClient -> {
                if (client.getRefClient() != null) {
                    existingClient.setRefClient(client.getRefClient());
                }
                if (client.getNom() != null) {
                    existingClient.setNom(client.getNom());
                }
                if (client.getPrenom() != null) {
                    existingClient.setPrenom(client.getPrenom());
                }
                if (client.getContact() != null) {
                    existingClient.setContact(client.getContact());
                }

                return existingClient;
            })
            .map(clientRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, client.getId().toString())
        );
    }

    
    @GetMapping("/clients")
    public List<Client> getAllClients() {
        log.debug("REST request to get all Clients");
        return clientRepository.findAll();
    }

    
    @GetMapping("/clients/{id}")
    public ResponseEntity<Client> getClient(@PathVariable Long id) {
        log.debug("REST request to get Client : {}", id);
        Optional<Client> client = clientRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(client);
    }

    
    @DeleteMapping("/clients/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        log.debug("REST request to delete Client : {}", id);
        clientRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
