import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography
} from '@material-ui/core';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';
import { makeStyles, useTheme } from '@material-ui/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from './../../../../http';
import Socket from './../../../../socket';

import './styles.css';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  chartContainer: {
    position: 'relative',
    height: '200px'
  },
  stats: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center'
  },
  device: {
    textAlign: 'center',
    padding: theme.spacing(1)
  },
  deviceIcon: {
    color: theme.palette.icon
  }
}));

const UsersByDevice = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const theme = useTheme();

  const [data, setData] = useState({});
  const [percents, setPercents] = useState(null);

  useEffect(() => {
    async function getDevices() {
      let authentication = await localStorage.getItem('authentication');
      let response = await axios.get('locations', {
        headers: { authentication }
      });

      const resp = response.data;
      let d = [];
      let l = [];
      let d_bottom = [];
      if (resp && resp.locations) {
        const locations = resp.locations;

        for (const location of locations) {
          l.push(location.name);
          d.push(location.device.length);
        }
        const total = d.reduce((a, b) => a + b);
        let percents = d.map(x => (x * 100) / total);

        locations.forEach((v, i) => {
          d_bottom.push({
            title: l[i],
            value: percents[i],
            icon: <LaptopMacIcon />,
            color: theme.palette.primary.main
          });
        });
      }

      const data = {
        datasets: [
          {
            data: d,
            backgroundColor: [
              theme.palette.primary.main,
              theme.palette.error.main,
              theme.palette.warning.main
            ],
            borderWidth: 8,
            borderColor: theme.palette.white,
            hoverBorderColor: theme.palette.white
          }
        ],
        labels: l
      };
      setData(data);
      setPercents(d_bottom);
    }

    getDevices();
    Socket.on('postDevice', () => getDevices());
    Socket.on('deleteDevice', () => getDevices());
  }, []);

  const options = {
    legend: {
      display: false
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    tooltips: {
      enabled: true,
      mode: 'index',
      intersect: false,
      borderWidth: 1,
      borderColor: theme.palette.divider,
      backgroundColor: theme.palette.white,
      titleFontColor: theme.palette.text.primary,
      bodyFontColor: theme.palette.text.secondary,
      footerFontColor: theme.palette.text.secondary
    }
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
      // style={{ ['background-color']: 'black' }}
    >
      <CardHeader
        // action={
        //   <IconButton size="small">
        //     <RefreshIcon />
        //   </IconButton>
        // }
        title="Dispositivos Por Local"
      />
      <Divider />
      <CardContent className={percents && 'fadeIn'}>
        <div className={classes.chartContainer}>
          <Doughnut data={data} options={options} />
        </div>
        <div className={classes.stats}>
          {percents &&
            percents.map(device => (
              <div className={classes.device} key={device.title}>
                <span className={classes.deviceIcon}>{device.icon}</span>
                <Typography variant="body1">{device.title}</Typography>
                <Typography style={{ color: device.color }} variant="h2">
                  {device.value}%
                </Typography>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

UsersByDevice.propTypes = {
  className: PropTypes.string
};

export default UsersByDevice;
