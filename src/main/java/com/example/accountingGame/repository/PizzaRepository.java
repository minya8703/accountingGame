package com.example.accountingGame.repository;

import com.example.accountingGame.entity.Pizza;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PizzaRepository extends JpaRepository<Pizza, Long> {
    List<Pizza> findByIsAvailableTrue();
    List<Pizza> findByType(String type);
} 