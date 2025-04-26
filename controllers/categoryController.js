// controllers/categoryController.js
const Category = require('../models/categoryModel');

// Cria uma nova categoria
exports.createCategory = async (req, res) => {
  try {
    const { name, description, subcategories } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'O campo "name" é obrigatório.'
      });
    }
    const newCategory = await Category.create({ name, description, subcategories });
    return res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Retorna todas as categorias
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({ success: true, data: categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Atualiza uma categoria
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params; // Obtém o ID da categoria pela URL
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: 'Categoria não encontrada' });
    }
    return res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Exclui uma categoria
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params; // Obtém o ID da categoria pela URL
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ success: false, message: 'Categoria não encontrada' });
    }
    return res.status(200).json({ success: true, message: 'Categoria excluída com sucesso' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Adiciona uma subcategoria a uma categoria existente
exports.addSubcategory = async (req, res) => {
  try {
    const { categoryId } = req.params; // ID da categoria existente
    const { subcategory } = req.body; // Nome da subcategoria a ser adicionada

    if (!subcategory) {
      return res.status(400).json({
        success: false,
        message: 'O nome da subcategoria é obrigatório.'
      });
    }

    // Localiza a categoria pelo ID
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Categoria não encontrada' });
    }

    // Se a subcategoria ainda não estiver presente, adiciona ao array
    if (!category.subcategories.includes(subcategory)) {
      category.subcategories.push(subcategory);
      await category.save();
    } else {
      return res.status(400).json({ success: false, message: 'Subcategoria já existe nessa categoria.' });
    }

    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
