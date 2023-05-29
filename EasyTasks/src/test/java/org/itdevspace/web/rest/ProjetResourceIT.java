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
import org.itdevspace.domain.Client;
import org.itdevspace.domain.Projet;
import org.itdevspace.domain.enumeration.Etat;
import org.itdevspace.domain.enumeration.Type;
import org.itdevspace.repository.ProjetRepository;
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
 * Integration tests for the {@link ProjetResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ProjetResourceIT {

    private static final String DEFAULT_REF_PROJET = "AAAAAAAAAA";
    private static final String UPDATED_REF_PROJET = "BBBBBBBBBB";

    private static final Type DEFAULT_TYPE = Type.Interne;
    private static final Type UPDATED_TYPE = Type.Externe;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATEDEBUT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATEDEBUT = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATEFIN = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATEFIN = LocalDate.now(ZoneId.systemDefault());

    private static final Etat DEFAULT_ETAT = Etat.Planifier;
    private static final Etat UPDATED_ETAT = Etat.EnCours;

    private static final String ENTITY_API_URL = "/api/projets";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProjetRepository projetRepository;

    @Mock
    private ProjetRepository projetRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProjetMockMvc;

    private Projet projet;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Projet createEntity(EntityManager em) {
        Projet projet = new Projet()
            .refProjet(DEFAULT_REF_PROJET)
            .type(DEFAULT_TYPE)
            .description(DEFAULT_DESCRIPTION)
            .datedebut(DEFAULT_DATEDEBUT)
            .datefin(DEFAULT_DATEFIN)
            .etat(DEFAULT_ETAT);
        // Add required entity
        Client client;
        if (TestUtil.findAll(em, Client.class).isEmpty()) {
            client = ClientResourceIT.createEntity(em);
            em.persist(client);
            em.flush();
        } else {
            client = TestUtil.findAll(em, Client.class).get(0);
        }
        projet.setClient(client);
        return projet;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Projet createUpdatedEntity(EntityManager em) {
        Projet projet = new Projet()
            .refProjet(UPDATED_REF_PROJET)
            .type(UPDATED_TYPE)
            .description(UPDATED_DESCRIPTION)
            .datedebut(UPDATED_DATEDEBUT)
            .datefin(UPDATED_DATEFIN)
            .etat(UPDATED_ETAT);
        // Add required entity
        Client client;
        if (TestUtil.findAll(em, Client.class).isEmpty()) {
            client = ClientResourceIT.createUpdatedEntity(em);
            em.persist(client);
            em.flush();
        } else {
            client = TestUtil.findAll(em, Client.class).get(0);
        }
        projet.setClient(client);
        return projet;
    }

    @BeforeEach
    public void initTest() {
        projet = createEntity(em);
    }

    @Test
    @Transactional
    void createProjet() throws Exception {
        int databaseSizeBeforeCreate = projetRepository.findAll().size();
        // Create the Projet
        restProjetMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(projet)))
            .andExpect(status().isCreated());

        // Validate the Projet in the database
        List<Projet> projetList = projetRepository.findAll();
        assertThat(projetList).hasSize(databaseSizeBeforeCreate + 1);
        Projet testProjet = projetList.get(projetList.size() - 1);
        assertThat(testProjet.getRefProjet()).isEqualTo(DEFAULT_REF_PROJET);
        assertThat(testProjet.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testProjet.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testProjet.getDatedebut()).isEqualTo(DEFAULT_DATEDEBUT);
        assertThat(testProjet.getDatefin()).isEqualTo(DEFAULT_DATEFIN);
        assertThat(testProjet.getEtat()).isEqualTo(DEFAULT_ETAT);
    }

    @Test
    @Transactional
    void createProjetWithExistingId() throws Exception {
        // Create the Projet with an existing ID
        projet.setId(1L);

        int databaseSizeBeforeCreate = projetRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProjetMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(projet)))
            .andExpect(status().isBadRequest());

        // Validate the Projet in the database
        List<Projet> projetList = projetRepository.findAll();
        assertThat(projetList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkRefProjetIsRequired() throws Exception {
        int databaseSizeBeforeTest = projetRepository.findAll().size();
        // set the field null
        projet.setRefProjet(null);

        // Create the Projet, which fails.

        restProjetMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(projet)))
            .andExpect(status().isBadRequest());

        List<Projet> projetList = projetRepository.findAll();
        assertThat(projetList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllProjets() throws Exception {
        // Initialize the database
        projetRepository.saveAndFlush(projet);

        // Get all the projetList
        restProjetMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(projet.getId().intValue())))
            .andExpect(jsonPath("$.[*].refProjet").value(hasItem(DEFAULT_REF_PROJET)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].datedebut").value(hasItem(DEFAULT_DATEDEBUT.toString())))
            .andExpect(jsonPath("$.[*].datefin").value(hasItem(DEFAULT_DATEFIN.toString())))
            .andExpect(jsonPath("$.[*].etat").value(hasItem(DEFAULT_ETAT.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProjetsWithEagerRelationshipsIsEnabled() throws Exception {
        when(projetRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restProjetMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(projetRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProjetsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(projetRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restProjetMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(projetRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getProjet() throws Exception {
        // Initialize the database
        projetRepository.saveAndFlush(projet);

        // Get the projet
        restProjetMockMvc
            .perform(get(ENTITY_API_URL_ID, projet.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(projet.getId().intValue()))
            .andExpect(jsonPath("$.refProjet").value(DEFAULT_REF_PROJET))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.datedebut").value(DEFAULT_DATEDEBUT.toString()))
            .andExpect(jsonPath("$.datefin").value(DEFAULT_DATEFIN.toString()))
            .andExpect(jsonPath("$.etat").value(DEFAULT_ETAT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingProjet() throws Exception {
        // Get the projet
        restProjetMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProjet() throws Exception {
        // Initialize the database
        projetRepository.saveAndFlush(projet);

        int databaseSizeBeforeUpdate = projetRepository.findAll().size();

        // Update the projet
        Projet updatedProjet = projetRepository.findById(projet.getId()).get();
        // Disconnect from session so that the updates on updatedProjet are not directly saved in db
        em.detach(updatedProjet);
        updatedProjet
            .refProjet(UPDATED_REF_PROJET)
            .type(UPDATED_TYPE)
            .description(UPDATED_DESCRIPTION)
            .datedebut(UPDATED_DATEDEBUT)
            .datefin(UPDATED_DATEFIN)
            .etat(UPDATED_ETAT);

        restProjetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProjet.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProjet))
            )
            .andExpect(status().isOk());

        // Validate the Projet in the database
        List<Projet> projetList = projetRepository.findAll();
        assertThat(projetList).hasSize(databaseSizeBeforeUpdate);
        Projet testProjet = projetList.get(projetList.size() - 1);
        assertThat(testProjet.getRefProjet()).isEqualTo(UPDATED_REF_PROJET);
        assertThat(testProjet.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testProjet.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testProjet.getDatedebut()).isEqualTo(UPDATED_DATEDEBUT);
        assertThat(testProjet.getDatefin()).isEqualTo(UPDATED_DATEFIN);
        assertThat(testProjet.getEtat()).isEqualTo(UPDATED_ETAT);
    }

    @Test
    @Transactional
    void putNonExistingProjet() throws Exception {
        int databaseSizeBeforeUpdate = projetRepository.findAll().size();
        projet.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProjetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, projet.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projet))
            )
            .andExpect(status().isBadRequest());

        // Validate the Projet in the database
        List<Projet> projetList = projetRepository.findAll();
        assertThat(projetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProjet() throws Exception {
        int databaseSizeBeforeUpdate = projetRepository.findAll().size();
        projet.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(projet))
            )
            .andExpect(status().isBadRequest());

        // Validate the Projet in the database
        List<Projet> projetList = projetRepository.findAll();
        assertThat(projetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProjet() throws Exception {
        int databaseSizeBeforeUpdate = projetRepository.findAll().size();
        projet.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjetMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(projet)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Projet in the database
        List<Projet> projetList = projetRepository.findAll();
        assertThat(projetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProjetWithPatch() throws Exception {
        // Initialize the database
        projetRepository.saveAndFlush(projet);

        int databaseSizeBeforeUpdate = projetRepository.findAll().size();

        // Update the projet using partial update
        Projet partialUpdatedProjet = new Projet();
        partialUpdatedProjet.setId(projet.getId());

        partialUpdatedProjet.description(UPDATED_DESCRIPTION);

        restProjetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProjet.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProjet))
            )
            .andExpect(status().isOk());

        // Validate the Projet in the database
        List<Projet> projetList = projetRepository.findAll();
        assertThat(projetList).hasSize(databaseSizeBeforeUpdate);
        Projet testProjet = projetList.get(projetList.size() - 1);
        assertThat(testProjet.getRefProjet()).isEqualTo(DEFAULT_REF_PROJET);
        assertThat(testProjet.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testProjet.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testProjet.getDatedebut()).isEqualTo(DEFAULT_DATEDEBUT);
        assertThat(testProjet.getDatefin()).isEqualTo(DEFAULT_DATEFIN);
        assertThat(testProjet.getEtat()).isEqualTo(DEFAULT_ETAT);
    }

    @Test
    @Transactional
    void fullUpdateProjetWithPatch() throws Exception {
        // Initialize the database
        projetRepository.saveAndFlush(projet);

        int databaseSizeBeforeUpdate = projetRepository.findAll().size();

        // Update the projet using partial update
        Projet partialUpdatedProjet = new Projet();
        partialUpdatedProjet.setId(projet.getId());

        partialUpdatedProjet
            .refProjet(UPDATED_REF_PROJET)
            .type(UPDATED_TYPE)
            .description(UPDATED_DESCRIPTION)
            .datedebut(UPDATED_DATEDEBUT)
            .datefin(UPDATED_DATEFIN)
            .etat(UPDATED_ETAT);

        restProjetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProjet.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProjet))
            )
            .andExpect(status().isOk());

        // Validate the Projet in the database
        List<Projet> projetList = projetRepository.findAll();
        assertThat(projetList).hasSize(databaseSizeBeforeUpdate);
        Projet testProjet = projetList.get(projetList.size() - 1);
        assertThat(testProjet.getRefProjet()).isEqualTo(UPDATED_REF_PROJET);
        assertThat(testProjet.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testProjet.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testProjet.getDatedebut()).isEqualTo(UPDATED_DATEDEBUT);
        assertThat(testProjet.getDatefin()).isEqualTo(UPDATED_DATEFIN);
        assertThat(testProjet.getEtat()).isEqualTo(UPDATED_ETAT);
    }

    @Test
    @Transactional
    void patchNonExistingProjet() throws Exception {
        int databaseSizeBeforeUpdate = projetRepository.findAll().size();
        projet.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProjetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, projet.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(projet))
            )
            .andExpect(status().isBadRequest());

        // Validate the Projet in the database
        List<Projet> projetList = projetRepository.findAll();
        assertThat(projetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProjet() throws Exception {
        int databaseSizeBeforeUpdate = projetRepository.findAll().size();
        projet.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(projet))
            )
            .andExpect(status().isBadRequest());

        // Validate the Projet in the database
        List<Projet> projetList = projetRepository.findAll();
        assertThat(projetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProjet() throws Exception {
        int databaseSizeBeforeUpdate = projetRepository.findAll().size();
        projet.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProjetMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(projet)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Projet in the database
        List<Projet> projetList = projetRepository.findAll();
        assertThat(projetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProjet() throws Exception {
        // Initialize the database
        projetRepository.saveAndFlush(projet);

        int databaseSizeBeforeDelete = projetRepository.findAll().size();

        // Delete the projet
        restProjetMockMvc
            .perform(delete(ENTITY_API_URL_ID, projet.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Projet> projetList = projetRepository.findAll();
        assertThat(projetList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
