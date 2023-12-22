package com.gettercode.app.service.mapper;

import com.gettercode.app.domain.UserApp;
import com.gettercode.app.service.dto.UserAppDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link UserApp} and its DTO {@link UserAppDTO}.
 */
@Mapper(componentModel = "spring")
public interface UserAppMapper extends EntityMapper<UserAppDTO, UserApp> {}
