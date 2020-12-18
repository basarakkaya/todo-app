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

const initialState = {
  lists: [],
  list: null,
  loading: true,
  error: {},
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_LISTS:
      return {
        ...state,
        lists: payload,
        loading: false,
      };
    case GET_LIST:
      return {
        ...state,
        list: payload,
        loading: false,
      };
    case ADD_LIST:
      return {
        ...state,
        lists: [payload, ...state.lists],
        loading: false,
      };
    case DELETE_LIST:
      return {
        ...state,
        lists: state.lists.filter((list) => list._id !== payload),
        loading: false,
      };
    case UPDATE_LIST:
    case ADD_TODO:
    case UPDATE_TODO:
    case DELETE_TODO:
      return {
        ...state,
        list: payload,
        loading: false,
      };
    case LIST_ERROR:
    case TODO_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
