import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout, PrivateRoute } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  Dashboard as DashboardView,
  Device as DeviceView,
  Environment as EnvironmentView,
  SignIn as SignInView,
  Event as EventView,
  NotFound as NotFoundView,
  User as UserView,
  DashboardDetail as DashboardDetailView
} from './views';

const Routes = () => {
  return (
    <Switch>
      <Redirect exact from="/" to="/sign-in" />
      <PrivateRoute
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/dashboard"
      />
      <PrivateRoute
        component={DashboardDetailView}
        exact
        layout={MainLayout}
        path="/dashboard/:id"
      />
      <PrivateRoute
        component={DeviceView}
        exact
        layout={MainLayout}
        path="/devices"
      />
      <PrivateRoute
        component={EnvironmentView}
        exact
        layout={MainLayout}
        path="/environments"
      />
      <RouteWithLayout
        component={UserView}
        exact
        layout={MainLayout}
        path="/users"
      />
      <RouteWithLayout
        component={EventView}
        exact
        layout={MainLayout}
        path="/events"
      />
      {/*
       <RouteWithLayout
        component={UserListView}
        exact
        layout={MainLayout}
        path="/users"
      />
      <RouteWithLayout
        component={ProductListView}
        exact
        layout={MainLayout}
        path="/products"
      />
      <RouteWithLayout
        component={TypographyView}
        exact
        layout={MainLayout}
        path="/typography"
      />
      <RouteWithLayout
        component={IconsView}
        exact
        layout={MainLayout}
        path="/icons"
      />
      <RouteWithLayout
        component={AccountView}
        exact
        layout={MainLayout}
        path="/account"
      />
      <RouteWithLayout
        component={SettingsView}
        exact
        layout={MainLayout}
        path="/settings"
      />
      <RouteWithLayout
        component={SignUpView}
        exact
        layout={MinimalLayout}
        path="/sign-up"
      /> */}
      <RouteWithLayout
        component={SignInView}
        exact
        layout={MinimalLayout}
        path="/sign-in"
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
