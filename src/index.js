require('./models/User');
require('./models/Track');
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');
const requireAuth = require('./middlewares/requireAuth');

const app = express();
app.use(express.json());
app.use(authRoutes);
app.use(trackRoutes);

const mongoUrl = 'mongodb+srv://admin:passwordpassword@cluster0-ezrfs.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => [
  console.log('Connected to mongoose instance'),
]);

mongoose.connection.on('error', (err) => {
  console.error('Error connecting to mongo', err);
});

app.get('/', requireAuth, (req, res) => {
  res.send(`Your Email: ${req.user.email}`);
});

app.listen(3000, () => {
  console.log('Listening on Port 3000');
});
