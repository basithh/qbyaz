package com.qbyaz.repository;

import com.qbyaz.model.Token;
import com.qbyaz.model.TokenStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {

    List<Token> findBySessionIdOrderByTokenNumberAsc(Long sessionId);

    List<Token> findBySessionIdAndStatusOrderByTokenNumberAsc(Long sessionId, TokenStatus status);

    @Query("SELECT COALESCE(MAX(t.tokenNumber), 0) FROM Token t WHERE t.session.id = :sessionId")
    Integer findMaxTokenNumber(@Param("sessionId") Long sessionId);

    Optional<Token> findFirstBySessionIdAndStatusOrderByTokenNumberAsc(Long sessionId, TokenStatus status);

    @Query("SELECT COUNT(t) FROM Token t WHERE t.session.id = :sessionId AND t.status = :status")
    long countBySessionIdAndStatus(@Param("sessionId") Long sessionId, @Param("status") TokenStatus status);
}
