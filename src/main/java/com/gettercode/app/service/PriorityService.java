package com.gettercode.app.service;

import com.gettercode.app.service.dto.PriorityDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.gettercode.app.domain.Priority}.
 */
public interface PriorityService {
    /**
     * Save a priority.
     *
     * @param priorityDTO the entity to save.
     * @return the persisted entity.
     */
    PriorityDTO save(PriorityDTO priorityDTO);

    /**
     * Updates a priority.
     *
     * @param priorityDTO the entity to update.
     * @return the persisted entity.
     */
    PriorityDTO update(PriorityDTO priorityDTO);

    /**
     * Partially updates a priority.
     *
     * @param priorityDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<PriorityDTO> partialUpdate(PriorityDTO priorityDTO);

    /**
     * Get all the priorities.
     *
     * @return the list of entities.
     */
    List<PriorityDTO> findAll();

    /**
     * Get the "id" priority.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<PriorityDTO> findOne(Long id);

    /**
     * Delete the "id" priority.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
