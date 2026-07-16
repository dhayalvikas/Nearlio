package com.nearlio.controller;

import com.nearlio.dto.BookingRequest;
import com.nearlio.dto.BookingStatusUpdateRequest;
import com.nearlio.model.Booking;
import com.nearlio.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @Valid @RequestBody BookingRequest request,
            Authentication authentication) {
        Booking booking = bookingService.createBooking(authentication.getName(), request);
        return ResponseEntity.ok(booking);
    }

    @PatchMapping("/{bookingId}/status")
    public ResponseEntity<Booking> updateStatus(
            @PathVariable Long bookingId,
            @Valid @RequestBody BookingStatusUpdateRequest request,
            Authentication authentication) {
        Booking booking = bookingService.updateStatus(authentication.getName(), bookingId, request);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookingsAsCustomer(Authentication authentication) {
        return ResponseEntity.ok(bookingService.getMyBookingsAsCustomer(authentication.getName()));
    }

    @GetMapping("/vendor")
    public ResponseEntity<List<Booking>> getMyBookingsAsVendor(Authentication authentication) {
        return ResponseEntity.ok(bookingService.getMyBookingsAsVendor(authentication.getName()));
    }
}