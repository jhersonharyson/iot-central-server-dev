import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/styles';
import { useMediaQuery, Typography } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from '../../http';
import Socket from '../../socket';
import { Sidebar, Topbar } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 56,
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      paddingTop: 64
    }
  },
  shiftContent: {
    paddingLeft: 240
  },
  content: {
    height: '100%'
  }
}));

const Main = props => {
  const { children } = props;

  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  });

  const [openSidebar, setOpenSidebar] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarFeedback, setSnackbarFeedback] = useState(null);

  let interval = null;

  React.useEffect(() => {
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const shouldOpenSidebar = isDesktop ? true : openSidebar;
  Socket.on('postEvent', async data => {
    const headers = {
      authentication: localStorage.getItem('authentication')
    };

    console.log(data);

    try {
      let response = await axios.get(`sensors/${data.sensor._id}`, {
        headers
      });

      const {
        data: { sensor }
      } = response;
      console.log(sensor);

      setSnackbarFeedback({
        location: `${sensor.location.name} - ${sensor.location.description}`.toUpperCase(),
        device: `${sensor.deviceId.name} - ${sensor.deviceId.mac}`.toUpperCase(),
        label:
          sensor.value >= 2000
            ? sensor.value >= 5000
              ? 'RISCO DE VIDA'
              : 'NÍVEL CRÍTICO'
            : 'NÍVEL ACIMA DO NORMAL'
      });
      setOpenSnackbar(true);
      beep(100, 500, 500, 4, 1000);
    } catch (e) {}
    // browsers limit the number of concurrent audio contexts, so you better re-use'em
  });

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop
      })}>
      <Topbar onSidebarOpen={handleSidebarOpen} />
      <Sidebar
        onClose={handleSidebarClose}
        open={shouldOpenSidebar}
        variant={isDesktop ? 'persistent' : 'temporary'}
      />
      <main className={classes.content}>{children}</main>

      <Dialog
        open={openSnackbar}
        disableBackdropClick
        onClose={() => {
          clearInterval(interval);
          setOpenSnackbar(false);
        }}
        aria-labelledby="responsive-dialog-title">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <div style={{ padding: '15px', minWidth: '300px' }}>
            <Typography variant="h4" style={{ alignSelf: 'flex-start' }}>
              ALERTA
            </Typography>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '25px'
              }}>
              <WarningRoundedIcon
                style={{ fontSize: '96px', color: '#e4ae5ce0' }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <Typography
                variant="h2"
                style={{ marginBottom: '25px', fontWeight: 'bolder' }}>
                {snackbarFeedback && snackbarFeedback['label']}
              </Typography>
              <Typography variant="h5">
                {snackbarFeedback && snackbarFeedback['location']}
              </Typography>
              <Typography variant="h6">
                {snackbarFeedback && snackbarFeedback['device']}
              </Typography>
            </div>
            <Button
              fullWidth
              variant="outlined"
              style={{ marginTop: '25px' }}
              onClick={() => {
                clearInterval(interval);
                setOpenSnackbar(false);
              }}
              color="primary"
              autoFocus>
              FECHAR
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

const Snack = ({ open, onClose, message }) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      open={open}
      autoHideDuration={10 * 60 * 1000}
      onClose={onClose}
      ContentProps={{
        'aria-describedby': 'message-id'
      }}
      message={
        <div>
          <span id="message-id" style={{ color: 'yellow', fontSize: 14 }}>
            ALERTA{'    '}
          </span>
          <span>{message}</span>
        </div>
      }
      action={[
        <IconButton
          key="close"
          aria-label="close"
          color="inherit"
          onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ]}
    />
  );
};

const beep = (vol, freq, duration, times, interval = 1) => {
  new Array(times).fill(1).forEach(async (f, i) => {
    const a = new AudioContext();
    let u = a.createGain();
    let v = a.createOscillator();
    v.frequency.value = freq;
    v.connect(u);
    u.connect(a.destination);
    v.type = 'square';
    await setTimeout(() => {
      v.start(a.currentTime);
      u.gain.value = vol * 0.01;
      v.stop(a.currentTime + duration * 0.001);
    }, interval * (i + 1));
  });
};

Main.propTypes = {
  children: PropTypes.node
};

export default Main;
