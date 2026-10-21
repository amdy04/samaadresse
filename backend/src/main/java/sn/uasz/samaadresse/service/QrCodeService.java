package sn.uasz.samaadresse.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Base64;

@Service
public class QrCodeService {

    @Value("${samaadresse.app.public-base-url:https://samaadresse.sn/adresses/}")
    private String publicBaseUrl;

    /**
     * Génère un QR Code PNG encodé en Base64 pointant vers la fiche publique de l'adresse.
     * @param codeSamaAdresse Code court ex: "ZIG-KBG-4271"
     * @return Data URL image/png base64 prête à être affichée dans un <img src="...">
     */
    public String genererQrCodeBase64(String codeSamaAdresse) {
        String urlCible = publicBaseUrl + codeSamaAdresse;
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(urlCible, BarcodeFormat.QR_CODE, 300, 300);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            byte[] pngData = outputStream.toByteArray();

            return "data:image/png;base64," + Base64.getEncoder().encodeToString(pngData);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du QR Code pour " + codeSamaAdresse, e);
        }
    }
}
