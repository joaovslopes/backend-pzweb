// models/categoryModel.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  description: { 
    type: String 
  },
  // Lista opcional de subcategorias (como strings; se necessário, pode ser outro modelo)
  subcategories: [{
    type: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
