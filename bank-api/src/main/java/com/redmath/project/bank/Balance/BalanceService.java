package com.redmath.project.bank.Balance;

import com.redmath.project.bank.Account.Account;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BalanceService {

    final BalanceRepository balanceRepository;

    Logger logger = LoggerFactory.getLogger(getClass());

    public BalanceService(BalanceRepository balanceRepository) {
        this.balanceRepository = balanceRepository;
    }


    public List<Balance> findAll() {
        return balanceRepository.findAll();
    }

    public Optional<Balance> findById(Long id) {

        Optional<Balance> bal =  balanceRepository.findById(id);

        if(bal.isPresent())
        {
            logger.info("Balance found at id: "+id);
            return bal;
        }
        else
        {
            return null;
        }
    }

    public Balance findByUserId(Long id) {
        return balanceRepository.findAllByUserId(id);
    }
}
