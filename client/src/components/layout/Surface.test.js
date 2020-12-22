import React from 'react';
import { shallow } from 'enzyme';

import { findByTestAttr } from '../../../test/testUtils';

import Surface from './Surface';

test('renders without error', () => {
  expect(findByTestAttr(shallow(<Surface />), 'component-surface').length).toBe(
    1
  );
});
