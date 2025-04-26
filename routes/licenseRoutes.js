// routes/licenseRoutes.js
const express = require('express');
const router = express.Router();
const {
    createLauncherLicense,
    getLauncherLicenseInfo,
    verifyLauncherLicense,
    updateLauncherLicense,
    deleteLicense
} = require('../controllers/licenseController');
const { checkLicenseMiddleware } = require('../middlewares/checkLicenseMiddleware');

// Rota para criar a license do launcher
router.post('/create', createLauncherLicense);

// Rota para retornar informações da license do launcher
router.get('/license-info/:token', checkLicenseMiddleware, getLauncherLicenseInfo);

// Rota para verificar a license (opcional)
router.get('/check/:token', checkLicenseMiddleware, verifyLauncherLicense);

// Rota para atualizar a license (altera themeUrl ou updateUrl)
router.put('/update/:token', updateLauncherLicense);

// Rota para deletar uma license (aqui usamos o ID da license)
router.delete('/delete/:id', deleteLicense);

module.exports = router;
