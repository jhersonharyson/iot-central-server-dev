import React, { Component } from 'react';
import {
  Button,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@material-ui/core';
// import Cropper from 'react-easy-crop';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  MyLocation as MyLocationIcon
} from '@material-ui/icons';
import PropTypes from 'prop-types';

class EnviromentRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      desc: '',
      img: '',
      marked: false,
      src: null,
      crop: {
        unit: '%',
        width: 30
        // aspect: 16 / 9
      }
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

  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        this.setState({ src: reader.result })
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  render() {
    const { crop, croppedImageUrl, src } = this.state;
    return (
      <div>
        <Typography variant="h3">Registro de ambiente</Typography>
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
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              paddingLeft: '15px'
            }}>
            <div className="App">
              <div>
                <input type="file" onChange={this.onSelectFile} />
              </div>
              {src && (
                <>
                  <div className="CropBlock">
                    {/* <ImageCrop
                      src={src}
                      maxHeight="300px"
                      // square={this.state.rectangleStatus}
                      // watch={this.watch}
                      onCrop={this.onCrop}
                      // onReset={this.onReset}
                    /> */}
                  </div>
                  <div className="ResultBlock">
                    <img style={{ maxHeight: '300px' }} src={src} />
                  </div>
                </>
              )}
              {/* {croppedImageUrl && (
                <img
                  alt="Crop"
                  style={{ maxWidth: '100%' }}
                  src={croppedImageUrl}
                />
              )} */}
            </div>
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

EnviromentRegistration.propTypes = {
  goBack: PropTypes.func.isRequired
};

export default EnviromentRegistration;
