package com.example.accountingGame.repository;

import com.example.accountingGame.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface OrderStatusRepository extends JpaRepository<OrderStatus, Long> {
    @Query("SELECT os FROM OrderStatus os WHERE os.statusName = :statusName")
    Optional<OrderStatus> findByStatusName(@Param("statusName") String statusName);
} 