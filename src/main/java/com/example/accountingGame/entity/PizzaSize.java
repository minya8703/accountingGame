package com.example.accountingGame.entity;

public enum PizzaSize {
    SMALL("SMALL", 1.0),
    MEDIUM("MEDIUM", 1.2),
    LARGE("LARGE", 1.5);

    private final String sizeName;
    private final double priceMultiplier;

    PizzaSize(String sizeName, double priceMultiplier) {
        this.sizeName = sizeName;
        this.priceMultiplier = priceMultiplier;
    }

    public String getSizeName() {
        return sizeName;
    }

    public double getPriceMultiplier() {
        return priceMultiplier;
    }
} 