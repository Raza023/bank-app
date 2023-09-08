package com.redmath.project.bank.Balance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface BalanceRepository extends JpaRepository<Balance, Long> {
    Balance findAllByUserId(Long id);

//    Optional<Balance> findById(Long id);
}
