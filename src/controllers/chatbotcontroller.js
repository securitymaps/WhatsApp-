exports.handleMessage = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Mensaje no proporcionado' });
  }

  return res.json({ respuesta: `Recibido: ${message}` });
};