import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar, Switch } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import MoneyIcon from '@material-ui/icons/Money';

const useStyles = makeStyles(theme => ({
  root: {
  },
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

const Budget = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const [inflador, setInflador] = React.useState({});
  const onInfladorSwitchChange = event => {
    setInflador({ value: event.target.checked })
  }

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
              INFLADOR
            </Typography>
            <Typography variant="h3">
              {inflador.value ? 'Ligado' : 'Desligado'}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <MoneyIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
        <div className={classes.difference}>
          <Switch
            checked={inflador.value}
            onChange={onInfladorSwitchChange}
          />
          <Typography
            className={classes.caption}
            variant="caption"
          >
            Último registro: 14/09/2019
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

Budget.propTypes = {
  className: PropTypes.string
};

export default Budget;
