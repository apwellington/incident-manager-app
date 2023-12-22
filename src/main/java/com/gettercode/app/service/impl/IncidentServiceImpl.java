package com.gettercode.app.service.impl;

import com.gettercode.app.domain.Incident;
import com.gettercode.app.repository.IncidentRepository;
import com.gettercode.app.service.IncidentService;
import com.gettercode.app.service.dto.IncidentDTO;
import com.gettercode.app.service.mapper.IncidentMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.gettercode.app.domain.Incident}.
 */
@Service
@Transactional
public class IncidentServiceImpl implements IncidentService {

    private final Logger log = LoggerFactory.getLogger(IncidentServiceImpl.class);

    private final IncidentRepository incidentRepository;

    private final IncidentMapper incidentMapper;

    public IncidentServiceImpl(IncidentRepository incidentRepository, IncidentMapper incidentMapper) {
        this.incidentRepository = incidentRepository;
        this.incidentMapper = incidentMapper;
    }

    @Override
    public IncidentDTO save(IncidentDTO incidentDTO) {
        log.debug("Request to save Incident : {}", incidentDTO);
        Incident incident = incidentMapper.toEntity(incidentDTO);
        incident = incidentRepository.save(incident);
        return incidentMapper.toDto(incident);
    }

    @Override
    public IncidentDTO update(IncidentDTO incidentDTO) {
        log.debug("Request to update Incident : {}", incidentDTO);
        Incident incident = incidentMapper.toEntity(incidentDTO);
        incident = incidentRepository.save(incident);
        return incidentMapper.toDto(incident);
    }

    @Override
    public Optional<IncidentDTO> partialUpdate(IncidentDTO incidentDTO) {
        log.debug("Request to partially update Incident : {}", incidentDTO);

        return incidentRepository
            .findById(incidentDTO.getId())
            .map(existingIncident -> {
                incidentMapper.partialUpdate(existingIncident, incidentDTO);

                return existingIncident;
            })
            .map(incidentRepository::save)
            .map(incidentMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<IncidentDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Incidents");
        return incidentRepository.findAll(pageable).map(incidentMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<IncidentDTO> findOne(Long id) {
        log.debug("Request to get Incident : {}", id);
        return incidentRepository.findById(id).map(incidentMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Incident : {}", id);
        incidentRepository.deleteById(id);
    }
}
