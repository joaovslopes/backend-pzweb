const mongoose = require('mongoose');

const licenseSchema = new mongoose.Schema({
  token: { type: String, unique: true },
  domain: { type: String, unique: true, required: true },
  themeUrl: { type: String, required: true },
  updateUrl: { type: String, required: true },
  expirationDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  dashboard: { type: Boolean, default: true },
}, { timestamps: true });

licenseSchema.methods.checkExpiration = function () {
  const currentDate = new Date();
  console.log(`Current Date: ${currentDate}`);
  console.log(`Expiration Date: ${this.expirationDate}`);
  this.isActive = this.expirationDate >= currentDate;
  console.log(`Is Active: ${this.isActive}`);
  console.log(`Dashboard: ${this.dashboard}`);
};

module.exports = mongoose.model('License', licenseSchema);
