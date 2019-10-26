import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import Detail from '../Detail';
import axios from '../../../../http';
import Socket from '../../../../socket';
import { PpmXDevice } from '..';
import ListTable from './ListTable/ListTable';

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
  const [locations, setLocations] = useState([]);
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
    async function getLocation() {
      let authentication = localStorage.getItem('authentication');
      let response = await axios.get('dashboard/location', {
        headers: { authentication }
      });

      setLocations(response.data);
    }

    getLocation();
    Socket.on('redrawLocationGraphic', locationsForUpdate => {
      console.log('locationsForUpdate: ', locationsForUpdate);
      locationsForUpdate.map(locationForUpdate => {
        let newLocations = locations;
        let locationIndex = newLocations.find(
          location => location._id === locationForUpdate._id
        );

        newLocations.splice(locationIndex, 1, locationForUpdate);
        setLocations(newLocations);
      });
    });
  }, []);

  const getOption = () => {
    let markLine = {
      silent: true,
      data: [
        {
          yAxis: 400,
          lineStyle: {
            color: '#4dbd6c'
          }
        },
        {
          yAxis: 1000,
          lineStyle: {
            color: '#E5DA00'
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
        data: ['Média', 'Máxima']
      },
      xAxis: {
        type: 'category',
        data: locations.map(location => location.name)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Média',
          type: 'bar',
          stack: '0',
          itemStyle: {
            color: '#053F66'
          },
          markLine,
          data: locations.map(location => location.avg)
        },
        {
          name: 'Máxima',
          type: 'bar',
          stack: '0',
          itemStyle: {
            color: ''
          },
          markLine,
          data: locations.map(location => location.max)
        }
      ]
    };
  };

  return (
    <>
      <Card {...rest} className={clsx(classes.root, className)}>
        <CardHeader title="CO² por Ambiente" />
        <Divider />
        <CardContent>
          <div className={classes.chartContainer}>
            <ReactEcharts
              lazyUpdate={true}
              showLoading={!locations.length}
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
      <Detail
        open={detail.active}
        handleToggle={handleToggle}
        title={detail.active && detail.data.name}>
        <>
          <PpmXDevice
            data_loc={[...locations]}
            data={detail.data}
            style={{ margin: '20px' }}
          />
          <ListTable media data_loc={[...locations]} data={detail.data} />
        </>
      </Detail>
    </>
  );
};

PpmXEnvironment.propTypes = {
  className: PropTypes.string
};

export default PpmXEnvironment;
