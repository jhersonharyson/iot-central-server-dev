import { Grid, Fab } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { Work as WorkIcon } from '@material-ui/icons';

import {
  Budget,
  PpmXDevice,
  PpmXEnvironment,
  TasksProgress,
  TotalProfit,
  TotalUsers,
  UsersByDevice
} from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Dashboard = props => {
  const classes = useStyles();

  const [drawOne, setDrawOne] = React.useState(false);
  const [drawTwo, setDrawTwo] = React.useState(false);

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
      </Grid>
      <div style={{ position: 'fixed', right: '15px', bottom: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Fab
            style={{ marginBottom: '15px' }}
            variant="extended"
            size="small"
            color="secondary"
            onClick={() => setDrawOne(true)}>
            <WorkIcon /> INFLADOR
          </Fab>
          <Fab
            variant="extended"
            size="small"
            color="secondary"
            onClick={() => setDrawTwo(true)}>
            <WorkIcon /> LOCAÇÃO
          </Fab>
        </div>
      </div>
      <Drawer anchor="right" open={drawOne} onClose={() => setDrawOne(false)}>
        <div style={{ width: '300px' }}>asdasdasd One</div>
      </Drawer>
      <Drawer anchor="right" open={drawTwo} onClose={() => setDrawTwo(false)}>
        <div style={{ width: '300px' }}>asdasdasd Two</div>
      </Drawer>
    </div>
  );
};

export default Dashboard;
