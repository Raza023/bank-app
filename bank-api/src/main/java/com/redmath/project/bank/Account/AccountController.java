package com.redmath.project.bank.Account;


import com.redmath.project.bank.basic.ApiResponse;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/bankAccount")
public class AccountController {

    final AccountService accountService;

    public AccountController(AccountService service)
    {
        this.accountService = service;
    }


    @PreAuthorize("permitAll()")
    @CacheEvict(value = "userNameCache", allEntries = true)
    @GetMapping("/auth")
    public ResponseEntity<ApiResponse<Account>> getAuthenticatedUser()
    {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if(auth != null)
        {
            Account account = accountService.findByName(auth.getName());
            return ResponseEntity.ok(ApiResponse.of(account));
        }
        return ResponseEntity.notFound().build();
    }

    @CacheEvict(value = "userNameCache", allEntries = true)
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<Account>> insert(@RequestBody Account accToInsert)
    {
        Account createdAcc = accountService.insert(accToInsert);
        if(createdAcc != null)
        {
            return ResponseEntity.ok(ApiResponse.of(createdAcc));
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @CacheEvict(value = "userNameCache", allEntries = true)
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/{id}")
    public ResponseEntity<ApiResponse<Account>> update(@RequestBody Account updatedAccount, @PathVariable("id") Long id)
    {
        Account updated = accountService.update(updatedAccount,id);   //to save on db as well

        if (updated != null) {
            return ResponseEntity.ok(ApiResponse.of(updated));
        }
        return ResponseEntity.notFound().build();
    }

//    @CacheEvict(value = "userNameCache", allEntries = true)
//    @PreAuthorize("hasAuthority('ADMIN')")
//    @PutMapping("/{id}")
//    public ResponseEntity<ApiResponse<Account>> updates(@RequestBody Account updatedAccount, @PathVariable("id") Long id)
//    {
//        Account updated = accountService.update(updatedAccount,id);   //to save on db as well
//
//        if (updated != null) {
//            return ResponseEntity.ok(ApiResponse.of(updated));
//        }
//        return ResponseEntity.notFound().build();
//    }

    @CacheEvict(value = "userNameCache", allEntries = true)
    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<List<Account>>> delete(@PathVariable("id") Long id)
    {
        boolean deleted = accountService.delete(id);
        if(deleted)
        {
            List<Account> list = accountService.findAll();
            return ResponseEntity.ok(ApiResponse.of(list));
        }
        else
        {
            List<Account> list = accountService.findAll();
            return ResponseEntity.ok(ApiResponse.of(list));
        }
    }

    @PreAuthorize("permitAll()")
    @CacheEvict(value = "userNameCache", allEntries = true)
    @GetMapping("/all")
    public ResponseEntity<List<Account>> findAll()
    {
        return ResponseEntity.ok(accountService.findAll());
    }

    @PreAuthorize("permitAll()")
    @CacheEvict(value = "userNameCache", allEntries = true)
    @GetMapping("/{id}")
    public ResponseEntity<Optional<Account>> findById(@PathVariable("id") Long id)
    {
        Optional<Account> acc = accountService.findById(id);

        if(acc == null)
        {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(acc);
    }

    @PreAuthorize("permitAll()")
    @CacheEvict(value = "userNameCache", allEntries = true)
    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<Optional<Account>>> findByEmail(@PathVariable("email") String email)
    {
        Optional<Account> acc = accountService.findByEmail(email);

        if(acc == null)
        {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ApiResponse.of(acc));
    }

    @PreAuthorize("permitAll()")
    @Cacheable("userNameCache") // Define a cache named "userNameCache"
    @GetMapping
    public ResponseEntity<ApiResponse<List<Account>>> findAllByName(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "100") int size,
            @RequestParam(name = "title", defaultValue = "") String title) {
        List<Account> news = accountService.findAllByName(page, size, title);
        if (news.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ApiResponse.of(news));
    }
}
