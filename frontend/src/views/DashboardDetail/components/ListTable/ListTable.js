import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  TextField,
  Typography,
  Snackbar
} from '@material-ui/core';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import RefreshIcon from '@material-ui/icons/Refresh';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import MaterialTable from 'material-table';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect } from 'react';
import axios from '../../../../http';
import Socket from '../../../../socket';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

export default class ListTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snackbar: false,
      selectedValue: {},
      dialog: false,
      isLoading: true,
      table: {
        columns: [
          { title: 'Dispositivo', field: 'deviceName' },
          { title: 'Valor', field: 'value' },
          { title: 'Data/Hora', field: 'createAt' }
        ],
        data: []
      }
    };
    this.message = 'Erro ao atualizar';
  }
  componentWillMount = async () => {
    try {
      this.populate();
      Socket.on('postSensor', sensor => {
        if (this.state.table.data.length) {
          const { location_id } = this.props;
          let sensores = this.state.table.data;

          if (sensor.location == location_id) {
            sensores.pop();
            sensores.unshift({
              deviceName: sensor.device.name,
              createAt: new Date(Date.parse(sensor.createAt)).toLocaleString(
                'pt-BR'
              ),
              value: sensor.value
            });

            this.setState({
              table: {
                ...this.state.table,
                data: sensores
              }
            });
          }
        }
      });
    } catch (e) {
      this.message = 'Erro ao tentar conectar com o servidor.';
    }
  };

  componentWillUnmount = () => {
    Socket.removeListener('postSensor');
  };

  populate = async () => {
    const { location_id } = this.props;

    let authentication = localStorage.getItem('authentication');
    let { data } = await axios.get(`location/${location_id}/devices`, {
      headers: { authentication }
    });

    this.setState({
      table: {
        ...this.state.table,
        data: data.devices.reduce((all, device) => {
          return [
            ...all,
            ...device.sensorData.map(sensor => ({
              ...sensor,
              deviceName: device.name,
              createAt: new Date(Date.parse(sensor.createAt)).toLocaleString(
                'pt-BR'
              )
            }))
          ];
        }, [])
      }
    });
    this.setState({ isLoading: false });
  };

  handleClose = () => {
    this.setState({ dialog: false });
  };

  render() {
    return (
      <>
        <SimpleDialog
          selectedValue={this.state.selectedValue}
          open={this.state.dialog}
          onClose={this.handleClose}
        />
        <MaterialTable
          isLoading={this.state.isLoading}
          title={
            <div
              onClick={() => {
                this.setState({ isLoading: true });
                this.populate();
              }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              {this.state.isLoading ? (
                <CircularProgress color="secondary" size="small" />
              ) : (
                  <Fab
                    color="secondary"
                    aria-label="atualizar"
                    size="small"
                    variant="extended">
                    <RefreshIcon />
                    <span style={{ marginRight: '5px' }}>ATUALIZAR</span>
                  </Fab>
                )}
            </div>
          }
          options={{
            exportButton: true,
            actionsColumnIndex: -1,
            exportFileName: 'syccoo-devices',
            rowStyle: { fontSize: '10px' },
            cellStyle: { fontSize: '10px' }
          }}
          localization={{
            pagination: {
              labelDisplayedRows: '{from}-{to} de {count}',
              labelRowsPerPage: '{0} linha(s)',
              nextTooltip: 'Próximo página',
              lastTooltip: 'Última página',
              previousTooltip: 'Página anterio',
              firstTooltip: 'Primeira página',
              labelRowsSelect: 'linhas'
            },
            toolbar: {
              nRowsSelected: '{0} linha(s) selecionada(s)',
              searchTooltip: 'Pesquisar',
              searchPlaceholder: 'Pesquisar',
              exportTitle: 'Exportar',
              exportName: 'Exportar para CSV',
              exportAriaLabel: 'devices'
            },
            header: {
              actions: 'Ações'
            },
            body: {
              emptyDataSourceMessage: 'Nenhum dado para mostrar',
              filterRow: {
                filterTooltip: 'Filtro'
              }
            }
          }}
          icons={tableIcons}
          columns={this.state.table.columns}
          data={this.state.table.data}
        />
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          open={this.state.snackbar}
          autoHideDuration={6000}
          onClose={() => this.setState({ snackbar: false })}
          ContentProps={{
            'aria-describedby': 'message-id'
          }}
          message={<span id="message-id">{this.message}</span>}
        />
      </>
    );
  }
}

function SimpleDialog(props) {
  const [password1, setPasswors1] = React.useState(undefined);
  const [password2, setPasswors2] = React.useState(undefined);

  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = value => {
    onClose(value);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}>
      <DialogTitle id="simple-dialog-title">
        Redefinir senha de {selectedValue.name}
      </DialogTitle>
      <DialogContent>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column'
          }}>
          <div>
            <Typography>Nova senha</Typography>
            <TextField
              type="password"
              onChange={event => setPasswors1(event.target.value)}
              error={
                password1 && (password1.length > 6 || password1.length < 3)
              }
              helperText={
                password1 && (password1.length > 6 || password1.length < 3)
                  ? 'A senha deve conter de 3 a 6 dígitos.'
                  : ''
              }
            />
          </div>
          <div style={{ marginTop: '15px' }}>
            <Typography>Confirmar senha</Typography>
            <TextField
              type="password"
              onChange={event => setPasswors2(event.target.value)}
              error={password1 != password2 && password2 != undefined}
              helperText={
                password1 != password2 && password2 != undefined
                  ? 'As senha são diferentes.'
                  : ''
              }
            />
          </div>
        </div>

        {/* onClick={() => handleListItemClick(email)} */}
      </DialogContent>
      <div style={{ margin: '15px', display: 'flex', flexDirection: 'column' }}>
        <Button style={{ marginBottom: '5px' }} onClick={() => onClose()}>
          FECHAR
        </Button>
        <Button
          disabled={
            (password1 && (password1.length > 6 || password1.length < 3)) ||
            (password1 != password2 && password2 != undefined) ||
            password2 == undefined ||
            password1 == undefined
          }
          variant="outlined"
          onClick={async () => {
            try {
              const headers = {
                authentication: localStorage.getItem('authentication')
              };
              console.log(selectedValue);
              const response = await axios.put(
                `user/${selectedValue._id}`,
                { ...selectedValue, password: password1 },
                { headers }
              );
              console.log(response.data);
            } catch (e) {
              //
            }
            setTimeout(onClose, 600);
          }}>
          REDEFINIR
        </Button>
      </div>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.object.isRequired
};
