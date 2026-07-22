package com.nearlio.repository;

import com.nearlio.model.VendorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface VendorProfileRepository extends JpaRepository<VendorProfile, Long> {
    Optional<VendorProfile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
    List<VendorProfile> findByCategoryIdAndIsActiveTrue(Long categoryId);
    @Query(value = """
    SELECT v.*, 
        (6371 * acos(
            cos(radians(:lat)) * cos(radians(v.latitude)) *
            cos(radians(v.longitude) - radians(:lng)) +
            sin(radians(:lat)) * sin(radians(v.latitude))
        )) AS distance_km
    FROM vendor_profiles v
    WHERE v.category_id = :categoryId
        AND v.is_active = true
        AND v.latitude IS NOT NULL
        AND v.longitude IS NOT NULL
    HAVING distance_km <= :radiusKm
    ORDER BY distance_km ASC
    """, nativeQuery = true)
    List<VendorProfile> findNearbyByCategory(
            @Param("lat") Double lat,
            @Param("lng") Double lng,
            @Param("categoryId") Long categoryId,
            @Param("radiusKm") Double radiusKm
    );
}