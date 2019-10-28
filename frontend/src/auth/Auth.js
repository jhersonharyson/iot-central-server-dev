import axios from '../http';
class Auth {
  constructor() {
    this.user = undefined;
    this.password = undefined;
    this.authenticated = false;
    this.token = undefined;
    this.user_name = undefined;
    this.profile = undefined;
    this.askToServer();
  }
  askToServer = async () => {
    this.token = await localStorage.getItem('authentication');
    const response = await axios.get('auth/verify', {
      headers: { authentication: this.token }
    });

    if (response && response.data && response.data.authenticated) {
      this.authenticated = true;
      const {
        token,
        user: { name, profile, email }
      } = response.data;

      this.user_name = name;
      this.token = token;
      this.profile = profile;
      this.user_email = email;
      this.user = undefined;
      this.password = undefined;
      this.authenticated = true;
      return true;
    }
    return false;
  };

  async login(cb, err) {
    this.authenticated = false;

    try {
      const response = await axios.post('auth/signin', {
        [typeof this.user[0] == 'number' ? 'cpf' : 'email']: this.user,
        password: this.password
      });
      // eslint-disable-next-line no-console
      console.log(response);
      if (response && response.data && response.data.token) {
        const {
          token,
          user: { name, profile, email }
        } = response.data;

        putTokenInSession(token);
        this.user_name = name;
        this.token = token;
        this.profile = profile;
        this.user_email = email;
        this.user = undefined;
        this.password = undefined;
        this.authenticated = true;
        return cb();
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e.response && e.response.status);
      if (err) return err(e.response && e.response.status);
    }
    if (err) return err();
  }

  async logout(cb) {
    await removeTokenInSession();
    this.user = undefined;
    this.password = undefined;
    this.authenticated = false;
    this.token = undefined;
    this.user_name = undefined;
    this.profile = undefined;
    if (cb) cb();
  }
  isAuthenticated() {
    return this.authenticated;
  }

  hasAuthorization(path = window.location.pathname) {
    switch (this.profile) {
      case 'JOUNIN': {
        return !!(
          [
            '/users',
            '/environments',
            '/devices',
            '/dashboard',
            '/events'
          ].indexOf(path) + 1
        );
      }
      case 'CHUNIN': {
        return !!(
          ['/environments', '/devices', '/dashboard'].indexOf(path) + 1
        );
      }

      case 'GENIN': {
        return !!(['/dashboard'].indexOf(path) + 1);
      }
      default: {
      }
    }
  }
}

const putTokenInSession = async token => {
  await localStorage.setItem('authentication', `Bearer ${token}`);
};

const removeTokenInSession = async () => {
  await localStorage.removeItem('authentication');
};

export const auth = new Auth();
