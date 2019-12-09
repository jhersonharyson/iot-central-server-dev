import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export default function DeviceDrawerDetail(props) {

  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (side, open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [side]: open });
  };

  const sideList = side => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <h2>Valor/Data</h2>
      <List>
        {props.data.map((obj, index) => (
          <ListItem button key={`${obj.date}${index}`}>
            <ListItemText placeholder={'Valor'} primary={obj.value} />
            <ListItemText aria-label={'label'} primary={new Date (obj.createAt).toLocaleString('pt-BR')} />
          </ListItem>
        ))}
      </List>
      <Button onClick={props.closeData}>Fechar</Button>
    </div>
  );

  return (
    <div>
     {/* <Button onClick={toggleDrawer('right', true)}>X</Button>*/}
      <Drawer anchor="right" open={props.data.length != 0} onClose={props.closeDetail}>
        {sideList('right')}
      </Drawer>
    </div>
  );
}
