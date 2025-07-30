const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware para recibir JSON
app.use(bodyParser.json());

// ✔️ Verificación Webhook (GET)
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFICADO");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// ✔️ Manejo de mensajes (POST)
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object === "whatsapp_business_account") {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const messages = changes?.value?.messages;

    if (messages && messages.length > 0) {
      const message = messages[0];
      const phone_number_id = changes.value.metadata.phone_number_id;
      const from = message.from;
      const msg_body = message.text?.body || "";

      console.log("Mensaje recibido:", msg_body);

      let respuestaBot = obtenerRespuesta(msg_body);

      // Enviar respuesta al usuario
      await axios.post(
        `https://graph.facebook.com/v19.0/${phone_number_id}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          text: { body: respuestaBot },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
    }

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// ✔️ Lógica personalizada del bot
function obtenerRespuesta(texto) {
  const mensaje = texto.toLowerCase();

  if (mensaje.includes("hola")) {
    return "👋 ¡Bienvenido al chat oficial de Zijin Continental Gold Colombia! Soy ZijinBot. ¿Cómo podemos ayudarte?";
  }

  if (mensaje.includes("zijin")) {
    return `🪙 Zijin Continental Gold es una empresa minera ubicada en Buriticá, Antioquia, Colombia. Forma parte del grupo chino Zijin Mining Group y se dedica a la extracción responsable de oro. ¿Deseas saber sobre empleo, ubicación o contacto?`;
  }

  if (mensaje.includes("trabajo") || mensaje.includes("hoja de vida")) {
    return `📄 Por favor envíanos tu hoja de vida, tu experiencia laboral y el cargo de interés. Un asesor se comunicará contigo.`;
  }

  if (mensaje.includes("ubicación") || mensaje.includes("dónde están")) {
    return "📍 Estamos ubicados en Buriticá, Antioquia, Colombia. Puedes ver nuestra ubicación en Google Maps buscando: Zijin Continental Gold.";
  }

  if (mensaje.includes("humano")) {
    return "🤖 Te comunicaré con un asesor humano. Por favor, espera un momento...";
  }

  return "🤖 No comprendí tu mensaje. ¿Puedes reformular o escribir 'ayuda'?";
}

// ✔️ Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});