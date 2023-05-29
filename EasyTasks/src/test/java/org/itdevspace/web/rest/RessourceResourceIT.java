package org.itdevspace.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.itdevspace.IntegrationTest;
import org.itdevspace.domain.Ressource;
import org.itdevspace.repository.RessourceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link RessourceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RessourceResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_PRENOM = "AAAAAAAAAA";
    private static final String UPDATED_PRENOM = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/ressources";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RessourceRepository ressourceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRessourceMockMvc;

    private Ressource ressource;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ressource createEntity(EntityManager em) {
        Ressource ressource = new Ressource().nom(DEFAULT_NOM).prenom(DEFAULT_PRENOM);
        return ressource;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ressource createUpdatedEntity(EntityManager em) {
        Ressource ressource = new Ressource().nom(UPDATED_NOM).prenom(UPDATED_PRENOM);
        return ressource;
    }

    @BeforeEach
    public void initTest() {
        ressource = createEntity(em);
    }

    @Test
    @Transactional
    void createRessource() throws Exception {
        int databaseSizeBeforeCreate = ressourceRepository.findAll().size();
        // Create the Ressource
        restRessourceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ressource)))
            .andExpect(status().isCreated());

        // Validate the Ressource in the database
        List<Ressource> ressourceList = ressourceRepository.findAll();
        assertThat(ressourceList).hasSize(databaseSizeBeforeCreate + 1);
        Ressource testRessource = ressourceList.get(ressourceList.size() - 1);
        assertThat(testRessource.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testRessource.getPrenom()).isEqualTo(DEFAULT_PRENOM);
    }

    @Test
    @Transactional
    void createRessourceWithExistingId() throws Exception {
        // Create the Ressource with an existing ID
        ressource.setId(1L);

        int databaseSizeBeforeCreate = ressourceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRessourceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ressource)))
            .andExpect(status().isBadRequest());

        // Validate the Ressource in the database
        List<Ressource> ressourceList = ressourceRepository.findAll();
        assertThat(ressourceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomIsRequired() throws Exception {
        int databaseSizeBeforeTest = ressourceRepository.findAll().size();
        // set the field null
        ressource.setNom(null);

        // Create the Ressource, which fails.

        restRessourceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ressource)))
            .andExpect(status().isBadRequest());

        List<Ressource> ressourceList = ressourceRepository.findAll();
        assertThat(ressourceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPrenomIsRequired() throws Exception {
        int databaseSizeBeforeTest = ressourceRepository.findAll().size();
        // set the field null
        ressource.setPrenom(null);

        // Create the Ressource, which fails.

        restRessourceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ressource)))
            .andExpect(status().isBadRequest());

        List<Ressource> ressourceList = ressourceRepository.findAll();
        assertThat(ressourceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllRessources() throws Exception {
        // Initialize the database
        ressourceRepository.saveAndFlush(ressource);

        // Get all the ressourceList
        restRessourceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ressource.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].prenom").value(hasItem(DEFAULT_PRENOM)));
    }

    @Test
    @Transactional
    void getRessource() throws Exception {
        // Initialize the database
        ressourceRepository.saveAndFlush(ressource);

        // Get the ressource
        restRessourceMockMvc
            .perform(get(ENTITY_API_URL_ID, ressource.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ressource.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.prenom").value(DEFAULT_PRENOM));
    }

    @Test
    @Transactional
    void getNonExistingRessource() throws Exception {
        // Get the ressource
        restRessourceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRessource() throws Exception {
        // Initialize the database
        ressourceRepository.saveAndFlush(ressource);

        int databaseSizeBeforeUpdate = ressourceRepository.findAll().size();

        // Update the ressource
        Ressource updatedRessource = ressourceRepository.findById(ressource.getId()).get();
        // Disconnect from session so that the updates on updatedRessource are not directly saved in db
        em.detach(updatedRessource);
        updatedRessource.nom(UPDATED_NOM).prenom(UPDATED_PRENOM);

        restRessourceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRessource.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRessource))
            )
            .andExpect(status().isOk());

        // Validate the Ressource in the database
        List<Ressource> ressourceList = ressourceRepository.findAll();
        assertThat(ressourceList).hasSize(databaseSizeBeforeUpdate);
        Ressource testRessource = ressourceList.get(ressourceList.size() - 1);
        assertThat(testRessource.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testRessource.getPrenom()).isEqualTo(UPDATED_PRENOM);
    }

    @Test
    @Transactional
    void putNonExistingRessource() throws Exception {
        int databaseSizeBeforeUpdate = ressourceRepository.findAll().size();
        ressource.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRessourceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ressource.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ressource))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ressource in the database
        List<Ressource> ressourceList = ressourceRepository.findAll();
        assertThat(ressourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRessource() throws Exception {
        int databaseSizeBeforeUpdate = ressourceRepository.findAll().size();
        ressource.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRessourceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ressource))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ressource in the database
        List<Ressource> ressourceList = ressourceRepository.findAll();
        assertThat(ressourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRessource() throws Exception {
        int databaseSizeBeforeUpdate = ressourceRepository.findAll().size();
        ressource.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRessourceMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ressource)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ressource in the database
        List<Ressource> ressourceList = ressourceRepository.findAll();
        assertThat(ressourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRessourceWithPatch() throws Exception {
        // Initialize the database
        ressourceRepository.saveAndFlush(ressource);

        int databaseSizeBeforeUpdate = ressourceRepository.findAll().size();

        // Update the ressource using partial update
        Ressource partialUpdatedRessource = new Ressource();
        partialUpdatedRessource.setId(ressource.getId());

        restRessourceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRessource.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRessource))
            )
            .andExpect(status().isOk());

        // Validate the Ressource in the database
        List<Ressource> ressourceList = ressourceRepository.findAll();
        assertThat(ressourceList).hasSize(databaseSizeBeforeUpdate);
        Ressource testRessource = ressourceList.get(ressourceList.size() - 1);
        assertThat(testRessource.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testRessource.getPrenom()).isEqualTo(DEFAULT_PRENOM);
    }

    @Test
    @Transactional
    void fullUpdateRessourceWithPatch() throws Exception {
        // Initialize the database
        ressourceRepository.saveAndFlush(ressource);

        int databaseSizeBeforeUpdate = ressourceRepository.findAll().size();

        // Update the ressource using partial update
        Ressource partialUpdatedRessource = new Ressource();
        partialUpdatedRessource.setId(ressource.getId());

        partialUpdatedRessource.nom(UPDATED_NOM).prenom(UPDATED_PRENOM);

        restRessourceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRessource.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRessource))
            )
            .andExpect(status().isOk());

        // Validate the Ressource in the database
        List<Ressource> ressourceList = ressourceRepository.findAll();
        assertThat(ressourceList).hasSize(databaseSizeBeforeUpdate);
        Ressource testRessource = ressourceList.get(ressourceList.size() - 1);
        assertThat(testRessource.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testRessource.getPrenom()).isEqualTo(UPDATED_PRENOM);
    }

    @Test
    @Transactional
    void patchNonExistingRessource() throws Exception {
        int databaseSizeBeforeUpdate = ressourceRepository.findAll().size();
        ressource.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRessourceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ressource.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ressource))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ressource in the database
        List<Ressource> ressourceList = ressourceRepository.findAll();
        assertThat(ressourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRessource() throws Exception {
        int databaseSizeBeforeUpdate = ressourceRepository.findAll().size();
        ressource.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRessourceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ressource))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ressource in the database
        List<Ressource> ressourceList = ressourceRepository.findAll();
        assertThat(ressourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRessource() throws Exception {
        int databaseSizeBeforeUpdate = ressourceRepository.findAll().size();
        ressource.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRessourceMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(ressource))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ressource in the database
        List<Ressource> ressourceList = ressourceRepository.findAll();
        assertThat(ressourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRessource() throws Exception {
        // Initialize the database
        ressourceRepository.saveAndFlush(ressource);

        int databaseSizeBeforeDelete = ressourceRepository.findAll().size();

        // Delete the ressource
        restRessourceMockMvc
            .perform(delete(ENTITY_API_URL_ID, ressource.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Ressource> ressourceList = ressourceRepository.findAll();
        assertThat(ressourceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
