
import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8000;


app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// Set up Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = '/mnt/temp-storage/uploads/';
        
        // Ensure that the 'uploads' directory exists
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // Save the file with the original filename
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });


app.get("/", (req,res) => {
    return res.json({
        success: true,
        message: `server is up and running on ${PORT}`
    });
})

app.post('/upload', upload.single('file'), (req, res) => {

    // Multer will automatically attach the file to req.file
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // File information is available in req.file
    const filePath = path.join("/mnt/temp-storage", 'uploads', req.file.originalname);

    // Read the file to confirm upload success (optional)
    fs.readFile(filePath, (err, data) => {
        if (err) {
            return res.status(500).send('Error reading the file.');
        }

        // Sending success response
        res.status(200).send({
            message: 'File uploaded successfully',
            fileName: req.file.originalname,
            path: filePath
        });
    });
});


app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
