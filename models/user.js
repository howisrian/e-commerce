const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

class User {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  async save() {
    try {
      // Carrega os dados atuais de usuários
      const usersData = await this.loadUsersData();

      // Verifica se o usuário já existe
      const userExists = usersData.users.some(user => user.email === this.email);
      if (userExists) {
        throw new Error('O email já está em uso.');
      }

      // Adiciona o novo usuário ao array de usuários
      usersData.users.push({ email: this.email, password: this.password });

      // Escreve os dados atualizados de volta no arquivo JSON
      await this.writeUsersData(usersData);

      return true;
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      return false;
    }
  }

  static async loadUsersData() {
    return new Promise((resolve, reject) => {
      fs.readFile(usersFilePath, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(JSON.parse(data));
      });
    });
  }

  static async writeUsersData(usersData) {
    return new Promise((resolve, reject) => {
      fs.writeFile(usersFilePath, JSON.stringify(usersData, null, 2), err => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
}

module.exports = User;
