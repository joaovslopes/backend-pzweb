const Product = require('../models/productModel');

 // Cria um novo produto
exports.createProduct = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      name,
      downloadUrl,
      videoUrl,
      description,
      price,
      tag,
      isLauncher,
      image
    } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Campo category é obrigatório.'
      });
    }

    const newProduct = await Product.create({
      category,
      subcategory,
      name,
      downloadUrl,
      videoUrl,
      description,
      price,
      tag,
      isLauncher,
      image
    });

    return res.status(201).json({
      success: true,
      data: newProduct
    });
  } catch (error) {
    console.error("Erro ao criar produto:", {
      message: error.message,
      stack: error.stack,
      input: req.body
    })

    return res.status(500).json({
      success: false,
      message: error.message,
      debug: {
        stack: error.stack,
        input: req.body
      }
    });
  }
}


// Retorna todos os produtos
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category subcategory');
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Atualiza um produto
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado' });
    }
    return res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Exclui um produto
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado' });
    }
    return res.status(200).json({ success: true, message: 'Produto excluído com sucesso' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
