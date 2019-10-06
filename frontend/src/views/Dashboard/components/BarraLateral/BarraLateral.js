import {
  Avatar,
  Badge,
  Fab,
  Grid,
  List,
  Zoom,
  ListItemIcon,
  ListItemText,
  ListItem,
  Tooltip,
  Drawer,
  ListSubheader
} from '@material-ui/core';
import {
  MeetingRoom as MeetingOnIcon,
  MeetingRoomOutlined as MeetingOffIcon,
  ToysOutlined as ToysIcon
} from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from './../../../../http';
import Socket from './../../../../socket';

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  }
}));

export default function BarraLateral() {
  const classes = useStyles();

  const [drawOne, setDrawOne] = React.useState(false);
  const [drawTwo, setDrawTwo] = React.useState(false);

  const [infladores, setInfladores] = useState([]);
  const [ocupacao, setOcupacao] = useState([]);

  useEffect(() => {
    async function getInfladores() {
      let authentication = await localStorage.getItem('authentication');
      let response = await axios.get('actuators', {
        headers: { authentication }
      });
      setInfladores(response.data);
    }

    getInfladores();
  }, []);

  useEffect(() => {
    async function getOcupacao() {
      let authentication = await localStorage.getItem('authentication');
      let response = await axios.get('location/occupation', {
        headers: { authentication }
      });
      setOcupacao(response.data);
    }

    getOcupacao();
  }, []);

  Socket.on('updateActuator', infSocketed => {
    let _infladores = infladores;
    let infIndex = _infladores.findIndex(i => i._id === infSocketed._id);

    _infladores.splice(infIndex, 1, infSocketed);
    setInfladores(_infladores);
  });

  Socket.on('updateLocation', occupSocketed => {
    let _ocupacao = ocupacao;
    let occupIndex = _ocupacao.findIndex(i => i._id === occupSocketed._id);

    _ocupacao.splice(occupIndex, 1, occupSocketed);
    setOcupacao(_ocupacao);
  });

  async function handleToggleInfladoresListItem(inf) {
    let authentication = await localStorage.getItem('authentication');
    await axios.put(
      `actuators/${inf._id}`,
      {
        value: !inf.value
      },
      {
        headers: { authentication }
      }
    );
  }

  async function handleToggleOcupacaoListItem(occup) {
    let authentication = await localStorage.getItem('authentication');
    await axios.put(
      `location/${occup._id}/occupation`,
      {
        value: !occup.value
      },
      {
        headers: { authentication }
      }
    );
  }

  return (
    <React.Fragment>
      <div style={{ position: 'fixed', right: '15px', bottom: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Badge
            className={classes.margin}
            style={{ marginBottom: '15px' }}
            badgeContent={infladores.filter(i => i.value).length}
            color="error"
            onClick={() => setDrawOne(true)}>
            <Tooltip
              TransitionComponent={Zoom}
              title="Infladores"
              placement="left">
              <Fab size="small" color="secondary">
                <ToysIcon
                  className={
                    infladores.filter(i => i.value).length ? 'rotation' : ''
                  }
                />
              </Fab>
            </Tooltip>
          </Badge>
          <Badge
            className={classes.margin}
            badgeContent={ocupacao.filter(i => i.value).length}
            color="error"
            onClick={() => setDrawTwo(true)}>
            <Tooltip
              TransitionComponent={Zoom}
              title="Ocupação dos Ambientes"
              placement="left">
              <Fab size="small" color="secondary">
                {ocupacao.filter(i => i.value).length ? (
                  <MeetingOnIcon />
                ) : (
                    <MeetingOffIcon />
                  )}
              </Fab>
            </Tooltip>
          </Badge>
        </div>
      </div>
      <Drawer anchor="right" open={drawOne} onClose={() => setDrawOne(false)}>
        <div style={{ width: '300px' }}>
          <List
            subheader={
              <ListSubheader component="div">Infladores</ListSubheader>
            }>
            {infladores.map(inf => (
              <ListItem
                button
                onClick={() => handleToggleInfladoresListItem(inf)}
                key={inf._id}>
                <ListItemIcon>
                  <Avatar
                    className={inf.value ? 'rotation' : ''}
                    style={{
                      backgroundColor: inf.value ? '#24a024' : '#908f8fad'
                    }}>
                    <ToysIcon />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={inf.description}
                  secondary={
                    inf.updateAt ?
                      'Atualizado em ' +
                      new Date(
                        Math.max(...inf.updateAt.map(x => Date.parse(x.time)))
                      ).toLocaleString() :
                      ''
                  }
                />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
      <Drawer anchor="right" open={drawTwo} onClose={() => setDrawTwo(false)}>
        <div style={{ width: '300px' }}>
          <List
            subheader={
              <ListSubheader component="div">
                Ocupação dos Ambientes
              </ListSubheader>
            }>
            {ocupacao.map(occup => (
              <ListItem
                button
                onClick={() => handleToggleOcupacaoListItem(occup)}
                key={occup._id}>
                <ListItemIcon>
                  <Avatar
                    style={{
                      backgroundColor: occup.value ? '#24a024' : '#908f8fad'
                    }}>
                    {occup.value ? <MeetingOnIcon /> : <MeetingOffIcon />}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={occup.name}
                  secondary={
                    occup.occupation ?
                      'Atualizado em ' +
                      new Date(
                        Math.max(...occup.occupation.map(x => Date.parse(x.time)))
                      ).toLocaleString() :
                      ''
                  }
                />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </React.Fragment>
  );
}
