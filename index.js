const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors')
const { extractTextContent, getAnswerFromPdfContent } = require('./controllers/pdfController.module');

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors())
app.use(bodyParser.json());


app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        // console.log("File uploaded:", req.file); // Debugging log

        const filePath = req.file.path;
        const pdfContentResponse = await extractTextContent(filePath);
        
        if (!pdfContentResponse.success) {
            return res.status(400).json(pdfContentResponse);
        }

        res.json(pdfContentResponse);
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/submit_pdf', async (req, res) => {
    try {
        const { pdfContent, userQuestion } = req.body;

        // console.log("Received pdfContent:", pdfContent); // Debugging log
        // console.log("Received userQuestion:", userQuestion); // Debugging log

        const apiResponse = await getAnswerFromPdfContent(pdfContent, userQuestion);
        console.log("apiResponse",apiResponse)
        return res.status(200).json(apiResponse);
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(3001, () => {
    console.log("Server is listening on port 3001");
});
