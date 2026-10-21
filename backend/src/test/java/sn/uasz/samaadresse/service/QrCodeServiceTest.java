package sn.uasz.samaadresse.service;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class QrCodeServiceTest {

    @Test
    void testGenererQrCodeBase64_FormatValide() {
        QrCodeService qrCodeService = new QrCodeService();
        ReflectionTestUtils.setField(qrCodeService, "publicBaseUrl", "https://samaadresse.sn/adresses/");

        String base64Qr = qrCodeService.genererQrCodeBase64("ZIG-KBG-4271");

        assertNotNull(base64Qr);
        assertTrue(base64Qr.startsWith("data:image/png;base64,"), "Le QR code doit être un data URL PNG");
        assertTrue(base64Qr.length() > 100, "Le contenu en Base64 doit être substantiel");
    }
}
