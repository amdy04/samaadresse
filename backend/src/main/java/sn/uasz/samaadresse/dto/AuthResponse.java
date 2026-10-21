package sn.uasz.samaadresse.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String nomComplet;
    private String telephone;
    private String role;
}
