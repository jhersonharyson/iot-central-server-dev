import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    boxShadow: 'none'
  }
}));

const Topbar = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
      color="primary"
      position="fixed"
    >
      <Toolbar>
        <RouterLink to="/">
        <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <img
              alt="Logo"
              src="/images/logos/Argo.png"
              width={48}
              style={{ marginLeft: 10 }}
            />
            <Typography
              component="h1"
              style={{ marginLeft: 15, color: '#fff', fontSize: 18 }}>
              CESUPA
            </Typography>
          </div>
        </RouterLink>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string
};

export default Topbar;
