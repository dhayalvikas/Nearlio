package com.nearlio.repository;

import com.nearlio.model.VendorOffering;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VendorOfferingRepository extends JpaRepository<VendorOffering, Long> {
    List<VendorOffering> findByVendorId(Long vendorId);
}