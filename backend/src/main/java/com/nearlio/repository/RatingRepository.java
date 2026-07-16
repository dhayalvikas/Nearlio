package com.nearlio.repository;

import com.nearlio.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    boolean existsByBookingId(Long bookingId);
}