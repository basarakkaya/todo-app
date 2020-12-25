import React from 'react';
import { shallow } from 'enzyme';

import { findByTestAttr, storeFactory } from '../../../test/testUtils';

import NewTodo, { UnconnectedNewTodo } from './NewTodo';

const setup = (state = {}) => {
  const store = storeFactory(state);
  const wrapper = shallow(<NewTodo store={store} />).dive();
  return wrapper;
};

describe('render', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = setup();
  });

  test('renders component without error', () => {
    const component = findByTestAttr(wrapper, 'component-new-todo');

    expect(component.length).toBe(1);
  });

  test('renders text input without error', () => {
    const textInput = findByTestAttr(wrapper, 'new-todo-text');

    expect(textInput.length).toBe(1);
  });

  test('renders due date input without error', () => {
    const dueDateInput = findByTestAttr(wrapper, 'new-todo-due-date');

    expect(dueDateInput.length).toBe(1);
  });

  test('renders create button without error', () => {
    const createButton = findByTestAttr(wrapper, 'new-todo-create');

    expect(createButton.length).toBe(1);
  });
});

describe('add todo action call', () => {
  let addTodoMock;
  let wrapper;
  let createButton;

  const listId = 'test-id';
  const text = 'test todo';
  const dueDate = Date.now();

  beforeEach(() => {
    addTodoMock = jest.fn();

    wrapper = shallow(
      <UnconnectedNewTodo addTodoItem={addTodoMock} listId={listId} />
    );

    wrapper.setState({
      text,
      dueDate,
    });

    createButton = findByTestAttr(wrapper, 'new-todo-create');
  });

  test('addTodo action runs on create click', () => {
    createButton.simulate('click', { preventDefault() {} });

    const addTodoCallCount = addTodoMock.mock.calls.length;

    expect(addTodoCallCount).toBe(1);
  });

  test('addTodo action is called with correct arguments - dueDate entered', () => {
    createButton.simulate('click', { preventDefault() {} });

    const addTodoCallArgs = addTodoMock.mock.calls[0];

    expect(addTodoCallArgs.length).toBe(3);

    expect(addTodoCallArgs[0]).toBe(listId);
    expect(addTodoCallArgs[1]).toBe(text);
    expect(addTodoCallArgs[2]).toBe(dueDate);
  });

  test('addTodo action is called with correct arguments - dueDate not entered', () => {
    wrapper.setState({ dueDate: '' });
    createButton.simulate('click', { preventDefault() {} });

    const addTodoCallArgs = addTodoMock.mock.calls[0];

    expect(addTodoCallArgs.length).toBe(3);

    expect(addTodoCallArgs[0]).toBe(listId);
    expect(addTodoCallArgs[1]).toBe(text);
    expect(addTodoCallArgs[2]).toBeFalsy();
  });

  test('inputs are cleared after create', () => {
    createButton.simulate('click', { preventDefault() {} });

    expect(wrapper.state('text')).toBe('');
    expect(wrapper.state('dueDate')).toBe('');
  });
});
