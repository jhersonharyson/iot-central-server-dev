import React, { Component } from 'react';
import {
  Button,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@material-ui/core';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  MyLocation as MyLocationIcon
} from '@material-ui/icons';
import PropTypes from 'prop-types';

class DeviceRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      desc: '',
      mac: '',
      environment: 0,
      marked: false
    };
    this.inputLabelDropdown = React.createRef();
    this.imageRef = React.createRef();
  }

  handleChange = name => event => {
    this.setState({ ...this.state, [name]: event.target.value });
  };

  componentDidMount() {
    //  const x = this.inputLabelDropdown.inputLabel?.current?.offsetWidth;
  }

  render() {
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
              <MenuItem value={10}>Ambiente X</MenuItem>
              <MenuItem value={20}>Ambiente Y</MenuItem>
              <MenuItem value={30}>Ambiente Z</MenuItem>
            </Select>
            {this.state.environment != 0 && (
              <img
                draggable={false}
                onClick={event => {
                  this.setState({
                    marked: {
                      top: event.pageY + 'px',
                      left: event.pageX + 'px'
                    }
                  });
                }}
                ref={this.imageRef}
                src="https://randomuser.me/api/portraits/men/65.jpg"
              />
            )}

            {this.state.marked['top'] && (
              <div
                style={{
                  position: 'absolute',
                  top: this.state.marked.top,
                  left: this.state.marked.left
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
          <Button onClick={this.props.goBack} color="primary">
            <SaveIcon />
            SALVAR
          </Button>
        </div>
      </div>
    );
  }
}

DeviceRegistration.propTypes = {
  goBack: PropTypes.func.isRequired
};

export default DeviceRegistration;
