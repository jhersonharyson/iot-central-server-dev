import React, { forwardRef } from 'react';

import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, Button } from '@material-ui/core';
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
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import MaterialTable from 'material-table';
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
      selectedValue: '',
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
      console.info(locations);
      let lookup = {};
      for (let i = 0; i < locations.length; i++) {
        lookup[`${locations[i]._id}`] = locations[i].name;
      }
      console.log(lookup);
      this.setState({
        table: {
          columns: [
            ...this.state.table.columns,
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
          title=""
          actions={[
            {
              icon: 'my_location',
              tooltip: 'posicionar',
              onClick: (event, rowData) => {
                this.setState({
                  dialog: true,
                  selectedValue: rowData.location
                });
              }
            }
          ]}
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
                deleteText: 'Você tem certeza que deseja excluir este iten?',
                cancelTooltip: 'cancelar',
                saveTooltip: 'confirmar'
              }
            }
          }}
          icons={tableIcons}
          columns={this.state.table.columns}
          data={this.state.table.data}
          editable={{
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
          }}
        />
      </>
    );
  }
}

function SimpleDialog(props) {
  let imageRef = React.createRef();
  const [position, setPosition] = React.useState({
    x: 0,
    y: 0
  });

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
        Posicionamento do dispositivo
      </DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img
            style={{ margin: 'auto' }}
            draggable={false}
            onClick={event => {
              console.log({
                y: event.pageY,
                x: event.pageX
              });
              setPosition({
                y: event.pageY,
                x: event.pageX
              });
            }}
            ref={imageRef}
            src="https://imagens-revista-pro.vivadecora.com.br/uploads/2019/05/Planta-baixa-com-cobertura.png"
          />
        </div>
        <div
          style={{
            position: 'fixed',
            top: position.y + 'px',
            left: position.x + 'px'
          }}>
          <MyLocationIcon style={{ color: '#000' }} />
        </div>

        {/* onClick={() => handleListItemClick(email)} */}
      </DialogContent>
      <Button onClick={() => onClose()}>FECHAR</Button>
      <Button onClick={() => onClose()}>POSICIONAR</Button>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired
};
