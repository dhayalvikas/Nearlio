package com.nearlio.service;

import com.nearlio.dto.VendorProfileRequest;
import com.nearlio.dto.VendorServiceRequest;
import com.nearlio.dto.VendorStatsDto;
import com.nearlio.model.Category;
import com.nearlio.model.Role;
import com.nearlio.model.User;
import com.nearlio.model.VendorOffering;
import com.nearlio.model.VendorProfile;
import com.nearlio.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorProfileRepository vendorProfileRepository;
    private final VendorOfferingRepository vendorOfferingRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final BookingRepository bookingRepository;

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

    public VendorStatsDto getVendorStats(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        VendorProfile profile = vendorProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Vendor profile not found"));

        long total = bookingRepository.countTotalByVendorId(profile.getId());
        long completed = bookingRepository.countBySlot_Offering_Vendor_IdAndStatus(profile.getId(), com.nearlio.model.BookingStatus.COMPLETED);
        long cancelled = bookingRepository.countBySlot_Offering_Vendor_IdAndStatus(profile.getId(), com.nearlio.model.BookingStatus.CANCELLED);
        long rejected = bookingRepository.countBySlot_Offering_Vendor_IdAndStatus(profile.getId(), com.nearlio.model.BookingStatus.REJECTED);

        double completionRate = total == 0 ? 0.0 : Math.round((completed * 1000.0 / total)) / 10.0;
        double cancellationRate = total == 0 ? 0.0 : Math.round((cancelled * 1000.0 / total)) / 10.0;

        return new VendorStatsDto(total, completed, cancelled, rejected, completionRate, cancellationRate);
    }

    public VendorProfile getVendorById(Long vendorId) {
        return vendorProfileRepository.findById(vendorId)
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found"));
    }

    public java.util.List<VendorOffering> getServicesByVendor(Long vendorId) {
        return vendorOfferingRepository.findByVendorId(vendorId);
    }
}