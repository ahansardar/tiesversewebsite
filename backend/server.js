const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();



const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const articlesRoutes = require('./routes/articles');                                                                        
const youtubeRoutes = require('./routes/youtubeVideos');
const workshopsRoutes = require('./routes/workshops');                                                                      
const settingsRoutes = require('./routes/settings');      
const teamRoutes = require('./routes/team');


app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);                                                                                           
app.use('/api/events', eventsRoutes);                     
app.use('/api/articles', articlesRoutes);
app.use('/api/youtube-videos', youtubeRoutes);
app.use('/api/workshops', workshopsRoutes); 
app.use('/api/settings', settingsRoutes);
app.use('/api/team', teamRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {            
    res.json({ message: 'TiesVerse API is running' });
}); 

