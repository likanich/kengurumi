package com.github.likanich.kengurumi.repositories;

import com.github.likanich.kengurumi.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
