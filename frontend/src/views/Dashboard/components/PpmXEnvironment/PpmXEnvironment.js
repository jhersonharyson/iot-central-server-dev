import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import Detail from '../Detail';
import axios from '../../../../http';
import { PpmXDevice } from '..';

const useStyles = makeStyles(() => ({
  root: {},
  chartContainer: {
    position: 'relative'
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const PpmXEnvironment = props => {
  //Style const
  const { className, ...rest } = props;
  const classes = useStyles();
  const [devices, setDevice] = useState([]);
  const [detail, setDetail] = React.useState({
    active: false,
    data: null
  });
  const handleToggle = () => {
    setDetail({
      active: !detail.active,
      data: null
    });
  };

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

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['ABC', 'DEF']
      },
      xAxis: {
        type: 'category',
        data: [
          '周一',
          '周二',
          '周三',
          '周四',
          '周五',
          '周六',
          '周日',
          '周五',
          '周六',
          '周日'
        ]
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'ABC',
          type: 'bar',
          stack: '0',
          itemStyle: {
            color: '#053F66'
          },
          markLine,
          data: [320, 302, 301, 334, 390, 330, 320, 389, 342, 312]
        },
        {
          name: 'DEF',
          type: 'bar',
          stack: '0',
          itemStyle: {
            color: ''
          },
          markLine,
          data: [120, 132, 101, 134, 90, 600, 10, 66, 43, 21]
        }
      ]
    };
  };

  return (
    <>
      <Card {...rest} className={clsx(classes.root, className)}>
        <CardHeader title="CO² por Ambiente" subheader="Atualizado em " />
        <Divider />
        <CardContent>
          <div className={classes.chartContainer}>
            <ReactEcharts
              option={getOption()}
              onEvents={{
                click: e => {
                  setDetail({
                    active: true,
                    data: e
                  });
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
      <Detail open={detail.active} handleToggle={handleToggle} title="Ambiente">
        <PpmXDevice data={detail.data} />
      </Detail>
    </>
  );
};

PpmXEnvironment.propTypes = {
  className: PropTypes.string
};

export default PpmXEnvironment;
