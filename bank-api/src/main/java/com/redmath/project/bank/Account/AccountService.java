package com.redmath.project.bank.Account;

//import jakarta.transaction.Transactional;
import javax.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AccountService implements UserDetailsService {
    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Value("${news.page.min:0}")
    public int pageMin = 0;

    @Value("${news.page.size.min:1}")
    public int pageSizeMin = 1;

    @Value("${news.page.size.max:100}")
    public int pageSizeMax = 100;

    final AccountRepository accountRepository;

    public AccountService(AccountRepository repo)
    {
        this.accountRepository = repo;
    }


    public Account findByUserName(String userName)
    {
        return accountRepository.findByUserName(userName);
    }
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Account user = findByUserName(username);
        if(user == null)
        {
            throw new UsernameNotFoundException("Invalid user: "+ username);
        }
        return new org.springframework.security.core.userdetails.User(user.getUserName(),user.getPassword(), true,
                true, true,true, AuthorityUtils.commaSeparatedStringToAuthorityList(user.getRoles()));

    }

    public List<Account> findAll() {
        return accountRepository.findAll();
    }

    public Optional<Account> findById(Long id) {
        Optional<Account> acc = accountRepository.findById(id);
        if (acc.isPresent())
        {
            return acc;
        }
        return null;
    }

    @Transactional
    public Account insert(Account accToInsert) {
        Long accId = accToInsert.getId();
        if(accId != null && accountRepository.existsById(accId)) {
            return null;
        }
//        accToInsert.setId(System.currentTimeMillis());
        return accountRepository.save(accToInsert);
    }

    @Transactional
    public Account update(Account updatedAccount, Long id) {

        // Check if the account item with the given id exists in the repository
        Optional<Account> existingAccountOptional = accountRepository.findById(id);

        if (existingAccountOptional.isEmpty()) {
//            logger.trace("There is nothing to update with id = {}",id);
            return null; // Return null or throw an exception to handle the case where the account item doesn't exist
        }

        // Get the existing news item from the Optional
        Account existingAccount = existingAccountOptional.get();

        // Update the existing news item with the new data from newsToUpdate
        existingAccount.setUserName(updatedAccount.getUserName());
        existingAccount.setPassword(updatedAccount.getPassword());
        existingAccount.setRoles(updatedAccount.getRoles());
        existingAccount.setEmail(updatedAccount.getEmail());
        existingAccount.setAddress(updatedAccount.getAddress());

        // Save the updated news item back to the repository
        accountRepository.save(existingAccount);

        return existingAccount; // Return the updated news item
    }

    public boolean delete(Long id)
    {
        Optional<Account> news = accountRepository.findById(id);
        if(news.isPresent())
        {
            accountRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Account> findAllByName(int page, int size, String title) {

        if (page < pageMin) {
            page = pageMin;
        }
        if (size > pageSizeMax) {
            size = pageSizeMax;
        } else if (size < pageSizeMin) {
            size = pageSizeMin;
        }
        logger.debug("News search with page: {}, size: {}, title: {}", page, size, title.replaceAll("[\r\n]", ""));   //log forgery
        Pageable pageable = PageRequest.of(page, size);
        if (title.isEmpty() || title.isBlank()) {
            return accountRepository.findByOrderByIdDesc(pageable).getContent();
        }
        return accountRepository.findByUserNameLikeOrderByIdDesc(pageable, title).getContent();
    }

    public Account findByName(String name) {
        return accountRepository.findByUserName(name);
    }

    public Authentication getMyAuth()
    {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth;
    }

    public Optional<Account> findByEmail(String email) {
        Optional<Account> acc = accountRepository.findByEmail(email);
        if (acc.isPresent())
        {
            return acc;
        }
        return null;
    }
}
