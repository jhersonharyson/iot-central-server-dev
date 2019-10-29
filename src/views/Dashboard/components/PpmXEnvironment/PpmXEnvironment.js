import React, { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, CardContent, CardHeader, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import axios from '../../../../http';
import Socket from '../../../../socket';

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

  let locations = [];
  let graphRef = useRef(null);

  function handleClickBar(e) {
    let { _id } = locations.find(item => item.name === e.name);
    if (_id) {
      props.history.push(`/dashboard/${_id}`);
    }
  }

  useEffect(() => {
    async function getLocation() {
      let authentication = localStorage.getItem('authentication');
      let response = await axios.get('dashboard/location', {
        headers: { authentication }
      });

      locations = response.data;
      locations.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });

      if (graphRef) {
        graphRef
          .getEchartsInstance()
          .setOption({
            xAxis: {
              data: locations.map(item => item.name)
            },
            series: [
              {
                data: locations.map(item => item.avg)
              },
              {
                data: locations.map(item => item.max)
              }
            ]
          }, false);
      }
    }

    getLocation();

    Socket.on('updateLocation', () => getLocation());
    Socket.on('deleteLocation', () => getLocation());
    Socket.on('updateDevice', () => getLocation());
    Socket.on('deleteDevice', () => getLocation());
    Socket.on('redrawLocationGraphic', locationsForUpdate => {
      locationsForUpdate.map(locationForUpdate => {
        let newLocations = locations;
        let locationIndex = newLocations.findIndex(
          location => location._id === locationForUpdate._id
        );

        if (locationIndex > -1) {
          newLocations[locationIndex].max = locationForUpdate.max;
          newLocations[locationIndex].avg = locationForUpdate.avg;
        }
        else {
          newLocations.push(locationForUpdate);
        }

        locations = newLocations;
        locations.sort(function (a, b) {
          return a.name.localeCompare(b.name);
        });

        if (graphRef) {
          graphRef
            .getEchartsInstance()
            .setOption({
              xAxis: {
                data: locations.map(item => item.name)
              },
              series: [
                {
                  data: locations.map(item => item.avg)
                },
                {
                  data: locations.map(item => item.max)
                }
              ]
            }, false);
        }
      });
    });

    return () => {
      Socket.removeListener('updateDevice');
      Socket.removeListener('deleteDevice');
      Socket.removeListener('updateLocation');
      Socket.removeListener('deleteLocation');
      Socket.removeListener('redrawLocationGraphic');
    };
  }, []);

  return (
    <>
      <Card {...rest} className={clsx(classes.root, className)}>
        <CardHeader title="CO² por Ambiente" />
        <Divider />
        <CardContent>
          <div className={classes.chartContainer}>
            <ReactEcharts
              ref={ref => graphRef = ref}
              lazyUpdate={true}
              option={{
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
                    markLine: {
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
                    }
                  },
                  {
                    name: 'Máxima',
                    type: 'bar',
                    stack: '0',
                    itemStyle: {
                      color: ''
                    },
                    markLine: {
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
                    }
                  }
                ]
              }}
              onEvents={{
                click: handleClickBar
              }}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

PpmXEnvironment.propTypes = {
  className: PropTypes.string
};

export default withRouter(PpmXEnvironment);
