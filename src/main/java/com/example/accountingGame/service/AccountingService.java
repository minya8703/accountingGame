package com.example.accountingGame.service;

import com.example.accountingGame.dto.AccountingReportDto;
import com.example.accountingGame.entity.Order;
import com.example.accountingGame.entity.OrderItem;
import com.example.accountingGame.model.ReportPeriod;
import com.example.accountingGame.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountingService {

    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public AccountingReportDto getReport(String range) {
        LocalDateTime startDate;
        LocalDateTime endDate = LocalDateTime.now();

        switch (range.toUpperCase()) {
            case "DAILY":
                startDate = endDate.minusDays(1);
                break;
            case "WEEKLY":
                startDate = endDate.minusWeeks(1);
                break;
            case "MONTHLY":
                startDate = endDate.minusMonths(1);
                break;
            default:
                startDate = endDate.minusWeeks(1);
        }

        List<Order> orders = orderRepository.findByOrderDateBetween(startDate, endDate);
        
        Map<LocalDate, List<Order>> ordersByDate = orders.stream()
                .collect(Collectors.groupingBy(order -> order.getOrderDate().toLocalDate()));

        Map<LocalDate, AccountingReportDto.DailyReport> dailyReports = ordersByDate.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> createDailyReport(entry.getKey(), entry.getValue())
                ));

        BigDecimal totalSales = dailyReports.values().stream()
                .map(AccountingReportDto.DailyReport::getSales)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalCost = dailyReports.values().stream()
                .map(AccountingReportDto.DailyReport::getCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return AccountingReportDto.builder()
                .range(range)
                .startDate(startDate.toLocalDate())
                .endDate(endDate.toLocalDate())
                .totalSales(totalSales)
                .totalCost(totalCost)
                .totalProfit(totalSales.subtract(totalCost))
                .dailyReports(dailyReports)
                .build();
    }

    private AccountingReportDto.DailyReport createDailyReport(LocalDate date, List<Order> orders) {
        List<AccountingReportDto.DailyReport.OrderReport> orderReports = orders.stream()
                .map(this::createOrderReport)
                .collect(Collectors.toList());

        BigDecimal sales = orderReports.stream()
                .map(AccountingReportDto.DailyReport.OrderReport::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal cost = orderReports.stream()
                .map(AccountingReportDto.DailyReport.OrderReport::getTotalCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return AccountingReportDto.DailyReport.builder()
                .date(date)
                .sales(sales)
                .cost(cost)
                .profit(sales.subtract(cost))
                .orders(orderReports)
                .build();
    }

    private AccountingReportDto.DailyReport.OrderReport createOrderReport(Order order) {
        BigDecimal totalAmount = order.getOrderItems().stream()
                .map(OrderItem::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalCost = order.getOrderItems().stream()
                .map(OrderItem::getCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return AccountingReportDto.DailyReport.OrderReport.builder()
                .orderId(order.getId())
                .customerName(order.getCustomerName())
                .totalAmount(totalAmount)
                .totalCost(totalCost)
                .profit(totalAmount.subtract(totalCost))
                .build();
    }

    public Map<String, Object> generateReport(ReportPeriod period) {
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = getStartDate(period, endDate);

        BigDecimal totalRevenue = orderRepository.calculateTotalRevenue(startDate, endDate);
        BigDecimal totalCost = orderRepository.calculateTotalCost(startDate, endDate);
        BigDecimal totalProfit = totalRevenue.subtract(totalCost);

        List<Object[]> revenueTrend = orderRepository.getRevenueTrend(startDate, endDate);
        List<Object[]> popularItems = orderRepository.getPopularItems(startDate, endDate);

        Map<String, Object> report = new HashMap<>();
        report.put("totalRevenue", totalRevenue);
        report.put("totalCost", totalCost);
        report.put("totalProfit", totalProfit);
        report.put("revenueTrend", convertRevenueTrend(revenueTrend));
        report.put("popularItems", convertPopularItems(popularItems));

        return report;
    }

    private List<Map<String, Object>> convertRevenueTrend(List<Object[]> trend) {
        return trend.stream().map(row -> {
            Map<String, Object> item = new HashMap<>();
            item.put("date", row[0]);
            item.put("revenue", row[1]);
            return item;
        }).collect(Collectors.toList());
    }

    private List<Map<String, Object>> convertPopularItems(List<Object[]> items) {
        return items.stream().map(row -> {
            Map<String, Object> item = new HashMap<>();
            item.put("name", row[0]);
            item.put("count", row[1]);
            item.put("revenue", row[2]);
            return item;
        }).collect(Collectors.toList());
    }

    private LocalDateTime getStartDate(ReportPeriod period, LocalDateTime endDate) {
        switch (period) {
            case DAILY:
                return endDate.minusDays(1);
            case WEEKLY:
                return endDate.minusWeeks(1);
            case MONTHLY:
                return endDate.minusMonths(1);
            default:
                return endDate.minusMonths(1);
        }
    }
} 