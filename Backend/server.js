
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// API endpoint to fetch all spots
app.get('/api/spots', (req, res) => {
  const spotsFilePath = path.join(__dirname, '../Data/spots.json');
  fs.readFile(spotsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading spots.json:', err);
      return res.status(500).json({ message: 'Failed to load spots.' });
    }

    try {
      res.json(JSON.parse(data));
    } catch (parseError) {
      console.error('Error parsing spots.json:', parseError);
      res.status(500).json({ message: 'Failed to parse spots data.' });
    }
  });
});

// API endpoint to add a new spot
app.post('/api/spots', (req, res) => {
  console.log('Received new spot data:', req.body);
  const newSpot = req.body;
  const spotsFilePath = path.join(__dirname, '../Data/spots.json');

  fs.readFile(spotsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading spots.json:', err);
      return res.status(500).json({ message: 'Failed to save the new spot.' });
    }

    let spots = [];
    try {
      spots = JSON.parse(data);
    } catch (parseError) {
      console.error('Error parsing spots.json:', parseError);
      return res.status(500).json({ message: 'Failed to parse spots data.' });
    }

    spots.push(newSpot);

    fs.writeFile(spotsFilePath, JSON.stringify(spots, null, 2), 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error writing to spots.json:', writeErr);
        return res.status(500).json({ message: 'Failed to save the new spot.' });
      }

      console.log('Spot added successfully:', newSpot);
      res.json({ message: 'Spot added successfully!' });
    });
  });
});

// API endpoint to clear all spots
app.delete('/api/clear', (req, res) => {
  console.log('DELETE /api/clear endpoint hit');
  const spotsFilePath = path.join(__dirname, '../Data/spots.json');

  fs.writeFile(spotsFilePath, JSON.stringify([], null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Error clearing spots data:', err);
      return res.status(500).json({ message: 'Failed to clear data.' });
    }
    console.log('Spots data cleared successfully');
    res.json({ message: 'All skate spots have been cleared!' });
  });
});

// Serve static files
app.use(express.static(path.join(__dirname, '../Frontend')));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});