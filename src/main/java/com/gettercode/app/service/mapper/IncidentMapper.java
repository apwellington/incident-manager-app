package com.gettercode.app.service.mapper;

import com.gettercode.app.domain.Department;
import com.gettercode.app.domain.Incident;
import com.gettercode.app.domain.Priority;
import com.gettercode.app.domain.Status;
import com.gettercode.app.domain.UserApp;
import com.gettercode.app.service.dto.DepartmentDTO;
import com.gettercode.app.service.dto.IncidentDTO;
import com.gettercode.app.service.dto.PriorityDTO;
import com.gettercode.app.service.dto.StatusDTO;
import com.gettercode.app.service.dto.UserAppDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Incident} and its DTO {@link IncidentDTO}.
 */
@Mapper(componentModel = "spring")
public interface IncidentMapper extends EntityMapper<IncidentDTO, Incident> {
    @Mapping(target = "department", source = "department", qualifiedByName = "departmentId")
    @Mapping(target = "priority", source = "priority", qualifiedByName = "priorityId")
    @Mapping(target = "status", source = "status", qualifiedByName = "statusId")
    @Mapping(target = "userApp", source = "userApp", qualifiedByName = "userAppId")
    IncidentDTO toDto(Incident s);

    @Named("departmentId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    DepartmentDTO toDtoDepartmentId(Department department);

    @Named("priorityId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    PriorityDTO toDtoPriorityId(Priority priority);

    @Named("statusId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    StatusDTO toDtoStatusId(Status status);

    @Named("userAppId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserAppDTO toDtoUserAppId(UserApp userApp);
}
