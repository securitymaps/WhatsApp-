// server.js
const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
const PORT = process.env.PORT || 10000;

// Cliente WhatsApp con almacenamiento local de sesión
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    console.log('Escanea este código QR con WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('¡WhatsApp conectado y listo!');
});

client.on('message', message => {
    console.log('Mensaje recibido:', message.body);

    // Ejemplo de respuesta automática
    if (message.body.toLowerCase() === 'hola') {
        message.reply('¡Hola! Soy tu bot de WhatsApp.');
    }
});

client.initialize();

// Endpoint web simple
app.get('/', (req, res) => {
    res.send('Servidor WhatsApp Web.js activo.');
});

app.listen(PORT, () => {
    console.log(`Servidor web escuchando en http://localhost:${PORT}`);
});
