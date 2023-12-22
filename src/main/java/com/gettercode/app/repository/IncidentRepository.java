package com.gettercode.app.repository;

import com.gettercode.app.domain.Incident;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Incident entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    @Query("select incident from Incident incident where incident.user.login = ?#{authentication.name}")
    List<Incident> findByUserIsCurrentUser();
}
