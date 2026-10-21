import React from 'react';
import { X, Download, Printer } from 'lucide-react';
import { Adresse } from '../types';

interface QrCodeModalProps {
  adresse: Adresse;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ adresse, onClose }) => {
  const qrImage = adresse.qrCodeUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(adresse.urlPartage || adresse.codeSamaAdresse);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrImage;
    link.download = `SamaAdresse-${adresse.codeSamaAdresse}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-extrabold text-slate-900 mt-2">QR Code de l'Adresse</h3>
        <p className="text-xs text-slate-500 mb-4">{adresse.titre} · {adresse.nomQuartier}</p>

        {/* Cadre Plaque d'adresse */}
        <div className="p-4 border-4 border-emerald-600 rounded-2xl bg-emerald-50/40 inline-block shadow-inner mb-4">
          <img
            src={qrImage}
            alt={`QR Code ${adresse.codeSamaAdresse}`}
            className="w-48 h-48 mx-auto rounded-lg shadow-sm bg-white p-2"
          />
          <div className="mt-2 text-emerald-800 font-extrabold text-base tracking-wider">
            {adresse.codeSamaAdresse}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold uppercase tracking-widest">
            Sénégal · Ziguinchor
          </div>
        </div>

        {/* Boutons Télécharger et Imprimer */}
        <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
