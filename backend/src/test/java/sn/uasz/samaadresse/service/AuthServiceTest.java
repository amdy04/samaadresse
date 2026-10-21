package sn.uasz.samaadresse.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.password.PasswordEncoder;
import sn.uasz.samaadresse.domain.Role;
import sn.uasz.samaadresse.domain.Utilisateur;
import sn.uasz.samaadresse.dto.AuthRequest;
import sn.uasz.samaadresse.dto.AuthResponse;
import sn.uasz.samaadresse.dto.RegisterRequest;
import sn.uasz.samaadresse.repository.UtilisateurRepository;
import sn.uasz.samaadresse.security.JwtService;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    private UtilisateurRepository utilisateurRepository;
    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        utilisateurRepository = Mockito.mock(UtilisateurRepository.class);
        passwordEncoder = Mockito.mock(PasswordEncoder.class);
        jwtService = Mockito.mock(JwtService.class);
        authService = new AuthService(utilisateurRepository, passwordEncoder, jwtService);
    }

    @Test
    void testRegister_Success() {
        RegisterRequest req = RegisterRequest.builder()
                .nomComplet("Fatou Ndiaye")
                .telephone("+221773334455")
                .email("fatou@samaadresse.sn")
                .motDePasse("Passer123!")
                .build();

        when(utilisateurRepository.existsByTelephone(req.getTelephone())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("hashed_pass");
        when(jwtService.generateToken(any())).thenReturn("fake_jwt_token");

        Utilisateur u = Utilisateur.builder()
                .id(1L)
                .nomComplet(req.getNomComplet())
                .telephone(req.getTelephone())
                .motDePasse("hashed_pass")
                .role(Role.ROLE_PROPRIETAIRE)
                .actif(true)
                .build();
        when(utilisateurRepository.findByTelephone(req.getTelephone())).thenReturn(Optional.of(u));

        AuthResponse resp = authService.register(req);

        assertNotNull(resp);
        assertEquals("fake_jwt_token", resp.getToken());
        assertEquals("Fatou Ndiaye", resp.getNomComplet());
    }

    @Test
    void testLogin_Success() {
        AuthRequest req = AuthRequest.builder()
                .telephone("+221773334455")
                .motDePasse("Passer123!")
                .build();

        Utilisateur u = Utilisateur.builder()
                .id(1L)
                .nomComplet("Fatou Ndiaye")
                .telephone(req.getTelephone())
                .motDePasse("hashed_pass")
                .role(Role.ROLE_PROPRIETAIRE)
                .actif(true)
                .build();

        when(utilisateurRepository.findByTelephone(req.getTelephone())).thenReturn(Optional.of(u));
        when(passwordEncoder.matches("Passer123!", "hashed_pass")).thenReturn(true);
        when(jwtService.generateToken(any())).thenReturn("fake_jwt_token");

        AuthResponse resp = authService.login(req);

        assertNotNull(resp);
        assertEquals("fake_jwt_token", resp.getToken());
    }

    @Test
    void testLogin_BadPassword_ThrowsException() {
        AuthRequest req = AuthRequest.builder()
                .telephone("+221773334455")
                .motDePasse("MauvaisPass")
                .build();

        Utilisateur u = Utilisateur.builder()
                .id(1L)
                .telephone(req.getTelephone())
                .motDePasse("hashed_pass")
                .role(Role.ROLE_PROPRIETAIRE)
                .build();

        when(utilisateurRepository.findByTelephone(req.getTelephone())).thenReturn(Optional.of(u));
        when(passwordEncoder.matches("MauvaisPass", "hashed_pass")).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> authService.login(req));
    }
}
