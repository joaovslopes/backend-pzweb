// controllers/licenseController.js

const License = require('../models/licenseModel');
const User    = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');

exports.getDomain = async (req, res) => {
  const { domain } = req.query;
  if (!domain) return res.status(400).json({ success:false, message: 'domain é obrigatório' });
  const exists = await License.exists({ domain });
  return res.json({ success: true, exists });
};

// Cria a licença do launcher e associa ao usuário
exports.createLauncherLicense = async (req, res) => {
  try {
    const { domain, themeUrl, updateUrl } = req.body;
    const userId = req.user.userId; // injetado pelo middleware de auth

    if (!domain || !themeUrl || !updateUrl) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos (domain, themeUrl, updateUrl) são obrigatórios.'
      });
    }

    const token = uuidv4();

    // Expira em um mês
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1);

    const newLicense = new License({
      user: userId,
      token,
      domain,
      themeUrl,
      updateUrl,
      expirationDate
    });

    newLicense.checkExpiration();
    await newLicense.save();

    // Adiciona ao array licenseLauncher do usuário
    await User.findByIdAndUpdate(userId, {
      $push: { licenseLauncher: newLicense._id }
    });

    res.status(201).json({
      success: true,
      data: newLicense
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Retorna todas as licenças do usuário logado
exports.getUserLicenses = async (req, res) => {
  try {
    const userId = req.user.userId;
    const licenses = await License.find({ user: userId })
      .select('id token domain expirationDate status downloader dashboard')
      .sort({ expirationDate: 1 });

    return res.status(200).json({
      success: true,
      data: licenses
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Retorna detalhes de uma única license a partir do token
exports.getLauncherLicenseInfo = (req, res) => {
  const { themeUrl, updateUrl, dashboard } = req.license;
  return res.json({
    success: true,
    data: { themeUrl, updateUrl, dashboard }
  });
};

// Atualiza a license do launcher (por token)
exports.updateLauncherLicense = async (req, res) => {
  try {
    const { token } = req.params;
    const { themeUrl, updateUrl } = req.body;

    const updatedLicense = await License.findOneAndUpdate(
      { token, user: req.user.userId },
      { themeUrl, updateUrl },
      { new: true, runValidators: true }
    );

    if (!updatedLicense) {
      return res.status(404).json({
        success: false,
        message: 'Licença não encontrada.'
      });
    }

    return res.status(200).json({ success: true, data: updatedLicense });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Deleta licença e remove referência no usuário
exports.deleteLicense = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLicense = await License.findOneAndDelete({
      _id: id,
      user: req.user.userId
    });
    if (!deletedLicense) {
      return res.status(404).json({ success: false, message: 'Licença não encontrada.' });
    }

    // Remove do array de licenças do usuário
    await User.findByIdAndUpdate(req.user.userId, {
      $pull: { licenseLauncher: id }
    });

    return res.status(200).json({
      success: true,
      message: 'Licença excluída com sucesso.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Verifica se a license está ativa
exports.verifyLauncherLicense = (req, res) => {
  res.json({
    success: true,
    message: 'License is active',
    isActive: true,
    dashboard: req.license.dashboard
  });
};
