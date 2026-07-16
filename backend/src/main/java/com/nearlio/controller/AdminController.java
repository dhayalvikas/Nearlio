package com.nearlio.controller;

import com.nearlio.model.User;
import com.nearlio.model.VendorProfile;
import com.nearlio.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/vendors")
    public ResponseEntity<List<VendorProfile>> getAllVendors() {
        return ResponseEntity.ok(adminService.getAllVendors());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/vendors/{vendorProfileId}/deactivate")
    public ResponseEntity<VendorProfile> deactivateVendor(@PathVariable Long vendorProfileId) {
        return ResponseEntity.ok(adminService.deactivateVendor(vendorProfileId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/vendors/{vendorProfileId}/reactivate")
    public ResponseEntity<VendorProfile> reactivateVendor(@PathVariable Long vendorProfileId) {
        return ResponseEntity.ok(adminService.reactivateVendor(vendorProfileId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/vendors/{vendorProfileId}/verification")
    public ResponseEntity<VendorProfile> updateVerification(
            @PathVariable Long vendorProfileId,
            @RequestParam com.nearlio.model.VerificationType type) {
        return ResponseEntity.ok(adminService.updateVerification(vendorProfileId, type));
    }
}