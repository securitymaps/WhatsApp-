const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

// Verificación del Webhook
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verificado correctamente ✅');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Responder a los mensajes
app.post('/webhook', async (req, res) => {
  const entry = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  const phone_number_id = req.body.entry?.[0]?.changes?.[0]?.value?.metadata?.phone_number_id;
  
  if (entry && phone_number_id) {
    const from = entry.from;
    const msg_body = entry.text?.body?.toLowerCase() || '';

    let respuesta = "¡Hola! Soy Zijinbot 🤖, asistente oficial de Zijin Continental Gold Colombia. ¿Cómo puedo ayudarte hoy?";
    
    if (msg_body.includes("hola") || msg_body.includes("buenos días")) {
      respuesta = `¡Bienvenido al chat oficial de Zijin Continental Gold Colombia! 🌎\n\n📍 Ubicación: Buriticá, Antioquia 🇨🇴\n🏢 Actividad: Minería de oro responsable\n🤝 ¿En qué podemos ayudarte hoy?`;
    } else if (msg_body.includes("trabajo") || msg_body.includes("hoja de vida")) {
      respuesta = `💼 Puedes enviar tu hoja de vida respondiendo con:\n\n📄 Nombre completo\n🪪 Documento\n📞 Número de contacto\n📍 Dirección\n📚 Nivel educativo\n💼 Experiencia\n\nTu solicitud será enviada a un agente humano.`;
    } else if (msg_body.includes("ubicación")) {
      respuesta = `📍 Zijin Continental Gold está ubicada en Buriticá, Antioquia (Colombia). Somos líderes en minería sostenible y responsable del oro.`;
    }

    await axios.post(`https://graph.facebook.com/v19.0/${phone_number_id}/messages`, {
      messaging_product: "whatsapp",
      to: from,
      text: { body: respuesta }
    }, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});