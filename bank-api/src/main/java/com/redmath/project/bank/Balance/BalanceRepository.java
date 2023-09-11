package com.redmath.project.bank.Balance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;


@Repository
public interface BalanceRepository extends JpaRepository<Balance, Long> {
    Balance findAllByUserId(Long id);

    Optional<Balance> findByUserId(Long userId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM balances WHERE user_id = ?1", nativeQuery = true)
    void deleteByUserId(Long userId);


//    Optional<Balance> findById(Long id);
}
