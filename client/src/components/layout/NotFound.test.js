import React from 'react';
import { shallow } from 'enzyme';

import { findByTestAttr } from '../../../test/testUtils';

import NotFound from './NotFound';

test('renders without error', () => {
  expect(
    findByTestAttr(shallow(<NotFound />), 'component-not-found').length
  ).toBe(1);
});

test('renders not found message correctly', () => {
  expect(
    findByTestAttr(shallow(<NotFound />), 'not-found-error-message').length
  ).toBe(1);
});

test('renders homepage link correctly', () => {
  expect(
    findByTestAttr(shallow(<NotFound />), 'not-found-homepage-link').length
  ).toBe(1);
});
