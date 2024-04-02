const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, 'data', 'users.json');

// Função para adicionar um novo usuário ao arquivo JSON
async function addUser(email, password) {
  try {
    // Carregar dados de usuários existentes
    const usersData = JSON.parse(fs.readFileSync(usersFilePath));

    // Verificar se o email já está em uso
    if (usersData.users.find(user => user.email === email)) {
      console.log('Erro: Email já está em uso');
      return;
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Adicionar o novo usuário aos dados de usuários
    usersData.users.push({ email, password: hashedPassword });

    // Escrever os dados atualizados no arquivo JSON
    fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2));

    console.log('Usuário adicionado com sucesso');
  } catch (error) {
    console.error('Erro ao adicionar usuário:', error);
  }
}

// Adicionar usuário (substitua o email e a senha conforme necessário)
addUser('test@example.com', 'senha123');