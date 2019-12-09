import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  LinearProgress,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import ptBRLocale from 'date-fns/locale/pt-BR';
import InsertChartIcon from '@material-ui/icons/InsertChartOutlined';
import axios from '../../../../http';
import Socket from '../../../../socket';
import Dots from 'react-activity/lib/Dots';
import 'react-activity/lib/Dots/Dots.css';
const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  progress: {
    marginTop: theme.spacing(3)
  },
  gridFormControl: {
    marginTop: theme.spacing(3)
  },
  containerPicker: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControlPicker: {
    margin: theme.spacing(1)
  }
}));

const TasksProgress = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const [events, setEvents] = useState(null);
  const [minDate, setMinDate] = useState(Date.now() - 60 * 1000 * 60 * 24);
  const [openValue, setOpenValue] = React.useState(24);
  const [open, setOpen] = React.useState(false);
  const [picker, setPicker] = React.useState({
    open: false,
    iniDate: null,
    fimDate: null
  });

  const handlePickerChange = name => date => {
    setPicker({ ...picker, [name]: Date.parse(date) });
  };

  const handlePickerClickOpen = () => {
    setPicker({ ...picker, open: true });
  };

  const handlePickerClose = (save = false) => () => {
    if (save) {
      let [dtInicio, dtFim] = [moment(picker.iniDate), moment(picker.fimDate)];
      let diff = dtFim.diff(dtInicio, 'hours');

      setMinDate(Date.now() - 60 * 1000 * 60 * Math.abs(diff));
    }

    setPicker({ ...picker, open: false });
  };

  const handleChange = event => {
    if (!event.target.value)
      return setMinDate(Date.now() - 60 * 1000 * 60 * 24);

    setOpenValue(event.target.value);
    if (event.target.value === 'Personalizado') {
      handlePickerClickOpen();
    } else {
      return setMinDate(
        parseInt(Date.now() - event.target.value * 60 * 1000 * 60)
      );
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    async function getEvents() {
      setEvents(null);
      const interval = minDate || Date.now() - 60 * 1000 * 60 * 24;
      let authentication = await localStorage.getItem('authentication');
      let response = await axios.get('events/interval/' + interval, {
        headers: { authentication }
      });

      let { events_counter } = response.data;
      setEvents(events_counter);
    }

    getEvents();
    Socket.on('postEvent', () => getEvents());
    return () => {
      Socket.removeListener('postEvent');
    };
  }, [minDate]);

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
        >
          <Grid item>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
              variant="body2"
            >
              EVENTOS DE ALERTA
            </Typography>
            {events === null ? (
              <Dots />
            ) : (
              <Typography variant="h3">{events}</Typography>
            )}
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <InsertChartIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
        <Grid
          className={classes.gridFormControl}
          container
          justify="space-between"
        >
          <FormControl>
            <Select
              onChange={handleChange}
              onClose={handleClose}
              onOpen={handleOpen}
              open={open}
              value={openValue}
            >
              <MenuItem value={12}>Últimas 12 horas</MenuItem>
              <MenuItem value={24}>Últimas 24 horas</MenuItem>
              <MenuItem value={48}>Últimas 48 horas</MenuItem>
              <MenuItem value={'Personalizado'}>Personalizado</MenuItem>
            </Select>
          </FormControl>
          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            onClose={handlePickerClose}
            open={picker.open}
          >
            <DialogTitle>Digite o intervalo personalizado</DialogTitle>
            <DialogContent>
              <MuiPickersUtilsProvider
                locale={ptBRLocale}
                utils={DateFnsUtils}
              >
                <Grid
                  container
                  justify="space-around"
                >
                  <DateTimePicker
                    ampm={false}
                    autoOk
                    className={classes.formControlPicker}
                    disableFuture
                    label="Data inicial"
                    onChange={handlePickerChange('iniDate')}
                    value={picker.iniDate}
                    variant="inline"
                  />
                </Grid>
                <Grid
                  container
                  justify="space-around"
                >
                  <DateTimePicker
                    ampm={false}
                    autoOk
                    className={classes.formControlPicker}
                    disableFuture
                    label="Data Final"
                    onChange={handlePickerChange('fimDate')}
                    value={picker.fimDate}
                    variant="inline"
                  />
                </Grid>
              </MuiPickersUtilsProvider>
            </DialogContent>
            <DialogActions>
              <Button
                color="primary"
                onClick={handlePickerClose()}
              >
                Cancelar
              </Button>
              <Button
                color="primary"
                onClick={handlePickerClose(true)}
              >
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </CardContent>
    </Card>
  );
};

TasksProgress.propTypes = {
  className: PropTypes.string
};

export default TasksProgress;
