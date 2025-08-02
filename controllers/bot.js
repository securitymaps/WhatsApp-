const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

router.post('/', chatbotController.handleMessage);
router.get('/', (req, res) => {
  res.send('Webhook verificado');
});

module.exports = router;