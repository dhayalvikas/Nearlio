package com.nearlio.service;

import com.nearlio.model.Favorite;
import com.nearlio.model.User;
import com.nearlio.model.VendorProfile;
import com.nearlio.repository.FavoriteRepository;
import com.nearlio.repository.UserRepository;
import com.nearlio.repository.VendorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final VendorProfileRepository vendorProfileRepository;

    public Favorite addFavorite(String userEmail, Long vendorId) {
        User customer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        VendorProfile vendor = vendorProfileRepository.findById(vendorId)
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found"));

        if (favoriteRepository.existsByCustomerIdAndVendorId(customer.getId(), vendorId)) {
            throw new IllegalArgumentException("Vendor already in favorites");
        }

        Favorite favorite = new Favorite();
        favorite.setCustomer(customer);
        favorite.setVendor(vendor);
        return favoriteRepository.save(favorite);
    }

    public void removeFavorite(String userEmail, Long vendorId) {
        User customer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Favorite favorite = favoriteRepository.findByCustomerIdAndVendorId(customer.getId(), vendorId)
                .orElseThrow(() -> new IllegalArgumentException("Favorite not found"));

        favoriteRepository.delete(favorite);
    }

    public List<Favorite> getMyFavorites(String userEmail) {
        User customer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return favoriteRepository.findByCustomerId(customer.getId());
    }
}