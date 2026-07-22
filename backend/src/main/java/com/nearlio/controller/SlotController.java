package com.nearlio.controller;

import com.nearlio.dto.SlotRequest;
import com.nearlio.model.ServiceSlot;
import com.nearlio.service.SlotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
public class SlotController {

    private final SlotService slotService;

    @PostMapping
    public ResponseEntity<ServiceSlot> createSlot(
            @Valid @RequestBody SlotRequest request,
            Authentication authentication) {
        ServiceSlot slot = slotService.createSlot(authentication.getName(), request);
        return ResponseEntity.ok(slot);
    }

    @GetMapping("/offering/{offeringId}")
    public ResponseEntity<List<ServiceSlot>> getOpenSlots(@PathVariable Long offeringId) {
        return ResponseEntity.ok(slotService.getOpenSlots(offeringId));
    }

    @DeleteMapping("/{slotId}")
    public ResponseEntity<Void> deleteSlot(@PathVariable Long slotId, Authentication authentication) {
        slotService.deleteSlot(authentication.getName(), slotId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/mine")
    public ResponseEntity<List<ServiceSlot>> getMySlots(Authentication authentication) {
        return ResponseEntity.ok(slotService.getMySlots(authentication.getName()));
    }
}