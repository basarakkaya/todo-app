import moxios from 'moxios';

import { storeFactory } from '../../test/testUtils';

import {
  getLists,
  getList,
  addList,
  removeList,
  updateListDescription,
  updateListArrangement,
  addUserToList,
  removeUserFromList,
} from './list';
import { ADD_LIST, GET_LIST } from './types';

const sampleList = {
  users: ['user1'],
  _id: 'list1',
  name: 'List 1',
  description: 'List description',
  items: [
    {
      _id: 'item2',
      text: 'Item 2',
      date: '2020-12-16T16:47:02.982Z',
    },
    {
      _id: 'item1',
      text: 'Item 1',
      date: '2020-12-16T16:26:55.442Z',
      completedDate: '2020-12-16T16:26:55.442Z',
      dueDate: '2020-12-16T16:26:55.442Z',
    },
  ],
  date: '2020-12-16T16:26:31.007Z',
};

describe('getLists', () => {
  let store;

  beforeEach(() => {
    store = storeFactory();
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  test('set lists state of list store correctly if successful', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();

      request.respondWith({
        status: 200,
        response: [sampleList],
      });
    });

    return store.dispatch(getLists()).then(() => {
      const newState = store.getState();

      expect(newState.list.lists).toEqual([sampleList]);
    });
  });

  test('set error state of list store if failed', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();

      request.respondWith({
        status: 500,
        response: 'Server Error',
      });
    });

    return store.dispatch(getLists()).then(() => {
      const newState = store.getState();

      expect(newState.list.error).toBeTruthy();
    });
  });
});

describe('getList', () => {
  let store;

  beforeEach(() => {
    store = storeFactory();
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  test('set list state of list store correctly if successful', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();

      request.respondWith({
        status: 200,
        response: sampleList,
      });
    });

    return store.dispatch(getList('list1')).then(() => {
      const newState = store.getState();

      expect(newState.list.list).toEqual(sampleList);
    });
  });

  test('throw error if no list id passed as param', () => {
    return store.dispatch(getList()).then(() => {
      const newState = store.getState();

      expect(newState.list.error).toBeTruthy();
    });
  });

  test('set error state of list store if failed', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();

      request.respondWith({
        status: 500,
        response: 'Server Error',
      });
    });

    return store.dispatch(getList('list1')).then(() => {
      const newState = store.getState();

      expect(newState.list.error).toBeTruthy();
    });
  });
});

describe('addList', () => {
  let store;

  beforeEach(() => {
    store = storeFactory();
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  test('set lists state of list store correctly if successful - name and description are provided', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      const { name, description } = JSON.parse(request.config.data);
      let resObj = {
        ...sampleList,
        name,
        description,
      };

      request.respondWith({
        status: 200,
        response: resObj,
      });
    });

    return store.dispatch(addList('test', 'test description')).then(() => {
      const newState = store.getState();

      expect(newState.list.lists.length).toBe(1);
      expect(newState.list.lists[0].name).toBe('test');
      expect(newState.list.lists[0].description).toBe('test description');
    });
  });

  test('set lists state of list store correctly if successful - name is provided, description is not provided', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      const { name, description } = JSON.parse(request.config.data);
      let resObj = {
        ...sampleList,
        name,
        description,
      };

      request.respondWith({
        status: 200,
        response: resObj,
      });
    });

    return store.dispatch(addList('test')).then(() => {
      const newState = store.getState();

      expect(newState.list.lists.length).toBe(1);
      expect(newState.list.lists[0].name).toBe('test');
      expect(newState.list.lists[0].description).toBeFalsy();
    });
  });

  // test('throw error if list name is not passed as param', () => {
  //   return store.dispatch(addList()).then(() => {
  //     const newState = store.getState();

  //     expect(newState.list.error).toBeTruthy();
  //   });
  // });

  test('set error state of list store if failed', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();

      request.respondWith({
        status: 500,
        response: 'Server Error',
      });
    });

    return store.dispatch(addList('test')).then(() => {
      const newState = store.getState();

      expect(newState.list.error).toBeTruthy();
    });
  });
});

describe('removeList', () => {
  let store;

  beforeEach(async () => {
    store = storeFactory();
    store.dispatch({
      type: ADD_LIST,
      payload: sampleList,
    });
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  test('set lists state of list store correctly if successful', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();

      request.respondWith({
        status: 200,
        response: { msg: 'List deleted' },
      });
    });

    return store.dispatch(removeList(sampleList._id)).then(() => {
      const newState = store.getState();

      expect(newState.list.lists.length).toBe(0);
    });
  });

  test('throw error if listId is not passed as param', () => {
    return store.dispatch(removeList()).then(() => {
      const newState = store.getState();

      expect(newState.list.lists.length).toBe(1);
      expect(newState.list.error).toBeTruthy();
    });
  });

  test('set error state of list store correctly if failed', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();

      request.respondWith({
        status: 500,
        response: 'Server Error',
      });
    });

    return store.dispatch(removeList(sampleList._id)).then(() => {
      const newState = store.getState();

      expect(newState.list.lists.length).toBe(1);
      expect(newState.list.error).toBeTruthy();
    });
  });
});

describe('updateListDescription', () => {
  let store;

  beforeEach(async () => {
    store = storeFactory();
    store.dispatch({
      type: GET_LIST,
      payload: sampleList,
    });
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  test('set list state of list store correctly if successful (updated the description correctly, description is provided)', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      const { description } = JSON.parse(request.config.data);

      let resObj = {
        ...sampleList,
        description,
      };

      request.respondWith({
        status: 200,
        response: resObj,
      });
    });

    return store
      .dispatch(updateListDescription(sampleList._id, 'description update'))
      .then(() => {
        const newState = store.getState();

        expect(newState.list.list).toBeTruthy();
        expect(newState.list.list.description).toBe('description update');
      });
  });

  test('set list state of list store correctly if successful (updated the description as empty string correctly, description is not provided)', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      const { description } = JSON.parse(request.config.data);

      let resObj = {
        ...sampleList,
        description,
      };

      request.respondWith({
        status: 200,
        response: resObj,
      });
    });

    return store.dispatch(updateListDescription(sampleList._id)).then(() => {
      const newState = store.getState();

      expect(newState.list.list).toBeTruthy();
      expect(newState.list.list.description).toBe('');
    });
  });

  test('set error state of list store correctly if failed', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();

      request.respondWith({
        status: 500,
        response: 'Server Error',
      });
    });

    return store.dispatch(updateListDescription(sampleList._id)).then(() => {
      const newState = store.getState();

      expect(newState.list.list).toBeTruthy();
      expect(newState.list.error).toBeTruthy();
    });
  });
});

describe('updateListArrangement', () => {
  let store;

  beforeEach(async () => {
    store = storeFactory();
    store.dispatch({
      type: GET_LIST,
      payload: sampleList,
    });
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  test('rearranges the list items correctly', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      const { items } = JSON.parse(request.config.data);

      let resObj = {
        ...sampleList,
        items,
      };

      request.respondWith({
        status: 200,
        response: resObj,
      });
    });

    const revArr = sampleList.items.reverse();

    return store
      .dispatch(updateListArrangement(sampleList._id, revArr))
      .then(() => {
        const newState = store.getState();

        expect(newState.list.list.items).toEqual(revArr);
      });
  });

  test('set error state of list store correctly if failed', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();

      request.respondWith({
        status: 500,
        response: 'Server Error',
      });
    });

    return store
      .dispatch(
        updateListArrangement(sampleList._id, sampleList.items.reverse())
      )
      .then(() => {
        const newState = store.getState();

        expect(newState.list.list).toBeTruthy();
        expect(newState.list.error).toBeTruthy();
      });
  });
});

describe('addUserToList', () => {
  let store;

  beforeEach(async () => {
    store = storeFactory();
    store.dispatch({
      type: GET_LIST,
      payload: sampleList,
    });
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  test('adds a user to a list correctly', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      const { email } = JSON.parse(request.config.data);

      const resObj = {
        ...sampleList,
        users: [...sampleList.users, email],
      };

      request.respondWith({
        status: 200,
        response: resObj,
      });
    });

    return store
      .dispatch(addUserToList(sampleList._id, 'test@test.com'))
      .then(() => {
        const newState = store.getState();

        expect(newState.list.list.users.length).toBe(2);
      });
  });

  test('set error state of list store correctly if failed', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();

      request.respondWith({
        status: 500,
        response: 'Server Error',
      });
    });

    return store
      .dispatch(addUserToList(sampleList._id, 'test@test.com'))
      .then(() => {
        const newState = store.getState();

        expect(newState.list.list.users.length).toBe(1);
        expect(newState.list.error).toBeTruthy();
      });
  });
});

describe('removeUserFromList', () => {
  let store;

  beforeEach(async () => {
    store = storeFactory();
    store.dispatch({
      type: GET_LIST,
      payload: {
        ...sampleList,
        users: ['user1', 'user2'],
      },
    });
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  test('removes user successfully', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      const userId = request.config.url.split('/').reverse()[0];

      const resObj = {
        ...sampleList,
        users: sampleList.users.filter((user) => user !== userId),
      };

      request.respondWith({
        status: 200,
        response: resObj,
      });
    });

    return store
      .dispatch(removeUserFromList(sampleList._id, 'user2'))
      .then(() => {
        const newState = store.getState();

        expect(newState.list.list.users.length).toBe(1);
      });
  });

  test('set error state of list store correctly if failed', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();

      request.respondWith({
        status: 500,
        response: 'Server Error',
      });
    });

    return store
      .dispatch(removeUserFromList(sampleList._id, 'user2'))
      .then(() => {
        const newState = store.getState();

        expect(newState.list.list.users.length).toBe(2);
        expect(newState.list.error).toBeTruthy();
      });
  });
});
