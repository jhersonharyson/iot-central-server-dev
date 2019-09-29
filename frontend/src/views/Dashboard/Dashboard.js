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
  Tooltip
} from '@material-ui/core';

import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';

import {
  PpmXEnvironment,
  TasksProgress,
  TotalUsers,
  BarraLateral
} from './components';
import './styles.css';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Dashboard = props => {
  const classes = useStyles();

  return (
    <div className={classes.root} style={{ paddingBottom: '100px' }}>
      <Grid container spacing={3}>
        <Grid item lg={12} md={12} xl={12} xs={12}>
          <PpmXEnvironment />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <TasksProgress />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <TotalUsers />
        </Grid>
      </Grid>
      <BarraLateral />
    </div>
  );
};

export default Dashboard;
