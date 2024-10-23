const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const registerRoute = require('./routes/register-routes');

const app = express();

dotenv.config();
const database_connection = process.env.DATABASE_URL;

// Connect to MongoDB
mongoose.connect(database_connection, {
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register routes
app.use('/api', registerRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});