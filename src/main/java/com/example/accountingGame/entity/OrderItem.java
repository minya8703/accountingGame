package com.example.accountingGame.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter @Setter
@Table(name = "order_item")
@NoArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "order_id")
    @JsonIgnoreProperties({"orderItems"})
    private Order order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pizza_id")
    private Pizza pizza;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PizzaSize size;

    private Integer quantity;        // 수량
    private BigDecimal price;        // 판매 가격
    private BigDecimal cost;         // 원가
    
    // 가격 계산 메서드
    public void calculatePrice() {
        if (pizza == null || quantity == null || size == null) {
            this.price = BigDecimal.ZERO;
            this.cost = BigDecimal.ZERO;
            return;
        }

        // basePrice가 null이면 0으로 설정
        BigDecimal basePrice = pizza.getBasePrice() != null ? 
            pizza.getBasePrice() : BigDecimal.ZERO;
            
        // size multiplier가 null이면 1로 설정
        double sizeMultiplier = size != null ? size.getPriceMultiplier() : 1.0;
        
        // type multiplier가 null이면 1로 설정
        double typeMultiplier = pizza.getType() != null ? 
            pizza.getType().getPriceMultiplier() : 1.0;
        
        // 최종 가격 계산
        this.price = basePrice
            .multiply(BigDecimal.valueOf(sizeMultiplier))
            .multiply(BigDecimal.valueOf(typeMultiplier))
            .multiply(BigDecimal.valueOf(quantity));
        
        // costPrice가 null이면 0으로 설정
        BigDecimal costPrice = pizza.getCostPrice() != null ? 
            pizza.getCostPrice() : BigDecimal.ZERO;
        this.cost = costPrice.multiply(BigDecimal.valueOf(quantity));
    }
} 