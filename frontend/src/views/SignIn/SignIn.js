import {
  Button,
  Grid,
  Link,
  TextField,
  Typography,
  LinearProgress
} from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import validate from 'validate.js';
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
  }
}));

const SignIn = props => {
  const { history } = props;

  const classes = useStyles();

  const [snackbar, setSnackbar] = useState(false);
  const [progressbar, setProgressbar] = useState(true);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  useEffect(() => {
    const verify = setTimeout(async () => {
      try {
        const response = await auth.askToServer();
        if (response) return history.push('/dashboard');
      } catch (e) {
        setProgressbar(false);
      }
    }, 3000);

    return () => {
      clearInterval(verify);
      setProgressbar(false);
    };
  }, []);

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

  const handleSignIn = async event => {
    event.preventDefault();
    auth.password = formState.values.password;
    auth.user = formState.values.email;
    auth.login(
      () => history.push('/dashboard'),
      () => {
        setSnackbar(true);
        setProgressbar(false);
      }
    );
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <div className={classes.root}>
      <Grid className={classes.grid} container>
        <Grid className={classes.quoteContainer} item lg={5}>
          <div className={classes.quote}>
            {/* <div className={classes.quoteInner}>
              <Typography className={classes.quoteText} variant="h1">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt...
              </Typography>
              <div className={classes.person}>
                <Typography className={classes.name} variant="body1">
                  Lorem ipsum
                </Typography>
                <Typography className={classes.bio} variant="body2">
                  Lorem ipsum dolor
                </Typography>
              </div>
            </div> */}
          </div>
        </Grid>
        <Grid className={classes.content} item lg={7} xs={12}>
          <div className={classes.content}>
            <div className={classes.contentHeader} />
            <div className={classes.contentBody}>
              <form className={classes.form} onSubmit={handleSignIn}>
                <Typography className={classes.title} variant="h2">
                  Entrar
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Entrar no SYCCOO
                </Typography>
                <TextField
                  className={classes.textField}
                  error={hasError('email')}
                  fullWidth
                  helperText={
                    hasError('email') ? formState.errors.email[0] : null
                  }
                  label="Email"
                  name="email"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.email || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('password')}
                  fullWidth
                  helperText={
                    hasError('password') ? formState.errors.password[0] : null
                  }
                  label="Senha"
                  name="password"
                  onChange={handleChange}
                  type="password"
                  value={formState.values.password || ''}
                  variant="outlined"
                />
                <Button
                  className={classes.signInButton}
                  color="primary"
                  disabled={!formState.isValid}
                  fullWidth
                  onClick={() => setProgressbar(true)}
                  size="large"
                  type="submit"
                  variant="contained">
                  Entrar agora
                </Button>
                <LinearProgress
                  variant={progressbar ? 'indeterminate' : 'determinate'}
                  value={0}
                  size={50}
                  thickness={20}
                />

                <Typography color="textSecondary" variant="body1">
                  Esqueceu a senha?{' '}
                  <Link component={RouterLink} to="/sign-up" variant="h6">
                    Recuperar
                  </Link>
                </Typography>
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={snackbar}
        autoHideDuration={6000}
        onClose={() => setSnackbar(false)}
        ContentProps={{
          'aria-describedby': 'message-id'
        }}
        message={<span id="message-id">Erro ao entrar no sistema</span>}
      />
    </div>
  );
};

SignIn.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignIn);
