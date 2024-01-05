// filepath: e:\Projects\UrbanGuard\server.js
import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 3000; // You can change the port if needed
  
const apiPath = (path) => `/api${path}`;
// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies


// Static file serving (e.g., for uploaded files)
app.use('/public', express.static('public'));

// Routes

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join('public/uploads', "tempFolder");

    // Ensure the directory exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const uniqueFilename = `${timestamp}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const isMimeTypeValid = allowedTypes.test(file.mimetype);
    const isExtNameValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (isMimeTypeValid && isExtNameValid) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
  },
});

// File upload endpoint
app.post(apiPath('/upload'), upload.array("files"), (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }
      const filePaths = req.files.map((file) => {
        return `/public/uploads/${req.body.userId}/${file.filename}`;
      });

      const userId = req.body.userId;
      const userUploadPath = path.join('public/uploads', userId);
      
      // Ensure the user-specific directory exists and move the images there
      fs.mkdirSync(userUploadPath, { recursive: true });
      req.files.forEach((file) => {
        const tempPath = path.join('public/uploads', "tempFolder", file.filename);
        const newPath = path.join(userUploadPath, file.filename);
        fs.renameSync(tempPath, newPath, (err) => {
          if (err) {
            console.error('Error moving file:', err);
          }
        });
      })

        res.header("Access-Control-Allow-Origin", "*");
        res.status(200).json({ filePath: filePaths }); // Send the file path as a response
    } catch (error) {
        console.error('Error handling file upload:', error.message);
        res.status(500).json({ error: 'File upload failed' });
    }
});

// Default route
app.get(apiPath('/'), (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.send('Welcome to the UrbanGuard API!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});