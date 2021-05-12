package com.github.likanich.kengurumi.service;

import com.github.likanich.kengurumi.models.Role;
import com.github.likanich.kengurumi.models.User;
import com.github.likanich.kengurumi.repositories.RoleRepository;
import com.github.likanich.kengurumi.repositories.UserRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {
    private static final Logger logger = LogManager.getLogger(UserService.class);

    @PersistenceContext
    private EntityManager entityManager;
    @Autowired
    UserRepository userRepository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.info("Find user by username: {}", username);
        User user = userRepository.findByUsername(username);

        if (user == null) {
            logger.warn("User {} not found", username);
            throw new UsernameNotFoundException("User not found");
        }
        logger.info("User {} found", username);
        return user;
    }

    public User findUserById(Long id) {
        logger.info("Find user by id: {}", id);
        Optional<User> userFromDb = userRepository.findById(id);
        return userFromDb.orElse(new User());
    }

    public List<User> allUsers() {
        logger.info("Get all users");
        return userRepository.findAll();
    }

    public boolean saveUser(User user) {
        logger.info("Save user {}", user.getUsername());
        User userFromDb = userRepository.findByUsername(user.getUsername());

        if (userFromDb != null) {
            logger.info("User {} exist", userFromDb.getUsername());
            return false;
        }

        user.setRoles(Collections.singleton(new Role(1L, "ROLE_USER")));
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        logger.info("User {} saved", user.getUsername());

        return true;
    }

    public boolean deleteUser(Long userId) {
        logger.info("delete user by id: {}", userId);
        if (userRepository.findById(userId).isPresent()) {
            userRepository.deleteById(userId);
            logger.info("User deleted");
            return true;
        }
        logger.info("User not found");
        return false;
    }

    public List<User> userGtList(Long idMin) {
        return entityManager.createQuery("SELECT u FROM User u WHERE u.id > :paramId", User.class)
                .setParameter("paramId", idMin).getResultList();
    }
}
