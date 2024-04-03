const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const User = require('./models/user');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para analisar corpos de solicitação
app.use(bodyParser.urlencoded({ extended: true }));

// Servir o arquivo HTML 
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/welcome', (req, res) => {
  res.sendFile(__dirname + '/welcome.html');
});

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});


// Rota para processar o formulário de login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Ler o arquivo JSON de usuários
  const usersData = JSON.parse(fs.readFileSync('data/users.json'));

  // Verificar se o usuário existe
  const user = usersData.users.find(user => user.email === email);
  if (!user) {
    return res.status(401).send('Email ou senha incorretos');
  }

  // Comparar senhas (certifique-se de usar bcrypt.compare se as senhas estiverem criptografadas)
  if (user.password !== password) {
    return res.status(401).send('Email ou senha incorretos');
  }

  // Redirecionar para a página de boas-vindas se a autenticação for bem-sucedida
  res.redirect('/welcome');
});




app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar se o usuário já existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).send('O email já está em uso.');
    }

    // Criar o novo usuário
    const newUser = new User(email, password);
    await newUser.save();

    // Redirecionar o usuário para a página de boas-vindas
    res.redirect('/welcome');
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).send('Ocorreu um erro ao criar o usuário.');
  }
});
























// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
