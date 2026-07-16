package com.nearlio.repository;

import com.nearlio.model.Booking;
import com.nearlio.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerId(Long customerId);
    List<Booking> findBySlot_Offering_Vendor_UserId(Long vendorUserId);

    long countBySlot_Offering_Vendor_IdAndStatus(Long vendorProfileId, BookingStatus status);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.slot.offering.vendor.id = :vendorId")
    long countTotalByVendorId(@Param("vendorId") Long vendorId);
}