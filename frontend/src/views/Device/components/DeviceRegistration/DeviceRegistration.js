import React, { Component } from 'react';
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
    presence: { allowEmpty: false, message: 'é obrigatório' },

    length: {
      maximum: 128
    }
  }
};

class DeviceRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      desc: '',
      mac: '',
      isValid: false,
      values: {},
      touched: {},
      errors: {},
      environment: 0,
      position: false,
      feedback: false,
      erro_field: '',
      locations: []
    };
    this.inputLabelDropdown = React.createRef();
    this.imageRef = React.createRef();
    this.message = '';
  }

  componentWillMount = async () => {
    try {
      let authentication = await localStorage.getItem('authentication');
      let response = await axios.get('locations', {
        headers: { authentication }
      });

      let {
        data: { locations }
      } = response;
      console.info(locations);

      await this.setState({
        locations: locations
      });
      console.log(this.state.locations);
    } catch (e) {
      this.message = 'Erro ao tentar conectar com o servidor.';
    }
  };

  handleChange = name => event => {
    if (name == 'environment') {
      this.setState({
        ...this.state,
        [name]: event.target.value,
        position: false
      });
    }
    this.setState({ ...this.state, [name]: event.target.value });
  };

  onSubmit = async () => {
    const { name, desc, mac, environment, position } = this.state;
    if (!name) {
      this.message = 'O campo nome é obrigatório.';
      this.setState({ feedback: true });
      return;
    } else if (!mac) {
      this.message = 'O campo MAC é obrigatório.';
      this.setState({ feedback: true });
      return;
    } else if (environment == 0) {
      this.message = 'A seleção de um ambiente é obrigatório.';
      this.setState({ feedback: true });
      return;
    } else if (!position) {
      this.message =
        'O posicionamento do dispositivo no ambiente é obrigatório.';
      this.setState({ feedback: true });
      return;
    } else if (name.length < 3 || name.length > 80) {
      this.message = 'O nome deve conter entre 3 e 80 caracteres.';
      this.setState({ feedback: true });
      return;
    } else if (mac.length != 17) {
      this.message = 'O endereço informado MAC não é válido.';
      this.setState({ feedback: true });
      return;
    }
    //doPost
    this.submit(mac, name, desc, environment, position);
  };

  submit = async (mac, name, description, location, position) => {
    const headers = {
      authentication: await localStorage.getItem('authentication')
    };

    console.log(headers.authentication);
    try {
      let response = await axios.post(
        'devices',
        { mac, name, description, location, position },
        {
          headers
        }
      );
      const {
        data: { locations }
      } = response;
      this.setState({ locations });
      this.message = 'Dispositivo adicionado com sucesso!';
    } catch (e) {
      this.message = 'Erro ao tentar salvar o dispositivo!';
    } finally {
      this.setState({ feedback: true });
      this.setState({
        name: '',
        desc: '',
        mac: '',
        environment: 0,
        position: false
      });
    }
  };

  render() {
    let { locations } = this.state;

    locations = locations && locations.length > 0 ? locations : [];
    return (
      <div>
        <Typography variant="h3">Registro de dispositivo</Typography>
        <form
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
              id="filled-name"
              label="Nome"
              required
              margin="dense"
              onChange={this.handleChange('name')}
              value={this.state.name}
              variant="outlined"
            />
            <TextField
              id="filled-desc"
              label="Descrição"
              margin="dense"
              onChange={this.handleChange('desc')}
              value={this.state.desc}
              variant="outlined"
            />
            <TextField
              id="filled-mac"
              label="MAC"
              required
              margin="dense"
              onChange={this.handleChange('mac')}
              value={this.state.mac}
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
                name: 'age',
                id: 'outlined-env'
              }}
              onChange={this.handleChange('environment')}
              placeholder="Selecione um ambiente"
              style={{ marginTop: '5px' }}
              value={this.state.environment}
              variant="outlined">
              <MenuItem value={0}>
                <em>Selecione um ambiente</em>
              </MenuItem>
              {locations.map(location => {
                return (
                  <MenuItem key={location._id} value={location._id}>
                    {location.name}
                  </MenuItem>
                );
              })}
            </Select>
            <br />
            {this.state.environment != 0 && (
              <img
                draggable={false}
                onClick={event => {
                  this.setState({
                    position: {
                      y: event.pageY,
                      x: event.pageX
                    }
                  });
                }}
                ref={this.imageRef}
                src="https://imagens-revista-pro.vivadecora.com.br/uploads/2019/05/Planta-baixa-com-cobertura.png"
              />
            )}
            {this.state.environment != 0 && this.state.position['y'] && (
              <div
                style={{
                  position: 'absolute',
                  top: this.state.position.y + 'px',
                  left: this.state.position.x + 'px'
                }}>
                <MyLocationIcon style={{ color: '#000' }} />
              </div>
            )}
          </div>
        </form>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={this.props.goBack}>
            <BackIcon />
            VOLTAR
          </Button>
          <Button onClick={this.onSubmit} color="primary">
            <SaveIcon />
            SALVAR
          </Button>
        </div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          open={this.state.feedback}
          autoHideDuration={6000}
          onClose={() => this.setState({ feedback: false })}
          ContentProps={{
            'aria-describedby': 'message-id'
          }}
          message={<span id="message-id">{this.message}</span>}
        />
      </div>
    );
  }
}

DeviceRegistration.propTypes = {
  goBack: PropTypes.func.isRequired
};

export default DeviceRegistration;
