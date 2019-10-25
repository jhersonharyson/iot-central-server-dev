import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import axios from './../../../../http';
import Socket from './../../../../socket';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import DevicesIcon from '@material-ui/icons/Devices';
import SettingsRemoteIcon from '@material-ui/icons/SettingsRemote';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: theme.palette.success.main,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  difference: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  differenceIcon: {
    color: theme.palette.success.dark
  },
  differenceValue: {
    color: theme.palette.success.dark,
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(0.3)
  }
}));

const TotalUsers = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const [counters, setCounters] = React.useState({});
  React.useEffect(() => {
    async function getDevices() {
      const headers = {
        authentication: await localStorage.getItem('authentication')
      };

      const response = await axios.get('dashboard/devices', { headers });
      setCounters(
        response.data.reduce(
          (counters, status) => ({
            ...counters,
            [status._id]: parseInt(status.count)
          }),
          {}
        )
      );
    }

    getDevices();
    Socket.on('postDevice', () => getDevices());
    Socket.on('deleteDevice', () => getDevices());
  }, []);

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent>
        <Grid container justify="space-between">
          <Grid item>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
              variant="body2">
              DISPOSITIVOS
            </Typography>
            <Typography variant="h3">
              {counters[1]} {counters[1] > 1 ? 'Onlines' : 'Online'}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <SettingsRemoteIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
        <div className={classes.difference}>
          <Typography className={classes.differenceValue} variant="body2">
            {counters[0]} {counters[0] > 1 ? 'Inativos' : 'Inativo'}
          </Typography>

          <Typography className={classes.caption} variant="body2">
            {counters[0] + counters[1]}{' '}
            {counters[0] + counters[1] > 1 ? 'dispositivos' : 'dispositivo'} no
            total
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

TotalUsers.propTypes = {
  className: PropTypes.string
};

export default TotalUsers;
