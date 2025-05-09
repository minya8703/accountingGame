package com.example.accountingGame.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "account")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Account parent;

    @OneToMany(mappedBy = "parent")
    private List<Account> children = new ArrayList<>();

    @Column(nullable = false)
    private boolean isGroup = false;

    public enum AccountType {
        ASSET("자산"),
        LIABILITY("부채"),
        EQUITY("자본"),
        REVENUE("수익"),
        EXPENSE("비용");

        private final String description;

        AccountType(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }
} 