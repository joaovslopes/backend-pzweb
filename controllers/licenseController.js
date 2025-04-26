const License = require('../models/licenseModel');
const { v4: uuidv4 } = require('uuid');

// Cria a licença do launcher (já existente)
exports.createLauncherLicense = async (req, res) => {
  try {
    const { domain, themeUrl, updateUrl } = req.body;

    if (!domain || !themeUrl || !updateUrl) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos (domain, themeUrl, updateUrl) são obrigatórios.'
      });
    }

    const token = uuidv4();

    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getMonth() + 1);

    const newLicense = new License({
      token,
      domain,
      themeUrl,
      updateUrl,
      expirationDate
    });

    newLicense.checkExpiration();
    await newLicense.save();

    res.status(201).json({
      success: true,
      data: newLicense
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Retorna as informações da license do launcher
exports.getLauncherLicenseInfo = (req, res) => {
  const { themeUrl, updateUrl, dashboard } = req.license;

  return res.json({
    success: true,
    data: { themeUrl, updateUrl, dashboard }
  });
};

// Atualiza a license do launcher (altera, por exemplo, themeUrl ou updateUrl)
exports.updateLauncherLicense = async (req, res) => {
  try {
    const { token } = req.params; // Localiza a license pelo token
    const { themeUrl, updateUrl } = req.body; // Novos dados para atualizar

    // Se desejar, adicione validações específicas para os campos

    const updatedLicense = await License.findOneAndUpdate(
      { token },
      { $set: { themeUrl, updateUrl } },
      { new: true, runValidators: true }
    );

    if (!updatedLicense) {
      return res.status(404).json({
        success: false,
        message: 'License not found'
      });
    }

    return res.status(200).json({ success: true, data: updatedLicense });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteLicense = async (req, res) => {
  try {
    const { id } = req.params; // ID da license a ser deletada

    // Exclui a license do banco de dados
    const deletedLicense = await License.findByIdAndDelete(id);
    if (!deletedLicense) {
      return res.status(404).json({ success: false, message: 'License não encontrada' });
    }

    // Remove o ID da license do array licenseLauncher de todos os usuários que a possuem
    await User.updateMany(
      { licenseLauncher: id },
      { $pull: { licenseLauncher: id } }
    );

    return res.status(200).json({ success: true, message: 'License excluída com sucesso e removida do(s) usuário(s)' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Mantém a verificação da license (já existente)
exports.verifyLauncherLicense = (req, res) => {
  res.json({
    success: true,
    message: 'License is active',
    isActive: true,
    dashboard: req.license.dashboard
  });
};