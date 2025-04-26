// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { createUser, loginUser, getUsers, getCurrentUser, getUserCounts } = require('../controllers/userController');
const { protectRoute } = require('../middlewares/authMiddleware');
const { protect } = require('../middlewares/auth')

router.get('/', protectRoute, getUsers);

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/me', protect, getCurrentUser);
router.get("/counts", protect, getUserCounts);

module.exports = router;
