document.addEventListener('DOMContentLoaded', () => {
    const qrCodeImg = document.getElementById('qr-code');
    fetch('/api/qr-code')
        .then(response => response.text())
        .then(dataUrl => {
            qrCodeImg.src = dataUrl;
        })
        .catch(error => {
            console.error('Failed to load QR code:', error);
            qrCodeImg.alt = 'Failed to load QR code.';
        });
});