package com.nearlio.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BookingStatusUpdateRequest {

    @NotBlank
    private String status; // CONFIRMED, REJECTED, COMPLETED, CANCELLED

    private String cancellationReason;
}