package org.itdevspace.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.itdevspace.IntegrationTest;
import org.itdevspace.domain.Maintenance;
import org.itdevspace.domain.Ressource;
import org.itdevspace.domain.enumeration.Etat;
import org.itdevspace.repository.MaintenanceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link MaintenanceResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class MaintenanceResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_PRODUIT = "AAAAAAAAAA";
    private static final String UPDATED_PRODUIT = "BBBBBBBBBB";

    private static final String DEFAULT_SOLUTION = "AAAAAAAAAA";
    private static final String UPDATED_SOLUTION = "BBBBBBBBBB";

    private static final Etat DEFAULT_ETAT = Etat.Planifier;
    private static final Etat UPDATED_ETAT = Etat.EnCours;

    private static final LocalDate DEFAULT_DATE_DEBUT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_DEBUT = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATE_FIN = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_FIN = LocalDate.now(ZoneId.systemDefault());

    private static final Double DEFAULT_DUREE = 1D;
    private static final Double UPDATED_DUREE = 2D;

    private static final String ENTITY_API_URL = "/api/maintenances";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    @Mock
    private MaintenanceRepository maintenanceRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMaintenanceMockMvc;

    private Maintenance maintenance;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Maintenance createEntity(EntityManager em) {
        Maintenance maintenance = new Maintenance()
            .description(DEFAULT_DESCRIPTION)
            .produit(DEFAULT_PRODUIT)
            .solution(DEFAULT_SOLUTION)
            .etat(DEFAULT_ETAT)
            .dateDebut(DEFAULT_DATE_DEBUT)
            .dateFin(DEFAULT_DATE_FIN)
            .duree(DEFAULT_DUREE);
        // Add required entity
        Ressource ressource;
        if (TestUtil.findAll(em, Ressource.class).isEmpty()) {
            ressource = RessourceResourceIT.createEntity(em);
            em.persist(ressource);
            em.flush();
        } else {
            ressource = TestUtil.findAll(em, Ressource.class).get(0);
        }
        maintenance.setRessource(ressource);
        return maintenance;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Maintenance createUpdatedEntity(EntityManager em) {
        Maintenance maintenance = new Maintenance()
            .description(UPDATED_DESCRIPTION)
            .produit(UPDATED_PRODUIT)
            .solution(UPDATED_SOLUTION)
            .etat(UPDATED_ETAT)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN)
            .duree(UPDATED_DUREE);
        // Add required entity
        Ressource ressource;
        if (TestUtil.findAll(em, Ressource.class).isEmpty()) {
            ressource = RessourceResourceIT.createUpdatedEntity(em);
            em.persist(ressource);
            em.flush();
        } else {
            ressource = TestUtil.findAll(em, Ressource.class).get(0);
        }
        maintenance.setRessource(ressource);
        return maintenance;
    }

    @BeforeEach
    public void initTest() {
        maintenance = createEntity(em);
    }

    @Test
    @Transactional
    void createMaintenance() throws Exception {
        int databaseSizeBeforeCreate = maintenanceRepository.findAll().size();
        // Create the Maintenance
        restMaintenanceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(maintenance)))
            .andExpect(status().isCreated());

        // Validate the Maintenance in the database
        List<Maintenance> maintenanceList = maintenanceRepository.findAll();
        assertThat(maintenanceList).hasSize(databaseSizeBeforeCreate + 1);
        Maintenance testMaintenance = maintenanceList.get(maintenanceList.size() - 1);
        assertThat(testMaintenance.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testMaintenance.getProduit()).isEqualTo(DEFAULT_PRODUIT);
        assertThat(testMaintenance.getSolution()).isEqualTo(DEFAULT_SOLUTION);
        assertThat(testMaintenance.getEtat()).isEqualTo(DEFAULT_ETAT);
        assertThat(testMaintenance.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testMaintenance.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
        assertThat(testMaintenance.getDuree()).isEqualTo(DEFAULT_DUREE);
    }

    @Test
    @Transactional
    void createMaintenanceWithExistingId() throws Exception {
        // Create the Maintenance with an existing ID
        maintenance.setId(1L);

        int databaseSizeBeforeCreate = maintenanceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMaintenanceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(maintenance)))
            .andExpect(status().isBadRequest());

        // Validate the Maintenance in the database
        List<Maintenance> maintenanceList = maintenanceRepository.findAll();
        assertThat(maintenanceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = maintenanceRepository.findAll().size();
        // set the field null
        maintenance.setDescription(null);

        // Create the Maintenance, which fails.

        restMaintenanceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(maintenance)))
            .andExpect(status().isBadRequest());

        List<Maintenance> maintenanceList = maintenanceRepository.findAll();
        assertThat(maintenanceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMaintenances() throws Exception {
        // Initialize the database
        maintenanceRepository.saveAndFlush(maintenance);

        // Get all the maintenanceList
        restMaintenanceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(maintenance.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].produit").value(hasItem(DEFAULT_PRODUIT)))
            .andExpect(jsonPath("$.[*].solution").value(hasItem(DEFAULT_SOLUTION)))
            .andExpect(jsonPath("$.[*].etat").value(hasItem(DEFAULT_ETAT.toString())))
            .andExpect(jsonPath("$.[*].dateDebut").value(hasItem(DEFAULT_DATE_DEBUT.toString())))
            .andExpect(jsonPath("$.[*].dateFin").value(hasItem(DEFAULT_DATE_FIN.toString())))
            .andExpect(jsonPath("$.[*].duree").value(hasItem(DEFAULT_DUREE.doubleValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMaintenancesWithEagerRelationshipsIsEnabled() throws Exception {
        when(maintenanceRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMaintenanceMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(maintenanceRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMaintenancesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(maintenanceRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMaintenanceMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(maintenanceRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getMaintenance() throws Exception {
        // Initialize the database
        maintenanceRepository.saveAndFlush(maintenance);

        // Get the maintenance
        restMaintenanceMockMvc
            .perform(get(ENTITY_API_URL_ID, maintenance.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(maintenance.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.produit").value(DEFAULT_PRODUIT))
            .andExpect(jsonPath("$.solution").value(DEFAULT_SOLUTION))
            .andExpect(jsonPath("$.etat").value(DEFAULT_ETAT.toString()))
            .andExpect(jsonPath("$.dateDebut").value(DEFAULT_DATE_DEBUT.toString()))
            .andExpect(jsonPath("$.dateFin").value(DEFAULT_DATE_FIN.toString()))
            .andExpect(jsonPath("$.duree").value(DEFAULT_DUREE.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingMaintenance() throws Exception {
        // Get the maintenance
        restMaintenanceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMaintenance() throws Exception {
        // Initialize the database
        maintenanceRepository.saveAndFlush(maintenance);

        int databaseSizeBeforeUpdate = maintenanceRepository.findAll().size();

        // Update the maintenance
        Maintenance updatedMaintenance = maintenanceRepository.findById(maintenance.getId()).get();
        // Disconnect from session so that the updates on updatedMaintenance are not directly saved in db
        em.detach(updatedMaintenance);
        updatedMaintenance
            .description(UPDATED_DESCRIPTION)
            .produit(UPDATED_PRODUIT)
            .solution(UPDATED_SOLUTION)
            .etat(UPDATED_ETAT)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN)
            .duree(UPDATED_DUREE);

        restMaintenanceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMaintenance.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMaintenance))
            )
            .andExpect(status().isOk());

        // Validate the Maintenance in the database
        List<Maintenance> maintenanceList = maintenanceRepository.findAll();
        assertThat(maintenanceList).hasSize(databaseSizeBeforeUpdate);
        Maintenance testMaintenance = maintenanceList.get(maintenanceList.size() - 1);
        assertThat(testMaintenance.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testMaintenance.getProduit()).isEqualTo(UPDATED_PRODUIT);
        assertThat(testMaintenance.getSolution()).isEqualTo(UPDATED_SOLUTION);
        assertThat(testMaintenance.getEtat()).isEqualTo(UPDATED_ETAT);
        assertThat(testMaintenance.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testMaintenance.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
        assertThat(testMaintenance.getDuree()).isEqualTo(UPDATED_DUREE);
    }

    @Test
    @Transactional
    void putNonExistingMaintenance() throws Exception {
        int databaseSizeBeforeUpdate = maintenanceRepository.findAll().size();
        maintenance.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMaintenanceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, maintenance.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(maintenance))
            )
            .andExpect(status().isBadRequest());

        // Validate the Maintenance in the database
        List<Maintenance> maintenanceList = maintenanceRepository.findAll();
        assertThat(maintenanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMaintenance() throws Exception {
        int databaseSizeBeforeUpdate = maintenanceRepository.findAll().size();
        maintenance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMaintenanceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(maintenance))
            )
            .andExpect(status().isBadRequest());

        // Validate the Maintenance in the database
        List<Maintenance> maintenanceList = maintenanceRepository.findAll();
        assertThat(maintenanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMaintenance() throws Exception {
        int databaseSizeBeforeUpdate = maintenanceRepository.findAll().size();
        maintenance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMaintenanceMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(maintenance)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Maintenance in the database
        List<Maintenance> maintenanceList = maintenanceRepository.findAll();
        assertThat(maintenanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMaintenanceWithPatch() throws Exception {
        // Initialize the database
        maintenanceRepository.saveAndFlush(maintenance);

        int databaseSizeBeforeUpdate = maintenanceRepository.findAll().size();

        // Update the maintenance using partial update
        Maintenance partialUpdatedMaintenance = new Maintenance();
        partialUpdatedMaintenance.setId(maintenance.getId());

        partialUpdatedMaintenance
            .description(UPDATED_DESCRIPTION)
            .solution(UPDATED_SOLUTION)
            .etat(UPDATED_ETAT)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN)
            .duree(UPDATED_DUREE);

        restMaintenanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMaintenance.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMaintenance))
            )
            .andExpect(status().isOk());

        // Validate the Maintenance in the database
        List<Maintenance> maintenanceList = maintenanceRepository.findAll();
        assertThat(maintenanceList).hasSize(databaseSizeBeforeUpdate);
        Maintenance testMaintenance = maintenanceList.get(maintenanceList.size() - 1);
        assertThat(testMaintenance.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testMaintenance.getProduit()).isEqualTo(DEFAULT_PRODUIT);
        assertThat(testMaintenance.getSolution()).isEqualTo(UPDATED_SOLUTION);
        assertThat(testMaintenance.getEtat()).isEqualTo(UPDATED_ETAT);
        assertThat(testMaintenance.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testMaintenance.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
        assertThat(testMaintenance.getDuree()).isEqualTo(UPDATED_DUREE);
    }

    @Test
    @Transactional
    void fullUpdateMaintenanceWithPatch() throws Exception {
        // Initialize the database
        maintenanceRepository.saveAndFlush(maintenance);

        int databaseSizeBeforeUpdate = maintenanceRepository.findAll().size();

        // Update the maintenance using partial update
        Maintenance partialUpdatedMaintenance = new Maintenance();
        partialUpdatedMaintenance.setId(maintenance.getId());

        partialUpdatedMaintenance
            .description(UPDATED_DESCRIPTION)
            .produit(UPDATED_PRODUIT)
            .solution(UPDATED_SOLUTION)
            .etat(UPDATED_ETAT)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN)
            .duree(UPDATED_DUREE);

        restMaintenanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMaintenance.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMaintenance))
            )
            .andExpect(status().isOk());

        // Validate the Maintenance in the database
        List<Maintenance> maintenanceList = maintenanceRepository.findAll();
        assertThat(maintenanceList).hasSize(databaseSizeBeforeUpdate);
        Maintenance testMaintenance = maintenanceList.get(maintenanceList.size() - 1);
        assertThat(testMaintenance.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testMaintenance.getProduit()).isEqualTo(UPDATED_PRODUIT);
        assertThat(testMaintenance.getSolution()).isEqualTo(UPDATED_SOLUTION);
        assertThat(testMaintenance.getEtat()).isEqualTo(UPDATED_ETAT);
        assertThat(testMaintenance.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testMaintenance.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
        assertThat(testMaintenance.getDuree()).isEqualTo(UPDATED_DUREE);
    }

    @Test
    @Transactional
    void patchNonExistingMaintenance() throws Exception {
        int databaseSizeBeforeUpdate = maintenanceRepository.findAll().size();
        maintenance.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMaintenanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, maintenance.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(maintenance))
            )
            .andExpect(status().isBadRequest());

        // Validate the Maintenance in the database
        List<Maintenance> maintenanceList = maintenanceRepository.findAll();
        assertThat(maintenanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMaintenance() throws Exception {
        int databaseSizeBeforeUpdate = maintenanceRepository.findAll().size();
        maintenance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMaintenanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(maintenance))
            )
            .andExpect(status().isBadRequest());

        // Validate the Maintenance in the database
        List<Maintenance> maintenanceList = maintenanceRepository.findAll();
        assertThat(maintenanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMaintenance() throws Exception {
        int databaseSizeBeforeUpdate = maintenanceRepository.findAll().size();
        maintenance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMaintenanceMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(maintenance))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Maintenance in the database
        List<Maintenance> maintenanceList = maintenanceRepository.findAll();
        assertThat(maintenanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMaintenance() throws Exception {
        // Initialize the database
        maintenanceRepository.saveAndFlush(maintenance);

        int databaseSizeBeforeDelete = maintenanceRepository.findAll().size();

        // Delete the maintenance
        restMaintenanceMockMvc
            .perform(delete(ENTITY_API_URL_ID, maintenance.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Maintenance> maintenanceList = maintenanceRepository.findAll();
        assertThat(maintenanceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
