package com.redmath.project.bank.Account;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    Page<Account> findByOrderByIdDesc(Pageable pageable);

    Page<Account> findByUserNameLikeOrderByIdDesc(Pageable pageable, String name);

    Account findByUserName(String userName);

    Optional<Account> findByEmail(String email);
}
