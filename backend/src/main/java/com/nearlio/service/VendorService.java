package com.nearlio.service;

import com.nearlio.dto.VendorProfileRequest;
import com.nearlio.dto.VendorServiceRequest;
import com.nearlio.model.Category;
import com.nearlio.model.Role;
import com.nearlio.model.User;
import com.nearlio.model.VendorOffering;
import com.nearlio.model.VendorProfile;
import com.nearlio.repository.CategoryRepository;
import com.nearlio.repository.UserRepository;
import com.nearlio.repository.VendorOfferingRepository;
import com.nearlio.repository.VendorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorProfileRepository vendorProfileRepository;
    private final VendorOfferingRepository vendorOfferingRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public VendorProfile createProfile(String userEmail, VendorProfileRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.getRole() != Role.VENDOR) {
            throw new IllegalArgumentException("Only vendors can create a vendor profile");
        }

        if (vendorProfileRepository.existsByUserId(user.getId())) {
            throw new IllegalArgumentException("Vendor profile already exists for this user");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid category"));

        VendorProfile profile = new VendorProfile();
        profile.setUser(user);
        profile.setCategory(category);
        profile.setBusinessName(request.getBusinessName());
        profile.setDescription(request.getDescription());
        profile.setTags(request.getTags());
        profile.setLocation(request.getLocation());
        profile.setWorkingHoursStart(request.getWorkingHoursStart());
        profile.setWorkingHoursEnd(request.getWorkingHoursEnd());
        if (request.getAcceptsCash() != null) {
            profile.setAcceptsCash(request.getAcceptsCash());
        }

        return vendorProfileRepository.save(profile);
    }

    public VendorOffering addService(String userEmail, VendorServiceRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        VendorProfile profile = vendorProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Create a vendor profile first"));

        VendorOffering offering = new VendorOffering();
        offering.setVendor(profile);
        offering.setServiceName(request.getServiceName());
        offering.setPrice(request.getPrice());
        offering.setDurationMinutes(request.getDurationMinutes());

        return vendorOfferingRepository.save(offering);
    }
}