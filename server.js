const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Nhut', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});