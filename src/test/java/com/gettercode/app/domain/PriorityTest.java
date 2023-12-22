package com.gettercode.app.domain;

import static com.gettercode.app.domain.IncidentTestSamples.*;
import static com.gettercode.app.domain.PriorityTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.gettercode.app.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class PriorityTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Priority.class);
        Priority priority1 = getPrioritySample1();
        Priority priority2 = new Priority();
        assertThat(priority1).isNotEqualTo(priority2);

        priority2.setId(priority1.getId());
        assertThat(priority1).isEqualTo(priority2);

        priority2 = getPrioritySample2();
        assertThat(priority1).isNotEqualTo(priority2);
    }

    @Test
    void incidentTest() throws Exception {
        Priority priority = getPriorityRandomSampleGenerator();
        Incident incidentBack = getIncidentRandomSampleGenerator();

        priority.addIncident(incidentBack);
        assertThat(priority.getIncidents()).containsOnly(incidentBack);
        assertThat(incidentBack.getPriority()).isEqualTo(priority);

        priority.removeIncident(incidentBack);
        assertThat(priority.getIncidents()).doesNotContain(incidentBack);
        assertThat(incidentBack.getPriority()).isNull();

        priority.incidents(new HashSet<>(Set.of(incidentBack)));
        assertThat(priority.getIncidents()).containsOnly(incidentBack);
        assertThat(incidentBack.getPriority()).isEqualTo(priority);

        priority.setIncidents(new HashSet<>());
        assertThat(priority.getIncidents()).doesNotContain(incidentBack);
        assertThat(incidentBack.getPriority()).isNull();
    }
}
