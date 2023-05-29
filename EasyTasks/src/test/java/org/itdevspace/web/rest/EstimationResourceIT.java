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
import org.itdevspace.domain.Activite;
import org.itdevspace.domain.Estimation;
import org.itdevspace.domain.Livrable;
import org.itdevspace.domain.Projet;
import org.itdevspace.domain.enumeration.TypeEntite;
import org.itdevspace.repository.EstimationRepository;
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
 * Integration tests for the {@link EstimationResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class EstimationResourceIT {

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Double DEFAULT_VALEUR_JOUR = 1D;
    private static final Double UPDATED_VALEUR_JOUR = 2D;

    private static final Double DEFAULT_VALEUR_HEURE = 1D;
    private static final Double UPDATED_VALEUR_HEURE = 2D;

    private static final Boolean DEFAULT_PRISE_EN_CHARGE = false;
    private static final Boolean UPDATED_PRISE_EN_CHARGE = true;

    private static final TypeEntite DEFAULT_TYPE = TypeEntite.Projet;
    private static final TypeEntite UPDATED_TYPE = TypeEntite.Livrable;

    private static final String ENTITY_API_URL = "/api/estimations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EstimationRepository estimationRepository;

    @Mock
    private EstimationRepository estimationRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEstimationMockMvc;

    private Estimation estimation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Estimation createEntity(EntityManager em) {
        Estimation estimation = new Estimation()
            .date(DEFAULT_DATE)
            .valeurJour(DEFAULT_VALEUR_JOUR)
            .valeurHeure(DEFAULT_VALEUR_HEURE)
            .priseEnCharge(DEFAULT_PRISE_EN_CHARGE)
            .type(DEFAULT_TYPE);
        // Add required entity
        Projet projet;
        if (TestUtil.findAll(em, Projet.class).isEmpty()) {
            projet = ProjetResourceIT.createEntity(em);
            em.persist(projet);
            em.flush();
        } else {
            projet = TestUtil.findAll(em, Projet.class).get(0);
        }
        estimation.setProjet(projet);
        // Add required entity
        Livrable livrable;
        if (TestUtil.findAll(em, Livrable.class).isEmpty()) {
            livrable = LivrableResourceIT.createEntity(em);
            em.persist(livrable);
            em.flush();
        } else {
            livrable = TestUtil.findAll(em, Livrable.class).get(0);
        }
        estimation.setLivrable(livrable);
        // Add required entity
        Activite activite;
        if (TestUtil.findAll(em, Activite.class).isEmpty()) {
            activite = ActiviteResourceIT.createEntity(em);
            em.persist(activite);
            em.flush();
        } else {
            activite = TestUtil.findAll(em, Activite.class).get(0);
        }
        estimation.setActivite(activite);
        return estimation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Estimation createUpdatedEntity(EntityManager em) {
        Estimation estimation = new Estimation()
            .date(UPDATED_DATE)
            .valeurJour(UPDATED_VALEUR_JOUR)
            .valeurHeure(UPDATED_VALEUR_HEURE)
            .priseEnCharge(UPDATED_PRISE_EN_CHARGE)
            .type(UPDATED_TYPE);
        // Add required entity
        Projet projet;
        if (TestUtil.findAll(em, Projet.class).isEmpty()) {
            projet = ProjetResourceIT.createUpdatedEntity(em);
            em.persist(projet);
            em.flush();
        } else {
            projet = TestUtil.findAll(em, Projet.class).get(0);
        }
        estimation.setProjet(projet);
        // Add required entity
        Livrable livrable;
        if (TestUtil.findAll(em, Livrable.class).isEmpty()) {
            livrable = LivrableResourceIT.createUpdatedEntity(em);
            em.persist(livrable);
            em.flush();
        } else {
            livrable = TestUtil.findAll(em, Livrable.class).get(0);
        }
        estimation.setLivrable(livrable);
        // Add required entity
        Activite activite;
        if (TestUtil.findAll(em, Activite.class).isEmpty()) {
            activite = ActiviteResourceIT.createUpdatedEntity(em);
            em.persist(activite);
            em.flush();
        } else {
            activite = TestUtil.findAll(em, Activite.class).get(0);
        }
        estimation.setActivite(activite);
        return estimation;
    }

    @BeforeEach
    public void initTest() {
        estimation = createEntity(em);
    }

    @Test
    @Transactional
    void createEstimation() throws Exception {
        int databaseSizeBeforeCreate = estimationRepository.findAll().size();
        // Create the Estimation
        restEstimationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(estimation)))
            .andExpect(status().isCreated());

        // Validate the Estimation in the database
        List<Estimation> estimationList = estimationRepository.findAll();
        assertThat(estimationList).hasSize(databaseSizeBeforeCreate + 1);
        Estimation testEstimation = estimationList.get(estimationList.size() - 1);
        assertThat(testEstimation.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testEstimation.getValeurJour()).isEqualTo(DEFAULT_VALEUR_JOUR);
        assertThat(testEstimation.getValeurHeure()).isEqualTo(DEFAULT_VALEUR_HEURE);
        assertThat(testEstimation.getPriseEnCharge()).isEqualTo(DEFAULT_PRISE_EN_CHARGE);
        assertThat(testEstimation.getType()).isEqualTo(DEFAULT_TYPE);
    }

    @Test
    @Transactional
    void createEstimationWithExistingId() throws Exception {
        // Create the Estimation with an existing ID
        estimation.setId(1L);

        int databaseSizeBeforeCreate = estimationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEstimationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(estimation)))
            .andExpect(status().isBadRequest());

        // Validate the Estimation in the database
        List<Estimation> estimationList = estimationRepository.findAll();
        assertThat(estimationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEstimations() throws Exception {
        // Initialize the database
        estimationRepository.saveAndFlush(estimation);

        // Get all the estimationList
        restEstimationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(estimation.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].valeurJour").value(hasItem(DEFAULT_VALEUR_JOUR.doubleValue())))
            .andExpect(jsonPath("$.[*].valeurHeure").value(hasItem(DEFAULT_VALEUR_HEURE.doubleValue())))
            .andExpect(jsonPath("$.[*].priseEnCharge").value(hasItem(DEFAULT_PRISE_EN_CHARGE.booleanValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllEstimationsWithEagerRelationshipsIsEnabled() throws Exception {
        when(estimationRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restEstimationMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(estimationRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllEstimationsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(estimationRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restEstimationMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(estimationRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getEstimation() throws Exception {
        // Initialize the database
        estimationRepository.saveAndFlush(estimation);

        // Get the estimation
        restEstimationMockMvc
            .perform(get(ENTITY_API_URL_ID, estimation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(estimation.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.valeurJour").value(DEFAULT_VALEUR_JOUR.doubleValue()))
            .andExpect(jsonPath("$.valeurHeure").value(DEFAULT_VALEUR_HEURE.doubleValue()))
            .andExpect(jsonPath("$.priseEnCharge").value(DEFAULT_PRISE_EN_CHARGE.booleanValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingEstimation() throws Exception {
        // Get the estimation
        restEstimationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEstimation() throws Exception {
        // Initialize the database
        estimationRepository.saveAndFlush(estimation);

        int databaseSizeBeforeUpdate = estimationRepository.findAll().size();

        // Update the estimation
        Estimation updatedEstimation = estimationRepository.findById(estimation.getId()).get();
        // Disconnect from session so that the updates on updatedEstimation are not directly saved in db
        em.detach(updatedEstimation);
        updatedEstimation
            .date(UPDATED_DATE)
            .valeurJour(UPDATED_VALEUR_JOUR)
            .valeurHeure(UPDATED_VALEUR_HEURE)
            .priseEnCharge(UPDATED_PRISE_EN_CHARGE)
            .type(UPDATED_TYPE);

        restEstimationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEstimation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEstimation))
            )
            .andExpect(status().isOk());

        // Validate the Estimation in the database
        List<Estimation> estimationList = estimationRepository.findAll();
        assertThat(estimationList).hasSize(databaseSizeBeforeUpdate);
        Estimation testEstimation = estimationList.get(estimationList.size() - 1);
        assertThat(testEstimation.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testEstimation.getValeurJour()).isEqualTo(UPDATED_VALEUR_JOUR);
        assertThat(testEstimation.getValeurHeure()).isEqualTo(UPDATED_VALEUR_HEURE);
        assertThat(testEstimation.getPriseEnCharge()).isEqualTo(UPDATED_PRISE_EN_CHARGE);
        assertThat(testEstimation.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingEstimation() throws Exception {
        int databaseSizeBeforeUpdate = estimationRepository.findAll().size();
        estimation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEstimationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, estimation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(estimation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Estimation in the database
        List<Estimation> estimationList = estimationRepository.findAll();
        assertThat(estimationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEstimation() throws Exception {
        int databaseSizeBeforeUpdate = estimationRepository.findAll().size();
        estimation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstimationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(estimation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Estimation in the database
        List<Estimation> estimationList = estimationRepository.findAll();
        assertThat(estimationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEstimation() throws Exception {
        int databaseSizeBeforeUpdate = estimationRepository.findAll().size();
        estimation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstimationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(estimation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Estimation in the database
        List<Estimation> estimationList = estimationRepository.findAll();
        assertThat(estimationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEstimationWithPatch() throws Exception {
        // Initialize the database
        estimationRepository.saveAndFlush(estimation);

        int databaseSizeBeforeUpdate = estimationRepository.findAll().size();

        // Update the estimation using partial update
        Estimation partialUpdatedEstimation = new Estimation();
        partialUpdatedEstimation.setId(estimation.getId());

        partialUpdatedEstimation.valeurJour(UPDATED_VALEUR_JOUR).type(UPDATED_TYPE);

        restEstimationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEstimation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEstimation))
            )
            .andExpect(status().isOk());

        // Validate the Estimation in the database
        List<Estimation> estimationList = estimationRepository.findAll();
        assertThat(estimationList).hasSize(databaseSizeBeforeUpdate);
        Estimation testEstimation = estimationList.get(estimationList.size() - 1);
        assertThat(testEstimation.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testEstimation.getValeurJour()).isEqualTo(UPDATED_VALEUR_JOUR);
        assertThat(testEstimation.getValeurHeure()).isEqualTo(DEFAULT_VALEUR_HEURE);
        assertThat(testEstimation.getPriseEnCharge()).isEqualTo(DEFAULT_PRISE_EN_CHARGE);
        assertThat(testEstimation.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateEstimationWithPatch() throws Exception {
        // Initialize the database
        estimationRepository.saveAndFlush(estimation);

        int databaseSizeBeforeUpdate = estimationRepository.findAll().size();

        // Update the estimation using partial update
        Estimation partialUpdatedEstimation = new Estimation();
        partialUpdatedEstimation.setId(estimation.getId());

        partialUpdatedEstimation
            .date(UPDATED_DATE)
            .valeurJour(UPDATED_VALEUR_JOUR)
            .valeurHeure(UPDATED_VALEUR_HEURE)
            .priseEnCharge(UPDATED_PRISE_EN_CHARGE)
            .type(UPDATED_TYPE);

        restEstimationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEstimation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEstimation))
            )
            .andExpect(status().isOk());

        // Validate the Estimation in the database
        List<Estimation> estimationList = estimationRepository.findAll();
        assertThat(estimationList).hasSize(databaseSizeBeforeUpdate);
        Estimation testEstimation = estimationList.get(estimationList.size() - 1);
        assertThat(testEstimation.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testEstimation.getValeurJour()).isEqualTo(UPDATED_VALEUR_JOUR);
        assertThat(testEstimation.getValeurHeure()).isEqualTo(UPDATED_VALEUR_HEURE);
        assertThat(testEstimation.getPriseEnCharge()).isEqualTo(UPDATED_PRISE_EN_CHARGE);
        assertThat(testEstimation.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingEstimation() throws Exception {
        int databaseSizeBeforeUpdate = estimationRepository.findAll().size();
        estimation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEstimationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, estimation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(estimation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Estimation in the database
        List<Estimation> estimationList = estimationRepository.findAll();
        assertThat(estimationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEstimation() throws Exception {
        int databaseSizeBeforeUpdate = estimationRepository.findAll().size();
        estimation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstimationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(estimation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Estimation in the database
        List<Estimation> estimationList = estimationRepository.findAll();
        assertThat(estimationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEstimation() throws Exception {
        int databaseSizeBeforeUpdate = estimationRepository.findAll().size();
        estimation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstimationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(estimation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Estimation in the database
        List<Estimation> estimationList = estimationRepository.findAll();
        assertThat(estimationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEstimation() throws Exception {
        // Initialize the database
        estimationRepository.saveAndFlush(estimation);

        int databaseSizeBeforeDelete = estimationRepository.findAll().size();

        // Delete the estimation
        restEstimationMockMvc
            .perform(delete(ENTITY_API_URL_ID, estimation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Estimation> estimationList = estimationRepository.findAll();
        assertThat(estimationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
