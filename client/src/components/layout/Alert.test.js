import React from 'react';
import { shallow } from 'enzyme';

import { findByTestAttr, storeFactory } from '../../../test/testUtils';

import Alert from './Alert';

const setup = (state = {}) => {
  const store = storeFactory(state);
  const wrapper = shallow(<Alert store={store} />)
    .dive()
    .dive();

  return wrapper;
};

test('renders alert container without error', () => {
  const wrapper = setup();
  const component = findByTestAttr(wrapper, 'component-alert');

  expect(component.length).toBe(1);
});

test('renders alert without error, if alert state is not empty', () => {
  const wrapper = setup({
    alert: [{ id: '1234', alertType: 'danger', msg: 'Test' }],
  });
  const item = findByTestAttr(wrapper, 'alert-item');

  expect(item.length).not.toBe(0);
});

test('does not render any alert if alert state is empty', () => {
  const wrapper = setup();
  const item = findByTestAttr(wrapper, 'alert-item');

  expect(item.length).toBe(0);
});

test('renders correct number of alerts', () => {
  const wrapper = setup({
    alert: [
      { id: '1234', alertType: 'danger', msg: 'Test' },
      { id: '12345', alertType: 'danger', msg: 'Test2' },
    ],
  });
  const item = findByTestAttr(wrapper, 'alert-item');

  expect(item.length).toBe(2);
});
