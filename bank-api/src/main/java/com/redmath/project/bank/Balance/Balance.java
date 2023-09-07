package com.redmath.project.bank.Balance;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity(name= "balances")
public class Balance {

    //DATE, AMOUNT, DB/CR Indicator

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "balance_sequence")
    @SequenceGenerator(name = "balance_sequence", sequenceName = "balance_sequence", allocationSize = 1)
    private Long id;
    private Long amount;
    private String lastTransaction;
    private LocalDateTime date;
    private Long userId;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public String getLastTransaction() {
        return lastTransaction;
    }

    public void setLastTransaction(String lastTransaction) {
        this.lastTransaction = lastTransaction;
    }
}
