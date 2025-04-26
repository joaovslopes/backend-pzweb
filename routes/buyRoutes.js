// routes/buyRoutes.js
const express = require('express');
const router = express.Router();
const { buyProduct, buyLicense } = require('../controllers/buyController');

// Endpoint para comprar um produto
router.post('/product', buyProduct);

// Endpoint para comprar uma license (criar uma license)
router.post('/license', buyLicense);

module.exports = router;
