const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('./routes/authRoutes');
const app = express();


mongoose.connect('mongodb://localhost:auth/auth');

app.use(morgan('short'));
app.use(bodyParser.json({type: '*/*'}));

app.use('/api', auth);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Auth app listening on port ${PORT}`);
});
