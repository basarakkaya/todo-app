import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';

import { findByTestAttr, storeFactory } from '../../../test/testUtils';

import PrivateRoute from './PrivateRoute';

const setup = (state = {}) => {
  const store = storeFactory(state);
  const wrapper = mount(
    <BrowserRouter>
      <PrivateRoute store={store} component={() => <div />} />
    </BrowserRouter>
  );
  return wrapper;
};

test('renders component if authenticated', () => {
  const wrapper = setup({
    auth: {
      isAuthenticated: true,
      loading: false,
    },
  });

  const childComponent = findByTestAttr(wrapper, 'private-route-child');
  const redirectComponent = findByTestAttr(wrapper, 'private-route-redirect');

  expect(childComponent.length).not.toBe(0);
  expect(redirectComponent.length).toBe(0);
});

test('returns redirect to login page if not authenticated', () => {
  const wrapper = setup({
    auth: {
      isAuthenticated: false,
      loading: false,
    },
  });

  const childComponent = findByTestAttr(wrapper, 'private-route-child');
  const redirectComponent = findByTestAttr(wrapper, 'private-route-redirect');

  expect(childComponent.length).toBe(0);
  expect(redirectComponent.length).not.toBe(0);
});
