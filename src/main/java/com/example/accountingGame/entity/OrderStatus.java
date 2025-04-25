package com.example.accountingGame.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "order_status")
@Getter
@Setter
@NoArgsConstructor
public class OrderStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "status_name", nullable = false, unique = true)
    private String statusName;

    @Column
    private String description;

    @OneToMany(mappedBy = "status", fetch = FetchType.EAGER)
    @JsonIgnoreProperties("status")
    private List<Order> orders = new ArrayList<>();
} 