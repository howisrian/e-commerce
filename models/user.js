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
      const usersData = JSON.parse(fs.readFileSync(usersFilePath));
      usersData.users.push({ email: this.email, password: this.password });
      fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2));
      return true;
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      return false;
    }
  }

  static async findByEmail(email) {
    try {
      const usersData = JSON.parse(fs.readFileSync(usersFilePath));
      const user = usersData.users.find(user => user.email === email);
      return user ? new User(user.email, user.password) : null;
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      return null;
    }
  }
}

module.exports = User;