import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { auth } from '../../auth';

export default function PrivateRoute({
  component: Component,
  layout: Layout,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={props =>
        auth.isAuthenticated() ? (
          <Layout>
            <Component {...props} />
          </Layout>
        ) : (
          <Redirect
            to={{ path: '/sign-in', state: { from: props.location } }}
          />
        )
      }
    />
  );
}

PrivateRoute.propType = {
  component: PropTypes.node.isRequired
};

PrivateRoute.defaultProps = {
  menssage: 'hellow'
};
