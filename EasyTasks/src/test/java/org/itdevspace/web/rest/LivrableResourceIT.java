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
import org.itdevspace.domain.Livrable;
import org.itdevspace.domain.Projet;
import org.itdevspace.domain.enumeration.Etat;
import org.itdevspace.repository.LivrableRepository;
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
 * Integration tests for the {@link LivrableResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class LivrableResourceIT {

    private static final String DEFAULT_REF_LIVRABLE = "AAAAAAAAAA";
    private static final String UPDATED_REF_LIVRABLE = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE_DEBUT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_DEBUT = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATE_FIN = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_FIN = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Etat DEFAULT_ETAT = Etat.Planifier;
    private static final Etat UPDATED_ETAT = Etat.EnCours;

    private static final String ENTITY_API_URL = "/api/livrables";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LivrableRepository livrableRepository;

    @Mock
    private LivrableRepository livrableRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLivrableMockMvc;

    private Livrable livrable;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Livrable createEntity(EntityManager em) {
        Livrable livrable = new Livrable()
            .refLivrable(DEFAULT_REF_LIVRABLE)
            .dateDebut(DEFAULT_DATE_DEBUT)
            .dateFin(DEFAULT_DATE_FIN)
            .description(DEFAULT_DESCRIPTION)
            .etat(DEFAULT_ETAT);
        // Add required entity
        Projet projet;
        if (TestUtil.findAll(em, Projet.class).isEmpty()) {
            projet = ProjetResourceIT.createEntity(em);
            em.persist(projet);
            em.flush();
        } else {
            projet = TestUtil.findAll(em, Projet.class).get(0);
        }
        livrable.setProjet(projet);
        return livrable;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Livrable createUpdatedEntity(EntityManager em) {
        Livrable livrable = new Livrable()
            .refLivrable(UPDATED_REF_LIVRABLE)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN)
            .description(UPDATED_DESCRIPTION)
            .etat(UPDATED_ETAT);
        // Add required entity
        Projet projet;
        if (TestUtil.findAll(em, Projet.class).isEmpty()) {
            projet = ProjetResourceIT.createUpdatedEntity(em);
            em.persist(projet);
            em.flush();
        } else {
            projet = TestUtil.findAll(em, Projet.class).get(0);
        }
        livrable.setProjet(projet);
        return livrable;
    }

    @BeforeEach
    public void initTest() {
        livrable = createEntity(em);
    }

    @Test
    @Transactional
    void createLivrable() throws Exception {
        int databaseSizeBeforeCreate = livrableRepository.findAll().size();
        // Create the Livrable
        restLivrableMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(livrable)))
            .andExpect(status().isCreated());

        // Validate the Livrable in the database
        List<Livrable> livrableList = livrableRepository.findAll();
        assertThat(livrableList).hasSize(databaseSizeBeforeCreate + 1);
        Livrable testLivrable = livrableList.get(livrableList.size() - 1);
        assertThat(testLivrable.getRefLivrable()).isEqualTo(DEFAULT_REF_LIVRABLE);
        assertThat(testLivrable.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testLivrable.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
        assertThat(testLivrable.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testLivrable.getEtat()).isEqualTo(DEFAULT_ETAT);
    }

    @Test
    @Transactional
    void createLivrableWithExistingId() throws Exception {
        // Create the Livrable with an existing ID
        livrable.setId(1L);

        int databaseSizeBeforeCreate = livrableRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLivrableMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(livrable)))
            .andExpect(status().isBadRequest());

        // Validate the Livrable in the database
        List<Livrable> livrableList = livrableRepository.findAll();
        assertThat(livrableList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkRefLivrableIsRequired() throws Exception {
        int databaseSizeBeforeTest = livrableRepository.findAll().size();
        // set the field null
        livrable.setRefLivrable(null);

        // Create the Livrable, which fails.

        restLivrableMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(livrable)))
            .andExpect(status().isBadRequest());

        List<Livrable> livrableList = livrableRepository.findAll();
        assertThat(livrableList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateDebutIsRequired() throws Exception {
        int databaseSizeBeforeTest = livrableRepository.findAll().size();
        // set the field null
        livrable.setDateDebut(null);

        // Create the Livrable, which fails.

        restLivrableMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(livrable)))
            .andExpect(status().isBadRequest());

        List<Livrable> livrableList = livrableRepository.findAll();
        assertThat(livrableList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = livrableRepository.findAll().size();
        // set the field null
        livrable.setDescription(null);

        // Create the Livrable, which fails.

        restLivrableMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(livrable)))
            .andExpect(status().isBadRequest());

        List<Livrable> livrableList = livrableRepository.findAll();
        assertThat(livrableList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllLivrables() throws Exception {
        // Initialize the database
        livrableRepository.saveAndFlush(livrable);

        // Get all the livrableList
        restLivrableMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(livrable.getId().intValue())))
            .andExpect(jsonPath("$.[*].refLivrable").value(hasItem(DEFAULT_REF_LIVRABLE)))
            .andExpect(jsonPath("$.[*].dateDebut").value(hasItem(DEFAULT_DATE_DEBUT.toString())))
            .andExpect(jsonPath("$.[*].dateFin").value(hasItem(DEFAULT_DATE_FIN.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].etat").value(hasItem(DEFAULT_ETAT.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllLivrablesWithEagerRelationshipsIsEnabled() throws Exception {
        when(livrableRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restLivrableMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(livrableRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllLivrablesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(livrableRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restLivrableMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(livrableRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getLivrable() throws Exception {
        // Initialize the database
        livrableRepository.saveAndFlush(livrable);

        // Get the livrable
        restLivrableMockMvc
            .perform(get(ENTITY_API_URL_ID, livrable.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(livrable.getId().intValue()))
            .andExpect(jsonPath("$.refLivrable").value(DEFAULT_REF_LIVRABLE))
            .andExpect(jsonPath("$.dateDebut").value(DEFAULT_DATE_DEBUT.toString()))
            .andExpect(jsonPath("$.dateFin").value(DEFAULT_DATE_FIN.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.etat").value(DEFAULT_ETAT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingLivrable() throws Exception {
        // Get the livrable
        restLivrableMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLivrable() throws Exception {
        // Initialize the database
        livrableRepository.saveAndFlush(livrable);

        int databaseSizeBeforeUpdate = livrableRepository.findAll().size();

        // Update the livrable
        Livrable updatedLivrable = livrableRepository.findById(livrable.getId()).get();
        // Disconnect from session so that the updates on updatedLivrable are not directly saved in db
        em.detach(updatedLivrable);
        updatedLivrable
            .refLivrable(UPDATED_REF_LIVRABLE)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN)
            .description(UPDATED_DESCRIPTION)
            .etat(UPDATED_ETAT);

        restLivrableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLivrable.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLivrable))
            )
            .andExpect(status().isOk());

        // Validate the Livrable in the database
        List<Livrable> livrableList = livrableRepository.findAll();
        assertThat(livrableList).hasSize(databaseSizeBeforeUpdate);
        Livrable testLivrable = livrableList.get(livrableList.size() - 1);
        assertThat(testLivrable.getRefLivrable()).isEqualTo(UPDATED_REF_LIVRABLE);
        assertThat(testLivrable.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testLivrable.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
        assertThat(testLivrable.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testLivrable.getEtat()).isEqualTo(UPDATED_ETAT);
    }

    @Test
    @Transactional
    void putNonExistingLivrable() throws Exception {
        int databaseSizeBeforeUpdate = livrableRepository.findAll().size();
        livrable.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLivrableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, livrable.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(livrable))
            )
            .andExpect(status().isBadRequest());

        // Validate the Livrable in the database
        List<Livrable> livrableList = livrableRepository.findAll();
        assertThat(livrableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLivrable() throws Exception {
        int databaseSizeBeforeUpdate = livrableRepository.findAll().size();
        livrable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLivrableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(livrable))
            )
            .andExpect(status().isBadRequest());

        // Validate the Livrable in the database
        List<Livrable> livrableList = livrableRepository.findAll();
        assertThat(livrableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLivrable() throws Exception {
        int databaseSizeBeforeUpdate = livrableRepository.findAll().size();
        livrable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLivrableMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(livrable)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Livrable in the database
        List<Livrable> livrableList = livrableRepository.findAll();
        assertThat(livrableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLivrableWithPatch() throws Exception {
        // Initialize the database
        livrableRepository.saveAndFlush(livrable);

        int databaseSizeBeforeUpdate = livrableRepository.findAll().size();

        // Update the livrable using partial update
        Livrable partialUpdatedLivrable = new Livrable();
        partialUpdatedLivrable.setId(livrable.getId());

        partialUpdatedLivrable.dateDebut(UPDATED_DATE_DEBUT).description(UPDATED_DESCRIPTION).etat(UPDATED_ETAT);

        restLivrableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLivrable.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLivrable))
            )
            .andExpect(status().isOk());

        // Validate the Livrable in the database
        List<Livrable> livrableList = livrableRepository.findAll();
        assertThat(livrableList).hasSize(databaseSizeBeforeUpdate);
        Livrable testLivrable = livrableList.get(livrableList.size() - 1);
        assertThat(testLivrable.getRefLivrable()).isEqualTo(DEFAULT_REF_LIVRABLE);
        assertThat(testLivrable.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testLivrable.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
        assertThat(testLivrable.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testLivrable.getEtat()).isEqualTo(UPDATED_ETAT);
    }

    @Test
    @Transactional
    void fullUpdateLivrableWithPatch() throws Exception {
        // Initialize the database
        livrableRepository.saveAndFlush(livrable);

        int databaseSizeBeforeUpdate = livrableRepository.findAll().size();

        // Update the livrable using partial update
        Livrable partialUpdatedLivrable = new Livrable();
        partialUpdatedLivrable.setId(livrable.getId());

        partialUpdatedLivrable
            .refLivrable(UPDATED_REF_LIVRABLE)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN)
            .description(UPDATED_DESCRIPTION)
            .etat(UPDATED_ETAT);

        restLivrableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLivrable.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLivrable))
            )
            .andExpect(status().isOk());

        // Validate the Livrable in the database
        List<Livrable> livrableList = livrableRepository.findAll();
        assertThat(livrableList).hasSize(databaseSizeBeforeUpdate);
        Livrable testLivrable = livrableList.get(livrableList.size() - 1);
        assertThat(testLivrable.getRefLivrable()).isEqualTo(UPDATED_REF_LIVRABLE);
        assertThat(testLivrable.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testLivrable.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
        assertThat(testLivrable.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testLivrable.getEtat()).isEqualTo(UPDATED_ETAT);
    }

    @Test
    @Transactional
    void patchNonExistingLivrable() throws Exception {
        int databaseSizeBeforeUpdate = livrableRepository.findAll().size();
        livrable.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLivrableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, livrable.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(livrable))
            )
            .andExpect(status().isBadRequest());

        // Validate the Livrable in the database
        List<Livrable> livrableList = livrableRepository.findAll();
        assertThat(livrableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLivrable() throws Exception {
        int databaseSizeBeforeUpdate = livrableRepository.findAll().size();
        livrable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLivrableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(livrable))
            )
            .andExpect(status().isBadRequest());

        // Validate the Livrable in the database
        List<Livrable> livrableList = livrableRepository.findAll();
        assertThat(livrableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLivrable() throws Exception {
        int databaseSizeBeforeUpdate = livrableRepository.findAll().size();
        livrable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLivrableMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(livrable)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Livrable in the database
        List<Livrable> livrableList = livrableRepository.findAll();
        assertThat(livrableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLivrable() throws Exception {
        // Initialize the database
        livrableRepository.saveAndFlush(livrable);

        int databaseSizeBeforeDelete = livrableRepository.findAll().size();

        // Delete the livrable
        restLivrableMockMvc
            .perform(delete(ENTITY_API_URL_ID, livrable.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Livrable> livrableList = livrableRepository.findAll();
        assertThat(livrableList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
