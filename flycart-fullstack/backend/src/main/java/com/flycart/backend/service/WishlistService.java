package com.flycart.backend.service;

import com.flycart.backend.dto.ProductDtos;
import com.flycart.backend.model.Product;
import com.flycart.backend.model.User;
import com.flycart.backend.model.WishlistItem;
import com.flycart.backend.repository.WishlistItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class WishlistService {

    private final WishlistItemRepository wishlistItemRepository;
    private final ProductService productService;
    private final UserService userService;

    public WishlistService(WishlistItemRepository wishlistItemRepository, ProductService productService, UserService userService) {
        this.wishlistItemRepository = wishlistItemRepository;
        this.productService = productService;
        this.userService = userService;
    }

    public List<ProductDtos.ProductResponse> list() {
        User user = userService.getCurrentUser();
        return wishlistItemRepository.findByUserId(user.getId()).stream()
                .map(item -> productService.getById(item.getProduct().getId()))
                .toList();
    }

    /** Adds the product if it isn't saved yet, removes it if it is. Returns the new saved state. */
    public Map<String, Boolean> toggle(Long productId) {
        User user = userService.getCurrentUser();
        var existing = wishlistItemRepository.findByUserIdAndProductId(user.getId(), productId);

        if (existing.isPresent()) {
            wishlistItemRepository.delete(existing.get());
            return Map.of("saved", false);
        }

        Product product = productService.findEntity(productId);
        wishlistItemRepository.save(new WishlistItem(user, product));
        return Map.of("saved", true);
    }
}
