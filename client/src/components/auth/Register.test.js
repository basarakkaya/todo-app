import React from 'react';
import { shallow } from 'enzyme';

import { findByTestAttr, storeFactory } from '../../../test/testUtils';

import Register, { UnconnectedRegister } from './Register';

const initialState = {
  auth: {
    isAuthenticated: false,
    loading: true,
  },
};

const setup = (state = initialState) => {
  const store = storeFactory(state);
  const wrapper = shallow(<Register store={store} />)
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
    const component = findByTestAttr(wrapper, 'component-register');

    expect(component.length).toBe(1);
  });

  test('renders name input without error if not authenticated', () => {
    const nameInput = findByTestAttr(wrapper, 'register-name');

    expect(nameInput.length).toBe(1);
  });

  test('renders email input without error if not authenticated', () => {
    const emailInput = findByTestAttr(wrapper, 'register-email');

    expect(emailInput.length).toBe(1);
  });

  test('renders password input without error if not authenticated', () => {
    const passwordInput = findByTestAttr(wrapper, 'register-password');

    expect(passwordInput.length).toBe(1);
  });

  test('renders register button without error if not authenticated', () => {
    const button = findByTestAttr(wrapper, 'register-button');

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
  const component = findByTestAttr(wrapper, 'component-register');
  const redirector = findByTestAttr(wrapper, 'register-redirect');

  expect(component.length).toBe(0);
  expect(redirector.length).toBe(1);
});

describe('register action', () => {
  let mockRegister;
  let wrapper;
  let registerButton;

  beforeEach(() => {
    mockRegister = jest.fn();
    wrapper = shallow(<UnconnectedRegister register={mockRegister} />);
    registerButton = findByTestAttr(wrapper, 'register-button');
  });

  test('register action is called when clicked to login button', () => {
    registerButton.simulate('click', { preventDefault() {} });

    expect(mockRegister.mock.calls.length).toBe(1);
  });

  test('register action is called with correct arguments hen clicked to register button', () => {
    const mockState = {
      name: 'Test Test',
      email: 'test@test.com',
      password: '123456',
    };
    wrapper.setState(mockState);

    registerButton.simulate('click', { preventDefault() {} });

    expect(mockRegister.mock.calls[0][0]).toEqual(mockState);
  });
});
