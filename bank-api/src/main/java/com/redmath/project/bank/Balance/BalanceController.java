package com.redmath.project.bank.Balance;

import com.redmath.project.bank.Account.Account;
import com.redmath.project.bank.Account.AccountService;
import com.redmath.project.bank.basic.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/bankBalance")
public class BalanceController {

    final BalanceService balanceService;
    AccountService accountService;

    private final Logger logger = LoggerFactory.getLogger(getClass());


    public BalanceController(BalanceService balanceService, AccountService accountService)
    {
        this.balanceService = balanceService;
        this.accountService = accountService;
    }

    @GetMapping
    public ResponseEntity<List<Balance>> findAll()
    {
        return ResponseEntity.ok(balanceService.findAll());
    }

    @GetMapping("/balance/{id}")
    public ResponseEntity<ApiResponse<Balance>> getBalanceDetails(@PathVariable("id") Long id)
    {
        Balance balance = balanceService.findByUserId(id);
        if(balance != null)
        {
            return ResponseEntity.ok(ApiResponse.of(balance));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Balance>> findById(@PathVariable("id") Long id)
    {
        Optional<Balance> bal = balanceService.findById(id);

        if(bal == null)
        {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(bal);
    }
    
    @GetMapping("/auth")
    public ResponseEntity<ApiResponse<Account>> getAuthenticatedUser()
    {
//        Authentication auth = accountService.getAuthenticationFromSecurityContext();

        Authentication auth = accountService.getMyAuth();
        logger.debug("AuthName is: "+auth.getName());

        if(auth != null)
        {
            Account account = accountService.findByName(auth.getName());
            logger.debug("AuthName is: "+auth.getName());
            return ResponseEntity.ok(ApiResponse.of(account));
        }
        return ResponseEntity.notFound().build();
    }



}
