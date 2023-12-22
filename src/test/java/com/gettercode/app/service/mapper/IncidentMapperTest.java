package com.gettercode.app.service.mapper;

import org.junit.jupiter.api.BeforeEach;

class IncidentMapperTest {

    private IncidentMapper incidentMapper;

    @BeforeEach
    public void setUp() {
        incidentMapper = new IncidentMapperImpl();
    }
}
