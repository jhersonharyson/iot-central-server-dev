import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import axios from './../../../../http';
import Socket from './../../../../socket';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import ArrowUpward from '@material-ui/icons/ArrowUpward';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: theme.palette.white,
    color: theme.palette.primary.main,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  co2: {
    marginTop: 10
  }
}));

const TotalProfit = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const [maxSensor, setMaxSensor] = React.useState(0);
  React
    .useEffect(() => {
      async function getDevices() {
        const headers = { authentication: await localStorage.getItem('authentication') };
        const response = await axios.get('sensors', { headers });

        if (response.data[0]) {
          let map = response.data.map(sensor => sensor.value);
          let max = Math.max(...map);

          setMaxSensor(max);
        }
      }

      getDevices();
      Socket.on('postSensor', () => getDevices());
    }, []);


  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
        >
          <Grid item>
            <Typography
              className={classes.title}
              color="inherit"
              gutterBottom
              variant="body2"
            >
              MAIOR MEDIÇÃO
            </Typography>
            <Typography
              color="inherit"
              variant="h3"
            >
              {maxSensor} ppm
            </Typography>

            <Typography
              className={classes.co2}
              color="inherit"
              variant="h2"
            >
              CO²
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <ArrowUpward className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

TotalProfit.propTypes = {
  className: PropTypes.string
};

export default TotalProfit;
