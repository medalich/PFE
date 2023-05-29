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
import org.itdevspace.domain.ChargeJournaliere;
import org.itdevspace.domain.Ressource;
import org.itdevspace.domain.enumeration.TypeCharge;
import org.itdevspace.repository.ChargeJournaliereRepository;
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
 * Integration tests for the {@link ChargeJournaliereResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ChargeJournaliereResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final TypeCharge DEFAULT_TYPE = TypeCharge.Support;
    private static final TypeCharge UPDATED_TYPE = TypeCharge.Dev;

    private static final Double DEFAULT_DUREE = 1D;
    private static final Double UPDATED_DUREE = 2D;

    private static final String ENTITY_API_URL = "/api/charge-journalieres";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ChargeJournaliereRepository chargeJournaliereRepository;

    @Mock
    private ChargeJournaliereRepository chargeJournaliereRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restChargeJournaliereMockMvc;

    private ChargeJournaliere chargeJournaliere;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChargeJournaliere createEntity(EntityManager em) {
        ChargeJournaliere chargeJournaliere = new ChargeJournaliere()
            .description(DEFAULT_DESCRIPTION)
            .date(DEFAULT_DATE)
            .type(DEFAULT_TYPE)
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
        chargeJournaliere.setRessource(ressource);
        return chargeJournaliere;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChargeJournaliere createUpdatedEntity(EntityManager em) {
        ChargeJournaliere chargeJournaliere = new ChargeJournaliere()
            .description(UPDATED_DESCRIPTION)
            .date(UPDATED_DATE)
            .type(UPDATED_TYPE)
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
        chargeJournaliere.setRessource(ressource);
        return chargeJournaliere;
    }

    @BeforeEach
    public void initTest() {
        chargeJournaliere = createEntity(em);
    }

    @Test
    @Transactional
    void createChargeJournaliere() throws Exception {
        int databaseSizeBeforeCreate = chargeJournaliereRepository.findAll().size();
        // Create the ChargeJournaliere
        restChargeJournaliereMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chargeJournaliere))
            )
            .andExpect(status().isCreated());

        // Validate the ChargeJournaliere in the database
        List<ChargeJournaliere> chargeJournaliereList = chargeJournaliereRepository.findAll();
        assertThat(chargeJournaliereList).hasSize(databaseSizeBeforeCreate + 1);
        ChargeJournaliere testChargeJournaliere = chargeJournaliereList.get(chargeJournaliereList.size() - 1);
        assertThat(testChargeJournaliere.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testChargeJournaliere.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testChargeJournaliere.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testChargeJournaliere.getDuree()).isEqualTo(DEFAULT_DUREE);
    }

    @Test
    @Transactional
    void createChargeJournaliereWithExistingId() throws Exception {
        // Create the ChargeJournaliere with an existing ID
        chargeJournaliere.setId(1L);

        int databaseSizeBeforeCreate = chargeJournaliereRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restChargeJournaliereMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chargeJournaliere))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChargeJournaliere in the database
        List<ChargeJournaliere> chargeJournaliereList = chargeJournaliereRepository.findAll();
        assertThat(chargeJournaliereList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllChargeJournalieres() throws Exception {
        // Initialize the database
        chargeJournaliereRepository.saveAndFlush(chargeJournaliere);

        // Get all the chargeJournaliereList
        restChargeJournaliereMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(chargeJournaliere.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].duree").value(hasItem(DEFAULT_DUREE.doubleValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllChargeJournalieresWithEagerRelationshipsIsEnabled() throws Exception {
        when(chargeJournaliereRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restChargeJournaliereMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(chargeJournaliereRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllChargeJournalieresWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(chargeJournaliereRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restChargeJournaliereMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(chargeJournaliereRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getChargeJournaliere() throws Exception {
        // Initialize the database
        chargeJournaliereRepository.saveAndFlush(chargeJournaliere);

        // Get the chargeJournaliere
        restChargeJournaliereMockMvc
            .perform(get(ENTITY_API_URL_ID, chargeJournaliere.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(chargeJournaliere.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.duree").value(DEFAULT_DUREE.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingChargeJournaliere() throws Exception {
        // Get the chargeJournaliere
        restChargeJournaliereMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingChargeJournaliere() throws Exception {
        // Initialize the database
        chargeJournaliereRepository.saveAndFlush(chargeJournaliere);

        int databaseSizeBeforeUpdate = chargeJournaliereRepository.findAll().size();

        // Update the chargeJournaliere
        ChargeJournaliere updatedChargeJournaliere = chargeJournaliereRepository.findById(chargeJournaliere.getId()).get();
        // Disconnect from session so that the updates on updatedChargeJournaliere are not directly saved in db
        em.detach(updatedChargeJournaliere);
        updatedChargeJournaliere.description(UPDATED_DESCRIPTION).date(UPDATED_DATE).type(UPDATED_TYPE).duree(UPDATED_DUREE);

        restChargeJournaliereMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedChargeJournaliere.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedChargeJournaliere))
            )
            .andExpect(status().isOk());

        // Validate the ChargeJournaliere in the database
        List<ChargeJournaliere> chargeJournaliereList = chargeJournaliereRepository.findAll();
        assertThat(chargeJournaliereList).hasSize(databaseSizeBeforeUpdate);
        ChargeJournaliere testChargeJournaliere = chargeJournaliereList.get(chargeJournaliereList.size() - 1);
        assertThat(testChargeJournaliere.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testChargeJournaliere.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testChargeJournaliere.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testChargeJournaliere.getDuree()).isEqualTo(UPDATED_DUREE);
    }

    @Test
    @Transactional
    void putNonExistingChargeJournaliere() throws Exception {
        int databaseSizeBeforeUpdate = chargeJournaliereRepository.findAll().size();
        chargeJournaliere.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChargeJournaliereMockMvc
            .perform(
                put(ENTITY_API_URL_ID, chargeJournaliere.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chargeJournaliere))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChargeJournaliere in the database
        List<ChargeJournaliere> chargeJournaliereList = chargeJournaliereRepository.findAll();
        assertThat(chargeJournaliereList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchChargeJournaliere() throws Exception {
        int databaseSizeBeforeUpdate = chargeJournaliereRepository.findAll().size();
        chargeJournaliere.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChargeJournaliereMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chargeJournaliere))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChargeJournaliere in the database
        List<ChargeJournaliere> chargeJournaliereList = chargeJournaliereRepository.findAll();
        assertThat(chargeJournaliereList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamChargeJournaliere() throws Exception {
        int databaseSizeBeforeUpdate = chargeJournaliereRepository.findAll().size();
        chargeJournaliere.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChargeJournaliereMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chargeJournaliere))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChargeJournaliere in the database
        List<ChargeJournaliere> chargeJournaliereList = chargeJournaliereRepository.findAll();
        assertThat(chargeJournaliereList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateChargeJournaliereWithPatch() throws Exception {
        // Initialize the database
        chargeJournaliereRepository.saveAndFlush(chargeJournaliere);

        int databaseSizeBeforeUpdate = chargeJournaliereRepository.findAll().size();

        // Update the chargeJournaliere using partial update
        ChargeJournaliere partialUpdatedChargeJournaliere = new ChargeJournaliere();
        partialUpdatedChargeJournaliere.setId(chargeJournaliere.getId());

        partialUpdatedChargeJournaliere.description(UPDATED_DESCRIPTION).date(UPDATED_DATE).duree(UPDATED_DUREE);

        restChargeJournaliereMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChargeJournaliere.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChargeJournaliere))
            )
            .andExpect(status().isOk());

        // Validate the ChargeJournaliere in the database
        List<ChargeJournaliere> chargeJournaliereList = chargeJournaliereRepository.findAll();
        assertThat(chargeJournaliereList).hasSize(databaseSizeBeforeUpdate);
        ChargeJournaliere testChargeJournaliere = chargeJournaliereList.get(chargeJournaliereList.size() - 1);
        assertThat(testChargeJournaliere.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testChargeJournaliere.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testChargeJournaliere.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testChargeJournaliere.getDuree()).isEqualTo(UPDATED_DUREE);
    }

    @Test
    @Transactional
    void fullUpdateChargeJournaliereWithPatch() throws Exception {
        // Initialize the database
        chargeJournaliereRepository.saveAndFlush(chargeJournaliere);

        int databaseSizeBeforeUpdate = chargeJournaliereRepository.findAll().size();

        // Update the chargeJournaliere using partial update
        ChargeJournaliere partialUpdatedChargeJournaliere = new ChargeJournaliere();
        partialUpdatedChargeJournaliere.setId(chargeJournaliere.getId());

        partialUpdatedChargeJournaliere.description(UPDATED_DESCRIPTION).date(UPDATED_DATE).type(UPDATED_TYPE).duree(UPDATED_DUREE);

        restChargeJournaliereMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChargeJournaliere.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChargeJournaliere))
            )
            .andExpect(status().isOk());

        // Validate the ChargeJournaliere in the database
        List<ChargeJournaliere> chargeJournaliereList = chargeJournaliereRepository.findAll();
        assertThat(chargeJournaliereList).hasSize(databaseSizeBeforeUpdate);
        ChargeJournaliere testChargeJournaliere = chargeJournaliereList.get(chargeJournaliereList.size() - 1);
        assertThat(testChargeJournaliere.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testChargeJournaliere.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testChargeJournaliere.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testChargeJournaliere.getDuree()).isEqualTo(UPDATED_DUREE);
    }

    @Test
    @Transactional
    void patchNonExistingChargeJournaliere() throws Exception {
        int databaseSizeBeforeUpdate = chargeJournaliereRepository.findAll().size();
        chargeJournaliere.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChargeJournaliereMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, chargeJournaliere.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chargeJournaliere))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChargeJournaliere in the database
        List<ChargeJournaliere> chargeJournaliereList = chargeJournaliereRepository.findAll();
        assertThat(chargeJournaliereList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchChargeJournaliere() throws Exception {
        int databaseSizeBeforeUpdate = chargeJournaliereRepository.findAll().size();
        chargeJournaliere.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChargeJournaliereMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chargeJournaliere))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChargeJournaliere in the database
        List<ChargeJournaliere> chargeJournaliereList = chargeJournaliereRepository.findAll();
        assertThat(chargeJournaliereList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamChargeJournaliere() throws Exception {
        int databaseSizeBeforeUpdate = chargeJournaliereRepository.findAll().size();
        chargeJournaliere.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChargeJournaliereMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chargeJournaliere))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChargeJournaliere in the database
        List<ChargeJournaliere> chargeJournaliereList = chargeJournaliereRepository.findAll();
        assertThat(chargeJournaliereList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteChargeJournaliere() throws Exception {
        // Initialize the database
        chargeJournaliereRepository.saveAndFlush(chargeJournaliere);

        int databaseSizeBeforeDelete = chargeJournaliereRepository.findAll().size();

        // Delete the chargeJournaliere
        restChargeJournaliereMockMvc
            .perform(delete(ENTITY_API_URL_ID, chargeJournaliere.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ChargeJournaliere> chargeJournaliereList = chargeJournaliereRepository.findAll();
        assertThat(chargeJournaliereList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
