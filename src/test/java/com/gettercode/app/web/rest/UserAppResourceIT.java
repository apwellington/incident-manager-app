package com.gettercode.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.gettercode.app.IntegrationTest;
import com.gettercode.app.domain.UserApp;
import com.gettercode.app.repository.UserAppRepository;
import com.gettercode.app.service.dto.UserAppDTO;
import com.gettercode.app.service.mapper.UserAppMapper;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link UserAppResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserAppResourceIT {

    private static final String DEFAULT_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_PHONE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/user-apps";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserAppRepository userAppRepository;

    @Autowired
    private UserAppMapper userAppMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserAppMockMvc;

    private UserApp userApp;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserApp createEntity(EntityManager em) {
        UserApp userApp = new UserApp().phone(DEFAULT_PHONE);
        return userApp;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserApp createUpdatedEntity(EntityManager em) {
        UserApp userApp = new UserApp().phone(UPDATED_PHONE);
        return userApp;
    }

    @BeforeEach
    public void initTest() {
        userApp = createEntity(em);
    }

    @Test
    @Transactional
    void createUserApp() throws Exception {
        int databaseSizeBeforeCreate = userAppRepository.findAll().size();
        // Create the UserApp
        UserAppDTO userAppDTO = userAppMapper.toDto(userApp);
        restUserAppMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userAppDTO)))
            .andExpect(status().isCreated());

        // Validate the UserApp in the database
        List<UserApp> userAppList = userAppRepository.findAll();
        assertThat(userAppList).hasSize(databaseSizeBeforeCreate + 1);
        UserApp testUserApp = userAppList.get(userAppList.size() - 1);
        assertThat(testUserApp.getPhone()).isEqualTo(DEFAULT_PHONE);
    }

    @Test
    @Transactional
    void createUserAppWithExistingId() throws Exception {
        // Create the UserApp with an existing ID
        userApp.setId(1L);
        UserAppDTO userAppDTO = userAppMapper.toDto(userApp);

        int databaseSizeBeforeCreate = userAppRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserAppMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userAppDTO)))
            .andExpect(status().isBadRequest());

        // Validate the UserApp in the database
        List<UserApp> userAppList = userAppRepository.findAll();
        assertThat(userAppList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkPhoneIsRequired() throws Exception {
        int databaseSizeBeforeTest = userAppRepository.findAll().size();
        // set the field null
        userApp.setPhone(null);

        // Create the UserApp, which fails.
        UserAppDTO userAppDTO = userAppMapper.toDto(userApp);

        restUserAppMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userAppDTO)))
            .andExpect(status().isBadRequest());

        List<UserApp> userAppList = userAppRepository.findAll();
        assertThat(userAppList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllUserApps() throws Exception {
        // Initialize the database
        userAppRepository.saveAndFlush(userApp);

        // Get all the userAppList
        restUserAppMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userApp.getId().intValue())))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE)));
    }

    @Test
    @Transactional
    void getUserApp() throws Exception {
        // Initialize the database
        userAppRepository.saveAndFlush(userApp);

        // Get the userApp
        restUserAppMockMvc
            .perform(get(ENTITY_API_URL_ID, userApp.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userApp.getId().intValue()))
            .andExpect(jsonPath("$.phone").value(DEFAULT_PHONE));
    }

    @Test
    @Transactional
    void getNonExistingUserApp() throws Exception {
        // Get the userApp
        restUserAppMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUserApp() throws Exception {
        // Initialize the database
        userAppRepository.saveAndFlush(userApp);

        int databaseSizeBeforeUpdate = userAppRepository.findAll().size();

        // Update the userApp
        UserApp updatedUserApp = userAppRepository.findById(userApp.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedUserApp are not directly saved in db
        em.detach(updatedUserApp);
        updatedUserApp.phone(UPDATED_PHONE);
        UserAppDTO userAppDTO = userAppMapper.toDto(updatedUserApp);

        restUserAppMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userAppDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userAppDTO))
            )
            .andExpect(status().isOk());

        // Validate the UserApp in the database
        List<UserApp> userAppList = userAppRepository.findAll();
        assertThat(userAppList).hasSize(databaseSizeBeforeUpdate);
        UserApp testUserApp = userAppList.get(userAppList.size() - 1);
        assertThat(testUserApp.getPhone()).isEqualTo(UPDATED_PHONE);
    }

    @Test
    @Transactional
    void putNonExistingUserApp() throws Exception {
        int databaseSizeBeforeUpdate = userAppRepository.findAll().size();
        userApp.setId(longCount.incrementAndGet());

        // Create the UserApp
        UserAppDTO userAppDTO = userAppMapper.toDto(userApp);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserAppMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userAppDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userAppDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserApp in the database
        List<UserApp> userAppList = userAppRepository.findAll();
        assertThat(userAppList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserApp() throws Exception {
        int databaseSizeBeforeUpdate = userAppRepository.findAll().size();
        userApp.setId(longCount.incrementAndGet());

        // Create the UserApp
        UserAppDTO userAppDTO = userAppMapper.toDto(userApp);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserAppMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userAppDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserApp in the database
        List<UserApp> userAppList = userAppRepository.findAll();
        assertThat(userAppList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserApp() throws Exception {
        int databaseSizeBeforeUpdate = userAppRepository.findAll().size();
        userApp.setId(longCount.incrementAndGet());

        // Create the UserApp
        UserAppDTO userAppDTO = userAppMapper.toDto(userApp);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserAppMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userAppDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserApp in the database
        List<UserApp> userAppList = userAppRepository.findAll();
        assertThat(userAppList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserAppWithPatch() throws Exception {
        // Initialize the database
        userAppRepository.saveAndFlush(userApp);

        int databaseSizeBeforeUpdate = userAppRepository.findAll().size();

        // Update the userApp using partial update
        UserApp partialUpdatedUserApp = new UserApp();
        partialUpdatedUserApp.setId(userApp.getId());

        partialUpdatedUserApp.phone(UPDATED_PHONE);

        restUserAppMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserApp.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserApp))
            )
            .andExpect(status().isOk());

        // Validate the UserApp in the database
        List<UserApp> userAppList = userAppRepository.findAll();
        assertThat(userAppList).hasSize(databaseSizeBeforeUpdate);
        UserApp testUserApp = userAppList.get(userAppList.size() - 1);
        assertThat(testUserApp.getPhone()).isEqualTo(UPDATED_PHONE);
    }

    @Test
    @Transactional
    void fullUpdateUserAppWithPatch() throws Exception {
        // Initialize the database
        userAppRepository.saveAndFlush(userApp);

        int databaseSizeBeforeUpdate = userAppRepository.findAll().size();

        // Update the userApp using partial update
        UserApp partialUpdatedUserApp = new UserApp();
        partialUpdatedUserApp.setId(userApp.getId());

        partialUpdatedUserApp.phone(UPDATED_PHONE);

        restUserAppMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserApp.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserApp))
            )
            .andExpect(status().isOk());

        // Validate the UserApp in the database
        List<UserApp> userAppList = userAppRepository.findAll();
        assertThat(userAppList).hasSize(databaseSizeBeforeUpdate);
        UserApp testUserApp = userAppList.get(userAppList.size() - 1);
        assertThat(testUserApp.getPhone()).isEqualTo(UPDATED_PHONE);
    }

    @Test
    @Transactional
    void patchNonExistingUserApp() throws Exception {
        int databaseSizeBeforeUpdate = userAppRepository.findAll().size();
        userApp.setId(longCount.incrementAndGet());

        // Create the UserApp
        UserAppDTO userAppDTO = userAppMapper.toDto(userApp);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserAppMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userAppDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userAppDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserApp in the database
        List<UserApp> userAppList = userAppRepository.findAll();
        assertThat(userAppList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserApp() throws Exception {
        int databaseSizeBeforeUpdate = userAppRepository.findAll().size();
        userApp.setId(longCount.incrementAndGet());

        // Create the UserApp
        UserAppDTO userAppDTO = userAppMapper.toDto(userApp);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserAppMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userAppDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserApp in the database
        List<UserApp> userAppList = userAppRepository.findAll();
        assertThat(userAppList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserApp() throws Exception {
        int databaseSizeBeforeUpdate = userAppRepository.findAll().size();
        userApp.setId(longCount.incrementAndGet());

        // Create the UserApp
        UserAppDTO userAppDTO = userAppMapper.toDto(userApp);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserAppMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(userAppDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserApp in the database
        List<UserApp> userAppList = userAppRepository.findAll();
        assertThat(userAppList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserApp() throws Exception {
        // Initialize the database
        userAppRepository.saveAndFlush(userApp);

        int databaseSizeBeforeDelete = userAppRepository.findAll().size();

        // Delete the userApp
        restUserAppMockMvc
            .perform(delete(ENTITY_API_URL_ID, userApp.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserApp> userAppList = userAppRepository.findAll();
        assertThat(userAppList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
