// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  // Armazena os IDs das licenças do launcher associadas ao usuário
  licenses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'License'
  }],
  // Armazena os IDs dos scripts (produtos) que o usuário possui
  licenseScript: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
