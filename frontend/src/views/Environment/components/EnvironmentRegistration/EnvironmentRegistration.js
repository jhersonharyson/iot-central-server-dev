import React, { Component } from 'react';
import {
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  Snackbar
} from '@material-ui/core';
// import Cropper from 'react-easy-crop';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  MyLocation as MyLocationIcon,
  Crop as CropIcon
} from '@material-ui/icons';

import ReactCrop from 'react-image-crop';

import PropTypes from 'prop-types';

import axios from '../../../../http';

import 'react-image-crop/dist/ReactCrop.css';
class EnviromentRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      desc: '',
      img: '',
      marked: false,
      src: null,
      cropped: '',
      crop: {
        // unit: '%',
        width: 250,
        aspect: 4 / 4
      },
      confirmCrop: false,
      feedback: false
    };
    this.inputLabelDropdown = React.createRef();
    this.imageRef = React.createRef();
    this.message = '';
  }

  handleChange = name => event => {
    this.setState({ ...this.state, [name]: event.target.value });
  };

  doSubmit = () => {
    const { name, desc, cropped, src, confirmCrop } = this.state;
    if (!name) {
      this.message = 'O campo nome é obrigatório.';
      this.setState({ feedback: true });
      return;
    } else if (name.length < 3 || name.length > 80) {
      this.message = 'O nome deve conter entre 3 e 80 caracteres.';
      this.setState({ feedback: true });
      return;
    } else if (!desc) {
      this.message = 'O campo de descrição é obrigatório.';
      this.setState({ feedback: true });
      return;
    } else if (src && !confirmCrop) {
      this.message = 'A confirmação do recorte é obrigatório.';
      this.setState({ feedback: true });
      return;
    }
    this.submit(name, desc, confirmCrop ? cropped : null);
  };

  submit = async (name, description, img_url) => {
    const headers = {
      authentication: localStorage.getItem('authentication')
    };

    console.log(headers.authentication);
    try {
      let response = await axios.post(
        'location',
        { name, description, img_url },
        {
          headers
        }
      );

      if (response.data) {
        this.message = 'Dispositivo adicionado com sucesso!';
      }
    } catch (e) {
      this.message = 'Erro ao tentar salvar o dispositivo!';
    } finally {
      this.setState({ feedback: true });
      this.setState({
        name: '',
        desc: '',
        img: '',
        marked: false,
        src: null,
        cropped: '',
        crop: {
          // unit: '%',
          width: 250,
          aspect: 4 / 4
        },
        confirmCrop: false,
        feedback: false
      });
    }
  };

  onSelectFile = e => {
    this.setState({ cropped: '', confirmCrop: false });
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        this.setState({ src: reader.result })
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  render() {
    const { crop, src, cropped } = this.state;
    return (
      <div>
        <Typography variant="h3">Registro de ambiente</Typography>
        <form
          style={{
            marginTop: '15px',
            display: 'flex',
            flex: 1,
            flexDirection: 'column'
          }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'space-between',
              paddingRight: '15px'
            }}>
            <TextField
              style={{ margin: 5 }}
              id="filled-name"
              label="Nome"
              required
              fullWidth
              margin="dense"
              onChange={this.handleChange('name')}
              value={this.state.name}
              variant="outlined"
            />
            <TextField
              style={{ margin: 5 }}
              id="filled-desc"
              required
              fullWidth
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
              flex: 1
            }}>
            <div
              className="App"
              style={{
                margin: '5px',
                marginTop: '30px',
                marginBottom: '20px'
              }}>
              <Typography variant="h4" style={{ marginBottom: '15px' }}>
                Upload da planta
              </Typography>
              <input type="file" onChange={this.onSelectFile} />
            </div>

            {src && (
              <>
                {!this.state.confirmCrop ? (
                  <>
                    <Typography variant="h4">Recorte</Typography>
                    <ReactCrop
                      src={src}
                      crop={this.state.crop}
                      onImageLoaded={ref => (this.imageRef = ref)}
                      onChange={async newCrop => {
                        this.setState({ crop: newCrop });
                        const base = getCroppedImg(
                          this.imageRef,
                          crop,
                          'newFile.jpeg'
                        );
                        this.setState({
                          cropped: base
                        });
                      }}
                      width={300}
                      style={{ alignSelf: 'center', marginBottom: '15px' }}
                      maxHeight={1000}
                    />
                    {this.state.cropped.length > 20 && (
                      <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => this.setState({ confirmCrop: true })}>
                        <CropIcon /> CONFIRMAR RECORTE
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Typography
                      variant="h5"
                      style={{
                        marginTop: '15px',
                        marginBottom: '5px',
                        alignSelf: 'flex-start'
                      }}>
                      {' '}
                      Pré visualisação{' '}
                    </Typography>
                    {this.state.cropped.length > 20 && (
                      <div
                        className="ResultBlock"
                        style={{
                          border: '1.5px solid gray',
                          borderRadius: '5px',
                          alignSelf: 'center'
                        }}>
                        <img
                          style={{
                            height: '300px',
                            width: '300px',
                            borderRadius: '5px',
                            margin: '0px',
                            marginBottom: '-3px'
                          }}
                          src={cropped}
                        />
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </form>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '15px'
          }}>
          <Button onClick={this.props.goBack}>
            <BackIcon />
            VOLTAR
          </Button>
          <Button
            onClick={this.props.goBack}
            color="primary"
            onClick={this.doSubmit}>
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

EnviromentRegistration.propTypes = {
  goBack: PropTypes.func.isRequired
};

function getCroppedImg(image, crop, fileName) {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  // As Base64 string
  const base64Image = canvas.toDataURL('image/jpeg');
  return base64Image;
  // As a blob
  // return new Promise((resolve, reject) => {
  //   canvas.toBlob(
  //     blob => {
  //       blob.name = fileName; // eslint-disable-line no-param-reassign
  //       window.URL.revokeObjectURL(this.fileUrl);
  //       this.fileUrl = window.URL.createObjectURL(blob);
  //       resolve(this.fileUrl);
  //     },
  //     'image/jpeg',
  //     1
  //   );
  // });
}

export default EnviromentRegistration;
