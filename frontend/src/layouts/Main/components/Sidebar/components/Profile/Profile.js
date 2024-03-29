import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography } from '@material-ui/core';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import { auth } from '../../../../../../auth';
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 60,
    height: 60,
    color: '#fff',
    backgroundColor: [deepOrange[500], deepPurple[500]][
      Math.floor(Math.random() * 2)
    ]
  },
  name: {
    marginTop: theme.spacing(1)
  }
}));

const Profile = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const user = {
    name: `${auth.user_name}`.toUpperCase(),
    avatar: '/images/avatars/avatar_11.png',
    bio: `${auth.user_email}`.toLowerCase()
  };

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Avatar
        alt="Person"
        className={classes.avatar}
        component={RouterLink}
        to="/settings">
        {auth.user_name &&
          (auth.user_name[0] + auth.user_name[1]).toUpperCase()}
      </Avatar>
      <Typography className={classes.name} variant="h4">
        {user.name}
      </Typography>
      <Typography variant="body2">{user.bio}</Typography>
    </div>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
