import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Routes from './components/routing/Routes';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';

import { loadUser } from './actions/auth';

export const UnconnectedApp = ({ loadUser }) => {
  React.useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <div data-test='app'>
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path='/' component={Landing} />
          <Route component={Routes} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default connect(null, { loadUser })(UnconnectedApp);
