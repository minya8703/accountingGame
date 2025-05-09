package com.example.accountingGame.dto;

import java.math.BigDecimal;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AccountActivityDTO {
    private String accountCode;
    private BigDecimal totalDebit;
    private BigDecimal totalCredit;
    
    public BigDecimal getNetAmount() {
        return totalDebit.subtract(totalCredit);
    }
} 