// controllers/userController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Função para criar um novo usuário com senha criptografada
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verifica se o usuário já existe pelo email
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "Email já cadastrado." });
    }

    // Gera um hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Cria o usuário com a senha criptografada
    const newUser = await User.create({ name, email, password: hashedPassword });
    return res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Endpoint de login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifica se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Credenciais inválidas." });
    }

    // Compara a senha enviada com a senha armazenada (criptografada)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Credenciais inválidas." });
    }

    // Cria o payload para o token (por exemplo, com o id do usuário)
    const payload = {
      userId: user._id,
      email: user.email
    };

    // Assina o token utilizando a chave secreta e definições do .env
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d"
    });

    return res.status(200).json({ success: true, token });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Endpoint para obter todos os usuários (por exemplo, para testes)
// Se estiver utilizando autenticação, você pode proteger essa rota com um middleware
exports.getUsers = async (req, res) => {
  try {
    // Note: se seu schema definir os arrays de licenças com nomes diferentes, ajuste a função populate
    const users = await User.find().populate('licenseLauncher licenseScript');
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('name email avatar'); // só campos que você quer expor

    if (!user) {
      return res.status(404).json({ success: false, message: "Usuário não encontrado." });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};