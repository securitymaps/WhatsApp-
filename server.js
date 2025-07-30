require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// Verificación del webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Recepción y respuesta automática
app.post("/webhook", async (req, res) => {
  const body = req.body;
  console.log("📩 Mensaje recibido:", JSON.stringify(body, null, 2));

  if (
    body.object &&
    body.entry &&
    body.entry[0].changes &&
    body.entry[0].changes[0].value.messages
  ) {
    const mensaje = body.entry[0].changes[0].value.messages[0];
    const numero = mensaje.from;
    const texto = mensaje.text?.body;

    if (texto) {
      await enviarMensaje(numero, `👋 Hola, recibimos tu mensaje: "${texto}"`);
    }
  }

  res.sendStatus(200);
});

// Enviar respuesta por API de WhatsApp
const enviarMensaje = async (numero, texto) => {
  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: numero,
        type: "text",
        text: { body: texto }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (err) {
    console.error("❌ Error al enviar mensaje:", err.response?.data || err.message);
  }
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor activo en puerto ${PORT}`));
