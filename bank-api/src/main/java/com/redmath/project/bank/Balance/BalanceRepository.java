package com.redmath.project.bank.Balance;

import com.redmath.project.bank.Account.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BalanceRepository extends JpaRepository<Balance, Long> {
    Balance findAllByUserId(Long id);

//    Optional<Balance> findById(Long id);
}
