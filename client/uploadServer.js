const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors()); // Habilitar CORS

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/images'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ filename: req.file.filename });
});

app.listen(3001, () => {
  console.log('Servidor de subida de archivos escuchando en el puerto 3001');
});
