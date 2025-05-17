// controllers/buyController.js
const User = require('../models/userModel');
const Product = require('../models/productModel');
const License = require('../models/licenseModel');
const { v4: uuidv4 } = require('uuid');

// Compra de produto: associa um produto ao usuário
// controllers/buyController.js
exports.buyProduct = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: 'Os campos userId e productId são obrigatórios.'
      });
    }

    // 1) Busca usuário e produto
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado' });
    }

    // 2) Se já tiver comprado, retorna erro
    if (user.licenseScript.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Você já possui este produto e não pode comprá-lo novamente.'
      });
    }

    // 3) Caso contrário, adiciona normalmente
    user.licenseScript.push(productId);
    await user.save();

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// Compra de license: cria uma nova license e a associa ao usuário
exports.buyLicense = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { domain, themeUrl, updateUrl } = req.body;

    if (!domain || !themeUrl || !updateUrl) {
      return res.status(400).json({
        success: false,
        message: 'Os campos domain, themeUrl e updateUrl são obrigatórios.'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    const token = uuidv4();
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1);

    const newLicense = new License({ token, user: userId, domain, themeUrl, updateUrl, expirationDate });
    // remova se não existir no schema:
    // newLicense.checkExpiration();
    await newLicense.save();

    user.licenses = user.licenses || [];
    user.licenses.push(newLicense._id);

    await user.save();

    return res.status(201).json({ success: true, data: newLicense });
  } catch (error) {
    // após
    return res.status(400).json({
      success: false,
      // devolve toda a mensagem de erro do Mongo
      message: error.message
    })

  }
};

