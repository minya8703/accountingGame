package com.example.accountingGame.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountingReportDto {
    private String range;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalSales;
    private BigDecimal totalCost;
    private BigDecimal totalProfit;
    private Map<LocalDate, DailyReport> dailyReports;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyReport {
        private LocalDate date;
        private BigDecimal sales;
        private BigDecimal cost;
        private BigDecimal profit;
        private List<OrderReport> orders;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class OrderReport {
            private Long orderId;
            private String customerName;
            private BigDecimal totalAmount;
            private BigDecimal totalCost;
            private BigDecimal profit;
        }
    }
} 