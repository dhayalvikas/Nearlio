package com.nearlio.controller;

import com.nearlio.model.Favorite;
import com.nearlio.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/{vendorId}")
    public ResponseEntity<Favorite> addFavorite(@PathVariable Long vendorId, Authentication authentication) {
        return ResponseEntity.ok(favoriteService.addFavorite(authentication.getName(), vendorId));
    }

    @DeleteMapping("/{vendorId}")
    public ResponseEntity<Void> removeFavorite(@PathVariable Long vendorId, Authentication authentication) {
        favoriteService.removeFavorite(authentication.getName(), vendorId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Favorite>> getMyFavorites(Authentication authentication) {
        return ResponseEntity.ok(favoriteService.getMyFavorites(authentication.getName()));
    }
}