package sn.uasz.samaadresse.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    private static final Logger log = LoggerFactory.getLogger(SmsService.class);

    /**
     * Simule l'envoi d'un SMS de partage d'adresse via SendFlash / Twilio Sandbox.
     * @param telephoneDestinataire Numéro au format international (ex: +221770000000)
     * @param codeSamaAdresse Code court
     * @param lienFichePublique URL publique de la fiche adresse
     * @return true si simulation réussie
     */
    public boolean envoyerSmsPartage(String telephoneDestinataire, String codeSamaAdresse, String lienFichePublique) {
        String message = String.format(
            "[SamaAdresse] Bonjour ! Voici mon adresse géolocalisée : %s. Retrouvez le plan et l'itinéraire ici : %s",
            codeSamaAdresse,
            lienFichePublique
        );

        log.info("========== SIMULATION SMS (SendFlash / Twilio Sandbox) ==========");
        log.info("Destinataire : {}", telephoneDestinataire);
        log.info("Contenu SMS  : {}", message);
        log.info("================================================================");
        return true;
    }
}
