package com.nearlio.controller;

import com.nearlio.dto.VendorProfileRequest;
import com.nearlio.dto.VendorServiceRequest;
import com.nearlio.model.VendorOffering;
import com.nearlio.model.VendorProfile;
import com.nearlio.service.VendorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vendor")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    @PostMapping("/profile")
    public ResponseEntity<VendorProfile> createProfile(
            @Valid @RequestBody VendorProfileRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        VendorProfile profile = vendorService.createProfile(email, request);
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/services")
    public ResponseEntity<VendorOffering> addService(
            @Valid @RequestBody VendorServiceRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        VendorOffering offering = vendorService.addService(email, request);
        return ResponseEntity.ok(offering);
    }

    @GetMapping("/stats")
    public ResponseEntity<com.nearlio.dto.VendorStatsDto> getStats(Authentication authentication) {
        return ResponseEntity.ok(vendorService.getVendorStats(authentication.getName()));
    }

    @GetMapping("/{vendorId}")
    public ResponseEntity<VendorProfile> getVendorById(@PathVariable Long vendorId) {
        return ResponseEntity.ok(vendorService.getVendorById(vendorId));
    }

    @GetMapping("/{vendorId}/services")
    public ResponseEntity<java.util.List<com.nearlio.model.VendorOffering>> getVendorServices(@PathVariable Long vendorId) {
        return ResponseEntity.ok(vendorService.getServicesByVendor(vendorId));
    }
}