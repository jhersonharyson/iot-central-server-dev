import axios from '../http';
class Auth {
  constructor() {
    this.user = undefined;
    this.password = undefined;
    this.authenticated = false;
  }

  async login(cb) {
    this.authenticated = false;

    try {
      const response = await axios.post('auth/signin', {
        [typeof this.user[0] == Number ? 'cpf' : 'email']: this.user,
        password: this.password
      });
      // eslint-disable-next-line no-console
      console.log(response);
      if (response) {
        const {
          data: { token }
        } = response;
        putTokenInSession(token);
        this.user = undefined;
        this.password = undefined;
        this.authenticated = true;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }

    cb();
  }

  logout(cb) {
    this.authenticated = false;
    cb();
  }
  isAuthenticated() {
    return this.authenticated;
  }
}

const putTokenInSession = async token => {
  await localStorage.setItem('authentication', `Bearer ${token}`);
};

export const auth = new Auth();
