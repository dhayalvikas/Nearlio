package com.nearlio.config;

import com.nearlio.model.Category;
import com.nearlio.model.Role;
import com.nearlio.model.User;
import com.nearlio.repository.CategoryRepository;
import com.nearlio.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        List<String> defaultCategories = List.of(
                "Plumbing",
                "Electrical",
                "Salon & Beauty",
                "Tutoring",
                "Cleaning",
                "Appliance Repair",
                "Carpentry",
                "Painting",
                "Pest Control",
                "AC & Refrigeration"
        );

        for (String name : defaultCategories) {
            if (!categoryRepository.existsByName(name)) {
                Category category = new Category();
                category.setName(name);
                categoryRepository.save(category);
            }
        }

        if (!userRepository.existsByEmail("admin@nearlio.com")) {
            User admin = new User();
            admin.setName("Nearlio Admin");
            admin.setEmail("admin@nearlio.com");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
        }
    }
}