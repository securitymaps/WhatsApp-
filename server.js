const express = require("express");
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

// Verificación del Webhook (GET)
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "mi_token_de_verificacion"; // cambia por tu token real

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WEBHOOK VERIFICADO");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Recepción de mensajes (POST)
app.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object) {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (message) {
      console.log("💬 Mensaje recibido:");
      console.log(JSON.stringify(message, null, 2));
    }

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
