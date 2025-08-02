const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const botRoutes = require('./routes/bot');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/webhook', botRoutes);

app.get('/', (req, res) => {
  res.send('VirtualBot de Zijin está funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});