package sn.uasz.samaadresse.service;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sn.uasz.samaadresse.domain.Role;
import sn.uasz.samaadresse.domain.Utilisateur;
import sn.uasz.samaadresse.dto.AuthRequest;
import sn.uasz.samaadresse.dto.AuthResponse;
import sn.uasz.samaadresse.dto.RegisterRequest;
import sn.uasz.samaadresse.repository.UtilisateurRepository;
import sn.uasz.samaadresse.security.JwtService;

import java.util.Collections;

@Service
public class AuthService implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UtilisateurRepository utilisateurRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public UserDetails loadUserByUsername(String telephone) throws UsernameNotFoundException {
        Utilisateur utilisateur = utilisateurRepository.findByTelephone(telephone)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec le numéro : " + telephone));

        return new User(
                utilisateur.getTelephone(),
                utilisateur.getMotDePasse(),
                utilisateur.getActif(),
                true, true, true,
                Collections.singletonList(new SimpleGrantedAuthority(utilisateur.getRole().name()))
        );
    }

    public AuthResponse register(RegisterRequest request) {
        if (utilisateurRepository.existsByTelephone(request.getTelephone())) {
            throw new IllegalArgumentException("Ce numéro de téléphone est déjà associé à un compte.");
        }

        Utilisateur utilisateur = Utilisateur.builder()
                .nomComplet(request.getNomComplet())
                .telephone(request.getTelephone())
                .email(request.getEmail())
                .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                .role(Role.ROLE_PROPRIETAIRE)
                .actif(true)
                .build();

        utilisateurRepository.save(utilisateur);

        UserDetails userDetails = loadUserByUsername(utilisateur.getTelephone());
        String token = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .nomComplet(utilisateur.getNomComplet())
                .telephone(utilisateur.getTelephone())
                .role(utilisateur.getRole().name())
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findByTelephone(request.getTelephone())
                .orElseThrow(() -> new IllegalArgumentException("Identifiants incorrects (téléphone ou mot de passe)."));

        if (!passwordEncoder.matches(request.getMotDePasse(), utilisateur.getMotDePasse())) {
            throw new IllegalArgumentException("Identifiants incorrects (téléphone ou mot de passe).");
        }

        UserDetails userDetails = loadUserByUsername(utilisateur.getTelephone());
        String token = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .nomComplet(utilisateur.getNomComplet())
                .telephone(utilisateur.getTelephone())
                .role(utilisateur.getRole().name())
                .build();
    }

    public Utilisateur getUtilisateurConnecte(String telephone) {
        return utilisateurRepository.findByTelephone(telephone)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable : " + telephone));
    }
}
