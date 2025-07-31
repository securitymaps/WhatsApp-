const express = require("express");
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware para JSON
app.use(express.json());

// Verificación del webhook (GET)
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "mi_token_de_verificacion";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WEBHOOK VERIFICADO CON ÉXITO");
    res.status(200).send(challenge);
  } else {
    console.warn("❌ VERIFICACIÓN FALLIDA");
    res.sendStatus(403);
  }
});

// Recepción de mensajes (POST)
app.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object) {
    try {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];

      if (message) {
        const from = message.from;
        const text = message.text?.body || "Sin texto";
        console.log("✅ MENSAJE RECIBIDO:");
        console.log(`📥 De: ${from}`);
        console.log(`📝 Contenido: ${text}`);
        console.log("👨‍💼 Zijin Continental Gold - Proveedor de Tecnología");
      } else {
        console.log("⚠️ No se encontró mensaje en la estructura.");
      }

      res.sendStatus(200);
    } catch (err) {
      console.error("❌ Error al procesar el mensaje:", err);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en http://localhost:${PORT}`);
});