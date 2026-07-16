package com.nearlio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalTime;

@Data
public class VendorProfileRequest {

    @NotNull
    private Long categoryId;

    @NotBlank
    private String businessName;

    private String description;
    private String tags;
    private String location;
    private LocalTime workingHoursStart;
    private LocalTime workingHoursEnd;
    private Boolean acceptsCash;
}