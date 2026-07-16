package com.nearlio.service;

import com.nearlio.model.User;
import com.nearlio.model.VendorProfile;
import com.nearlio.model.VerificationType;
import com.nearlio.repository.UserRepository;
import com.nearlio.repository.VendorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final VendorProfileRepository vendorProfileRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public VendorProfile deactivateVendor(Long vendorProfileId) {
        VendorProfile vendor = vendorProfileRepository.findById(vendorProfileId)
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found"));
        vendor.setIsActive(false);
        return vendorProfileRepository.save(vendor);
    }

    public VendorProfile reactivateVendor(Long vendorProfileId) {
        VendorProfile vendor = vendorProfileRepository.findById(vendorProfileId)
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found"));
        vendor.setIsActive(true);
        return vendorProfileRepository.save(vendor);
    }

    public List<VendorProfile> getAllVendors() {
        return vendorProfileRepository.findAll();
    }

    public VendorProfile updateVerification(Long vendorProfileId, VerificationType type) {
        VendorProfile vendor = vendorProfileRepository.findById(vendorProfileId)
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found"));
        vendor.setVerificationType(type);
        return vendorProfileRepository.save(vendor);
    }
}