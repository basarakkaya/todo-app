import React from 'react';
import { shallow, mount } from 'enzyme';

import { findByTestAttr } from '../test/testUtils';

import { UnconnectedApp } from './App';

test('renders app without error', () => {
  const component = findByTestAttr(shallow(<UnconnectedApp />), 'app');
  expect(component.length).toBe(1);
});

test('calls loadUser when app component is mounted', () => {
  const mockLoadUser = jest.fn();

  mount(<UnconnectedApp loadUser={mockLoadUser} />);

  expect(mockLoadUser.mock.calls.length).toBe(1);
});
