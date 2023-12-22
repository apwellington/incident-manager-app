package com.gettercode.app.domain;

import static com.gettercode.app.domain.CommentTestSamples.*;
import static com.gettercode.app.domain.IncidentTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.gettercode.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CommentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Comment.class);
        Comment comment1 = getCommentSample1();
        Comment comment2 = new Comment();
        assertThat(comment1).isNotEqualTo(comment2);

        comment2.setId(comment1.getId());
        assertThat(comment1).isEqualTo(comment2);

        comment2 = getCommentSample2();
        assertThat(comment1).isNotEqualTo(comment2);
    }

    @Test
    void incidentTest() throws Exception {
        Comment comment = getCommentRandomSampleGenerator();
        Incident incidentBack = getIncidentRandomSampleGenerator();

        comment.setIncident(incidentBack);
        assertThat(comment.getIncident()).isEqualTo(incidentBack);

        comment.incident(null);
        assertThat(comment.getIncident()).isNull();
    }
}
