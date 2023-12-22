package com.gettercode.app.domain;

import static com.gettercode.app.domain.DepartmentTestSamples.*;
import static com.gettercode.app.domain.IncidentTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.gettercode.app.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class DepartmentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Department.class);
        Department department1 = getDepartmentSample1();
        Department department2 = new Department();
        assertThat(department1).isNotEqualTo(department2);

        department2.setId(department1.getId());
        assertThat(department1).isEqualTo(department2);

        department2 = getDepartmentSample2();
        assertThat(department1).isNotEqualTo(department2);
    }

    @Test
    void incidentTest() throws Exception {
        Department department = getDepartmentRandomSampleGenerator();
        Incident incidentBack = getIncidentRandomSampleGenerator();

        department.addIncident(incidentBack);
        assertThat(department.getIncidents()).containsOnly(incidentBack);
        assertThat(incidentBack.getDepartment()).isEqualTo(department);

        department.removeIncident(incidentBack);
        assertThat(department.getIncidents()).doesNotContain(incidentBack);
        assertThat(incidentBack.getDepartment()).isNull();

        department.incidents(new HashSet<>(Set.of(incidentBack)));
        assertThat(department.getIncidents()).containsOnly(incidentBack);
        assertThat(incidentBack.getDepartment()).isEqualTo(department);

        department.setIncidents(new HashSet<>());
        assertThat(department.getIncidents()).doesNotContain(incidentBack);
        assertThat(incidentBack.getDepartment()).isNull();
    }
}
