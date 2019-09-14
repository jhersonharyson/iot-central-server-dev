import { Types } from './index';

const randomHexColor = require('random-hex-color');
const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9].reverse();

export function makeDeviceDataset(devices = [], graphFilter) {
  if (!devices) return {};

  const datasets = devices.map(device => {
    let color = randomHexColor();


    return {
      label: `${device.description} - ${device.location.name}`,
      backgroundColor: color,
      borderColor: color,
      data: device.sensorData.map(sensor => sensor.value),
      fill: false
    };
  });

  return {
    labels: labels.map(num => {
      return num + (
        Types.MINUTES_GRAPH_TYPE === graphFilter ? " m" :
          Types.HOURS_GRAPH_TYPE === graphFilter ? " h" :
            " d"
      )
    }),
    datasets
  }
};

export const options = {
  responsive: true,
  tooltips: {
    mode: 'index',
    intersect: false,
  },
  hover: {
    mode: 'nearest',
    intersect: true
  },
  scales: {
    xAxes: [{
      display: true,
      scaleLabel: {
        display: true,
        labelString: 'Tempo'
      }
    }],
    yAxes: [{
      display: true,
      scaleLabel: {
        display: true,
        labelString: 'CO² (ppm)'
      }
    }]
  }
};
