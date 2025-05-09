package com.example.accountingGame.service;

import com.example.accountingGame.dto.AccountingReportDto;
import com.example.accountingGame.entity.Account;
import com.example.accountingGame.entity.Account.AccountType;
import com.example.accountingGame.entity.JournalDetail;
import com.example.accountingGame.entity.JournalEntry;
import com.example.accountingGame.entity.JournalEntry.JournalStatus;
import com.example.accountingGame.entity.Order;
import com.example.accountingGame.entity.OrderItem;
import com.example.accountingGame.model.ReportPeriod;
import com.example.accountingGame.repository.AccountRepository;
import com.example.accountingGame.repository.JournalDetailRepository;
import com.example.accountingGame.repository.JournalEntryRepository;
import com.example.accountingGame.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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
public class AccountingService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private JournalEntryRepository journalEntryRepository;
    @Autowired
    private JournalDetailRepository journalDetailRepository;
    @Autowired
    private AccountRepository accountRepository;

    @Transactional(readOnly = true)
    public AccountingReportDto getReport(String range) {
        LocalDateTime startDate;
        LocalDateTime endDate = LocalDateTime.now();

        startDate = switch (range.toUpperCase()) {
            case "DAILY" -> endDate.minusDays(1);
            case "WEEKLY" -> endDate.minusWeeks(1);
            case "MONTHLY" -> endDate.minusMonths(1);
            default -> endDate.minusWeeks(1);
        };

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

    @Transactional
    public JournalEntry createJournalEntry(String description, LocalDate date, List<JournalDetail> details) {
        // 차변과 대변의 합계가 일치하는지 검증
        BigDecimal totalDebit = BigDecimal.ZERO;
        BigDecimal totalCredit = BigDecimal.ZERO;
        
        for (JournalDetail detail : details) {
            totalDebit = totalDebit.add(detail.getDebitAmount());
            totalCredit = totalCredit.add(detail.getCreditAmount());
        }
        
        if (totalDebit.compareTo(totalCredit) != 0) {
            throw new IllegalArgumentException("차변과 대변의 합계가 일치하지 않습니다.");
        }

        // 분개 생성
        JournalEntry journalEntry = new JournalEntry();
        journalEntry.setDescription(description);
        journalEntry.setDate(date);
        journalEntry.setStatus(JournalStatus.PENDING);
        
        // 분개 상세 내역 설정
        for (JournalDetail detail : details) {
            detail.setJournalEntry(journalEntry);
        }
        journalEntry.setDetails(details);
        
        return journalEntryRepository.save(journalEntry);
    }

    @Transactional
    public JournalEntry approveJournalEntry(Long id) {
        JournalEntry entry = journalEntryRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("분개를 찾을 수 없습니다."));
        
        if (entry.getStatus() != JournalStatus.PENDING) {
            throw new IllegalStateException("대기 상태의 분개만 승인할 수 있습니다.");
        }
        
        entry.setStatus(JournalStatus.APPROVED);
        return journalEntryRepository.save(entry);
    }

    @Transactional
    public JournalEntry rejectJournalEntry(Long id, String reason) {
        JournalEntry entry = journalEntryRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("분개를 찾을 수 없습니다."));
        
        if (entry.getStatus() != JournalStatus.PENDING) {
            throw new IllegalStateException("대기 상태의 분개만 거부할 수 있습니다.");
        }
        
        entry.setStatus(JournalStatus.REJECTED);
        return journalEntryRepository.save(entry);
    }

    public List<JournalEntry> getPendingJournalEntries() {
        return journalEntryRepository.findByStatus(JournalStatus.PENDING);
    }

    @Transactional
    public Account createAccount(String name, String code, AccountType type, Long parentId, boolean isGroup) {
        Account account = new Account();
        account.setName(name);
        account.setCode(code);
        account.setType(type);
        account.setGroup(isGroup);
        
        if (parentId != null) {
            Account parent = accountRepository.findById(parentId)
                .orElseThrow(() -> new IllegalArgumentException("상위 계정을 찾을 수 없습니다."));
            account.setParent(parent);
            
            // 상위 계정의 유형과 동일해야 함
            if (parent.getType() != type) {
                throw new IllegalArgumentException("상위 계정과 동일한 유형이어야 합니다.");
            }
        }
        
        return accountRepository.save(account);
    }

    public Account getAccountByCode(String code) {
        return accountRepository.findByCode(code)
            .orElseThrow(() -> new IllegalArgumentException("계정을 찾을 수 없습니다."));
    }

    public List<Account> getAccountsByType(AccountType type) {
        return accountRepository.findByType(type);
    }

    public List<Account> getRootAccounts() {
        return accountRepository.findByParentIsNull();
    }

    public List<Account> getChildAccounts(Long parentId) {
        Account parent = accountRepository.findById(parentId)
            .orElseThrow(() -> new IllegalArgumentException("상위 계정을 찾을 수 없습니다."));
        return accountRepository.findByParent(parent);
    }

    public List<Account> getAccountGroups() {
        return accountRepository.findAllGroups();
    }

    public List<Account> getLeafAccounts() {
        return accountRepository.findAllLeafs();
    }

    public List<AccountType> getAllAccountTypes() {
        return accountRepository.findAllAccountTypes();
    }

    public BigDecimal getAccountBalance(Long accountId, LocalDate startDate, LocalDate endDate) {
        Account account = accountRepository.findById(accountId)
            .orElseThrow(() -> new IllegalArgumentException("계정을 찾을 수 없습니다."));
            
        BigDecimal balance = journalEntryRepository.getAccountBalance(
            accountId,
            startDate.atStartOfDay(),
            endDate.atTime(23, 59, 59)
        );
        
        // 계정 유형에 따라 잔액 부호 조정
        if (account.getType() == AccountType.LIABILITY || 
            account.getType() == AccountType.EQUITY ||
            account.getType() == AccountType.REVENUE) {
            balance = balance.negate();
        }
        
        return balance;
    }

    public List<JournalEntry> getJournalEntries(LocalDate startDate, LocalDate endDate) {
        return journalEntryRepository.findByDateBetweenOrderByDateDesc(
            startDate.atStartOfDay(),
            endDate.atTime(23, 59, 59)
        );
    }
} 