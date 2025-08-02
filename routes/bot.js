const express = require('express');
const router = express.Router();

// Ruta POST para el webhook de WhatsApp
router.post('/', (req, res) => {
  console.log('Mensaje recibido:', req.body);
  res.sendStatus(200); // Confirmamos recepción
});

// Ruta GET para la verificación del webhook
router.get('/', (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'mi_token_de_prueba';
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verificado correctamente');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;