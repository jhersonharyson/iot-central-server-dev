import { Card, CardContent, CardHeader, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef, useMemo } from 'react';
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
  const markLine = {
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

  const markArea = {
    itemStyle: {
      opacity: 0.1
    },
    data: []
  };

  let xAxisData = [];
  let yAxisData = [];
  let graphRef = null;

  useEffect(() => {
    async function getData() {
      try {
        let authentication = localStorage.getItem('authentication');
        let { data } = await axios.get(`location/${location_id}/devices`, {
          headers: { authentication }
        });

        xAxisData = data.devices.reduce(
          (all, device) => [
            ...all,
            ...device.sensorData.map(sensor => ({
              ...sensor,
              device: {
                _id: device._id,
                name: device.name
              },
              createAt: new Date(Date.parse(sensor.createAt)).toLocaleString(
                'pt-BR'
              )
            }))
          ],
          []
        );

        xAxisData.sort(function (a, b) {
          return a.createAt.localeCompare(b.createAt);
        });

        data.devices.forEach(device => {
          let last = 0;
          yAxisData.push({
            _id: device._id,
            name: device.name,
            data: xAxisData.map(sensor => {
              if (sensor.device._id === device._id) {
                last = sensor.value;
                return sensor;
              }

              return {
                ...sensor,
                value: last
              };
            })
          });
        });

        if (graphRef !== null) {
          graphRef
            .getEchartsInstance()
            .setOption({
              legend: {
                data: yAxisData.map(item => item.name)
              },
              xAxis: {
                data: xAxisData.map(item => item.createAt)
              },
              series: yAxisData.map(item => ({
                name: item.name,
                type: 'line',
                smooth: true,
                data: item.data.map(_ => _.value),
                markLine,
                markArea
              }))
            }, false);
        }
      } catch (err) {
        console.log("err getData(): ", err);
      }
    }
    getData();

    Socket.on('postSensor', sensor => {
      try {
        if (xAxisData && sensor.location == location_id) {
          let _xAxisData = xAxisData;

          _xAxisData.pop();
          _xAxisData.unshift({
            deviceName: sensor.device.name,
            createAt: new Date(Date.parse(sensor.createAt)).toLocaleString(
              'pt-BR'
            ),
            value: sensor.value
          });
          xAxisData = _xAxisData;

          let _yAxisData = yAxisData.map(de => ({
            ...de,
            data: [...de.data.slice(1), de._id === sensor.device._id ? sensor.value : de.data.pop().value]
          }));
          yAxisData = _yAxisData;

          if (graphRef !== null) {
            graphRef
              .getEchartsInstance()
              .setOption({
                legend: {
                  data: _yAxisData.map(item => item.name)
                },
                xAxis: {
                  data: _xAxisData.map(item => item.createAt)
                },
                series: _yAxisData.map(item => ({
                  data: item.data.map(_ => _.value)
                }))
              }, false);
          }
        }
      } catch (err) {
        console.log("err Socket:postEvent(): ", err);
      }
    });

    return () => {
      Socket.removeListener('postSensor');
    }
  }, []);

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
<CardHeader title="CO² por Sensor" />
    <Divider />
    <CardContent>
    <div className={classes.chartContainer}>
    <ReactEcharts
  ref={ref => ref !== null ? graphRef = ref : null}
  lazyUpdate={true}
  option={{
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
        boundaryGap: false,
        data: []
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
        type: 'slider',
        orient: 'horizontal'
      },
      {
        type: 'inside',
        orient: 'horizontal'
      }],
      legend: {
      data: []
    },
    series: []
  }} />
  </div>
  </CardContent>
  </Card>
);
};

PpmXDevice.propTypes = {
  className: PropTypes.string
};

export default PpmXDevice;
