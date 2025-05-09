package com.example.accountingGame.repository;

import com.example.accountingGame.entity.JournalEntry;
import com.example.accountingGame.entity.JournalEntry.JournalStatus;
import com.example.accountingGame.dto.AccountActivityDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {
    List<JournalEntry> findByDateBetweenOrderByDateDesc(LocalDateTime startDate, LocalDateTime endDate);
    
    List<JournalEntry> findByStatus(JournalStatus status);
    
    @Query("SELECT j FROM JournalEntry j JOIN j.details d WHERE d.account.id = :accountId")
    List<JournalEntry> findByAccountId(@Param("accountId") Long accountId);
    
    @Query("SELECT COALESCE(SUM(d.debitAmount), 0) - COALESCE(SUM(d.creditAmount), 0) " +
           "FROM JournalEntry j JOIN j.details d " +
           "WHERE d.account.id = :accountId AND j.date BETWEEN :startDate AND :endDate")
    BigDecimal getAccountBalance(
        @Param("accountId") Long accountId, 
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT COUNT(j) FROM JournalEntry j WHERE j.status = :status")
    long countByStatus(@Param("status") JournalStatus status);

    @Query("SELECT j FROM JournalEntry j WHERE j.description LIKE %:keyword%")
    List<JournalEntry> searchByDescription(@Param("keyword") String keyword);

    @Query("SELECT DISTINCT j.description FROM JournalEntry j WHERE j.status = 'POSTED' ORDER BY j.date DESC")
    List<String> findCommonTransactionDescriptions();

    @Query("SELECT new com.example.accountingGame.dto.AccountActivityDTO(" +
           "a.code, " +
           "COALESCE(SUM(d.debitAmount), 0), " +
           "COALESCE(SUM(d.creditAmount), 0)) " +
           "FROM JournalEntry j " +
           "JOIN j.details d " +
           "JOIN d.account a " +
           "WHERE j.date BETWEEN :startDate AND :endDate " +
           "AND j.status = 'POSTED' " +
           "GROUP BY a.code")
    List<AccountActivityDTO> getAccountActivity(@Param("startDate") LocalDateTime startDate, 
                                              @Param("endDate") LocalDateTime endDate);
} 