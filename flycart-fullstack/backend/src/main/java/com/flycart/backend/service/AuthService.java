package com.flycart.backend.service;

import com.flycart.backend.dto.AuthDtos;
import com.flycart.backend.exception.ApiException;
import com.flycart.backend.model.User;
import com.flycart.backend.repository.UserRepository;
import com.flycart.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    public AuthService(UserRepository userRepository,
                        PasswordEncoder passwordEncoder,
                        JwtService jwtService,
                        AuthenticationManager authenticationManager,
                        UserService userService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }

    public AuthDtos.AuthResponse signup(AuthDtos.SignupRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw ApiException.conflict("An account with this email already exists.");
        }
        User user = new User(request.name(), request.email(), passwordEncoder.encode(request.password()));
        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());
        return new AuthDtos.AuthResponse(token, userService.toProfileResponse(user));
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );
        } catch (BadCredentialsException ex) {
            throw ApiException.unauthorized("Invalid email or password.");
        }

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> ApiException.unauthorized("Invalid email or password."));

        String token = jwtService.generateToken(user.getEmail());
        return new AuthDtos.AuthResponse(token, userService.toProfileResponse(user));
    }
}
