package com.nearlio.service;

import com.nearlio.dto.RatingRequest;
import com.nearlio.model.Booking;
import com.nearlio.model.BookingStatus;
import com.nearlio.model.Rating;
import com.nearlio.model.User;
import com.nearlio.model.VendorProfile;
import com.nearlio.repository.BookingRepository;
import com.nearlio.repository.RatingRepository;
import com.nearlio.repository.UserRepository;
import com.nearlio.repository.VendorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final BookingRepository bookingRepository;
    private final VendorProfileRepository vendorProfileRepository;
    private final UserRepository userRepository;

    @Transactional
    public Rating addRating(String userEmail, RatingRequest request) {
        User customer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (!booking.getCustomer().getId().equals(customer.getId())) {
            throw new IllegalArgumentException("You can only rate your own bookings");
        }

        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new IllegalArgumentException("Only completed bookings can be rated");
        }

        if (ratingRepository.existsByBookingId(booking.getId())) {
            throw new IllegalArgumentException("This booking has already been rated");
        }

        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        Rating rating = new Rating();
        rating.setBooking(booking);
        rating.setRating(request.getRating());
        rating.setReview(request.getReview());
        ratingRepository.save(rating);

        updateVendorAverageRating(booking, request.getRating());

        return rating;
    }

    private void updateVendorAverageRating(Booking booking, int newRatingValue) {
        VendorProfile vendor = booking.getSlot().getOffering().getVendor();

        int oldCount = vendor.getRatingCount();
        double oldAvg = vendor.getAvgRating();

        double updatedAvg = ((oldAvg * oldCount) + newRatingValue) / (oldCount + 1);

        vendor.setAvgRating(Math.round(updatedAvg * 10.0) / 10.0);
        vendor.setRatingCount(oldCount + 1);
        vendorProfileRepository.save(vendor);
    }
}