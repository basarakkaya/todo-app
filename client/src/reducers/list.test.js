import {
  GET_LISTS,
  GET_LIST,
  ADD_LIST,
  DELETE_LIST,
  UPDATE_LIST,
  LIST_ERROR,
  ADD_TODO,
  DELETE_TODO,
  UPDATE_TODO,
  TODO_ERROR,
} from '../actions/types';
import listReducer from './list';

const listsSample = [{ _id: '1234', name: 'testlist', items: [] }];

describe('returns correct state upon calling', () => {
  test('GET_LISTS', () => {
    const newState = listReducer(undefined, {
      type: GET_LISTS,
      payload: listsSample,
    });

    expect(newState.lists).toEqual(listsSample);
    expect(newState.loading).toBe(false);
  });

  test('GET_LIST', () => {
    const newState = listReducer(undefined, {
      type: GET_LIST,
      payload: listsSample[0],
    });

    expect(newState.list).toEqual(listsSample[0]);
    expect(newState.loading).toBe(false);
  });

  test('ADD_LIST', () => {
    const newState = listReducer(undefined, {
      type: ADD_LIST,
      payload: listsSample[0],
    });

    expect(newState.lists).toEqual(listsSample);
    expect(newState.loading).toBe(false);
  });

  test('UPDATE_LIST', () => {
    const newState = listReducer(
      {
        lists: listsSample,
        list: listsSample[0],
        loading: true,
        error: {},
      },
      {
        type: UPDATE_LIST,
        payload: { ...listsSample[0], name: 'test' },
      }
    );

    expect(newState.list).toEqual({ ...listsSample[0], name: 'test' });
    expect(newState.loading).toBe(false);
  });

  test('DELETE_LIST', () => {
    const state = listReducer(undefined, {
      type: ADD_LIST,
      payload: listsSample[0],
    });

    const newState = listReducer(state, {
      type: DELETE_LIST,
      payload: listsSample[0]._id,
    });

    expect(newState.lists.length).toBe(0);
    expect(newState.loading).toBe(false);
  });

  test('LIST_ERROR', () => {
    const newState = listReducer(undefined, {
      type: LIST_ERROR,
      payload: 'test',
    });

    expect(newState.error).toBe('test');
    expect(newState.loading).toBe(false);
  });

  test('ADD_TODO', () => {
    const newTodo = { _id: '2345', text: 'todo1' };
    const newState = listReducer(
      {
        lists: listsSample,
        list: listsSample[0],
        loading: true,
        error: {},
      },
      {
        type: ADD_TODO,
        payload: {
          ...listsSample[0],
          items: [...listsSample[0].items, newTodo],
        },
      }
    );

    expect(newState.list.items.length).toBe(1);
    expect(newState.loading).toBe(false);
  });

  test('DELETE_TODO', () => {
    const newTodo = { _id: '2345', text: 'todo1' };
    const state = listReducer(
      {
        lists: listsSample,
        list: listsSample[0],
        loading: true,
        error: {},
      },
      {
        type: ADD_TODO,
        payload: {
          ...listsSample[0],
          items: [...listsSample[0].items, newTodo],
        },
      }
    );

    const newState = listReducer(state, {
      type: DELETE_TODO,
      payload: {
        ...state.list,
        items: [
          ...state.list.items.filter(
            (item) => item._id !== state.list.items[0]._id
          ),
        ],
      },
    });

    expect(newState.list.items.length).toBe(0);
    expect(newState.loading).toBe(false);
  });

  test('UPDATE_TODO', () => {
    const newTodo = { _id: '2345', text: 'todo1' };
    const state = listReducer(
      {
        lists: listsSample,
        list: listsSample[0],
        loading: true,
        error: {},
      },
      {
        type: ADD_TODO,
        payload: {
          ...listsSample[0],
          items: [...listsSample[0].items, newTodo],
        },
      }
    );

    const updatedTodo = { ...listsSample[0].items[0], text: 'updated todo' };

    const newState = listReducer(state, {
      type: UPDATE_TODO,
      payload: {
        ...state.list,
        items: [updatedTodo],
      },
    });

    expect(newState.list.items[0].text).toBe('updated todo');
    expect(newState.loading).toBe(false);
  });

  test('TODO_ERROR', () => {
    const newState = listReducer(undefined, {
      type: TODO_ERROR,
      payload: 'test',
    });

    expect(newState.error).toBe('test');
    expect(newState.loading).toBe(false);
  });
});

test('returns default state when no action passed', () => {
  expect(listReducer(undefined, {})).toEqual({
    lists: [],
    list: null,
    loading: true,
    error: {},
  });
});
