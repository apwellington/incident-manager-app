package com.gettercode.app.service.impl;

import com.gettercode.app.domain.Priority;
import com.gettercode.app.repository.PriorityRepository;
import com.gettercode.app.service.PriorityService;
import com.gettercode.app.service.dto.PriorityDTO;
import com.gettercode.app.service.mapper.PriorityMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.gettercode.app.domain.Priority}.
 */
@Service
@Transactional
public class PriorityServiceImpl implements PriorityService {

    private final Logger log = LoggerFactory.getLogger(PriorityServiceImpl.class);

    private final PriorityRepository priorityRepository;

    private final PriorityMapper priorityMapper;

    public PriorityServiceImpl(PriorityRepository priorityRepository, PriorityMapper priorityMapper) {
        this.priorityRepository = priorityRepository;
        this.priorityMapper = priorityMapper;
    }

    @Override
    public PriorityDTO save(PriorityDTO priorityDTO) {
        log.debug("Request to save Priority : {}", priorityDTO);
        Priority priority = priorityMapper.toEntity(priorityDTO);
        priority = priorityRepository.save(priority);
        return priorityMapper.toDto(priority);
    }

    @Override
    public PriorityDTO update(PriorityDTO priorityDTO) {
        log.debug("Request to update Priority : {}", priorityDTO);
        Priority priority = priorityMapper.toEntity(priorityDTO);
        priority = priorityRepository.save(priority);
        return priorityMapper.toDto(priority);
    }

    @Override
    public Optional<PriorityDTO> partialUpdate(PriorityDTO priorityDTO) {
        log.debug("Request to partially update Priority : {}", priorityDTO);

        return priorityRepository
            .findById(priorityDTO.getId())
            .map(existingPriority -> {
                priorityMapper.partialUpdate(existingPriority, priorityDTO);

                return existingPriority;
            })
            .map(priorityRepository::save)
            .map(priorityMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PriorityDTO> findAll() {
        log.debug("Request to get all Priorities");
        return priorityRepository.findAll().stream().map(priorityMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PriorityDTO> findOne(Long id) {
        log.debug("Request to get Priority : {}", id);
        return priorityRepository.findById(id).map(priorityMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Priority : {}", id);
        priorityRepository.deleteById(id);
    }
}
