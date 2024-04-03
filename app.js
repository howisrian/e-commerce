const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const path = require('path');
const usersFilePath = path.join(__dirname, 'data', 'users.json');
const app = express();
const PORT = process.env.PORT || 3000;


// Middleware para analisar corpos de solicitação
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

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
  bcrypt.compare(password, user.password, (err, result) => {
    if (err || !result) {
      return res.status(401).send('Email ou senha incorretos');
    }

    // Redirecionar para a página de boas-vindas se a autenticação for bem-sucedida
    res.redirect('/welcome');
  });
});

app.use(express.urlencoded({ extended: true }));

// Rota para lidar com a submissão do formulário de cadastro
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Carregar dados de usuários existentes
    const usersData = JSON.parse(fs.readFileSync(usersFilePath));

    // Verificar se o email já está em uso
    if (usersData.users.find(user => user.email === email)) {
      return res.status(400).send('Erro: Email já está em uso');
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Adicionar o novo usuário aos dados de usuários
    usersData.users.push({ email, password: hashedPassword });

    // Escrever os dados atualizados no arquivo JSON
    fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2));

    res.send('Usuário cadastrado com sucesso');
  } catch (error) {
    console.error('Erro ao adicionar usuário:', error);
    res.status(500).send('Erro interno do servidor');
  }
});
























// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
