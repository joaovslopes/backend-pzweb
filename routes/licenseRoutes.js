// routes/licenseRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  createLauncherLicense,
  getUserLicenses,
  getLauncherLicenseInfo,
  updateLauncherLicense,
  deleteLicense,
  verifyLauncherLicense,
  getDomain
} = require('../controllers/licenseController');


router.post('/',           protect, createLauncherLicense);
router.get('/',            protect, getUserLicenses);
router.get('/:token/info', protect, getLauncherLicenseInfo);
router.put('/:token',      protect, updateLauncherLicense);
router.delete('/:id',      protect, deleteLicense);
router.get('/:token/verify', verifyLauncherLicense); // pública se quiser
router.get('/check-domain', getDomain);

module.exports = router;
