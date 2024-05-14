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
    const userFound = registeredUsers.find(user => user.username === usernameInput); 
    if (!userFound || userFound.password !== passwordInput) {
      return verifyCallback(null, false, { message: 'Incorrect username or password.' });
    }
    return verifyCallback(null, userFound);
  }
));

passport.serializeUser((user, doneSerialize) => doneSerialize(null, user.username)); 
passport.deserializeUser((username, doneDeserialize) => { 
  const user = registeredUsers.find(user => user.username === username);
  if (user) {
    doneDeserialize(null, user);
  } else {
    doneDeserialize(new Error('User not found'), null);
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
  })
);

app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(__dirname + '/public/dashboard.html');
  } else {
    res.redirect('/login');
  }
});

liveSocket.on('connection', (userSocket) => { 
  console.log('A user connected');

  userSocket.on('disconnect', () => {
    console.log('User disconnected');
  });

  userSocket.emit('bot-activity', { message: 'Recruitment bot has screened 10 profiles.' });
});

const PORT = process.env.APP_PORT || 3000; 
httpServer.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));