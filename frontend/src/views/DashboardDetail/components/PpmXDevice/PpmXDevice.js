import { Card, CardContent, CardHeader, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import React, { useEffect, useState, useMemo } from 'react';
import Socket from '../../../../socket';
import axios from '../../../../http';
import data from './data.json';

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
  const { className, location_id, ...rest } = props;
  const classes = useStyles();

  const [xAxisData, setXAxisData] = useState([]);

  // const yAxisData = useMemo(() => , [xAxisData]);

  useEffect(() => {
    async function getDevices() {
      let authentication = localStorage.getItem('authentication');
      let { data } = await axios.get(`location/${location_id}/devices`, {
        headers: { authentication }
      });

      setXAxisData(
        data.devices.reduce(
          (all, device) => [
            ...all,
            ...device.sensorData.map(sensor => ({
              ...sensor,
              device,
              createAt: new Date(Date.parse(sensor.createAt)).toLocaleString(
                'pt-BR'
              )
            }))
          ],
          []
        )
      );
    }

    getDevices();

    Socket.on('postSensor', sensor => {
      if (xAxisData && sensor.location == location_id) {
        let newDevices = xAxisData;
        debugger;
        newDevices.pop();
        newDevices.unshift({
          ...sensor,
          createAt: new Date(Date.parse(sensor.createAt)).toLocaleString(
            'pt-BR'
          )
        });

        setXAxisData(newDevices);
      }
    });

    return () => {
      Socket.removeListener('postSensor');
    };
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
      data: []
    };

    return {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisData.map(item => item.createAt)
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
          type: 'inside'
        }
      ],
      legend: {
        data: []
      },
      series: [
        {
          name: 'abc',
          type: 'line',
          smooth: true,
          data: [],
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
