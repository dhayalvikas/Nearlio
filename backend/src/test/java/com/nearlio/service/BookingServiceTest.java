package com.nearlio.service;

import com.nearlio.dto.BookingRequest;
import com.nearlio.dto.BookingStatusUpdateRequest;
import com.nearlio.model.*;
import com.nearlio.repository.BookingRepository;
import com.nearlio.repository.ServiceSlotRepository;
import com.nearlio.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock private BookingRepository bookingRepository;
    @Mock private ServiceSlotRepository serviceSlotRepository;
    @Mock private UserRepository userRepository;
    @Mock private SseEmitterService sseEmitterService;

    @InjectMocks private BookingService bookingService;

    private User customer;
    private User vendorUser;
    private ServiceSlot slot;
    private Booking booking;

    private void setUpBookingChain() {
        customer = new User();
        customer.setId(1L);
        customer.setEmail("customer@test.com");
        customer.setRole(Role.CUSTOMER);

        vendorUser = new User();
        vendorUser.setId(2L);
        vendorUser.setEmail("vendor@test.com");

        VendorProfile vendorProfile = new VendorProfile();
        vendorProfile.setUser(vendorUser);

        VendorOffering offering = new VendorOffering();
        offering.setVendor(vendorProfile);

        slot = new ServiceSlot();
        slot.setId(10L);
        slot.setOffering(offering);
        slot.setIsBooked(false);

        booking = new Booking();
        booking.setId(100L);
        booking.setCustomer(customer);
        booking.setSlot(slot);
        booking.setStatus(BookingStatus.PENDING);
    }

    @Test
    void createBooking_succeedsForOpenSlot() {
        setUpBookingChain();
        BookingRequest request = new BookingRequest();
        request.setSlotId(10L);

        when(userRepository.findByEmail("customer@test.com")).thenReturn(Optional.of(customer));
        when(serviceSlotRepository.findById(10L)).thenReturn(Optional.of(slot));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> inv.getArgument(0));

        Booking result = bookingService.createBooking("customer@test.com", request);

        assertThat(result.getStatus()).isEqualTo(BookingStatus.PENDING);
        assertThat(slot.getIsBooked()).isTrue();
    }

    @Test
    void createBooking_throwsWhenSlotAlreadyBooked() {
        setUpBookingChain();
        slot.setIsBooked(true);
        BookingRequest request = new BookingRequest();
        request.setSlotId(10L);

        when(userRepository.findByEmail("customer@test.com")).thenReturn(Optional.of(customer));
        when(serviceSlotRepository.findById(10L)).thenReturn(Optional.of(slot));

        assertThatThrownBy(() -> bookingService.createBooking("customer@test.com", request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Slot no longer available");
    }

    @Test
    void updateStatus_vendorCanConfirmPendingBooking() {
        setUpBookingChain();
        BookingStatusUpdateRequest request = new BookingStatusUpdateRequest();
        request.setStatus("CONFIRMED");

        when(userRepository.findByEmail("vendor@test.com")).thenReturn(Optional.of(vendorUser));
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> inv.getArgument(0));

        Booking result = bookingService.updateStatus("vendor@test.com", 100L, request);

        assertThat(result.getStatus()).isEqualTo(BookingStatus.CONFIRMED);
        verify(sseEmitterService).sendBookingUpdate(eq("customer@test.com"), any());
    }

    @Test
    void updateStatus_throwsWhenCustomerTriesToConfirm() {
        setUpBookingChain();
        BookingStatusUpdateRequest request = new BookingStatusUpdateRequest();
        request.setStatus("CONFIRMED");

        when(userRepository.findByEmail("customer@test.com")).thenReturn(Optional.of(customer));
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));

        assertThatThrownBy(() -> bookingService.updateStatus("customer@test.com", 100L, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Only the vendor can confirm or reject a booking");
    }

    @Test
    void updateStatus_throwsOnAlreadyFinalizedBooking() {
        setUpBookingChain();
        booking.setStatus(BookingStatus.COMPLETED);
        BookingStatusUpdateRequest request = new BookingStatusUpdateRequest();
        request.setStatus("CANCELLED");

        when(userRepository.findByEmail("customer@test.com")).thenReturn(Optional.of(customer));
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));

        assertThatThrownBy(() -> bookingService.updateStatus("customer@test.com", 100L, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Booking is already finalized and cannot be changed");
    }
}