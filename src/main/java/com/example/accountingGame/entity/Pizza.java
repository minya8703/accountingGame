package com.example.accountingGame.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "pizza")
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Pizza {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;            // 피자 이름

    @Column(name = "base_price", nullable = false)
    private BigDecimal basePrice;   // 기본 가격

    @Column(name = "cost_price", nullable = false)
    private BigDecimal costPrice = BigDecimal.ZERO;   // 원가

    private String description;     // 설명
    private String imageUrl;        // 이미지 URL
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PizzaType type;
    
    @Column(name = "preparation_time")
    private Integer preparationTime;  // 준비 시간 (분)

    @Column(name = "is_available")
    private Boolean isAvailable;      // 판매 가능 여부
} 