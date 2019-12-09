import {
  AppBar,
  Button,
  Dialog,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  Slide
} from '@material-ui/core';
import React from 'react';
import { Close as CloseIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Details(props) {
  const classes = useStyles();

  const { open, handleToggle, children, title } = props;
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleToggle}
      TransitionComponent={Transition}
      style={{ paddingTop: '65px' }}>
      <AppBar>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography style={{ color: '#fff' }} variant="h4">
            {title}
          </Typography>
          <Button color="inherit" onClick={handleToggle}>
            <CloseIcon />
          </Button>
        </Toolbar>
      </AppBar>
      <div style={{ overflow: 'auto', padding: '30px' }}>{children}</div>
    </Dialog>
  );
}
