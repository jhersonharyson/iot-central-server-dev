import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import axios from './../../../../http';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button,
  Menu,
  MenuItem
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import { makeDeviceDataset, options } from './chart';
import { Types } from './index'

const useStyles = makeStyles(() => ({
  root: {},
  chartContainer: {
    position: 'relative'
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const LatestSales = props => {
  //Style const
  const { className, ...rest } = props;
  const classes = useStyles();

  //Dropdown Menu Option
  const [graphFilter, setGraphFilter] = useState(Types.MINUTES_GRAPH_TYPE);
  const [anchorElMenu, setAnchorElMenu] = useState(null);

  function handleClickMenu(event) {
    setAnchorElMenu(event.currentTarget);
  }

  function handleCloseMenu(graphType = graphFilter) {
    setGraphFilter(graphType);
    setAnchorElMenu(null);
  }

  //Carrego os dados iniciais
  const [needOverview, setNeedOverview] = useState(false);
  const [devices, setDevice] = useState([]);
  useEffect(() => {
    async function getDevices() {
      let authentication = await localStorage.getItem('authentication');
      let response = await axios.get('devices', { headers: { authentication } });

      let devices = response.data;
      if (devices) {
        if (devices.lenght > 5) {
          setNeedOverview(true);

          devices = devices.filter((device, key) => key < 5);
        }

        setDevice(
          makeDeviceDataset(devices, graphFilter)
        );
      }
    }

    getDevices();
  }, []);


  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        action={
          <div>
            <Button
              size="small"
              variant="text"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClickMenu}
            >
              {
                graphFilter === Types.MINUTES_GRAPH_TYPE ? 'Últimos minutos' :
                  graphFilter === Types.HOURS_GRAPH_TYPE ? 'Últimas horas' :
                    'Últimos dias'
              } <ArrowDropDownIcon />
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorElMenu}
              keepMounted
              open={Boolean(anchorElMenu)}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={() => handleCloseMenu(Types.MINUTES_GRAPH_TYPE)}>Últimos minutos</MenuItem>
              <MenuItem onClick={() => handleCloseMenu(Types.HOURS_GRAPH_TYPE)}>Últimas horas</MenuItem>
              <MenuItem onClick={() => handleCloseMenu(Types.DAYS_GRAPH_TYPE)}>Últimos dias</MenuItem>
            </Menu>
          </div>
        }
        title="Níveis de CO²"
      />
      <Divider />
      <CardContent>
        <div className={classes.chartContainer}>
          <Line
            data={devices}
            options={options}
          />
        </div>
      </CardContent>
      {needOverview ?
        <div>
          <Divider />
          <CardActions className={classes.actions}>
            <Button
              color="primary"
              size="small"
              variant="text"
            >
              Overview <ArrowRightIcon />
            </Button>
          </CardActions>
        </div>
        : null}
    </Card>
  );
};

LatestSales.propTypes = {
  className: PropTypes.string
};

export default LatestSales;
