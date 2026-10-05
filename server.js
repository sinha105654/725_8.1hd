require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');

const app = express();

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is missing from environment variables.');
  process.exit(1);
}

if (!process.env.SESSION_SECRET) {
  console.error('SESSION_SECRET is missing from environment variables.');
  process.exit(1);
}

// View engine
app.set('view engine', 'ejs');

// Form and JSON parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax'
    }
  })
);

// Passport
require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

// Useful root route
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/subjects');
  }

  res.redirect('/login');
});

// Routes
app.use('/', require('./routes/auth'));
app.use('/subjects', require('./routes/subjects'));
app.use('/api', require('./routes/student'));

// 404
app.use((req, res) => {
  res.status(404).send('Page not found');
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

startServer();
