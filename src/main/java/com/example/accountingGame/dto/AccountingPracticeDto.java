package com.example.accountingGame.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountingPracticeDto {
    private String term;
    private String definition;
    private String example;
    private List<JournalEntry> journalEntries;
    private String explanation;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JournalEntry {
        private String account;
        private String debit;
        private String credit;
        private String description;
    }
} 