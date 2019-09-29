import { Card, CardContent, CardHeader, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import data from './data.json';
import axios from '../../../../http';

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
  const { className, data: ambiente, ...rest } = props;
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
            color: '#61f205'
          }
        },
        {
          yAxis: 1000,
          lineStyle: {
            color: '#f4ea07'
          }
        },
        {
          yAxis: 2000,
          lineStyle: {
            color: '#fb7607'
          }
        },
        {
          yAxis: 5000,
          lineStyle: {
            color: '#fb0505'
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
            xAxis: '2000-06-05'
          },
          {
            xAxis: '2007-02-12'
          }
        ],
        [
          {
            xAxis: '2011-06-07'
          },
          {
            xAxis: '2012-03-14'
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
        },
        {
          type: 'inside'
        }
      ],
      legend: {
        data: ['Dispositivo 01', 'Dispositivo 02', 'Dispositivo 03']
      },
      series: [
        {
          name: 'Dispositivo 01',
          type: 'line',
          smooth: true,
          data: data.map(item => item[1] * 15),
          markLine,
          markArea
        },
        {
          name: 'Dispositivo 02',
          type: 'line',
          smooth: true,
          data: data.map(item => item[1] * 11),
          markLine,
          markArea
        },
        {
          name: 'Dispositivo 03',
          type: 'line',
          smooth: true,
          data: data.map(item => item[1] * 6),
          markLine,
          markArea
        }
      ]
    };
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title="CO² por Sensor" />
      <Divider />
      <CardContent>
        <div className={classes.chartContainer}>
          <ReactEcharts option={getOption()} />
        </div>
      </CardContent>
    </Card>
  );
};

PpmXDevice.propTypes = {
  className: PropTypes.string
};

export default PpmXDevice;
