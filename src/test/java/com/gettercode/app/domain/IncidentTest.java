package com.gettercode.app.domain;

import static com.gettercode.app.domain.CommentTestSamples.*;
import static com.gettercode.app.domain.DepartmentTestSamples.*;
import static com.gettercode.app.domain.IncidentTestSamples.*;
import static com.gettercode.app.domain.PriorityTestSamples.*;
import static com.gettercode.app.domain.StatusTestSamples.*;
import static com.gettercode.app.domain.UserAppTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.gettercode.app.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class IncidentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Incident.class);
        Incident incident1 = getIncidentSample1();
        Incident incident2 = new Incident();
        assertThat(incident1).isNotEqualTo(incident2);

        incident2.setId(incident1.getId());
        assertThat(incident1).isEqualTo(incident2);

        incident2 = getIncidentSample2();
        assertThat(incident1).isNotEqualTo(incident2);
    }

    @Test
    void commentTest() throws Exception {
        Incident incident = getIncidentRandomSampleGenerator();
        Comment commentBack = getCommentRandomSampleGenerator();

        incident.addComment(commentBack);
        assertThat(incident.getComments()).containsOnly(commentBack);
        assertThat(commentBack.getIncident()).isEqualTo(incident);

        incident.removeComment(commentBack);
        assertThat(incident.getComments()).doesNotContain(commentBack);
        assertThat(commentBack.getIncident()).isNull();

        incident.comments(new HashSet<>(Set.of(commentBack)));
        assertThat(incident.getComments()).containsOnly(commentBack);
        assertThat(commentBack.getIncident()).isEqualTo(incident);

        incident.setComments(new HashSet<>());
        assertThat(incident.getComments()).doesNotContain(commentBack);
        assertThat(commentBack.getIncident()).isNull();
    }

    @Test
    void departmentTest() throws Exception {
        Incident incident = getIncidentRandomSampleGenerator();
        Department departmentBack = getDepartmentRandomSampleGenerator();

        incident.setDepartment(departmentBack);
        assertThat(incident.getDepartment()).isEqualTo(departmentBack);

        incident.department(null);
        assertThat(incident.getDepartment()).isNull();
    }

    @Test
    void priorityTest() throws Exception {
        Incident incident = getIncidentRandomSampleGenerator();
        Priority priorityBack = getPriorityRandomSampleGenerator();

        incident.setPriority(priorityBack);
        assertThat(incident.getPriority()).isEqualTo(priorityBack);

        incident.priority(null);
        assertThat(incident.getPriority()).isNull();
    }

    @Test
    void statusTest() throws Exception {
        Incident incident = getIncidentRandomSampleGenerator();
        Status statusBack = getStatusRandomSampleGenerator();

        incident.setStatus(statusBack);
        assertThat(incident.getStatus()).isEqualTo(statusBack);

        incident.status(null);
        assertThat(incident.getStatus()).isNull();
    }

    @Test
    void userAppTest() throws Exception {
        Incident incident = getIncidentRandomSampleGenerator();
        UserApp userAppBack = getUserAppRandomSampleGenerator();

        incident.setUserApp(userAppBack);
        assertThat(incident.getUserApp()).isEqualTo(userAppBack);

        incident.userApp(null);
        assertThat(incident.getUserApp()).isNull();
    }
}
