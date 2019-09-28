import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import axios from '../../../../http';
import PropTypes from 'prop-types';
import { Line, Bar } from 'react-chartjs-2';
import { makeStyles } from '@material-ui/styles';
import ReactEcharts from 'echarts-for-react';
import data from './data.json';
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
import Socket from '../../../../socket';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import { makeDeviceDataset, options } from './chart';
import { dataG, optionsG } from './chart';
import { Types } from './index';

const useStyles = makeStyles(() => ({
  root: {},
  chartContainer: {
    position: 'relative'
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const PpmXDevice = props => {
  //Style const
  const { className, ...rest } = props;
  const classes = useStyles();

  const [devices, setDevice] = useState([]);
  useEffect(() => {
    async function getDevices() {
      let authentication = await localStorage.getItem('authentication');
      let response = await axios.get('sensors', {
        headers: { authentication }
      });

      let dev = response.data;
      console.log(dev);
      if (dev) {
        //await setDevice();
      }
    }

    getDevices();
    //Socket.on('postDevice', () => getDevices());
    //Socket.on('deleteDevice', () => getDevices());
    //Socket.on('postSensor', () => setTimeout(getDevices, 3000));
    //Socket.on('postEvent', getDevices);
  }, []);

  const getOption = () => {
    let markLine = {
      silent: true,
      data: [
        {
          yAxis: 400,
          lineStyle: {
            color: "#61f205"
          }
        }, {
          yAxis: 1000,
          lineStyle: {
            color: "#f4ea07"
          }
        }, {
          yAxis: 2000,
          lineStyle: {
            color: "#fb7607"
          }
        }, {
          yAxis: 5000,
          lineStyle: {
            color: "#fb0505"
          }
        }
      ]
    };

    let markArea = {
      itemStyle: {
        opacity: 0.1
      },
      data: [
        [
          {
            xAxis: "2000-06-05"
          },
          {
            xAxis: "2007-02-12"
          }
        ],
        [
          {
            xAxis: "2011-06-07"
          },
          {
            xAxis: "2012-03-14"
          }
        ]
      ]
    };

    return {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.map(item => item[0])
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: false
        }
      },
      toolbox: {
        left: 'center'
      },
      dataZoom: [
        {
          startValue: '2015-01-01'
        }, {
          type: 'inside'
        }
      ],
      legend: {
        data: ['Beijing AQI', 'Beijing AQIs', 'Beijing AQIe']
      },
      series: [
        {
          name: 'Beijing AQI',
          type: 'line',
          smooth: true,
          data: data.map(item => item[1] * 15),
          markLine,
          markArea
        },
        {
          name: 'Beijing AQIs',
          type: 'line',
          smooth: true,
          data: data.map(item => item[1] * 11),
          markLine,
          markArea
        },
        {
          name: 'Beijing AQIe',
          type: 'line',
          smooth: true,
          data: data.map(item => item[1] * 6),
          markLine,
          markArea
        }
      ]
    };
  }

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader
        // action={
        //   <div>
        //     <Button
        //       size="small"
        //       variant="text"
        //       aria-controls="simple-menu"
        //       aria-haspopup="true"
        //       onClick={handleClickMenu}>
        //       {graphFilter === Types.MINUTES_GRAPH_TYPE
        //         ? 'Últimos minutos'
        //         : graphFilter === Types.HOURS_GRAPH_TYPE
        //         ? 'Últimas horas'
        //         : 'Últimos dias'}{' '}
        //       <ArrowDropDownIcon />
        //     </Button>
        //     <Menu
        //       id="simple-menu"
        //       anchorEl={anchorElMenu}
        //       keepMounted
        //       open={Boolean(anchorElMenu)}
        //       onClose={handleCloseMenu}>
        //       <MenuItem
        //         onClick={() => handleCloseMenu(Types.MINUTES_GRAPH_TYPE)}>
        //         Últimos minutos
        //       </MenuItem>
        //       <MenuItem onClick={() => handleCloseMenu(Types.HOURS_GRAPH_TYPE)}>
        //         Últimas horas
        //       </MenuItem>
        //       <MenuItem onClick={() => handleCloseMenu(Types.DAYS_GRAPH_TYPE)}>
        //         Últimos dias
        //       </MenuItem>
        //     </Menu>
        //   </div>
        // }
        title="CO² por Sensor"
        subheader="Atualizado em "
      />
      <Divider />
      {/* <CardContent>
        <div className={classes.chartContainer}>
          <Bar data={dataG} options={optionsG} />
        </div>
      </CardContent> */}
      <CardContent>
        <div className={classes.chartContainer}>
          <ReactEcharts option={getOption()} />
        </div>
      </CardContent>
      {/* {needOverview ? (
        <div>
          <Divider />
          <CardActions className={classes.actions}>
            <Button color="primary" size="small" variant="text">
              Overview <ArrowRightIcon />
            </Button>
          </CardActions>
        </div>
      ) : null} */}
    </Card>
  );
};

PpmXDevice.propTypes = {
  className: PropTypes.string
};

export default PpmXDevice;
