package com.nearlio.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "vendor_services")
@Data
@NoArgsConstructor
public class VendorOffering {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "vendor_id", nullable = false)
    private VendorProfile vendor;

    @Column(name = "service_name", nullable = false, length = 100)
    private String serviceName; // "Haircut", "Pipe Leak Repair"

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @Column(name = "is_active")
    private Boolean isActive = true;
}