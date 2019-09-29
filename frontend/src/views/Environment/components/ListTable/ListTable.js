import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  Typography
} from '@material-ui/core';
import AddBox from '@material-ui/icons/AddBox';
import ImageIcon from '@material-ui/icons/Image';
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
      selectedValue: {},
      dialog: false,
      isLoading: true,
      table: {
        columns: [
          { title: 'Nome', field: 'name' },
          { title: 'Descrição', field: 'description' }
        ],
        data: []
      }
    };
  }
  componentWillMount = async () => {
    this.populate();
  };

  populate = async () => {
    const headers = {
      authentication: localStorage.getItem('authentication')
    };
    axios.get('locations', { headers }).then(response => {
      console.log(response.data);
      if (response.data) {
        this.setState({
          table: {
            ...this.state.table,
            data: response.data.locations
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
          actions={[
            {
              icon: 'image',
              tooltip: 'planta',
              onClick: (event, rowData) => {
                this.setState({
                  dialog: true,

                  selectedValue: {
                    ...rowData
                  }
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
                      `location`,
                      {
                        _id: oldData._id,
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
                    const response = await axios.delete(`location`, {
                      headers,
                      data: { location: oldData._id }
                    });
                    if (response.data.location) {
                    }
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

  const [cropped, setCropped] = React.useState('');
  const [confirmCrop, setConfirmCrop] = React.useState(false);
  const [src, setSrc] = React.useState(null);

  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose();
  };

  const onSelectFile = e => {
    setCropped('');
    setConfirmCrop(false);

    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}>
      <DialogTitle id="simple-dialog-title">Planta</DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img
            style={{ margin: 'auto' }}
            draggable={false}
            ref={imageRef}
            src={selectedValue.img_url}
          />
        </div>

        <Typography variant="h4" style={{ marginBottom: '15px' }}>
          Upload de nova planta
        </Typography>
        <input type="file" onChange={onSelectFile} />
      </DialogContent>
      <Button onClick={() => onClose()}>FECHAR</Button>
      <Button
        onClick={async () => {
          try {
            const headers = {
              authentication: localStorage.getItem('authentication')
            };
            const response = await axios.put(
              `devices/${selectedValue.mac}`,
              { ...selectedValue, x: position.x, y: position.y },
              { headers }
            );
            console.log(response.data);
          } catch (e) {
            //
          }
          setTimeout(onClose, 600);
        }}>
        POSICIONAR
      </Button>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.object.isRequired
};
