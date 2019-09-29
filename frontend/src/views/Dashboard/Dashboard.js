import {
  Grid,
  Fab,
  Badge,
  List,
  ListItemIcon,
  ListItemText,
  Avatar,
  ListItem
} from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import axios from './../../http';
import socket from './../../socket';
import { ToysOutlined as ToysIcon } from '@material-ui/icons';
import { MeetingRoom as MeetingOnIcon } from '@material-ui/icons';
import { MeetingRoomOutlined as MeetingOffIcon } from '@material-ui/icons';

import {
  Budget,
  PpmXDevice,
  PpmXEnvironment,
  TasksProgress,
  TotalProfit,
  TotalUsers,
  UsersByDevice
} from './components';

import './styles.css';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Dashboard = props => {
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

  socket.on('updateActuator', infSocketed => {
    let _infladores = infladores;
    let infIndex = _infladores.findIndex(i => i._id === infSocketed._id);

    _infladores.splice(infIndex, 1, infSocketed);
    setInfladores(_infladores);
  });

  socket.on('updateLocation', occupSocketed => {
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
      });
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
      });
  }

  return (
    <div className={classes.root} style={{ paddingBottom: '100px' }}>
      <Grid container spacing={4}>
        <Grid item lg={12} md={12} xl={12} xs={12}>
          <PpmXDevice />
        </Grid>
        <Grid item lg={12} md={12} xl={12} xs={12}>
          <PpmXEnvironment />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <TasksProgress />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <TotalUsers />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <TotalProfit />
        </Grid>
      </Grid>
      <div style={{ position: 'fixed', right: '15px', bottom: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Badge
            className={classes.margin}
            style={{ marginBottom: '15px' }}
            badgeContent={infladores.filter(i => i.value).length}
            color="error"
            onClick={() => setDrawOne(true)}>
            <Fab size="small" color="secondary" >
              <ToysIcon className={infladores.filter(i => i.value).length ? 'rotation' : ''} />
            </Fab>
          </Badge>
          <Badge
            className={classes.margin}
            badgeContent={ocupacao.filter(i => i.value).length}
            color="error"
            onClick={() => setDrawTwo(true)}>
            <Fab size="small" color="secondary">
              {ocupacao.filter(i => i.value).length ? <MeetingOnIcon /> : <MeetingOffIcon />}
            </Fab>
          </Badge>
        </div>
      </div>
      <Drawer anchor="right" open={drawOne} onClose={() => setDrawOne(false)}>
        <div style={{ width: '300px' }}>
          <List>
            {infladores.map(inf => (
              <ListItem button onClick={() => handleToggleInfladoresListItem(inf)} key={inf._id}>
                <ListItemIcon>
                  <Avatar
                    className={inf.value ? 'rotation' : ''}
                    style={{ backgroundColor: inf.value ? '#24a024' : '#908f8fad' }}>
                    <ToysIcon />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={inf.description}
                  secondary={
                    'Atualizado em ' +
                    new Date(
                      Math.max(...inf.updateAt.map(x => Date.parse(x.time)))
                    ).toLocaleString()
                  }
                />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
      <Drawer anchor="right" open={drawTwo} onClose={() => setDrawTwo(false)}>
        <div style={{ width: '300px' }}>
          <List>
            {ocupacao.map(occup => (
              <ListItem button onClick={() => handleToggleOcupacaoListItem(occup)} key={occup._id}>
                <ListItemIcon>
                  <Avatar
                    style={{ backgroundColor: occup.value ? '#24a024' : '#908f8fad' }}>
                    {occup.value ? <MeetingOnIcon /> : <MeetingOffIcon />}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={occup.name}
                  secondary={
                    'Atualizado em ' +
                    new Date(
                      Math.max(...occup.occupation.map(x => Date.parse(x.time)))
                    ).toLocaleString()
                  }
                />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </div>
  );
};

export default Dashboard;
