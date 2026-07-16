package com.nearlio.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingRequest {

    @NotNull
    private Long slotId;
    // In BookingRequest.java
    private Boolean isEmergency = false;
}