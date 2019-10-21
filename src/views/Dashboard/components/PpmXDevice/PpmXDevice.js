import { Card, CardContent, CardHeader, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import React, { useEffect, useState, useMemo } from 'react';

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

  console.log(props.data_loc, props.data);

  const [devices, setDevice] = useState([]);

  useEffect(() => {
    async function getDevices() {
      const loc_filtered = props.data_loc.find(loc => loc.name === props.data.name);
      setDevice(loc_filtered.devices);
    }

    getDevices();
  }, []);

  const sensoresData = useMemo(() => {
    return devices.reduce((all, device) => {
      return [...all, ...device.sensorData.map(sensor => ({ ...sensor, deviceName: device.name }))];
    }, []);
  }, [devices]);

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
      data: []
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
        data: devices.map(device => device.name)
      },
      series:
        devices.map(device => ({
          name: device.name,
          type: 'line',
          smooth: true,
          data: device.sensorData.map(sensor => sensor.value),
          markLine,
          markArea
        }))
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
