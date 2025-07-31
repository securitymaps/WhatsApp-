const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static("public")); // Carpeta para servir el HTML

// Webhook GET
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "mi_token_de_verificacion";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("WEBHOOK_VERIFICADO");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Webhook POST
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
      io.emit("nuevo_mensaje", message);
    }

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Servidor
http.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});