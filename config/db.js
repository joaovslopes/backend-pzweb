const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://joaovslopesz:l25lD10A01Rhjofr@bancoshortlink.iptf7z8.mongodb.net/?retryWrites=true&w=majority&appName=BancoShortLink", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'pzdev-launcher'
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
