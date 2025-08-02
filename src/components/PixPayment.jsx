// src/components/PixPayment.jsx

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const PIX_EXPIRATION_SECONDS = 300;

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

export default function PixPayment({ onConfirm, isProcessing }) {
    const [pixCode, setPixCode] = useState('');
    const [showQRCode, setShowQRCode] = useState(false);
    const [timer, setTimer] = useState(PIX_EXPIRATION_SECONDS);
    const [pixExpired, setPixExpired] = useState(false);

    useEffect(() => {
        if (!showQRCode || timer <= 0) {
            if (timer <= 0 && showQRCode) {
                setShowQRCode(false);
                setPixExpired(true);
            }
            return;
        }

        const intervalId = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [showQRCode, timer]);

    const handleGeneratePix = () => {
        const randomCode = Math.random().toString(36).substring(2, 20) + Math.random().toString(36).substring(2, 20);
        setPixCode(randomCode);
        setTimer(PIX_EXPIRATION_SECONDS);
        setShowQRCode(true);
        setPixExpired(false);
    };

    return (
        <div className="text-center p-6 border rounded-lg bg-gray-50 animate-fade-in">
            {pixExpired && <p className="text-red-600 font-bold mb-4">Código Pix expirado. Por favor, gere um novo código.</p>}

            {showQRCode ? (
                <>
                    <p className="font-semibold mb-2">Escaneie o QR Code abaixo para pagar:</p>
                    <div className="flex justify-center my-4">
                        <QRCodeSVG value={pixCode} size={200} level="H" />
                    </div>
                    <p className="font-mono text-xs break-all my-4 p-3 bg-gray-200 rounded-md">{pixCode}</p>
                    <p className="font-bold text-lg text-red-600 mb-4">Expira em: {formatTime(timer)}</p>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isProcessing}
                        className="w-full bg-green-600 text-white font-bold py-3 rounded-lg text-lg hover:bg-green-700 transition disabled:bg-green-300"
                    >
                        {isProcessing ? 'Confirmando...' : 'Confirmar Pagamento'}
                    </button>
                </>
            ) : (
                <button
                    type="button"
                    onClick={handleGeneratePix}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg text-lg hover:bg-blue-700 transition"
                >
                    Gerar QR Code Pix
                </button>
            )}
        </div>
    );
}
