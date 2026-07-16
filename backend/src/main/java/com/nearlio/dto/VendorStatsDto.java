package com.nearlio.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VendorStatsDto {
    private long totalBookings;
    private long completedBookings;
    private long cancelledBookings;
    private long rejectedBookings;
    private double completionRate;   // completed / total, as percentage
    private double cancellationRate; // cancelled / total, as percentage
}