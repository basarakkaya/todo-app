import React from 'react';
import { Switch, Route } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';

import Surface from '../layout/Surface';
import Alert from '../layout/Alert';

import Register from '../auth/Register';
import Login from '../auth/Login';

import Lists from '../lists/Lists';
import List from '../list/List';

const Routes = () => {
  return (
    <Surface data-test='routes-component'>
      <Alert />
      <Switch>
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
        <PrivateRoute exact path='/lists' component={Lists} />
        <PrivateRoute exact path='/list/:id' component={List} />
      </Switch>
    </Surface>
  );
};

export default Routes;
