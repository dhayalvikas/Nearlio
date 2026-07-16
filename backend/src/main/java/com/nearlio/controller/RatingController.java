package com.nearlio.controller;

import com.nearlio.dto.RatingRequest;
import com.nearlio.model.Rating;
import com.nearlio.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public ResponseEntity<Rating> addRating(
            @Valid @RequestBody RatingRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(ratingService.addRating(authentication.getName(), request));
    }
}