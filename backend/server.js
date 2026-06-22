import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to read JSON file or return default
const readDataFile = (filename, defaultValue = []) => {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
    return defaultValue;
  }
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return defaultValue;
  }
};

// Helper to write JSON file
const writeDataFile = (filename, data) => {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
    return false;
  }
};

// API: GET menu
app.get('/api/menu', (req, res) => {
  const menu = readDataFile('menu.json', []);
  res.json(menu);
});

// API: GET reviews
app.get('/api/reviews', (req, res) => {
  const reviews = readDataFile('reviews.json', []);
  res.json(reviews);
});

// API: POST new review
app.post('/api/reviews', (req, res) => {
  const { text, author, role, rating } = req.body;
  if (!text || !author || !rating) {
    return res.status(400).json({ error: 'Missing required fields (text, author, rating).' });
  }

  const reviews = readDataFile('reviews.json', []);
  const newReview = {
    id: Date.now().toString(),
    text,
    author,
    role: role || 'Guest Reviewer',
    rating: parseFloat(rating)
  };
  reviews.push(newReview);
  writeDataFile('reviews.json', reviews);

  res.status(201).json({ message: 'Review submitted successfully!', review: newReview });
});

// API: POST reservation
app.post('/api/reservations', (req, res) => {
  const { date, timeSlot, seatingArea } = req.body;
  if (!date || !timeSlot || !seatingArea) {
    return res.status(400).json({ error: 'Missing required fields (date, timeSlot, seatingArea).' });
  }

  const reservations = readDataFile('reservations.json', []);
  const newReservation = {
    id: Date.now().toString(),
    date,
    timeSlot,
    seatingArea,
    createdAt: new Date().toISOString()
  };
  reservations.push(newReservation);
  writeDataFile('reservations.json', reservations);

  res.status(201).json({ message: 'Reservation locked successfully!', reservation: newReservation });
});

// API: POST contact message
app.post('/api/messages', (req, res) => {
  const { name, phone, message } = req.body;
  if (!name || !phone || !message) {
    return res.status(400).json({ error: 'Missing required fields (name, phone, message).' });
  }

  const messages = readDataFile('messages.json', []);
  const newMessage = {
    id: Date.now().toString(),
    name,
    phone,
    message,
    createdAt: new Date().toISOString()
  };
  messages.push(newMessage);
  writeDataFile('messages.json', messages);

  res.status(201).json({ message: "Thank you! We'll reply over coffee soon.", messageData: newMessage });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
