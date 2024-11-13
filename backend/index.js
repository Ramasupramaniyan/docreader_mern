const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const cors = require('cors'); // Import cors
const path = require('path');

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

// POST route to upload and process document
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  // Process the uploaded file using Tesseract
  Tesseract.recognize(
    path.join(__dirname, req.file.path),
    'eng',
    {
      logger: (m) => console.log(m), // Log progress
    }
  )
    .then(({ data: { text } }) => {
      res.json({ text });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error processing document');
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
