package com.example.accountingGame.controller;

import com.example.accountingGame.dto.AccountingReportDto;
import com.example.accountingGame.entity.Account;
import com.example.accountingGame.entity.JournalDetail;
import com.example.accountingGame.entity.JournalEntry;
import com.example.accountingGame.model.ReportPeriod;
import com.example.accountingGame.service.AccountingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounting")
@CrossOrigin(origins = "http://localhost:3000")
public class AccountingController {

    @Autowired
    private AccountingService accountingService;

    @GetMapping("/report")
    public ResponseEntity<AccountingReportDto> getReport(@RequestParam(defaultValue = "WEEKLY") String range) {
        return ResponseEntity.ok(accountingService.getReport(range));
    }

    @GetMapping("/report/detailed")
    public ResponseEntity<Map<String, Object>> getDetailedReport(
            @RequestParam(defaultValue = "MONTHLY") ReportPeriod period) {
        return ResponseEntity.ok(accountingService.generateReport(period));
    }

    @PostMapping("/journal-entries")
    public ResponseEntity<JournalEntry> createJournalEntry(
            @RequestBody CreateJournalEntryRequest request) {
        JournalEntry entry = accountingService.createJournalEntry(
            request.getDescription(),
            request.getDate(),
            request.getDetails()
        );
        return ResponseEntity.ok(entry);
    }

    @GetMapping("/journal-entries")
    public ResponseEntity<List<JournalEntry>> getJournalEntries(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(accountingService.getJournalEntries(startDate, endDate));
    }

    @GetMapping("/accounts/{type}")
    public ResponseEntity<List<Account>> getAccountsByType(
            @PathVariable Account.AccountType type) {
        return ResponseEntity.ok(accountingService.getAccountsByType(type));
    }

    @GetMapping("/accounts/{accountId}/balance")
    public ResponseEntity<BigDecimal> getAccountBalance(
            @PathVariable Long accountId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(accountingService.getAccountBalance(accountId, startDate, endDate));
    }
}

record CreateJournalEntryRequest(
    String description,
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    LocalDate date,
    List<JournalDetail> details
) {
    public String getDescription() { return description; }
    public LocalDate getDate() { return date; }
    public List<JournalDetail> getDetails() { return details; }
} 