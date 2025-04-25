package com.example.accountingGame.entity;

public enum PizzaType {
    CLASSIC("클래식", 1.0),
    PREMIUM("프리미엄", 1.5),
    SIGNATURE("시그니처", 2.0);

    private final String displayName;
    private final double priceMultiplier;

    PizzaType(String displayName, double priceMultiplier) {
        this.displayName = displayName;
        this.priceMultiplier = priceMultiplier;
    }

    public String getDisplayName() {
        return displayName;
    }

    public double getPriceMultiplier() {
        return priceMultiplier;
    }
} 