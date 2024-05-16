const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const registeredUsers = [];

require('dotenv').config();

const app = express();
const httpServer = http.createServer(app);
const liveSocket = socketIo(httpServer);

app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  (usernameInput, passwordInput, verifyCallback) => {
    try {
      const userFound = registeredUsers.find(user => user.username === usernameInput);
      if (!userFound || userFound.password !== passwordInput) {
        return verifyCallback(null, false, { message: 'Incorrect username or password.' });
      }
      return verifyCallback(null, userFound);
    } catch (error) {
      return verifyCallback(error);
    }
  }
));

passport.serializeUser((user, doneSerialize) => doneSerialize(null, user.username));
passport.deserializeUser((username, doneDeserialize) => {
  try {
    const user = registeredUsers.find(user => user.username === username);
    if (user) {
      doneDeserialize(null, user);
    } else {
      doneDeserialize(new Error('User not found'), null);
    }
  } catch (error) {
    doneDeserialize(error, null);
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true 
  })
);

app.get('/dashboard', (req, res) => {
  try {
    if (req.isAuthenticated()) {
      res.sendFile(__dirname + '/public/dashboard.html');
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error accessing the dashboard:', error);
    res.status(500).send('An internal server error occurred');
  }
});

liveSocket.on('connection', (userSocket) => {
  try {
    console.log('A user connected');
  
    userSocket.on('disconnect', () => {
      console.log('User disconnected');
    });
  
    userSocket.emit('bot-activity', { message: 'Recruitment bot has screened 10 profiles.' });
  } catch (error) {
    console.error('Error with live socket connection:', error);
  }
});

const PORT = process.env.APP_PORT || 3000;
httpServer.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));