import {
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
} from '../actions/types';
import authReducer from './auth';

const user = {
  id: 1234,
  name: 'Test User',
};

const token = 'token1234';

test('returns correct state upon calling USER_LOADED', () => {
  const newState = authReducer(undefined, {
    type: USER_LOADED,
    payload: user,
  });

  expect(newState).toEqual({
    isAuthenticated: true,
    loading: false,
    user,
    token: null,
  });
});

describe('returns correct state upon calling', () => {
  test('LOGIN_SUCCESS', () => {
    const newState = authReducer(undefined, {
      type: LOGIN_SUCCESS,
      payload: { token },
    });

    expect(newState).toEqual({
      isAuthenticated: true,
      loading: false,
      user: null,
      token,
    });
  });

  test('REGISTER_SUCCESS', () => {
    const newState = authReducer(undefined, {
      type: REGISTER_SUCCESS,
      payload: { token },
    });

    expect(newState).toEqual({
      isAuthenticated: true,
      loading: false,
      user: null,
      token,
    });
  });

  test('LOGOUT', () => {
    const newState = authReducer(undefined, {
      type: LOGOUT,
    });

    expect(newState).toEqual({
      isAuthenticated: false,
      loading: false,
      user: null,
      token: null,
    });
  });

  test('LOGIN_FAIL', () => {
    const newState = authReducer(undefined, {
      type: LOGIN_FAIL,
    });

    expect(newState).toEqual({
      isAuthenticated: false,
      loading: false,
      user: null,
      token: null,
    });
  });

  test('REGISTER_FAIL', () => {
    const newState = authReducer(undefined, {
      type: REGISTER_FAIL,
    });

    expect(newState).toEqual({
      isAuthenticated: false,
      loading: false,
      user: null,
      token: null,
    });
  });

  test('AUTH_ERROR', () => {
    const newState = authReducer(undefined, {
      type: AUTH_ERROR,
    });

    expect(newState).toEqual({
      isAuthenticated: false,
      loading: false,
      user: null,
      token: null,
    });
  });
});

describe('updates local storage correctly upon calling', () => {
  beforeEach(() => {
    // mock localstorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem: jest.fn(() => null),
        removeItem: jest.fn(() => null),
      },
      writable: true,
    });
  });

  test('LOGIN_SUCCESS', () => {
    authReducer(undefined, {
      type: LOGIN_SUCCESS,
      payload: { token },
    });

    expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(window.localStorage.setItem).toHaveBeenCalledWith('token', token);
  });

  test('REGISTER_SUCCESS', () => {
    authReducer(undefined, {
      type: REGISTER_SUCCESS,
      payload: { token },
    });

    expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(window.localStorage.setItem).toHaveBeenCalledWith('token', token);
  });

  test('LOGOUT', () => {
    authReducer(undefined, {
      type: LOGOUT,
    });

    expect(window.localStorage.removeItem).toHaveBeenCalledTimes(1);
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  test('LOGIN_FAIL', () => {
    authReducer(undefined, {
      type: LOGIN_FAIL,
    });

    expect(window.localStorage.removeItem).toHaveBeenCalledTimes(1);
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  test('REGISTER_FAIL', () => {
    authReducer(undefined, {
      type: REGISTER_FAIL,
    });

    expect(window.localStorage.removeItem).toHaveBeenCalledTimes(1);
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  test('AUTH_ERROR', () => {
    authReducer(undefined, {
      type: AUTH_ERROR,
    });

    expect(window.localStorage.removeItem).toHaveBeenCalledTimes(1);
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
  });
});

test('returns default state when no action passed', () => {
  expect(authReducer(undefined, {})).toEqual({
    token: null,
    isAuthenticated: null,
    loading: true,
    user: null,
  });
});
