const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;

// Increase limit for large JSON payloads
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from the current directory
app.use(express.static(__dirname));

// Endpoint to save location/road data
app.post('/save-locations', (req, res) => {
    const data = req.body;
    const filePath = path.join(__dirname, 'data', 'locations.json');

    console.log('Received save request for locations.json');

    fs.writeFile(filePath, JSON.stringify(data, null, 4), (err) => {
        if (err) {
            console.error('Error writing file:', err);
            res.status(500).json({ success: false, message: 'Error saving data' });
        } else {
            console.log('Data saved successfully');
            res.json({ success: true, message: 'Data saved successfully' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop');
});
