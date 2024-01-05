const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.body.userId || 'anonymous';
        const uploadPath = path.join(__dirname, 'public/images', userId, 'issues');
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        cb(null, `${timestamp}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// File upload endpoint
router.post('/upload', upload.single('file'), (req, res) => {
    const filePath = `/images/${req.body.userId}/issues/${req.file.filename}`;
    res.status(200).json({ filePath });
});

module.exports = router;