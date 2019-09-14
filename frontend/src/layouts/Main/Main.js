import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/styles';
import { useMediaQuery } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
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

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  //setTimeout(() => setOpenSnackbar(true), 10000);

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const shouldOpenSidebar = isDesktop ? true : openSidebar;
  Socket.on('postEvent', data => {
    setSnackbarFeedback(data.description);
    setOpenSnackbar(true);
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
      <Snack
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarFeedback}
      />
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

Main.propTypes = {
  children: PropTypes.node
};

export default Main;
