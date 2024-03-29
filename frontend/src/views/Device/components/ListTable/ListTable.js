import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
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
import React, { forwardRef } from 'react';
import axios from '../../../../http';

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
      dialogCharging: undefined,
      snackbar: false,

      locations: [],
      selectedValue: {},
      dialog: false,
      isLoading: true,
      table: {
        columns: [
          { title: 'Nome', field: 'name' },
          { title: 'Descrição', field: 'description' },
          { title: 'MAC', field: 'mac', editable: 'never' },
          {
            title: 'Status',
            field: 'status',
            editable: 'never',
            filtering: false,
            lookup: {
              1: (
                <span
                  style={{
                    backgroundColor: '#4caf50',
                    padding: '4px',
                    borderRadius: '5px',
                    color: '#fff'
                  }}>
                  online
                </span>
              ),
              0: (
                <span
                  style={{
                    backgroundColor: '#ca3232',
                    padding: '4px',
                    borderRadius: '5px',
                    color: '#fff'
                  }}>
                  offline
                </span>
              )
            }
          }
        ],
        data: []
      }
    };
  }
  componentWillMount = async () => {
    try {
      let authentication = localStorage.getItem('authentication');
      let response = await axios.get('locations', {
        headers: { authentication }
      });

      let {
        data: { locations }
      } = response;
      let lookup = {};
      for (let i = 0; i < locations.length; i++) {
        lookup[`${locations[i]._id}`] = locations[i].name;
      }

      console.log(lookup);
      const columnsWithoutRepetion = this.state.table.columns.filter(
        column => column.title != 'Ambiente'
      );

      this.setState({
        table: {
          columns: [
            ...columnsWithoutRepetion,
            { title: 'Ambiente', field: 'location', lookup: { ...lookup } }
          ],
          data: []
        }
      });

      this.setState({
        locations: locations
      });
      console.log(this.state.locations);
      this.populate();
    } catch (e) {
      this.message = 'Erro ao tentar conectar com o servidor.';
    }
  };

  populate = async () => {
    const headers = {
      authentication: localStorage.getItem('authentication')
    };
    axios.get('devices/all', { headers }).then(response => {
      console.log(response.data);
      if (response.data) {
        this.setState({
          table: {
            ...this.state.table,
            data: response.data
          }
        });
      }
      this.setState({ isLoading: false });
    });
  };
  handleClose = () => {
    this.setState({ dialog: false });
  };

  handleUpdateAfterClose = () => {
    this.setState({ isLoading: true });
    this.componentWillMount();
    setTimeout(() => this.setState({ isLoading: false }), 1000);
    this.handleClose();
  };

  render() {
    return (
      <>
        <SimpleDialog
          selectedValue={this.state.selectedValue}
          open={this.state.dialog}
          onClose={this.handleClose}
          handleUpdateAfterClose={this.handleUpdateAfterClose}
        />
        <MaterialTable
          isLoading={this.state.isLoading}
          title={
            <div
              onClick={() => {
                this.setState({ isLoading: true });
                this.componentWillMount();
                setTimeout(() => this.setState({ isLoading: false }), 2500);
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
          actions={
            this.props.profile && [
              {
                icon: 'my_location',
                tooltip: 'posicionar',
                onClick: (event, rowData) => {
                  document.body.scrollTop = 0; // For Safari
                  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

                  const { img_url } = this.state.locations.find(
                    x => x._id == rowData.location
                  );
                  console.log(img_url);
                  this.setState({
                    dialog: true,

                    selectedValue: {
                      ...rowData,
                      img_url
                    }
                  });
                }
              },
              {
                icon: 'battery_charging_full',
                tooltip: 'indicar troca de bateria',
                onClick: (event, rowData) => {
                  this.setState({ snackbar: true });
                  setTimeout(() => {
                    this.setState({
                      dialogCharging: {
                        name: rowData.name,
                        location: this.state.locations.find(
                          x => x._id == rowData.location
                        )
                      }
                    });
                  }, 20000);
                }
              }
            ]
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
              },
              editRow: {
                deleteText: 'Você tem certeza que deseja excluir este item?',
                cancelTooltip: 'cancelar',
                saveTooltip: 'confirmar'
              }
            }
          }}
          icons={tableIcons}
          columns={this.state.table.columns}
          data={this.state.table.data}
          editable={
            this.props.profile && {
              onRowUpdate: (newData, oldData) =>
                new Promise(resolve => {
                  setTimeout(async () => {
                    try {
                      const headers = {
                        authentication: localStorage.getItem('authentication')
                      };
                      const response = await axios.put(
                        `devices/${oldData.mac}`,
                        {
                          name: newData.name,
                          description: newData.description,
                          location: newData.location
                        },
                        {
                          headers
                        }
                      );

                      console.log(response.data);

                      resolve();
                      const data = [...this.state.table.data];
                      data[data.indexOf(oldData)] = newData;
                      this.setState({ table: { ...this.state.table, data } });
                      setTimeout(this.populate, 2000);
                    } catch (e) {}
                  }, 600);
                }),
              onRowDelete: oldData =>
                new Promise(resolve => {
                  setTimeout(async () => {
                    // console.log(oldData);
                    try {
                      const headers = {
                        authentication: localStorage.getItem('authentication')
                      };
                      const response = await axios.delete(
                        `devices/${oldData.mac}`,
                        { headers }
                      );
                      console.log(response.data.status);
                      resolve();
                      const data = [...this.state.table.data];
                      data.splice(data.indexOf(oldData), 1);
                      this.setState({ table: { ...this.state.table, data } });
                      setTimeout(this.populate, 2000);
                    } catch (e) {
                      /////
                    }
                  }, 600);
                })
            }
          }
        />
        <Dialog
          onClose={() => {
            this.setState({ dialogCharging: undefined });
          }}
          aria-labelledby="simple-dialog-title"
          open={this.state.dialogCharging != undefined}>
          <DialogTitle id="simple-dialog-title">
            Alerta nível de bateria
          </DialogTitle>
          <DialogContent>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: '15px'
              }}>
              <Typography
                variant="h5"
                style={{ marginBottom: '15px' }}>{`O dispositivo ${
                this.state.dialogCharging ? this.state.dialogCharging.name : ''
              } alocado em ${
                this.state.dialogCharging
                  ? this.state.dialogCharging.location.name
                  : ''
              }, nescessita de troca de bateria.`}</Typography>

              {this.state.dialogCharging && (
                <img
                  style={{ margin: 'auto', width: '300px' }}
                  src={this.state.dialogCharging.location.img_url}></img>
              )}
            </div>
          </DialogContent>
        </Dialog>
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
          message={
            <span id="message-id">Troca de bateria informada com sucesso</span>
          }
        />
      </>
    );
  }
}

class SimpleDialog extends React.Component {
  constructor(props) {
    super(props);
    this.imageRef = React.createRef();
    this.state = {
      position: {
        x: 0,
        y: 0
      }
    };
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedValue && nextProps.selectedValue.position) {
      setTimeout(() => {
        if (this.imageRef.current) {
          console.info(
            JSON.stringify(this.imageRef.current.getBoundingClientRect())
          );
          this.setState({
            position: {
              x:
                nextProps.selectedValue.position.x +
                this.imageRef.current.getBoundingClientRect().x,
              y:
                nextProps.selectedValue.position.y +
                this.imageRef.current.getBoundingClientRect().y
            }
          });
        }
      }, 100);
    }
    if (nextProps.position) {
      this.setState({
        position: {
          x: nextProps.position ? nextProps.position.x : 0,
          y: nextProps.position ? nextProps.position.y : 0
        }
      });
    }
    console.log({
      x: nextProps.position ? nextProps.position.x : 0,
      y: nextProps.position ? nextProps.position.y : 0
    });

    console.log({
      x: this.state.position ? this.state.position.x : 0,
      y: this.state.position ? this.state.position.y : 0
    });
  }

  handleClose = () => {
    // setPosition({
    //   x: 0,
    //   y: 0
    // });
    this.props.onClose();
  };

  handleListItemClick = value => {
    this.props.onClose(value);
  };
  render() {
    const { handleUpdateAfterClose, onClose, selectedValue, open } = this.props;
    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}>
        <DialogTitle id="simple-dialog-title">
          Posicionamento do dispositivo
        </DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img
              style={{ margin: 'auto', width: '300px' }}
              draggable={false}
              onClick={event => {
                const x =
                  event.pageX -
                  event.target.getBoundingClientRect().left +
                  window.scrollX;
                const y =
                  event.pageY -
                  event.target.getBoundingClientRect().top +
                  window.scrollY;
                console.log(x, y);
                console.log(this.imageRef.current.getBoundingClientRect());

                this.setState({
                  position: {
                    y: event.pageY,
                    x: event.pageX,
                    xr: x,
                    yr: y
                  }
                });
              }}
              ref={this.imageRef}
              src={selectedValue.img_url}
            />
          </div>
          <div
            style={{
              position: 'fixed',
              top:
                selectedValue.position && this.state.position.y == 0
                  ? selectedValue.position.y +
                    (!!this.imageRef.current
                      ? this.imageRef.current.getBoundingClientRect().top
                      : 0) +
                    'px'
                  : this.state.position.y,
              left:
                selectedValue.position && this.state.position.x == 0
                  ? selectedValue.position.x +
                    (!!this.imageRef.current
                      ? this.imageRef.current.getBoundingClientRect().left
                      : 0) +
                    'px'
                  : this.state.position.x
            }}>
            <MyLocationIcon style={{ color: '#000' }} />
          </div>

          {/* onClick={() => handleListItemClick(email)} */}
        </DialogContent>
        <div
          style={{ margin: '15px', display: 'flex', flexDirection: 'column' }}>
          <Button style={{ marginBottom: '5px' }} onClick={() => onClose()}>
            FECHAR
          </Button>
          <Button
            variant="outlined"
            disabled={this.state.position.x == 0 && this.state.position.y == 0}
            onClick={async () => {
              try {
                const headers = {
                  authentication: localStorage.getItem('authentication')
                };
                const response = await axios.put(
                  `devices/${selectedValue.mac}`,
                  {
                    ...selectedValue,
                    position: {
                      x: this.state.position.xr,
                      y: this.state.position.yr
                    }
                  },
                  { headers }
                );
                console.log(response.data);
              } catch (e) {
                //
              }
              setTimeout(handleUpdateAfterClose, 600);
            }}>
            POSICIONAR
          </Button>
        </div>
      </Dialog>
    );
  }
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.object.isRequired
};
