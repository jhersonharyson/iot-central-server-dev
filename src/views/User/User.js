import {
  Card,
  CardContent,
  IconButton,
  InputBase,
  Paper,
  Typography,
  Fab
} from '@material-ui/core';
import { Search as SearchIcon, Add as AddIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import { UserRegistration, ListTable } from './components';

import { auth } from '../../auth';

const schema = {
  email: {
    presence: { allowEmpty: false, message: 'é obrigatório' },
    email: {
      message: 'informado não é válido'
    },
    length: {
      maximum: 64
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'é obrigatório' },

    length: {
      maximum: 128
    }
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',

    alignItems: 'center',
    backgroundImage: 'url(/images/argo.png)',
    backgroundSize: '',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  bio: {
    color: theme.palette.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    height: '50px'
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  socialButtons: {
    marginTop: theme.spacing(3)
  },
  socialIcon: {
    marginRight: theme.spacing(1)
  },
  sugestion: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  signInButton: {
    margin: theme.spacing(2, 0)
  },
  fab: {
    position: 'fixed',
    bottom: '15px',
    right: '15px'
  }
}));

const User = props => {
  const { history } = props;

  const classes = useStyles();

  const [registration, setRegistration] = useState(false);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  // useEffect(() => {
  //   const verify = setTimeout(async () => {
  //     try {
  //       const response = await auth.askToServer();
  //       if (response) return history.push('/dashboard');
  //     } catch (e) {
  //       setProgressbar(false);
  //     }
  //   }, 3000);

  //   return () => {
  //     clearInterval(verify);
  //     setProgressbar(false);
  //   };
  // }, []);

  const toggleRegistration = () => {
    setRegistration(!registration);
  };

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <div className={classes.root} style={{ padding: '50px' }}>
      <Card>
        <CardContent>
          {registration ? (
            <UserRegistration goBack={toggleRegistration} />
          ) : (
            <>
              {/* <Paper
                className={classes.root}
                style={{
                  paddingLeft: '15px',
                  paddingRight: '15px',
                  display: 'flex'
                }}>
                <InputBase
                  style={{ display: 'flex', flex: 1 }}
                  className={classes.input}
                  placeholder="Pesquisar dispositivos"
                  inputProps={{ 'aria-label': 'Pesquisar dispositivos' }}
                />
                <IconButton className={classes.iconButton} aria-label="search">
                  <SearchIcon />
                </IconButton>
              </Paper> */}
              <div style={{ marginTop: '15px' }}>
                <Typography variant="h4">Lista de usuários</Typography>
                <div style={{ padding: '15px', paddingTop: '25px' }}>
                  <ListTable profile={auth.hasAuthorization()} />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      {!registration && auth.hasAuthorization() && (
        <Fab
          aria-label="add"
          className={classes.fab}
          color="primary"
          onClick={toggleRegistration}>
          <AddIcon />
        </Fab>
      )}
    </div>
  );
};

User.propTypes = {
  history: PropTypes.object
};

export default withRouter(User);
