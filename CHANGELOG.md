## Resumen de los cambios 31/08/2025:

- Se añadió la dependencia qrcode a server/package.json.
- Se creó la función generateQrCode en server/controllers/authController.js.
- Se añadió la ruta /api/qr-code en server/routes/api.js.
- Se creó server/public/qr-code.html para mostrar el código QR.
- Se creó server/public/js/qr-code.js para obtener y mostrar el código QR.
- Se añadió la función serveQrCodePage en server/controllers/viewController.js.
- Se modificó server/routes/views.js para servir qr-code.html en la URL raíz (/).

## Paso importante:

Se reinstalo con 

```bash
$ npm install && npm run dev
```

 http://localhost:3000/ para ver el código QR.
