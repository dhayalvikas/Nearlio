package com.nearlio.service;

import com.nearlio.model.Category;
import com.nearlio.model.VendorProfile;
import com.nearlio.repository.CategoryRepository;
import com.nearlio.repository.VendorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final VendorProfileRepository vendorProfileRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<VendorProfile> getVendorsByCategory(Long categoryId) {
        return vendorProfileRepository.findByCategoryIdAndIsActiveTrue(categoryId);
    }
}