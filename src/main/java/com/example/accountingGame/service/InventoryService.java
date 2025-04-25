package com.example.accountingGame.service;

import com.example.accountingGame.entity.Inventory;
import com.example.accountingGame.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public Optional<Inventory> getInventoryById(Long id) {
        return inventoryRepository.findById(id);
    }

    @Transactional
    public Inventory saveInventory(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    @Transactional
    public void deleteInventory(Long id) {
        inventoryRepository.deleteById(id);
    }

    public List<Inventory> getLowStockItems() {
        return inventoryRepository.findByQuantityLessThanEqualMinimumQuantity();
    }

    @Transactional
    public void updateInventoryQuantity(Long id, BigDecimal quantity) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("재고 항목을 찾을 수 없습니다: " + id));
        
        inventory.setQuantity(inventory.getQuantity().add(quantity));
        inventoryRepository.save(inventory);
    }

    public boolean checkSufficientStock(Long id, BigDecimal requiredQuantity) {
        Optional<Inventory> inventoryOpt = inventoryRepository.findById(id);
        if (inventoryOpt.isEmpty()) {
            return false;
        }
        Inventory inventory = inventoryOpt.get();
        return inventory.getQuantity().compareTo(requiredQuantity) >= 0;
    }
} 