package com.nearlio.controller;

import com.nearlio.model.Category;
import com.nearlio.model.VendorProfile;
import com.nearlio.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/{categoryId}/vendors")
    public ResponseEntity<List<VendorProfile>> getVendorsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(categoryService.getVendorsByCategory(categoryId));
    }
}