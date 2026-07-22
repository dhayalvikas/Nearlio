package com.nearlio.repository;

import com.nearlio.model.ServiceSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceSlotRepository extends JpaRepository<ServiceSlot, Long> {
    List<ServiceSlot> findByOfferingIdAndIsBookedFalse(Long offeringId);
    List<ServiceSlot> findByOffering_Vendor_UserId(Long userId);
}