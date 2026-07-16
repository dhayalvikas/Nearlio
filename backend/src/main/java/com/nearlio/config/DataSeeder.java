package com.nearlio.config;

import com.nearlio.model.Category;
import com.nearlio.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

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
    }
}