package com.nearlio.repository;

import com.nearlio.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByCustomerId(Long customerId);
    Optional<Favorite> findByCustomerIdAndVendorId(Long customerId, Long vendorId);
    boolean existsByCustomerIdAndVendorId(Long customerId, Long vendorId);
}