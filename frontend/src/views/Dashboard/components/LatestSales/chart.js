import { Types } from './index';
import randomHexColor from 'random-hex-color';
import palette from 'theme/palette';

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
      return (
        num +
        (Types.MINUTES_GRAPH_TYPE === graphFilter
          ? ' m'
          : Types.HOURS_GRAPH_TYPE === graphFilter
          ? ' h'
          : ' d')
      );
    }),
    datasets
  };
}

export const options = {
  responsive: true,
  tooltips: {
    mode: 'index',
    intersect: false
  },
  hover: {
    mode: 'nearest',
    intersect: true
  },
  scales: {
    xAxes: [
      {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Tempo'
        }
      }
    ],
    yAxes: [
      {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'CO² (ppm)'
        }
      }
    ]
  }
};

export const dataG = {
  labels: ['1 Aug', '2 Aug', '3 Aug', '4 Aug', '5 Aug', '6 Aug'],
  datasets: [
    {
      label: 'This year',
      backgroundColor: palette.primary.main,
      data: [18, 5, 19, 27, 29, 19, 20]
    },
    {
      label: 'Last year',
      backgroundColor: palette.neutral,
      data: [11, 20, 12, 29, 30, 25, 13]
    }
  ]
};

export const optionsG = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  legend: { display: false },
  cornerRadius: 20,
  tooltips: {
    enabled: true,
    mode: 'index',
    intersect: false,
    borderWidth: 1,
    borderColor: palette.divider,
    backgroundColor: palette.white,
    titleFontColor: palette.text.primary,
    bodyFontColor: palette.text.secondary,
    footerFontColor: palette.text.secondary
  },
  layout: { padding: 0 },
  scales: {
    xAxes: [
      {
        barThickness: 12,
        maxBarThickness: 10,
        barPercentage: 0.5,
        categoryPercentage: 0.5,
        ticks: {
          fontColor: palette.text.secondary
        },
        gridLines: {
          display: false,
          drawBorder: false
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          fontColor: palette.text.secondary,
          beginAtZero: true,
          min: 0
        },
        gridLines: {
          borderDash: [2],
          borderDashOffset: [2],
          color: palette.divider,
          drawBorder: false,
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
          zeroLineColor: palette.divider
        }
      }
    ]
  }
};
