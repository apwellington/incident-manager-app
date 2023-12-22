package com.gettercode.app.domain;

import static com.gettercode.app.domain.IncidentTestSamples.*;
import static com.gettercode.app.domain.UserAppTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.gettercode.app.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class UserAppTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserApp.class);
        UserApp userApp1 = getUserAppSample1();
        UserApp userApp2 = new UserApp();
        assertThat(userApp1).isNotEqualTo(userApp2);

        userApp2.setId(userApp1.getId());
        assertThat(userApp1).isEqualTo(userApp2);

        userApp2 = getUserAppSample2();
        assertThat(userApp1).isNotEqualTo(userApp2);
    }

    @Test
    void incidentTest() throws Exception {
        UserApp userApp = getUserAppRandomSampleGenerator();
        Incident incidentBack = getIncidentRandomSampleGenerator();

        userApp.addIncident(incidentBack);
        assertThat(userApp.getIncidents()).containsOnly(incidentBack);
        assertThat(incidentBack.getUserApp()).isEqualTo(userApp);

        userApp.removeIncident(incidentBack);
        assertThat(userApp.getIncidents()).doesNotContain(incidentBack);
        assertThat(incidentBack.getUserApp()).isNull();

        userApp.incidents(new HashSet<>(Set.of(incidentBack)));
        assertThat(userApp.getIncidents()).containsOnly(incidentBack);
        assertThat(incidentBack.getUserApp()).isEqualTo(userApp);

        userApp.setIncidents(new HashSet<>());
        assertThat(userApp.getIncidents()).doesNotContain(incidentBack);
        assertThat(incidentBack.getUserApp()).isNull();
    }
}
