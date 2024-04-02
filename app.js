const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const flash = require('connect-flash'); // Importe o connect-flash
const fs = require('fs');
const path = require('path');

// Crie uma instância do aplicativo Express
const app = express();

// Configurações de sessão
app.use(session({
  secret: 'secreto',
  resave: false,
  saveUninitialized: false
}));

// Inicialização do Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Configuração da estratégia de autenticação local
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'users.json')));
    const user = usersData.users.find(user => user.email === email);
    if (!user) {
      return done(null, false, { message: 'Email ou senha incorretos' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Email ou senha incorretos' });
    }
  } catch (error) {
    return done(error);
  }
}));

// Serialização e desserialização do usuário
passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
  try {
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'users.json')));
    const user = usersData.users.find(user => user.email === email);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Configuração do connect-flash
app.use(flash());

// Rota para servir o formulário de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Rota para processar a solicitação de login
app.post('/login', passport.authenticate('local', {
  successRedirect: '/welcome',
  failureRedirect: '/login',
  failureFlash: true
}));

// Rota para perfil do usuário (requer autenticação)
app.get('/profile', isAuthenticated, (req, res) => {
  res.send('Página do perfil do usuário');
});

// Rota para a tela de boas-vindas
app.get('/welcome', (req, res) => {
  res.sendFile(path.join(__dirname, 'welcome.html'));
});

// Middleware para verificar autenticação
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});