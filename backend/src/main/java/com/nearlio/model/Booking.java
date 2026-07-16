package com.nearlio.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @OneToOne
    @JoinColumn(name = "slot_id", nullable = false, unique = true)
    private ServiceSlot slot;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "cancelled_by", length = 20)
    private String cancelledBy; // CUSTOMER, VENDOR, ADMIN

    @Column(name = "cancellation_reason", length = 255)
    private String cancellationReason;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "is_emergency")
    private Boolean isEmergency = false;

    @Column(name = "labor_cost", precision = 10, scale = 2)
    private java.math.BigDecimal laborCost;

    @Column(name = "material_cost", precision = 10, scale = 2)
    private java.math.BigDecimal materialCost;

    @Column(name = "travel_cost", precision = 10, scale = 2)
    private java.math.BigDecimal travelCost;

    @Column(name = "before_image_url", length = 500)
    private String beforeImageUrl;

    @Column(name = "after_image_url", length = 500)
    private String afterImageUrl;

    @Column(name = "warranty_expires_at")
    private java.time.LocalDate warrantyExpiresAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}