package com.gettercode.app.service.mapper;

import org.junit.jupiter.api.BeforeEach;

class UserAppMapperTest {

    private UserAppMapper userAppMapper;

    @BeforeEach
    public void setUp() {
        userAppMapper = new UserAppMapperImpl();
    }
}
