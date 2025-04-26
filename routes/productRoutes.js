// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { createProduct, getProducts, updateProduct, deleteProduct } = require('../controllers/productController');

// Rota para criar um produto
router.post('/', createProduct);

// Rota para listar todos os produtos
router.get('/', getProducts);

// Rota para atualizar um produto (passando o ID do produto)
router.put('/update/:id', updateProduct);

// Rota para excluir um produto (passando o ID do produto)
router.delete('/delete/:id', deleteProduct);

module.exports = router;
