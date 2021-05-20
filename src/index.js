// Create express app
const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const dbSetup = require('./database/setup');
const contactRoutes = require('./routes/contactRoutes');

app.use(express.json());

// SETUP DATABASE (Mongoose)
dbSetup();

app.use(contactRoutes);

app.listen(port, ()=> console.log(`App listening on port ${port}`));
