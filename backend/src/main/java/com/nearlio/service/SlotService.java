package com.nearlio.service;

import com.nearlio.dto.SlotRequest;
import com.nearlio.model.ServiceSlot;
import com.nearlio.model.User;
import com.nearlio.model.VendorOffering;
import com.nearlio.repository.BookingRepository;
import com.nearlio.repository.ServiceSlotRepository;
import com.nearlio.repository.UserRepository;
import com.nearlio.repository.VendorOfferingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SlotService {

    private final ServiceSlotRepository serviceSlotRepository;
    private final VendorOfferingRepository vendorOfferingRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public ServiceSlot createSlot(String userEmail, SlotRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        VendorOffering offering = vendorOfferingRepository.findById(request.getOfferingId())
                .orElseThrow(() -> new IllegalArgumentException("Service not found"));

        // Ownership check — a vendor can only create slots for their own services
        if (!offering.getVendor().getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You do not own this service");
        }

        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        ServiceSlot slot = new ServiceSlot();
        slot.setOffering(offering);
        slot.setSlotDate(request.getSlotDate());
        slot.setStartTime(request.getStartTime());
        slot.setEndTime(request.getEndTime());

        return serviceSlotRepository.save(slot);
    }

    public List<ServiceSlot> getOpenSlots(Long offeringId) {
        return serviceSlotRepository.findByOfferingIdAndIsBookedFalse(offeringId);
    }

    public void deleteSlot(String userEmail, Long slotId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        ServiceSlot slot = serviceSlotRepository.findById(slotId)
                .orElseThrow(() -> new IllegalArgumentException("Slot not found"));

        if (!slot.getOffering().getVendor().getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You do not own this slot");
        }

        if (bookingRepository.existsBySlotId(slotId)) {
            throw new IllegalArgumentException("Cannot delete a slot that has booking history");
        }

        serviceSlotRepository.delete(slot);
    }

    public List<ServiceSlot> getMySlots(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return serviceSlotRepository.findByOffering_Vendor_UserId(user.getId());
    }
}