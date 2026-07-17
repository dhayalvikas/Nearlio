package com.nearlio.service;

import com.nearlio.dto.RatingRequest;
import com.nearlio.model.*;
import com.nearlio.repository.BookingRepository;
import com.nearlio.repository.RatingRepository;
import com.nearlio.repository.UserRepository;
import com.nearlio.repository.VendorProfileRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {

    @Mock private RatingRepository ratingRepository;
    @Mock private BookingRepository bookingRepository;
    @Mock private VendorProfileRepository vendorProfileRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks private RatingService ratingService;

    private User customer;
    private VendorProfile vendorProfile;
    private Booking booking;

    private void setUp(double existingAvg, int existingCount) {
        customer = new User();
        customer.setId(1L);

        vendorProfile = new VendorProfile();
        vendorProfile.setAvgRating(existingAvg);
        vendorProfile.setRatingCount(existingCount);

        VendorOffering offering = new VendorOffering();
        offering.setVendor(vendorProfile);

        ServiceSlot slot = new ServiceSlot();
        slot.setOffering(offering);

        booking = new Booking();
        booking.setId(100L);
        booking.setCustomer(customer);
        booking.setSlot(slot);
        booking.setStatus(BookingStatus.COMPLETED);
    }

    @Test
    void addRating_firstRatingSetsAverageDirectly() {
        setUp(0.0, 0);
        RatingRequest request = new RatingRequest();
        request.setBookingId(100L);
        request.setRating(5);

        when(userRepository.findByEmail("customer@test.com")).thenReturn(Optional.of(customer));
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));
        when(ratingRepository.existsByBookingId(100L)).thenReturn(false);
        when(ratingRepository.save(any(Rating.class))).thenAnswer(inv -> inv.getArgument(0));

        ratingService.addRating("customer@test.com", request);

        assertThat(vendorProfile.getAvgRating()).isEqualTo(5.0);
        assertThat(vendorProfile.getRatingCount()).isEqualTo(1);
    }

    @Test
    void addRating_incrementalAverageCalculatesCorrectly() {
        // Vendor already has avg 4.0 from 3 ratings; a new 5-star rating should
        // produce (4.0*3 + 5) / 4 = 4.25
        setUp(4.0, 3);
        RatingRequest request = new RatingRequest();
        request.setBookingId(100L);
        request.setRating(5);

        when(userRepository.findByEmail("customer@test.com")).thenReturn(Optional.of(customer));
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));
        when(ratingRepository.existsByBookingId(100L)).thenReturn(false);
        when(ratingRepository.save(any(Rating.class))).thenAnswer(inv -> inv.getArgument(0));

        ratingService.addRating("customer@test.com", request);

        assertThat(vendorProfile.getAvgRating()).isEqualTo(4.3); // rounded to 1 decimal
        assertThat(vendorProfile.getRatingCount()).isEqualTo(4);
    }

    @Test
    void addRating_throwsWhenBookingNotCompleted() {
        setUp(0.0, 0);
        booking.setStatus(BookingStatus.CONFIRMED);
        RatingRequest request = new RatingRequest();
        request.setBookingId(100L);
        request.setRating(5);

        when(userRepository.findByEmail("customer@test.com")).thenReturn(Optional.of(customer));
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));

        assertThatThrownBy(() -> ratingService.addRating("customer@test.com", request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Only completed bookings can be rated");
    }

    @Test
    void addRating_throwsWhenAlreadyRated() {
        setUp(5.0, 1);
        RatingRequest request = new RatingRequest();
        request.setBookingId(100L);
        request.setRating(4);

        when(userRepository.findByEmail("customer@test.com")).thenReturn(Optional.of(customer));
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));
        when(ratingRepository.existsByBookingId(100L)).thenReturn(true);

        assertThatThrownBy(() -> ratingService.addRating("customer@test.com", request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("This booking has already been rated");
    }
}