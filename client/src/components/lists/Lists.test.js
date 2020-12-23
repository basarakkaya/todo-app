import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';

import { findByTestAttr, storeFactory } from '../../../test/testUtils';

import Lists, { UnconnectedLists } from './Lists';

const initialState = {
  auth: {
    isAuthenticated: true,
    loading: false,
    user: { name: 'test' },
  },
  list: {
    loading: false,
    lists: [
      {
        users: ['u123'],
        _id: '123',
        name: 'List 1',
        description: 'desc1',
        items: [],
      },
    ],
  },
};

const setup = (state = initialState) => {
  const store = storeFactory(state);
  const wrapper = shallow(<Lists store={store} />)
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
    const component = findByTestAttr(wrapper, 'component-lists');

    expect(component.length).toBe(1);
  });

  test('renders NewList component without error', () => {
    const newListComponent = findByTestAttr(wrapper, 'lists-new-list');

    expect(newListComponent.length).toBe(1);
  });

  test('renders list container without error', () => {
    const listContainer = findByTestAttr(wrapper, 'lists-list-container');

    expect(listContainer.length).toBe(1);
  });

  test('renders items if lists state is not empty', () => {
    const items = findByTestAttr(wrapper, 'lists-list');

    expect(items.length).not.toBe(0);
  });

  test('does not render any item if lists state is empty', () => {
    wrapper = setup({
      ...initialState,
      list: {
        ...initialState.list,
        lists: [],
      },
    });

    const items = findByTestAttr(wrapper, 'lists-list');

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
    const loader = findByTestAttr(wrapper, 'lists-loader');

    expect(loader.length).toBe(1);
  });

  test('if not loading, does not show loading indicator', () => {
    const loader = findByTestAttr(wrapper, 'lists-loader');

    expect(loader.length).toBe(0);
  });
});

test('calls getLists action on mount', () => {
  const getListsMock = jest.fn();
  const store = storeFactory();

  mount(
    <Provider store={store}>
      <UnconnectedLists getLists={getListsMock} loggedIn={true} />
    </Provider>
  );

  expect(getListsMock.mock.calls.length).toBe(1);
});
