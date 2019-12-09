import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Switch,
  Typography
} from '@material-ui/core';
import WorkIcon from '@material-ui/icons/Work';
import { makeStyles, withStyles } from '@material-ui/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import axios from './../../../../http';
import Socket from './../../../../socket';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: theme.palette.error.main,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  difference: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  differenceIcon: {
    color: theme.palette.error.dark
  },
  differenceValue: {
    color: theme.palette.error.dark,
    marginRight: theme.spacing(1)
  }
}));

// const Switcher = withStyles({
//   switchBase: {
//     color: purple[300],
//     '&$checked': {
//       color: purple[500],
//     },
//     '&$checked + $track': {
//       backgroundColor: purple[500],
//     },
//   },
//   checked: {},
//   track: {},
// })(Switch);

const Budget = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const [inflador, setInflador] = React.useState({ value: false });
  React.useEffect(() => {
    async function getInflador() {
      const headers = {
        authentication: await localStorage.getItem('authentication')
      };
      const response = await axios.get('actuators/INFLADOR', { headers });

      if (response.data[0]) {
        setInflador(response.data[0]);
      }
    }

    getInflador();
    Socket.on('postActuator', () => getInflador());
  }, []);

  const onInfladorSwitchChange = async event => {
    const headers = {
      authentication: await localStorage.getItem('authentication')
    };
    const atuador = {
      type: 'INFLADOR',
      value: !inflador.value
    };

    const response = await axios.post('actuators', atuador, { headers });
    if (response) {
      setInflador(response.data);
    }
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent>
        <Grid container justify="space-between">
          <Grid item>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
              variant="body2">
              INFLADOR
            </Typography>
            <Typography variant="h3">
              {inflador.value ? 'Ligado' : 'Desligado'}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <WorkIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
        <div className={classes.difference}>
          <Switch checked={inflador.value} onChange={onInfladorSwitchChange} />
          <Typography className={classes.caption} variant="body2">
            Último registro:{' '}
            {inflador.createAt && new Date(inflador.createAt).toLocaleString()}
          </Typography>
        </div>
        <br />
      </CardContent>
    </Card>
  );
};

Budget.propTypes = {
  className: PropTypes.string
};

export default Budget;
