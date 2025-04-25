package com.example.accountingGame.repository;

import com.example.accountingGame.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    
    @Query("SELECT i FROM Inventory i WHERE i.quantity <= i.minimumQuantity")
    List<Inventory> findByQuantityLessThanEqualMinimumQuantity();
    
    List<Inventory> findByIngredientNameContainingIgnoreCase(String keyword);
} 