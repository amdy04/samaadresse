package sn.uasz.samaadresse.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sn.uasz.samaadresse.domain.*;
import sn.uasz.samaadresse.dto.*;
import sn.uasz.samaadresse.repository.AdresseRepository;
import sn.uasz.samaadresse.repository.CommandePlaqueRepository;
import sn.uasz.samaadresse.repository.SignalementRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdresseService {

    private final AdresseRepository adresseRepository;
    private final GeoGridService geoGridService;
    private final QrCodeService qrCodeService;
    private final SignalementRepository signalementRepository;
    private final CommandePlaqueRepository commandePlaqueRepository;

    @Value("${samaadresse.app.public-base-url:https://samaadresse.sn/adresses/}")
    private String publicBaseUrl;

    public AdresseService(AdresseRepository adresseRepository,
                          GeoGridService geoGridService,
                          QrCodeService qrCodeService,
                          SignalementRepository signalementRepository,
                          CommandePlaqueRepository commandePlaqueRepository) {
        this.adresseRepository = adresseRepository;
        this.geoGridService = geoGridService;
        this.qrCodeService = qrCodeService;
        this.signalementRepository = signalementRepository;
        this.commandePlaqueRepository = commandePlaqueRepository;
    }

    @Transactional
    public AdresseResponseDTO creerAdresse(AdresseRequestDTO dto, Utilisateur proprietaire) {
        // 1. Détection du quartier et génération du code d'adresse unique
        Quartier quartier = geoGridService.detecterQuartierPlusProche(dto.getLatitude(), dto.getLongitude());
        String codeGenere = geoGridService.genererCodeAdresse(dto.getLatitude(), dto.getLongitude());

        // 2. Gestion des collisions (si deux portes sont dans la même cellule de 5m)
        int suffix = 1;
        String finalCode = codeGenere;
        while (adresseRepository.findByCodeSamaAdresse(finalCode).isPresent()) {
            finalCode = codeGenere + "-" + suffix;
            suffix++;
        }

        // 3. Génération du QR Code vectoriel Base64
        String qrCodeDataUrl = qrCodeService.genererQrCodeBase64(finalCode);

        // 4. Construction de l'entité
        Adresse adresse = Adresse.builder()
                .codeSamaAdresse(finalCode)
                .titre(dto.getTitre())
                .descriptionRepere(dto.getDescriptionRepere())
                .typeLieu(dto.getTypeLieu())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .precisionGpsMetres(dto.getPrecisionGpsMetres())
                .nomProprietaireAffichable(dto.getNomProprietaireAffichable())
                .photoFacadeUrl(dto.getPhotoFacadeBase64() != null ? dto.getPhotoFacadeBase64() : "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=400&q=80")
                .qrCodeUrl(qrCodeDataUrl)
                .statut(StatutAdresse.ACTIVE)
                .vuesCompteur(0L)
                .quartier(quartier)
                .utilisateur(proprietaire)
                .build();

        Adresse saved = adresseRepository.save(adresse);
        return mapToResponseDTO(saved);
    }

    @Transactional
    public ResolutionResponseDTO resoudreAdresse(String codeSamaAdresse) {
        Adresse adresse = adresseRepository.findByCodeSamaAdresse(codeSamaAdresse)
                .orElseThrow(() -> new IllegalArgumentException("Aucune adresse trouvée pour le code : " + codeSamaAdresse));

        // Incrémentation du compteur de vues
        adresse.setVuesCompteur(adresse.getVuesCompteur() + 1);
        adresseRepository.save(adresse);

        return ResolutionResponseDTO.builder()
                .codeSamaAdresse(adresse.getCodeSamaAdresse())
                .titre(adresse.getTitre())
                .descriptionRepere(adresse.getDescriptionRepere())
                .typeLieu(adresse.getTypeLieu())
                .latitude(adresse.getLatitude())
                .longitude(adresse.getLongitude())
                .nomQuartier(adresse.getQuartier() != null ? adresse.getQuartier().getNom() : "Ziguinchor")
                .codeRegion(adresse.getQuartier() != null ? adresse.getQuartier().getCodeRegion() : "ZIG")
                .photoFacadeUrl(adresse.getPhotoFacadeUrl())
                .qrCodeUrl(adresse.getQrCodeUrl())
                .nomProprietaireAffichable(adresse.getNomProprietaireAffichable())
                .urlPartage(publicBaseUrl + adresse.getCodeSamaAdresse())
                .build();
    }

    public List<AdresseResponseDTO> rechercherAdresses(String query) {
        if (query == null || query.trim().isEmpty()) {
            return adresseRepository.findByStatutOrderByDateCreationDesc(StatutAdresse.ACTIVE)
                    .stream().map(this::mapToResponseDTO).collect(Collectors.toList());
        }
        return adresseRepository.searchAdresses(query.trim())
                .stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    public List<AdresseResponseDTO> filtrerAdresses(Long quartierId, TypeLieu typeLieu) {
        return adresseRepository.filterAdresses(quartierId, typeLieu)
                .stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    public List<AdresseResponseDTO> getMesAdresses(Long utilisateurId) {
        return adresseRepository.findByUtilisateurIdOrderByDateCreationDesc(utilisateurId)
                .stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    @Transactional
    public boolean signalerAdresse(SignalementRequestDTO dto) {
        Adresse adresse = adresseRepository.findByCodeSamaAdresse(dto.getCodeSamaAdresse())
                .orElseThrow(() -> new IllegalArgumentException("Adresse introuvable : " + dto.getCodeSamaAdresse()));

        Signalement signalement = Signalement.builder()
                .motif(dto.getMotif())
                .details(dto.getDetails())
                .contactSignaleur(dto.getContactSignaleur())
                .adresse(adresse)
                .traite(false)
                .build();

        signalementRepository.save(signalement);
        return true;
    }

    @Transactional
    public CommandePlaque commanderPlaque(CommandePlaqueRequestDTO dto, Utilisateur user) {
        Adresse adresse = adresseRepository.findByCodeSamaAdresse(dto.getCodeSamaAdresse())
                .orElseThrow(() -> new IllegalArgumentException("Adresse introuvable : " + dto.getCodeSamaAdresse()));

        double montant = dto.getMontant() != null ? dto.getMontant() : 5000.0;
        String waveRef = "WAVE-SANDBOX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        CommandePlaque commande = CommandePlaque.builder()
                .referenceWave(waveRef)
                .montant(montant)
                .statutPaiement("PAYE") // Simulation Wave immédiate
                .statutLivraison("EN_PREPARATION")
                .telephoneLivraison(dto.getTelephoneLivraison())
                .adresse(adresse)
                .utilisateur(user)
                .build();

        return commandePlaqueRepository.save(commande);
    }

    private AdresseResponseDTO mapToResponseDTO(Adresse a) {
        return AdresseResponseDTO.builder()
                .id(a.getId())
                .codeSamaAdresse(a.getCodeSamaAdresse())
                .titre(a.getTitre())
                .descriptionRepere(a.getDescriptionRepere())
                .typeLieu(a.getTypeLieu())
                .latitude(a.getLatitude())
                .longitude(a.getLongitude())
                .precisionGpsMetres(a.getPrecisionGpsMetres())
                .nomProprietaireAffichable(a.getNomProprietaireAffichable())
                .photoFacadeUrl(a.getPhotoFacadeUrl())
                .qrCodeUrl(a.getQrCodeUrl())
                .statut(a.getStatut())
                .vuesCompteur(a.getVuesCompteur())
                .nomQuartier(a.getQuartier() != null ? a.getQuartier().getNom() : "")
                .codeRegion(a.getQuartier() != null ? a.getQuartier().getCodeRegion() : "ZIG")
                .dateCreation(a.getDateCreation())
                .build();
    }
}
