require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');




const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const articlesRoutes = require('./routes/articles');
const youtubeRoutes = require('./routes/youtubeVideos');
const workshopsRoutes = require('./routes/workshops');
const settingsRoutes = require('./routes/settings');
const teamRoutes = require('./routes/team');
const cloudinaryRoutes = require('./routes/cloudinary');
const guestsRoutes = require('./routes/guests');
const networkRoutes = require('./routes/network');


const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:5173', 
  'https://tiesverse.com',
  process.env.FRONTEND_URL // <-- Add this!
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/youtube-videos', youtubeRoutes);
app.use('/api/workshops', workshopsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);
app.use('/api/guests', guestsRoutes);
app.use('/api/network', networkRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {            
    res.json({ message: 'TiesVerse API is running' });
}); 

