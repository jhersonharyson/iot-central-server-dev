import React, { Component, useState, useEffect } from 'react';
import {
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  Snackbar
} from '@material-ui/core';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  MyLocation as MyLocationIcon
} from '@material-ui/icons';
import validate from 'validate.js';

import axios from '../../../../http';

import PropTypes from 'prop-types';

const schema = {
  email: {
    presence: { allowEmpty: false, message: 'é obrigatório' },
    email: {
      message: 'informado não é válido'
    },
    length: {
      maximum: 64
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'A senha é obrigatório.' },
    length: {
      maximum: 6,
      minimum: 3,
      tooShort: 'A senha deve conter de 3 a 6 caracteres.',
      tooLong: 'A senha deve conter de 3 a 6 caracteres.'
    }
  },
  confirmpassword: {
    equality: {
      attribute: 'password',
      message: 'As senhas não coicidem.'
    }
  },
  name: {
    presence: { allowEmpty: false, message: 'O nome é obrigatório' },
    length: {
      maximum: 80,
      minimum: 3,
      tooShort: 'O nome deve conter entre 3 a 80 caracteres.',
      tooLong: 'O nome deve conter entre 3 a 80 caracteres.'
    }
  },
  profile: {
    presence: { allowEmpty: false, message: 'O perfil é obrigatório.' }
  }
};

const UserRegistration = props => {
  const { history } = props;
  const [feedback, setFeedback] = useState(false);
  const [message, setMessage] = useState('');
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const handleBack = () => {
    history.goBack();
  };

  const handleSignUp = event => {
    const { name, email, password, profile } = formState.values;
    submit(name, email, password, profile);
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const submit = async (name, email, password, profile) => {
    const headers = {
      authentication: localStorage.getItem('authentication')
    };

    console.log(headers.authentication);
    try {
      let response = await axios.post(
        'auth/signup',
        {
          name,
          email,
          password,
          profile
        },
        {
          headers
        }
      );
      const {
        data: { user }
      } = response;

      setMessage('Usuário cadastrado com sucesso!');
      setFormState({
        isValid: false,
        values: {},
        touched: {},
        errors: {}
      });
    } catch (e) {
      setMessage('Erro ao tentar cadastrar o usuário!');
    } finally {
      setFeedback(true);
    }
  };

  return (
    <div>
      <Typography variant="h3">Registro de usuário</Typography>
      <form
        style={{
          marginTop: '15px',
          display: 'flex',
          flexDirection: 'column'
        }}>
        <div
          style={{
            marginTop: '15px',
            display: 'flex',
            flexDirection: 'row'
          }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              paddingRight: '15px'
            }}>
            <TextField
              error={hasError('name')}
              fullWidth
              helperText={
                hasError('name')
                  ? formState.errors.name[0].replace('Name', '')
                  : null
              }
              label="Nome"
              name="name"
              onChange={handleChange}
              type="text"
              margin="dense"
              value={formState.values.name || ''}
              variant="outlined"
            />
            <TextField
              error={hasError('email')}
              fullWidth
              helperText={hasError('email') ? formState.errors.email[0] : null}
              label="Email"
              name="email"
              margin="dense"
              onChange={handleChange}
              type="text"
              value={formState.values.email || ''}
              variant="outlined"
            />
            <TextField
              error={hasError('password')}
              fullWidth
              helperText={
                hasError('password')
                  ? formState.errors.password[0].replace('Password', '')
                  : null
              }
              label="Senha"
              name="password"
              margin="dense"
              onChange={handleChange}
              type="password"
              value={formState.values.password || ''}
              variant="outlined"
            />
            <TextField
              error={hasError('confirmpassword')}
              fullWidth
              helperText={
                hasError('confirmpassword')
                  ? formState.errors.confirmpassword[0].replace(
                      'Confirmpassword',
                      ''
                    )
                  : null
              }
              label="Confirmar senha"
              name="confirmpassword"
              margin="dense"
              onChange={handleChange}
              type="password"
              value={formState.values.confirmpassword || ''}
              variant="outlined"
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              paddingLeft: '15px'
            }}>
            <Select
              inputProps={{
                name: 'profile',
                id: 'outlined-env'
              }}
              onChange={e => {
                console.log(e);
                handleChange(e);
              }}
              name="profile"
              label="Confirmar senha"
              placeholder="Selecione um perfil"
              style={{ marginTop: '5px' }}
              value={formState.values.profile || ''}
              variant="outlined">
              <MenuItem value={''}>
                <em>Selecione um perfil</em>
              </MenuItem>
              <MenuItem value={'GENIN'}>JUNIOR</MenuItem>
              <MenuItem value={'CHUNIN'}>PLENO</MenuItem>
              <MenuItem value={'JOUNIN'}>SENIOR</MenuItem>
            </Select>
            <br />
          </div>
        </div>

        <div style={{ display: 'flex', alignSelf: 'flex-end' }}>
          <Button onClick={props.goBack}>
            <BackIcon />
            VOLTAR
          </Button>
          <Button
            disabled={!formState.isValid}
            onClick={handleSignUp}
            color="primary">
            <SaveIcon />
            SALVAR
          </Button>
        </div>
      </form>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={feedback}
        autoHideDuration={6000}
        onClose={() => setFeedback(false)}
        ContentProps={{
          'aria-describedby': 'message-id'
        }}
        message={<span id="message-id">{message}</span>}
      />
    </div>
  );
};

UserRegistration.propTypes = {
  goBack: PropTypes.func.isRequired
};

export default UserRegistration;
