import React from 'react';
import { shallow } from 'enzyme';

import { findByTestAttr } from '../../../test/testUtils';

import ListItem from './ListItem';

const initialProps = {
  list: {
    _id: '1234',
    name: 'Test list',
    description: 'Test description',
  },
};

const setup = (props = {}) => {
  return shallow(<ListItem {...props} />);
};

describe('render', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = setup(initialProps);
  });

  test('renders without error', () => {
    const component = findByTestAttr(wrapper, 'component-list-item');

    expect(component.length).toBe(1);
  });

  test('displays list name without error', () => {
    const name = findByTestAttr(wrapper, 'list-item-name');

    expect(name.length).toBe(1);
    expect(name.text().length).not.toBe(0);
  });

  test('displays list description without error if description is provided', () => {
    const description = findByTestAttr(wrapper, 'list-item-description');

    expect(description.length).not.toBe(0);
    expect(description.text().length).not.toBe(0);
  });

  test('does not display list description without error if description is not provided', () => {
    wrapper = setup({
      list: {
        ...initialProps.list,
        description: '',
      },
    });

    const description = findByTestAttr(wrapper, 'list-item-description');

    expect(description.length).toBe(0);
  });
});
