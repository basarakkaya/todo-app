import React from 'react';
import { shallow } from 'enzyme';

import { findByTestAttr } from '../../../test/testUtils';

import TodoItem from './TodoItem';

const initialProps = {
  item: {
    _id: '1234',
    text: 'Test list',
    completedDate: '2020-12-21T10:48:35.151+00:00',
    dueDate: '2020-12-21T10:48:35.151+00:00',
  },
  updateTodoText: () => {},
  completeTodoItem: () => {},
  incompleteTodoItem: () => {},
  setDueTodoItem: () => {},
  unsetDueTodoItem: () => {},
  removeTodoItem: () => {},
};

const setup = (props = {}) => {
  return shallow(<TodoItem {...props} />);
};

describe('render', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = setup(initialProps);
  });

  test('renders without error', () => {
    const component = findByTestAttr(wrapper, 'component-todo-item');

    expect(component.length).toBe(1);
  });

  test('displays text without error', () => {
    const text = findByTestAttr(wrapper, 'todo-item-text');

    expect(text.length).toBe(1);
    expect(text.text().length).not.toBe(0);
  });

  test('displays completedDate without error if provided', () => {
    const completedDate = findByTestAttr(wrapper, 'todo-item-completed-date');

    expect(completedDate.length).not.toBe(0);
    expect(completedDate.text().length).not.toBe(0);
  });

  test('does not display completedDate without error if not provided', () => {
    wrapper = setup({
      item: {
        ...initialProps.item,
        completedDate: null,
      },
    });

    const completedDate = findByTestAttr(wrapper, 'todo-item-completed-date');

    expect(completedDate.length).toBe(0);
  });

  test('displays dueDate without error if provided', () => {
    const dueDate = findByTestAttr(wrapper, 'todo-item-due-date');

    expect(dueDate.length).not.toBe(0);
    expect(dueDate.text().length).not.toBe(0);
  });

  test('does not display dueDate without error if not provided', () => {
    wrapper = setup({
      item: {
        ...initialProps.item,
        dueDate: null,
      },
    });

    const dueDate = findByTestAttr(wrapper, 'todo-item-due-date');

    expect(dueDate.length).toBe(0);
  });
});

// TODO: To-do item actions - update, complete/incomplete, due/undue, remove
