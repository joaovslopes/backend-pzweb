// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    addSubcategory  // Importa a nova função
} = require('../controllers/categoryController');

// Rota para criar uma categoria
router.post('/create', createCategory);

// Rota para obter todas as categorias
router.get('/', getCategories);

// Rota para atualizar uma categoria pelo ID
router.put('/update/:id', updateCategory);

// Rota para excluir uma categoria pelo ID
router.delete('/delete/:id', deleteCategory);

// Rota para adicionar uma subcategoria à categoria existente
// Por exemplo, envia um POST para /api/categories/{categoryId}/subcategory
router.post('/:categoryId/subcategory', addSubcategory);

module.exports = router;
