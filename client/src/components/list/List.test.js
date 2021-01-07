import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';

import { findByTestAttr, storeFactory } from '../../../test/testUtils';

import List, { UnconnectedList } from './List';

const initialState = {
  auth: {
    isAuthenticated: true,
    loading: false,
    user: { name: 'test' },
  },
  list: {
    loading: false,
    list: {
      users: ['u123'],
      _id: '123',
      name: 'List 1',
      description: 'desc1',
      items: [
        {
          _id: '123123',
          text: 'item',
        },
      ],
    },
  },
};

const match = { params: { id: '123123' } };

const setup = (state = initialState) => {
  const store = storeFactory(state);
  const wrapper = shallow(<List store={store} match={match} />)
    .dive()
    .dive();
  return wrapper;
};

describe('render', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = setup();
  });

  test('renders without error', () => {
    const component = findByTestAttr(wrapper, 'component-list');

    expect(component.length).toBe(1);
  });

  test('renders NewTodo component without error', () => {
    const newTodoComponent = findByTestAttr(wrapper, 'list-new-todo');

    expect(newTodoComponent.length).toBe(1);
  });

  test('renders todo container without error', () => {
    const todoContainer = findByTestAttr(wrapper, 'list-todo-container');

    expect(todoContainer.length).toBe(1);
  });

  test('renders todo items if items of list is not empty', () => {
    const items = findByTestAttr(wrapper, 'list-todo-item');

    expect(items.length).not.toBe(0);
  });

  test('does not render todo items if items of list is empty', () => {
    wrapper = setup({
      ...initialState,
      list: {
        ...initialState.list,
        list: {
          ...initialState.list.list,
          items: [],
        },
      },
    });

    const items = findByTestAttr(wrapper, 'list-todo-item');

    expect(items.length).toBe(0);
  });

  test('if loading, show loading indicator', () => {
    wrapper = setup({
      ...initialState,
      list: {
        ...initialState.list,
        loading: true,
      },
    });
    const loader = findByTestAttr(wrapper, 'list-loader');

    expect(loader.length).toBe(1);
  });

  test('if not loading, does not show loading indicator', () => {
    const loader = findByTestAttr(wrapper, 'list-loader');

    expect(loader.length).toBe(0);
  });
});

test('calls get list action on mount', () => {
  const getListMock = jest.fn();
  const store = storeFactory();

  mount(
    <Provider store={store}>
      <UnconnectedList getList={getListMock} loggedIn={true} match={match} />
    </Provider>
  );

  expect(getListMock.mock.calls.length).toBe(1);
});

// TODO: Rearrange list

// TODO: Filter list items - completed, incomplete, etc.
