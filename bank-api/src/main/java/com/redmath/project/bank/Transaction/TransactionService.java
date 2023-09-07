package com.redmath.project.bank.Transaction;

import com.redmath.project.bank.Account.Account;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {
    final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public List<Transaction> findAll() {
        return transactionRepository.findAll();
    }

    public Optional<Transaction> findById(Long id) {
        Optional<Transaction> trans = transactionRepository.findById(id);

        if(trans.isPresent())
        {
            return trans;
        }
        return null;
    }

    public List<Transaction> findByUserId(Long id) {
        return transactionRepository.findAllByUserId(id);
    }

    @Transactional
    public Transaction insert(Transaction transactionToInsert) {
        Long transId = transactionToInsert.getId();
        if(transId != null && transactionRepository.existsById(transId))
        {
            return null;
        }
//        transactionToInsert.setId(System.currentTimeMillis());   //implemented sequence for it.
        return transactionRepository.save(transactionToInsert);
    }

//    @Transactional
//    public Transaction insert(Transaction accToInsert) {
//        Long accId = accToInsert.getId();
//        if(accId != null && transactionRepository.existsById(accId)) {
//            return null;
//        }
////        accToInsert.setId(System.currentTimeMillis());
//        return transactionRepository.save(accToInsert);
//    }
}
