import React from 'react';
import { shallow } from 'enzyme';

import { findByTestAttr, storeFactory } from '../../../test/testUtils';

import Login, { UnconnectedLogin } from './Login';

const initialState = {
  auth: {
    isAuthenticated: false,
    loading: true,
  },
};

const setup = (state = initialState) => {
  const store = storeFactory(state);
  const wrapper = shallow(<Login store={store} />)
    .dive()
    .dive();

  return wrapper;
};

describe('render', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = setup();
  });

  test('component renders without error if not authenticated', () => {
    const component = findByTestAttr(wrapper, 'component-login');

    expect(component.length).toBe(1);
  });

  test('renders email input without error if not authenticated', () => {
    const emailInput = findByTestAttr(wrapper, 'login-email');

    expect(emailInput.length).toBe(1);
  });

  test('renders password input without error if not authenticated', () => {
    const passwordInput = findByTestAttr(wrapper, 'login-password');

    expect(passwordInput.length).toBe(1);
  });

  test('renders login button without error if not authenticated', () => {
    const button = findByTestAttr(wrapper, 'login-button');

    expect(button.length).toBe(1);
  });
});

test('redirects to home if authenticated', () => {
  const wrapper = setup({
    auth: {
      isAuthenticated: true,
      loading: false,
    },
  });
  const component = findByTestAttr(wrapper, 'component-login');
  const redirector = findByTestAttr(wrapper, 'login-redirect');

  expect(component.length).toBe(0);
  expect(redirector.length).toBe(1);
});

describe('login action', () => {
  let mockLogin;
  let wrapper;
  let loginButton;

  beforeEach(() => {
    mockLogin = jest.fn();
    wrapper = shallow(<UnconnectedLogin login={mockLogin} />);
    loginButton = findByTestAttr(wrapper, 'login-button');
  });

  test('login action is called when clicked to login button', () => {
    loginButton.simulate('click', { preventDefault() {} });

    expect(mockLogin.mock.calls.length).toBe(1);
  });

  test('login action is called with correct arguments hen clicked to login button', () => {
    const mockState = {
      email: 'test@test.com',
      password: '123456',
    };
    wrapper.setState(mockState);

    loginButton.simulate('click', { preventDefault() {} });

    expect(mockLogin.mock.calls[0][0]).toEqual(mockState);
  });
});
