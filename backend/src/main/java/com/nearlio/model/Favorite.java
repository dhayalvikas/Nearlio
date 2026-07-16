package com.nearlio.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "favorites", uniqueConstraints = @UniqueConstraint(columnNames = {"customer_id", "vendor_id"}))
@Data
@NoArgsConstructor
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne
    @JoinColumn(name = "vendor_id", nullable = false)
    private VendorProfile vendor;
}