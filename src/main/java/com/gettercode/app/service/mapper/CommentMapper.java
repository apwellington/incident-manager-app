package com.gettercode.app.service.mapper;

import com.gettercode.app.domain.Comment;
import com.gettercode.app.domain.Incident;
import com.gettercode.app.service.dto.CommentDTO;
import com.gettercode.app.service.dto.IncidentDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Comment} and its DTO {@link CommentDTO}.
 */
@Mapper(componentModel = "spring")
public interface CommentMapper extends EntityMapper<CommentDTO, Comment> {
    @Mapping(target = "incident", source = "incident", qualifiedByName = "incidentId")
    CommentDTO toDto(Comment s);

    @Named("incidentId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    IncidentDTO toDtoIncidentId(Incident incident);
}
