package com.gettercode.app.service.mapper;

import com.gettercode.app.domain.Priority;
import com.gettercode.app.service.dto.PriorityDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Priority} and its DTO {@link PriorityDTO}.
 */
@Mapper(componentModel = "spring")
public interface PriorityMapper extends EntityMapper<PriorityDTO, Priority> {}
