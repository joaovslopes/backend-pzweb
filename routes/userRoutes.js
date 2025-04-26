// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { createUser, loginUser, getUsers } = require('../controllers/userController');
const { protectRoute } = require('../middlewares/authMiddleware');

router.get('/', protectRoute, getUsers);

// Rota para cadastro de usuário
router.post('/register', createUser);

// Rota para login de usuário
router.post('/login', loginUser);


module.exports = router;
