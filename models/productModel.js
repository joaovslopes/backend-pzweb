// models/productModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Categoria do script (ex.: "Administração", "Utilitário", etc.)
  category: { 
    type: String, 
    required: true 
  },
  isLauncher: { 
    type: Boolean, 
    required: true 
  },
  // Subcategoria (opcional)
  subcategory: [{ 
    type: String 
  }],
  // Nome do script
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  // URL para download do script
  downloadUrl: { 
    type: String, 
    required: true 
  },
  // URL para vídeo demonstrativo ou explicativo (opcional)
  videoUrl: { 
    type: String 
  },
  // Descrição detalhada do script
  description: { 
    type: String, 
    required: true 
  },
  tag: { 
    type: String, 
    required: true 
  },
  image: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
