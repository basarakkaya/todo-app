import moxios from 'moxios';

import { storeFactory } from '../../test/testUtils';

import { loadUser, login, logout, register } from './auth';

describe('loadUser', () => {
  let store;

  beforeEach(() => {
    store = storeFactory();
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  test('sets user correctly if token found', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();

      request.respondWith({
        status: 200,
        response: {
          name: 'Test User',
        },
      });
    });

    return store.dispatch(loadUser()).then(() => {
      const newState = store.getState();

      expect(newState.auth.user).toEqual({
        name: 'Test User',
      });
    });
  });

  test('sets error state correctly if token is not found', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();

      request.respondWith({
        status: 401,
        response: {
          msg: 'No token found',
        },
      });
    });

    return store.dispatch(loadUser()).then(() => {
      const newState = store.getState();

      expect(newState.auth.isAuthenticated).toBe(false);
      expect(newState.auth.user).toBe(null);
      expect(newState.auth.token).toBe(null);
    });
  });
});

describe('login', () => {
  let store;

  beforeEach(() => {
    store = storeFactory();
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  test('sets token correctly if succeeds', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();

      request.respondWith({
        status: 200,
        response: {
          token: '1234',
        },
      });
    });

    return store
      .dispatch(login({ email: 'test@test.com', password: '123456' }))
      .then(() => {
        const newState = store.getState();

        expect(newState.auth.token).toBe('1234');
      });
  });

  test('sets error state correctly if login fails', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();

      request.respondWith({
        status: 400,
        response: {
          errors: [{ msg: 'Invalid Credentials' }],
        },
      });
    });

    return store
      .dispatch(login({ email: 'test@test.com', password: '123456' }))
      .then(() => {
        const newState = store.getState();

        expect(newState.auth.isAuthenticated).toBe(false);
        expect(newState.auth.user).toBe(null);
        expect(newState.auth.token).toBe(null);
      });
  });
});

test('logout', () => {
  const store = storeFactory();

  return store.dispatch(logout()).then(() => {
    const newState = store.getState();

    expect(newState.auth.isAuthenticated).toBe(false);
    expect(newState.auth.user).toBe(null);
    expect(newState.auth.token).toBe(null);
  });
});

describe('register', () => {
  let store;

  beforeEach(() => {
    store = storeFactory();
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  test('sets token correctly if succeeds', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();

      request.respondWith({
        status: 200,
        response: {
          token: '1234',
        },
      });
    });

    return store
      .dispatch(
        register({
          name: 'Test User',
          email: 'test@test.com',
          password: '123456',
        })
      )
      .then(() => {
        const newState = store.getState();

        expect(newState.auth.token).toBe('1234');
      });
  });

  test('sets error state correctly if register fails', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();

      request.respondWith({
        status: 400,
        response: {
          errors: [{ msg: 'Invalid Credentials' }],
        },
      });
    });

    return store
      .dispatch(
        register({
          name: 'Test User',
          email: 'test@test.com',
          password: '123456',
        })
      )
      .then(() => {
        const newState = store.getState();

        expect(newState.auth.isAuthenticated).toBe(false);
        expect(newState.auth.user).toBe(null);
        expect(newState.auth.token).toBe(null);
      });
  });
});
