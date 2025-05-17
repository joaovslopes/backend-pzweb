// routes/buyRoutes.js
const express = require('express')
const { protectRoute } = require('../middlewares/authMiddleware')
const { buyProduct, buyLicense } = require('../controllers/buyController')

const router = express.Router()

// **Aqui** você precisa do protectRoute para popular req.user
router.post('/product', protectRoute, buyProduct)
router.post('/license', protectRoute, buyLicense)

module.exports = router
