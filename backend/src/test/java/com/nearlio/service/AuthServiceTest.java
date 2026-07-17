package com.nearlio.service;

import com.nearlio.dto.LoginRequest;
import com.nearlio.dto.RegisterRequest;
import com.nearlio.model.Role;
import com.nearlio.model.User;
import com.nearlio.repository.UserRepository;
import com.nearlio.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;

    @InjectMocks private AuthService authService;

    @Test
    void register_succeedsForNewCustomer() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Test User");
        request.setEmail("new@test.com");
        request.setPassword("password123");
        request.setRole("CUSTOMER");

        when(userRepository.existsByEmail("new@test.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashed");
        when(jwtUtil.generateToken(anyString(), anyString())).thenReturn("fake-jwt");

        var response = authService.register(request);

        assertThat(response.getToken()).isEqualTo("fake-jwt");
        assertThat(response.getRole()).isEqualTo("CUSTOMER");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_throwsWhenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@test.com");
        request.setRole("CUSTOMER");

        when(userRepository.existsByEmail("existing@test.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Email already registered");
    }

    @Test
    void register_throwsWhenSelfRegisteringAsAdmin() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("wannabe-admin@test.com");
        request.setRole("ADMIN");

        when(userRepository.existsByEmail("wannabe-admin@test.com")).thenReturn(false);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Cannot self-register as ADMIN");
    }

    @Test
    void login_succeedsWithCorrectCredentials() {
        User user = new User();
        user.setEmail("user@test.com");
        user.setPasswordHash("hashed");
        user.setName("Test User");
        user.setRole(Role.CUSTOMER);

        LoginRequest request = new LoginRequest();
        request.setEmail("user@test.com");
        request.setPassword("password123");

        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "hashed")).thenReturn(true);
        when(jwtUtil.generateToken(anyString(), anyString())).thenReturn("fake-jwt");

        var response = authService.login(request);

        assertThat(response.getToken()).isEqualTo("fake-jwt");
    }

    @Test
    void login_throwsWithWrongPassword() {
        User user = new User();
        user.setEmail("user@test.com");
        user.setPasswordHash("hashed");

        LoginRequest request = new LoginRequest();
        request.setEmail("user@test.com");
        request.setPassword("wrongpassword");

        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpassword", "hashed")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Invalid email or password");
    }
}