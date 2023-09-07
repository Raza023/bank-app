package com.redmath.project.bank.Account;

import jakarta.persistence.*;

@Entity(name = "accounts")
public class Account {

    //ID,NAME,  PASSWORD, roles, EMAIL, ADDRESS
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "accounts_sequence")
    @SequenceGenerator(name = "accounts_sequence", sequenceName = "accounts_sequence", allocationSize = 1)
    private Long id;
    private String name;
    private String password;
    private String roles;
    private String email;
    private String address;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRoles() {
        return roles;
    }

    public void setRoles(String roles) {
        this.roles = roles;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
