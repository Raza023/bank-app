package com.redmath.project.bank.Transaction;

import com.redmath.project.bank.basic.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/bankTransaction")
public class TransactionController {

    final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Transaction>>> findAll()
    {
        return ResponseEntity.ok(ApiResponse.of(transactionService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Transaction>> findById(@PathVariable("id") Long id)
    {
        Optional<Transaction> trans = transactionService.findById(id);
        if(trans == null)
        {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(trans);
    }

    @GetMapping("/transactions/{id}")
    public ResponseEntity<ApiResponse<List<Transaction>>> getBalanceDetails(@PathVariable("id") Long id)
    {
        List<Transaction> transaction = transactionService.findByUserId(id);
        if(transaction != null)
        {
            return ResponseEntity.ok(ApiResponse.of(transaction));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Transaction>> insert(@RequestBody Transaction transactionToInsert)
    {
        Transaction insertedTransaction = transactionService.insert(transactionToInsert);
        if(insertedTransaction != null)
        {
            return ResponseEntity.ok(ApiResponse.of(insertedTransaction));
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

}
