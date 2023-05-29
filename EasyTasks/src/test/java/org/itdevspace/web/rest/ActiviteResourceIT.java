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
import org.itdevspace.domain.Livrable;
import org.itdevspace.domain.enumeration.Etat;
import org.itdevspace.repository.ActiviteRepository;
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
 * Integration tests for the {@link ActiviteResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ActiviteResourceIT {

    private static final String DEFAULT_REF_ACT = "AAAAAAAAAA";
    private static final String UPDATED_REF_ACT = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE_DEBUT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_DEBUT = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATE_FIN = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_FIN = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_RAF = "AAAAAAAAAA";
    private static final String UPDATED_RAF = "BBBBBBBBBB";

    private static final Etat DEFAULT_ETAT = Etat.Planifier;
    private static final Etat UPDATED_ETAT = Etat.EnCours;

    private static final String ENTITY_API_URL = "/api/activites";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ActiviteRepository activiteRepository;

    @Mock
    private ActiviteRepository activiteRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restActiviteMockMvc;

    private Activite activite;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Activite createEntity(EntityManager em) {
        Activite activite = new Activite()
            .refAct(DEFAULT_REF_ACT)
            .description(DEFAULT_DESCRIPTION)
            .dateDebut(DEFAULT_DATE_DEBUT)
            .dateFin(DEFAULT_DATE_FIN)
            .raf(DEFAULT_RAF)
            .etat(DEFAULT_ETAT);
        // Add required entity
        Livrable livrable;
        if (TestUtil.findAll(em, Livrable.class).isEmpty()) {
            livrable = LivrableResourceIT.createEntity(em);
            em.persist(livrable);
            em.flush();
        } else {
            livrable = TestUtil.findAll(em, Livrable.class).get(0);
        }
        activite.setLivrable(livrable);
        return activite;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Activite createUpdatedEntity(EntityManager em) {
        Activite activite = new Activite()
            .refAct(UPDATED_REF_ACT)
            .description(UPDATED_DESCRIPTION)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN)
            .raf(UPDATED_RAF)
            .etat(UPDATED_ETAT);
        // Add required entity
        Livrable livrable;
        if (TestUtil.findAll(em, Livrable.class).isEmpty()) {
            livrable = LivrableResourceIT.createUpdatedEntity(em);
            em.persist(livrable);
            em.flush();
        } else {
            livrable = TestUtil.findAll(em, Livrable.class).get(0);
        }
        activite.setLivrable(livrable);
        return activite;
    }

    @BeforeEach
    public void initTest() {
        activite = createEntity(em);
    }

    @Test
    @Transactional
    void createActivite() throws Exception {
        int databaseSizeBeforeCreate = activiteRepository.findAll().size();
        // Create the Activite
        restActiviteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activite)))
            .andExpect(status().isCreated());

        // Validate the Activite in the database
        List<Activite> activiteList = activiteRepository.findAll();
        assertThat(activiteList).hasSize(databaseSizeBeforeCreate + 1);
        Activite testActivite = activiteList.get(activiteList.size() - 1);
        assertThat(testActivite.getRefAct()).isEqualTo(DEFAULT_REF_ACT);
        assertThat(testActivite.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testActivite.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testActivite.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
        assertThat(testActivite.getRaf()).isEqualTo(DEFAULT_RAF);
        assertThat(testActivite.getEtat()).isEqualTo(DEFAULT_ETAT);
    }

    @Test
    @Transactional
    void createActiviteWithExistingId() throws Exception {
        // Create the Activite with an existing ID
        activite.setId(1L);

        int databaseSizeBeforeCreate = activiteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restActiviteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activite)))
            .andExpect(status().isBadRequest());

        // Validate the Activite in the database
        List<Activite> activiteList = activiteRepository.findAll();
        assertThat(activiteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkRefActIsRequired() throws Exception {
        int databaseSizeBeforeTest = activiteRepository.findAll().size();
        // set the field null
        activite.setRefAct(null);

        // Create the Activite, which fails.

        restActiviteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activite)))
            .andExpect(status().isBadRequest());

        List<Activite> activiteList = activiteRepository.findAll();
        assertThat(activiteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = activiteRepository.findAll().size();
        // set the field null
        activite.setDescription(null);

        // Create the Activite, which fails.

        restActiviteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activite)))
            .andExpect(status().isBadRequest());

        List<Activite> activiteList = activiteRepository.findAll();
        assertThat(activiteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateDebutIsRequired() throws Exception {
        int databaseSizeBeforeTest = activiteRepository.findAll().size();
        // set the field null
        activite.setDateDebut(null);

        // Create the Activite, which fails.

        restActiviteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activite)))
            .andExpect(status().isBadRequest());

        List<Activite> activiteList = activiteRepository.findAll();
        assertThat(activiteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllActivites() throws Exception {
        // Initialize the database
        activiteRepository.saveAndFlush(activite);

        // Get all the activiteList
        restActiviteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(activite.getId().intValue())))
            .andExpect(jsonPath("$.[*].refAct").value(hasItem(DEFAULT_REF_ACT)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].dateDebut").value(hasItem(DEFAULT_DATE_DEBUT.toString())))
            .andExpect(jsonPath("$.[*].dateFin").value(hasItem(DEFAULT_DATE_FIN.toString())))
            .andExpect(jsonPath("$.[*].raf").value(hasItem(DEFAULT_RAF)))
            .andExpect(jsonPath("$.[*].etat").value(hasItem(DEFAULT_ETAT.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllActivitesWithEagerRelationshipsIsEnabled() throws Exception {
        when(activiteRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restActiviteMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(activiteRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllActivitesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(activiteRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restActiviteMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(activiteRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getActivite() throws Exception {
        // Initialize the database
        activiteRepository.saveAndFlush(activite);

        // Get the activite
        restActiviteMockMvc
            .perform(get(ENTITY_API_URL_ID, activite.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(activite.getId().intValue()))
            .andExpect(jsonPath("$.refAct").value(DEFAULT_REF_ACT))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.dateDebut").value(DEFAULT_DATE_DEBUT.toString()))
            .andExpect(jsonPath("$.dateFin").value(DEFAULT_DATE_FIN.toString()))
            .andExpect(jsonPath("$.raf").value(DEFAULT_RAF))
            .andExpect(jsonPath("$.etat").value(DEFAULT_ETAT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingActivite() throws Exception {
        // Get the activite
        restActiviteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingActivite() throws Exception {
        // Initialize the database
        activiteRepository.saveAndFlush(activite);

        int databaseSizeBeforeUpdate = activiteRepository.findAll().size();

        // Update the activite
        Activite updatedActivite = activiteRepository.findById(activite.getId()).get();
        // Disconnect from session so that the updates on updatedActivite are not directly saved in db
        em.detach(updatedActivite);
        updatedActivite
            .refAct(UPDATED_REF_ACT)
            .description(UPDATED_DESCRIPTION)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN)
            .raf(UPDATED_RAF)
            .etat(UPDATED_ETAT);

        restActiviteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedActivite.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedActivite))
            )
            .andExpect(status().isOk());

        // Validate the Activite in the database
        List<Activite> activiteList = activiteRepository.findAll();
        assertThat(activiteList).hasSize(databaseSizeBeforeUpdate);
        Activite testActivite = activiteList.get(activiteList.size() - 1);
        assertThat(testActivite.getRefAct()).isEqualTo(UPDATED_REF_ACT);
        assertThat(testActivite.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testActivite.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testActivite.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
        assertThat(testActivite.getRaf()).isEqualTo(UPDATED_RAF);
        assertThat(testActivite.getEtat()).isEqualTo(UPDATED_ETAT);
    }

    @Test
    @Transactional
    void putNonExistingActivite() throws Exception {
        int databaseSizeBeforeUpdate = activiteRepository.findAll().size();
        activite.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActiviteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, activite.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(activite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Activite in the database
        List<Activite> activiteList = activiteRepository.findAll();
        assertThat(activiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchActivite() throws Exception {
        int databaseSizeBeforeUpdate = activiteRepository.findAll().size();
        activite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActiviteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(activite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Activite in the database
        List<Activite> activiteList = activiteRepository.findAll();
        assertThat(activiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamActivite() throws Exception {
        int databaseSizeBeforeUpdate = activiteRepository.findAll().size();
        activite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActiviteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activite)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Activite in the database
        List<Activite> activiteList = activiteRepository.findAll();
        assertThat(activiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateActiviteWithPatch() throws Exception {
        // Initialize the database
        activiteRepository.saveAndFlush(activite);

        int databaseSizeBeforeUpdate = activiteRepository.findAll().size();

        // Update the activite using partial update
        Activite partialUpdatedActivite = new Activite();
        partialUpdatedActivite.setId(activite.getId());

        partialUpdatedActivite
            .refAct(UPDATED_REF_ACT)
            .description(UPDATED_DESCRIPTION)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN)
            .raf(UPDATED_RAF);

        restActiviteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActivite.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActivite))
            )
            .andExpect(status().isOk());

        // Validate the Activite in the database
        List<Activite> activiteList = activiteRepository.findAll();
        assertThat(activiteList).hasSize(databaseSizeBeforeUpdate);
        Activite testActivite = activiteList.get(activiteList.size() - 1);
        assertThat(testActivite.getRefAct()).isEqualTo(UPDATED_REF_ACT);
        assertThat(testActivite.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testActivite.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testActivite.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
        assertThat(testActivite.getRaf()).isEqualTo(UPDATED_RAF);
        assertThat(testActivite.getEtat()).isEqualTo(DEFAULT_ETAT);
    }

    @Test
    @Transactional
    void fullUpdateActiviteWithPatch() throws Exception {
        // Initialize the database
        activiteRepository.saveAndFlush(activite);

        int databaseSizeBeforeUpdate = activiteRepository.findAll().size();

        // Update the activite using partial update
        Activite partialUpdatedActivite = new Activite();
        partialUpdatedActivite.setId(activite.getId());

        partialUpdatedActivite
            .refAct(UPDATED_REF_ACT)
            .description(UPDATED_DESCRIPTION)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN)
            .raf(UPDATED_RAF)
            .etat(UPDATED_ETAT);

        restActiviteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActivite.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActivite))
            )
            .andExpect(status().isOk());

        // Validate the Activite in the database
        List<Activite> activiteList = activiteRepository.findAll();
        assertThat(activiteList).hasSize(databaseSizeBeforeUpdate);
        Activite testActivite = activiteList.get(activiteList.size() - 1);
        assertThat(testActivite.getRefAct()).isEqualTo(UPDATED_REF_ACT);
        assertThat(testActivite.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testActivite.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testActivite.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
        assertThat(testActivite.getRaf()).isEqualTo(UPDATED_RAF);
        assertThat(testActivite.getEtat()).isEqualTo(UPDATED_ETAT);
    }

    @Test
    @Transactional
    void patchNonExistingActivite() throws Exception {
        int databaseSizeBeforeUpdate = activiteRepository.findAll().size();
        activite.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActiviteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, activite.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(activite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Activite in the database
        List<Activite> activiteList = activiteRepository.findAll();
        assertThat(activiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchActivite() throws Exception {
        int databaseSizeBeforeUpdate = activiteRepository.findAll().size();
        activite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActiviteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(activite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Activite in the database
        List<Activite> activiteList = activiteRepository.findAll();
        assertThat(activiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamActivite() throws Exception {
        int databaseSizeBeforeUpdate = activiteRepository.findAll().size();
        activite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActiviteMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(activite)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Activite in the database
        List<Activite> activiteList = activiteRepository.findAll();
        assertThat(activiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteActivite() throws Exception {
        // Initialize the database
        activiteRepository.saveAndFlush(activite);

        int databaseSizeBeforeDelete = activiteRepository.findAll().size();

        // Delete the activite
        restActiviteMockMvc
            .perform(delete(ENTITY_API_URL_ID, activite.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Activite> activiteList = activiteRepository.findAll();
        assertThat(activiteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
