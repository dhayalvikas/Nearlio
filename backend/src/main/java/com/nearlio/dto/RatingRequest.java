package com.nearlio.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RatingRequest {

    @NotNull
    private Long bookingId;

    @NotNull
    private Integer rating;

    private String review;
}