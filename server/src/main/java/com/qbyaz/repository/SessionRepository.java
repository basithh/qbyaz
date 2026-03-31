package com.qbyaz.repository;

import com.qbyaz.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Long> {
    Optional<Session> findBySlug(String slug);
}
