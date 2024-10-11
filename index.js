const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const { extractTextContent, getAnswerFromPdfContent } = require('./controllers/pdfController.module');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(bodyParser.json());

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        const pdfContentResponse = await extractTextContent(req.file.buffer);
        res.json(pdfContentResponse);
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/submit_pdf', async (req, res) => {
    try {
        const { pdfContent, userQuestion } = req.body;
        const apiResponse = await getAnswerFromPdfContent(pdfContent, userQuestion);
        return res.status(200).json(apiResponse);
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("Internal Server Error");
    }
});

// This line exports the Express app, which is important for Vercel.
module.exports = app;
