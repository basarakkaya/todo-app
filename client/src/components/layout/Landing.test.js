import React from 'react';
import { shallow } from 'enzyme';

import { findByTestAttr, storeFactory } from '../../../test/testUtils';

import Landing from './Landing';

const initialState = {
  auth: {
    isAuthenticated: false,
    loading: true,
  },
};

const setup = (state = initialState) => {
  const store = storeFactory(state);
  const wrapper = shallow(<Landing store={store} />)
    .dive()
    .dive();

  return wrapper;
};

test('renders component correctly, if not authenticated', () => {
  const wrapper = setup();
  const component = findByTestAttr(wrapper, 'component-landing');

  expect(component.length).toBe(1);
});

test('renders login redirect button correctly', () => {
  const wrapper = setup();
  const component = findByTestAttr(wrapper, 'landing-login-link');

  expect(component.length).toBe(1);
});

test('renders register redirect button correctly', () => {
  const wrapper = setup();
  const component = findByTestAttr(wrapper, 'landing-register-link');

  expect(component.length).toBe(1);
});

test('redirects to lists if authenticated', () => {
  const wrapper = setup({
    auth: {
      isAuthenticated: true,
      loading: false,
    },
  });
  const component = findByTestAttr(wrapper, 'component-landing');
  const redirector = findByTestAttr(wrapper, 'landing-redirect');

  expect(component.length).toBe(0);
  expect(redirector.length).toBe(1);
});
