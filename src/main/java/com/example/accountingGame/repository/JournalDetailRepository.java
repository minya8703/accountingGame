package com.example.accountingGame.repository;

import com.example.accountingGame.entity.JournalDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JournalDetailRepository extends JpaRepository<JournalDetail, Long> {
    List<JournalDetail> findByJournalEntryId(Long journalEntryId);
    
    @Query("SELECT d FROM JournalDetail d WHERE d.account.id = :accountId")
    List<JournalDetail> findByAccountId(@Param("accountId") Long accountId);
} 