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
import {
  MuiPickersUtilsProvider,
  DateTimePicker
} from '@material-ui/pickers';
import ptBRLocale from "date-fns/locale/pt-BR";
import InsertChartIcon from '@material-ui/icons/InsertChartOutlined';
import axios from '../../../../http';
import Socket from '../../../../socket';
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
    marginTop: theme.spacing(3),
  },
  containerPicker: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControlPicker: {
    margin: theme.spacing(1)
  },
}));

const TasksProgress = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const [events, setEvents] = useState(undefined);
  const [minDate, setMinDate] = useState(Date.now() - 60 * 1000 * 60 * 24);
  const [openValue, setOpenValue] = React.useState(24);
  const [open, setOpen] = React.useState(false);
  const [picker, setPicker] = React.useState({
    open: false,
    iniDate: null,
    fimDate: null,
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
    async function getDevices() {
      const interval = minDate || Date.now() - 60 * 1000 * 60 * 24;
      let authentication = await localStorage.getItem('authentication');
      let response = await axios.get('events/interval/' + interval, {
        headers: { authentication }
      });

      let { events_counter } = response.data;
      setEvents(events_counter);
    }

    getDevices();
    Socket.on('postEvent', () => getDevices());
  }, [minDate]);

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
              EVENTOS DE ALERTA
            </Typography>
            <Typography variant="h3">{events}</Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <InsertChartIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
        <Grid className={classes.gridFormControl} container justify="space-between">
          <InputLabel htmlFor="evento-intervalo">Ocorrências nas ultimas</InputLabel>
          <FormControl>
            <Select
              open={open}
              onClose={handleClose}
              onOpen={handleOpen}
              value={openValue}
              onChange={handleChange}
              inputProps={{
                id: "evento-intervalo"
              }}
            >
              <MenuItem value={12}>12 horas</MenuItem>
              <MenuItem value={24}>24 horas</MenuItem>
              <MenuItem value={48}>48 horas</MenuItem>
              <MenuItem value={'Personalizado'}>Personalizado</MenuItem>
            </Select>
          </FormControl>
          <Dialog disableBackdropClick disableEscapeKeyDown open={picker.open} onClose={handlePickerClose}>
            <DialogTitle>Digite o intervalo personalizado para busca dos Eventos</DialogTitle>
            <DialogContent>
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBRLocale}>
                <Grid container justify="space-around">
                  <DateTimePicker
                    className={classes.formControlPicker}
                    autoOk
                    ampm={false}
                    disableFuture
                    variant="inline"
                    label="Data inicial"
                    value={picker.iniDate}
                    onChange={handlePickerChange('iniDate')}
                  />
                </Grid>
                <Grid container justify="space-around">
                  <DateTimePicker
                    className={classes.formControlPicker}
                    autoOk
                    ampm={false}
                    disableFuture
                    variant="inline"
                    label="Data Final"
                    value={picker.fimDate}
                    onChange={handlePickerChange('fimDate')}
                  />
                </Grid>
              </MuiPickersUtilsProvider>
            </DialogContent>
            <DialogActions>
              <Button onClick={handlePickerClose()} color="primary">
                Cancelar
              </Button>
              <Button onClick={handlePickerClose(true)} color="primary">
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
