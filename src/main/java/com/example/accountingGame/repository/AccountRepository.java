package com.example.accountingGame.repository;

import com.example.accountingGame.entity.Account;
import com.example.accountingGame.entity.Account.AccountType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByCode(String code);
    
    List<Account> findByType(AccountType type);
    
    List<Account> findByParentIsNull();
    
    List<Account> findByParent(Account parent);
    
    @Query("SELECT a FROM Account a WHERE a.isGroup = true")
    List<Account> findAllGroups();
    
    @Query("SELECT a FROM Account a WHERE a.isGroup = false")
    List<Account> findAllLeafs();
    
    @Query("SELECT DISTINCT a.type FROM Account a")
    List<AccountType> findAllAccountTypes();
} 