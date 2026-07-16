package com.nearlio.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Entity
@Table(name = "vendor_profiles")
@Data
@NoArgsConstructor
public class VendorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "business_name", length = 150)
    private String businessName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 255)
    private String tags; // free-text specialization, comma-separated

    @Column(length = 150)
    private String location; // text for V1, lat/lng comes in V2

    @Column(name = "working_hours_start")
    private LocalTime workingHoursStart;

    @Column(name = "working_hours_end")
    private LocalTime workingHoursEnd;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "is_available")
    private Boolean isAvailable = true;

    @Column(name = "accepts_cash")
    private Boolean acceptsCash = false;

    @Column(name = "avg_rating")
    private Double avgRating = 0.0;

    @Column(name = "rating_count")
    private Integer ratingCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_type", nullable = false)
    private VerificationType verificationType = VerificationType.UNVERIFIED;
}