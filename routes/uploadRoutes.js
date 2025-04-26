const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");

router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Nenhuma imagem enviada." });
  }

  const imageUrl = `/uploads/${req.file.filename}`;

  res.status(201).json({
    success: true,
    data: imageUrl
  });
});

module.exports = router;
