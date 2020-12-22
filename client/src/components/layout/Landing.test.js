import React from 'react';
import { shallow } from 'enzyme';

import { findByTestAttr } from '../../../test/testUtils';

import Landing from './Landing';

test('renders component correctly', () => {
  expect(findByTestAttr(shallow(<Landing />), 'component-landing').length).toBe(
    1
  );
});

test('renders login redirect button correctly', () => {
  expect(
    findByTestAttr(shallow(<Landing />), 'landing-login-link').length
  ).toBe(1);
});

test('renders register redirect button correctly', () => {
  expect(
    findByTestAttr(shallow(<Landing />), 'landing-register-link').length
  ).toBe(1);
});
