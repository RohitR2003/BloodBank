const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const donorRoutes = require('./donorRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/donors',donorRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(()=>{

        app.listen(port, ()=>{console.log(`Server started on port ${port}...`)})
    })
    .catch((err)=>{console.log(err)});


