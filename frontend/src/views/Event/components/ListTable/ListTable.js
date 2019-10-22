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

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
          { title: 'Tipo', field: 'type' },
          { title: 'Descrição', field: 'description' },
          { title: 'Registro', field: 'createAt' }
          // {
          //   title: 'Status',
          //   field: 'status',
          //   editable: 'never',
          //   filtering: false,
          //   lookup: {
          //     1: (
          //       <span
          //         style={{
          //           backgroundColor: '#4caf50',
          //           padding: '4px',
          //           borderRadius: '5px',
          //           color: '#fff'
          //         }}>
          //         online
          //       </span>
          //     ),
          //     0: (
          //       <span
          //         style={{
          //           backgroundColor: '#ca3232',
          //           padding: '4px',
          //           borderRadius: '5px',
          //           color: '#fff'
          //         }}>
          //         offline
          //       </span>
          //     )
          //   }
          // }
        ],
        data: []
      }
    };
  }
  componentWillMount = async () => {
    try {
      this.populate();
    } catch (e) {
      this.message = 'Erro ao tentar conectar com o servidor.';
    }
  };

  populate = async () => {
    const headers = {
      authentication: localStorage.getItem('authentication')
    };
    axios.get('events', { headers }).then(response => {
      console.log(response.data);
      if (response.data) {
        this.setState({
          table: {
            ...this.state.table,
            data: response.data.events.map(data => ({
              ...data,
              description: ` ${data.description}`.toUpperCase().split(' - ')[1],
              createAt: new Date(data.createAt).toLocaleString()
            }))
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
          detailPanel={rowData => {
            console.log(rowData);
            return (
              <div>
                {rowData.sensorData &&
                  rowData.sensorData.map((data, index) => (
                    <ExpansionPanel key={index}>
                      <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header">
                        <h3 style={{ fontWeight: 'bold' }}>{`REGISTRO`}</h3>
                        <h4 style={{ fontWeight: 100, marginLeft: '15px' }}>
                          {new Date(data.createAt).toLocaleString()}
                        </h4>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <div style={{ display: 'flex' }}>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column'
                            }}>
                            <label
                              style={{
                                fontWeight: 100
                              }}>{`LOCALIZAÇÃO`}</label>
                            <h4>
                              {` ${data.location &&
                                data.location.name +
                                  ' - ' +
                                  data.location.description} `.toUpperCase()}
                            </h4>

                            <label
                              style={{
                                fontWeight: 100
                              }}>{`DISPOSITIVO`}</label>
                            <h4>
                              {` ${data.location &&
                                data.deviceId.name +
                                  ' - ' +
                                  data.deviceId.description} `.toUpperCase()}
                            </h4>
                            <label style={{ fontWeight: 100 }}>{`MAC`}</label>
                            <h4>
                              {` ${data.location &&
                                data.deviceId.mac} `.toUpperCase()}
                            </h4>
                          </div>

                          <div
                            style={{
                              marginLeft: '30px',
                              display: 'flex',
                              flexDirection: 'column'
                            }}>
                            <label
                              style={{
                                fontWeight: 100
                              }}>{`TIPO`}</label>
                            <h4>{` ${data && data.type} `.toUpperCase()}</h4>

                            <label
                              style={{
                                fontWeight: 100
                              }}>{`VALOR`}</label>
                            <h4>{`${data && data.value} PPM`}</h4>
                            <label
                              style={{ fontWeight: 100 }}>{`DESCRIÇÃO`}</label>
                            <h4>
                              {` ${
                                data.value >= 2000
                                  ? data.value >= 5000
                                    ? 'RISCO DE VIDA'
                                    : 'NÍVEL CRÍTICO'
                                  : 'NÍVEL ACIMA DO NORMAL'
                              } `}
                            </h4>
                          </div>
                        </div>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  ))}
              </div>
            );
          }}
          options={{
            exportButton: true,
            actionsColumnIndex: -1,
            detailPanelType: 'single',
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
              onRowDelete: oldData =>
                new Promise(resolve => {
                  setTimeout(async () => {
                    // console.log(oldData);
                    try {
                      const headers = {
                        authentication: localStorage.getItem('authentication')
                      };
                      const response = await axios.delete(
                        `events/${oldData._id}`,
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
          <DialogTitle id="simple-dialog-title">Dados dos sensores</DialogTitle>
          <DialogContent>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: '15px'
              }}>
              <MaterialTable
                isLoading={this.state.isLoading}
                title={
                  <div
                    onClick={() => {
                      this.setState({ isLoading: true });
                      this.componentWillMount();
                      setTimeout(
                        () => this.setState({ isLoading: false }),
                        2500
                      );
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
                    },
                    editRow: {
                      deleteText:
                        'Você tem certeza que deseja excluir este item?',
                      cancelTooltip: 'cancelar',
                      saveTooltip: 'confirmar'
                    }
                  }
                }}
                icons={tableIcons}
                columns={this.state.table.columns}
                data={this.state.table.data}
              />
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
