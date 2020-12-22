import React from 'react';
import { shallow } from 'enzyme';

import { findByTestAttr } from '../../../test/testUtils';

import Routes from './Routes';

test('renders successfully', () => {
  const wrapper = shallow(<Routes />);

  expect(findByTestAttr(wrapper, 'routes-component').length).not.toBe(0);
});
