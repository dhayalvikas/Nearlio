package com.nearlio.repository;

import com.nearlio.model.VendorProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VendorProfileRepository extends JpaRepository<VendorProfile, Long> {
    Optional<VendorProfile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
    List<VendorProfile> findByCategoryIdAndIsActiveTrue(Long categoryId);
}