// middlewares/checkLicenseMiddleware.js
const License = require('../models/licenseModel');

exports.checkLicenseMiddleware = async (req, res, next) => {
  try {
    const token = req.params.token; // ou req.query.token / req.body.token, dependendo de como for enviado

    const license = await License.findOne({ token });
    if (!license) {
      return res.status(404).json({
        success: false,
        message: 'License not found'
      });
    }

    // Verifica a expiração e atualiza
    license.checkExpiration();
    await license.save();

    if (!license.isActive) {
      return res.status(403).json({
        success: false,
        message: 'License is inactive or expired'
      });
    }

    // Armazena a licença validada no request para uso nos controllers
    req.license = license;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
