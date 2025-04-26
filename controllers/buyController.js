// controllers/buyController.js
const User = require('../models/userModel');
const Product = require('../models/productModel');
const License = require('../models/licenseModel');
const { v4: uuidv4 } = require('uuid');

// Compra de produto: associa um produto ao usuário
exports.buyProduct = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: 'Os campos userId e productId são obrigatórios.'
      });
    }

    // Procura o usuário
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    // Procura o produto
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado' });
    }

    // Adiciona o produto ao array licenseScript, se ainda não estiver incluído
    if (!user.licenseScript.includes(productId)) {
      user.licenseScript.push(productId);
    }

    await user.save();
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Compra de license: cria uma nova license e a associa ao usuário
exports.buyLicense = async (req, res) => {
  try {
    const { userId, domain, themeUrl, updateUrl } = req.body;

    if (!userId || !domain || !themeUrl || !updateUrl) {
      return res.status(400).json({
        success: false,
        message: 'Os campos userId, domain, themeUrl e updateUrl são obrigatórios.'
      });
    }

    // Procura o usuário
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    // Cria uma nova license para o launcher
    const token = uuidv4();
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1);

    const newLicense = new License({
      token,
      domain,
      themeUrl,
      updateUrl,
      expirationDate
    });

    // Verifica e atualiza o status da license conforme a data de expiração
    newLicense.checkExpiration();
    await newLicense.save();

    // Associa a license recém-criada ao usuário (campo licenseLauncher)
     // Verifica se o array licenseLauncher está definido; caso contrário, inicializa-o
     if (!user.licenses) {
      user.licenses = [];
    }
 
    user.licenses.push(newLicense._id);
    await user.save();

    return res.status(201).json({ success: true, data: { license: newLicense, user } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
