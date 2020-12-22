import React from 'react';
import { shallow } from 'enzyme';

import {
  findByTestAttr,
  checkProps,
  storeFactory,
} from '../../../test/testUtils';

import Navbar from './Navbar';

const initialState = {
  auth: {
    isAuthenticated: false,
    loading: true,
  },
};

const setup = (state = initialState) => {
  const store = storeFactory(state);
  const wrapper = shallow(<Navbar store={store} />)
    .dive()
    .dive();

  return wrapper;
};

test('navbar renders without error', () => {
  const wrapper = setup();
  const component = findByTestAttr(wrapper, 'component-navbar');

  expect(component.length).toBe(1);
});

test('renders brand without error', () => {
  const wrapper = setup();
  const brand = findByTestAttr(wrapper, 'navbar-brand');

  expect(brand.length).toBe(1);
});

test('guest links are rendered without error when not authenticated', () => {
  const wrapper = setup({ auth: { isAuthenticated: false, loading: false } });
  const guestLinks = findByTestAttr(wrapper, 'navbar-guest-links');
  const authLinks = findByTestAttr(wrapper, 'navbar-auth-links');

  expect(guestLinks.length).not.toBe(0);
  expect(authLinks.length).toBe(0);
});

test('auth links are rendered without error when authenticated', () => {
  const wrapper = setup({ auth: { isAuthenticated: true, loading: false } });
  const authLinks = findByTestAttr(wrapper, 'navbar-auth-links');
  const guestLinks = findByTestAttr(wrapper, 'navbar-guest-links');

  expect(authLinks.length).not.toBe(0);
  expect(guestLinks.length).toBe(0);
});

test('does not render any link while loading', () => {
  const wrapper = setup({ auth: { isAuthenticated: false, loading: true } });
  const authLinks = findByTestAttr(wrapper, 'navbar-auth-links');
  const guestLinks = findByTestAttr(wrapper, 'navbar-guest-links');

  expect(authLinks.children().length).toBe(0);
  expect(guestLinks.children().length).toBe(0);
});

test('check proptypes', () => {
  checkProps(Navbar, {
    auth: { isAuthenticated: false, loading: true },
    logout: () => {},
  });
});
