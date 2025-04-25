package com.example.accountingGame.repository;

import com.example.accountingGame.entity.Order;
import com.example.accountingGame.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatus(OrderStatus status);

    @Query("SELECT SUM(oi.price) FROM Order o JOIN o.orderItems oi " +
           "WHERE o.orderDate BETWEEN :startDate AND :endDate")
    BigDecimal calculateTotalRevenue(@Param("startDate") LocalDateTime startDate,
                                   @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(oi.cost) FROM Order o JOIN o.orderItems oi " +
           "WHERE o.orderDate BETWEEN :startDate AND :endDate")
    BigDecimal calculateTotalCost(@Param("startDate") LocalDateTime startDate,
                                @Param("endDate") LocalDateTime endDate);

    @Query("SELECT FUNCTION('DATE', o.orderDate) as date, SUM(oi.price) as revenue " +
           "FROM Order o JOIN o.orderItems oi " +
           "WHERE o.orderDate BETWEEN :startDate AND :endDate " +
           "GROUP BY FUNCTION('DATE', o.orderDate) " +
           "ORDER BY date")
    List<Object[]> getRevenueTrend(@Param("startDate") LocalDateTime startDate,
                                  @Param("endDate") LocalDateTime endDate);

    @Query("SELECT oi.pizza.name as pizzaName, COUNT(oi) as count, SUM(oi.price) as revenue " +
           "FROM Order o JOIN o.orderItems oi " +
           "WHERE o.orderDate BETWEEN :startDate AND :endDate " +
           "GROUP BY oi.pizza.name " +
           "ORDER BY count DESC")
    List<Object[]> getPopularItems(@Param("startDate") LocalDateTime startDate,
                                 @Param("endDate") LocalDateTime endDate);

    List<Order> findByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);
} 