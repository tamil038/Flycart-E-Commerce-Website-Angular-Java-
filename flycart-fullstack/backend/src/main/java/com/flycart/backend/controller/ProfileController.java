package com.flycart.backend.controller;

import com.flycart.backend.dto.ProfileDtos;
import com.flycart.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ProfileDtos.ProfileResponse getProfile() {
        return userService.toProfileResponse(userService.getCurrentUser());
    }

    @PutMapping
    public ProfileDtos.ProfileResponse updateProfile(@Valid @RequestBody ProfileDtos.ProfileUpdateRequest request) {
        return userService.updateProfile(request);
    }
}
