package com.redmath.project.bank.Balance;

import com.redmath.project.bank.Account.Account;
import jakarta.transaction.Transactional;
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

    @Transactional
    public Balance insert(Balance balToInsert) {
        Long balId = balToInsert.getId();
        if(balId != null && balanceRepository.existsById(balId))
        {
            return null;
        }

        return balanceRepository.save(balToInsert);
    }

    @Transactional
    public Balance update(Balance updatedBalance, Long id) {
        Optional<Balance> existingBal = balanceRepository.findById(id);

        if (existingBal.isEmpty())
        {
            return null;
        }

        Balance existingBalance = existingBal.get();

        existingBalance.setAmount(updatedBalance.getAmount());
        existingBalance.setDate(updatedBalance.getDate());
        existingBalance.setLastTransaction(updatedBalance.getLastTransaction());
        existingBalance.setUserId(updatedBalance.getUserId());

        balanceRepository.save(existingBalance);

        return existingBalance;
    }

    public boolean deleteByUserId(Long userId) {
        Optional<Balance> bal = balanceRepository.findByUserId(userId);
        if(bal.isPresent())
        {
            balanceRepository.deleteByUserId(userId);
            return true;
        }
        return false;
    }
}
