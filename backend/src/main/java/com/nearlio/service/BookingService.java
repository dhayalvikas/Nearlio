package com.nearlio.service;

import com.nearlio.dto.BookingRequest;
import com.nearlio.dto.BookingStatusUpdateRequest;
import com.nearlio.model.*;
import com.nearlio.repository.BookingRepository;
import com.nearlio.repository.ServiceSlotRepository;
import com.nearlio.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ServiceSlotRepository serviceSlotRepository;
    private final UserRepository userRepository;

    private static final Set<String> VALID_STATUSES = Set.of(
            "CONFIRMED", "REJECTED", "COMPLETED", "CANCELLED"
    );

    @Transactional
    public Booking createBooking(String userEmail, BookingRequest request) {
        User customer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (customer.getRole() != Role.CUSTOMER) {
            throw new IllegalArgumentException("Only customers can book slots");
        }

        ServiceSlot slot = serviceSlotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new IllegalArgumentException("Slot not found"));

        // Fast-fail check — the real guarantee is the DB unique constraint on slot_id,
        // but this avoids a wasted round-trip and gives a friendlier error message
        if (Boolean.TRUE.equals(slot.getIsBooked())) {
            throw new IllegalArgumentException("Slot no longer available");
        }

        slot.setIsBooked(true);
        serviceSlotRepository.save(slot);

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setSlot(slot);
        booking.setStatus(BookingStatus.PENDING);

        // If two requests race past the isBooked check simultaneously, the
        // unique constraint on slot_id makes this save() throw for the loser —
        // caught by GlobalExceptionHandler's generic Exception handler as a 500.
        // Good enough for V1; a dedicated DataIntegrityViolationException handler
        // returning a clean 409 Conflict is a nice V2 refinement.
        return bookingRepository.save(booking);
    }

    public Booking updateStatus(String userEmail, Long bookingId, BookingStatusUpdateRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        String newStatus = request.getStatus().toUpperCase();
        if (!VALID_STATUSES.contains(newStatus)) {
            throw new IllegalArgumentException("Invalid status");
        }

        boolean isVendor = booking.getSlot().getOffering().getVendor().getUser().getId().equals(user.getId());
        boolean isCustomer = booking.getCustomer().getId().equals(user.getId());

        if (!isVendor && !isCustomer) {
            throw new IllegalArgumentException("You are not part of this booking");
        }

        validateTransition(booking.getStatus(), BookingStatus.valueOf(newStatus), isVendor, isCustomer);

        booking.setStatus(BookingStatus.valueOf(newStatus));

        if (newStatus.equals("CANCELLED")) {
            booking.setCancelledBy(isVendor ? "VENDOR" : "CUSTOMER");
            booking.setCancellationReason(request.getCancellationReason());
        }

        // Free up the slot if the booking didn't go through
        if (newStatus.equals("REJECTED") || newStatus.equals("CANCELLED")) {
            ServiceSlot slot = booking.getSlot();
            slot.setIsBooked(false);
            serviceSlotRepository.save(slot);
        }

        return bookingRepository.save(booking);
    }

    private void validateTransition(BookingStatus current, BookingStatus next, boolean isVendor, boolean isCustomer) {
        if (current == BookingStatus.COMPLETED || current == BookingStatus.CANCELLED || current == BookingStatus.REJECTED) {
            throw new IllegalArgumentException("Booking is already finalized and cannot be changed");
        }

        switch (next) {
            case CONFIRMED, REJECTED -> {
                if (!isVendor) throw new IllegalArgumentException("Only the vendor can confirm or reject a booking");
                if (current != BookingStatus.PENDING) throw new IllegalArgumentException("Only a pending booking can be confirmed or rejected");
            }
            case COMPLETED -> {
                if (!isVendor) throw new IllegalArgumentException("Only the vendor can mark a booking complete");
                if (current != BookingStatus.CONFIRMED) throw new IllegalArgumentException("Only a confirmed booking can be completed");
            }
            case CANCELLED -> {
                // Both customer and vendor can cancel, from PENDING or CONFIRMED
            }
            default -> throw new IllegalArgumentException("Invalid target status");
        }
    }

    public List<Booking> getMyBookingsAsCustomer(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return bookingRepository.findByCustomerId(user.getId());
    }

    public List<Booking> getMyBookingsAsVendor(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return bookingRepository.findBySlot_Offering_Vendor_UserId(user.getId());
    }
}