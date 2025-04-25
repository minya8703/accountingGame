package com.example.accountingGame.controller;

import com.example.accountingGame.model.ReportPeriod;
import com.example.accountingGame.service.AccountingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/accounting")
public class AccountingController {

    @Autowired
    private AccountingService accountingService;

    @GetMapping("/report")
    public ResponseEntity<Map<String, Object>> getReport(@RequestParam(defaultValue = "MONTHLY") ReportPeriod period) {
        return ResponseEntity.ok(accountingService.generateReport(period));
    }
} 