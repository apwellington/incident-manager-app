package com.gettercode.app.domain;

import static com.gettercode.app.domain.IncidentTestSamples.*;
import static com.gettercode.app.domain.StatusTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.gettercode.app.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class StatusTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Status.class);
        Status status1 = getStatusSample1();
        Status status2 = new Status();
        assertThat(status1).isNotEqualTo(status2);

        status2.setId(status1.getId());
        assertThat(status1).isEqualTo(status2);

        status2 = getStatusSample2();
        assertThat(status1).isNotEqualTo(status2);
    }

    @Test
    void incidentTest() throws Exception {
        Status status = getStatusRandomSampleGenerator();
        Incident incidentBack = getIncidentRandomSampleGenerator();

        status.addIncident(incidentBack);
        assertThat(status.getIncidents()).containsOnly(incidentBack);
        assertThat(incidentBack.getStatus()).isEqualTo(status);

        status.removeIncident(incidentBack);
        assertThat(status.getIncidents()).doesNotContain(incidentBack);
        assertThat(incidentBack.getStatus()).isNull();

        status.incidents(new HashSet<>(Set.of(incidentBack)));
        assertThat(status.getIncidents()).containsOnly(incidentBack);
        assertThat(incidentBack.getStatus()).isEqualTo(status);

        status.setIncidents(new HashSet<>());
        assertThat(status.getIncidents()).doesNotContain(incidentBack);
        assertThat(incidentBack.getStatus()).isNull();
    }
}
