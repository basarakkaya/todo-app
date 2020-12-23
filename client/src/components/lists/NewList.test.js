import React from 'react';
import { shallow } from 'enzyme';

import { findByTestAttr, storeFactory } from '../../../test/testUtils';

import NewList, { UnconnectedNewList } from './NewList';

const setup = (state = {}) => {
  const store = storeFactory(state);
  const wrapper = shallow(<NewList store={store} />).dive();
  return wrapper;
};

describe('render', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = setup();
  });

  test('renders component without error', () => {
    const component = findByTestAttr(wrapper, 'component-new-list');

    expect(component.length).toBe(1);
  });

  test('renders name input without error', () => {
    const nameInput = findByTestAttr(wrapper, 'new-list-name');

    expect(nameInput.length).toBe(1);
  });

  test('renders description input without error', () => {
    const descInput = findByTestAttr(wrapper, 'new-list-description');

    expect(descInput.length).toBe(1);
  });

  test('renders create button without error', () => {
    const createButton = findByTestAttr(wrapper, 'new-list-create');

    expect(createButton.length).toBe(1);
  });
});

describe('add list action call', () => {
  let addListMock;
  let wrapper;
  let createButton;

  const name = 'test list';
  const description = 'test description';

  beforeEach(() => {
    addListMock = jest.fn();

    wrapper = shallow(<UnconnectedNewList addList={addListMock} />);

    wrapper.setState({
      name,
      description,
    });

    createButton = findByTestAttr(wrapper, 'new-list-create');
  });

  test('addList action runs on create click', () => {
    createButton.simulate('click', { preventDefault() {} });

    const addListCallCount = addListMock.mock.calls.length;

    expect(addListCallCount).toBe(1);
  });

  test('addList action is called with correct arguments - description entered', () => {
    createButton.simulate('click', { preventDefault() {} });

    const addListCallArgs = addListMock.mock.calls[0];

    expect(addListMock.mock.calls[0].length).toBe(2);
    expect(addListCallArgs[0]).toBe(name);
    expect(addListCallArgs[1]).toBe(description);
  });

  test('addList action is called with correct arguments - description not entered', () => {
    wrapper.setState({ description: '' });
    createButton.simulate('click', { preventDefault() {} });

    const addListCallArgs = addListMock.mock.calls[0];

    expect(addListMock.mock.calls[0].length).toBe(2);
    expect(addListCallArgs[0]).toBe(name);
    expect(addListCallArgs[1]).toBeFalsy();
  });

  test('inputs are cleared after create', () => {
    createButton.simulate('click', { preventDefault() {} });

    expect(wrapper.state('name')).toBe('');
    expect(wrapper.state('description')).toBe('');
  });
});
