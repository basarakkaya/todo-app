import moxios from 'moxios';

import { storeFactory } from '../../test/testUtils';

import {
  addTodoItem,
  updateTodoText,
  completeTodoItem,
  incompleteTodoItem,
  setDueTodoItem,
  unsetDueTodoItem,
  removeTodoItem,
} from './todo';
import { GET_LIST } from './types';

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

describe('to-do item tests', () => {
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

  describe('addTodoItem', () => {
    test('adds a todo item to a list successfully - with due date', () => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        const { text, dueDate } = JSON.parse(request.config.data);

        const resObj = {
          ...sampleList,
          items: [{ _id: 'item3', text, dueDate }, ...sampleList.items],
        };

        request.respondWith({
          status: 200,
          response: resObj,
        });
      });

      const date = Date.now();

      return store
        .dispatch(addTodoItem(sampleList._id, 'new todo item', date))
        .then(() => {
          const newState = store.getState();

          expect(newState.list.list.items.length).toBe(3);
          expect(newState.list.list.items[0].text).toBe('new todo item');
          expect(newState.list.list.items[0].dueDate).toBe(date);
        });
    });

    test('adds a todo item to a list successfully - without due date', () => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        const { text } = JSON.parse(request.config.data);

        const resObj = {
          ...sampleList,
          items: [{ _id: 'item3', text }, ...sampleList.items],
        };

        request.respondWith({
          status: 200,
          response: resObj,
        });
      });

      return store
        .dispatch(addTodoItem(sampleList._id, 'new todo item'))
        .then(() => {
          const newState = store.getState();

          expect(newState.list.list.items.length).toBe(3);
          expect(newState.list.list.items[0].text).toBe('new todo item');
          expect(newState.list.list.items[0].dueDate).toBeFalsy();
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
        .dispatch(addTodoItem(sampleList._id, 'new item'))
        .then(() => {
          const newState = store.getState();

          expect(newState.list.list.items.length).toBe(2);
          expect(newState.list.error).toBeTruthy();
        });
    });
  });

  describe('updateTodoText', () => {
    test('updates to-do item text correctly', () => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        const { text } = JSON.parse(request.config.data);
        const itemId = request.config.url.split('/').reverse()[0];

        const updateIndex = sampleList.items
          .map((item) => item._id)
          .indexOf(itemId);

        let items = [...sampleList.items];
        items[updateIndex].text = text;

        const resObj = {
          ...sampleList,
          items,
        };

        request.respondWith({
          status: 200,
          response: resObj,
        });
      });

      return store
        .dispatch(updateTodoText(sampleList._id, 'item2', 'updated this text'))
        .then(() => {
          const newState = store.getState();

          expect(newState.list.list.items.length).toBe(2);
          expect(newState.list.list.items[0].text).toBe('updated this text');
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
        .dispatch(updateTodoText(sampleList._id, 'item2', 'updated this text'))
        .then(() => {
          const newState = store.getState();

          expect(newState.list.list.items.length).toBe(2);
          expect(newState.list.error).toBeTruthy();
        });
    });
  });

  describe('completeTodoItem', () => {
    test('updates completeness of to-do item correctly', () => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        const itemId = request.config.url.split('/').reverse()[0];

        const updateIndex = sampleList.items
          .map((item) => item._id)
          .indexOf(itemId);

        let items = [...sampleList.items];
        items[updateIndex].completedDate = Date.now();

        const resObj = {
          ...sampleList,
          items,
        };

        request.respondWith({
          status: 200,
          response: resObj,
        });
      });

      return store
        .dispatch(completeTodoItem(sampleList._id, 'item2'))
        .then(() => {
          const newState = store.getState();

          expect(newState.list.list.items.length).toBe(2);
          expect(newState.list.list.items[0].completedDate).not.toBeFalsy();
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
        .dispatch(completeTodoItem(sampleList._id, 'item2'))
        .then(() => {
          const newState = store.getState();

          expect(newState.list.list.items.length).toBe(2);
          expect(newState.list.error).toBeTruthy();
        });
    });
  });

  describe('incompleteTodoItem', () => {
    test('updates incompleteness of to-do item correctly', () => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        const itemId = request.config.url.split('/').reverse()[0];

        const updateIndex = sampleList.items
          .map((item) => item._id)
          .indexOf(itemId);

        let items = [...sampleList.items];
        items[updateIndex].completedDate = null;

        const resObj = {
          ...sampleList,
          items,
        };

        request.respondWith({
          status: 200,
          response: resObj,
        });
      });

      return store
        .dispatch(incompleteTodoItem(sampleList._id, 'item1'))
        .then(() => {
          const newState = store.getState();

          expect(newState.list.list.items.length).toBe(2);
          expect(newState.list.list.items[1].completedDate).toBeFalsy();
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
        .dispatch(incompleteTodoItem(sampleList._id, 'item1'))
        .then(() => {
          const newState = store.getState();

          expect(newState.list.list.items.length).toBe(2);
          expect(newState.list.error).toBeTruthy();
        });
    });
  });

  describe('setDueTodoItem', () => {
    test('updates due date of to-do item correctly', () => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        const itemId = request.config.url.split('/').reverse()[0];

        const updateIndex = sampleList.items
          .map((item) => item._id)
          .indexOf(itemId);

        let items = [...sampleList.items];
        items[updateIndex].dueDate = Date.now();

        const resObj = {
          ...sampleList,
          items,
        };

        request.respondWith({
          status: 200,
          response: resObj,
        });
      });

      return store
        .dispatch(setDueTodoItem(sampleList._id, 'item2'))
        .then(() => {
          const newState = store.getState();

          expect(newState.list.list.items.length).toBe(2);
          expect(newState.list.list.items[0].dueDate).not.toBeFalsy();
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
        .dispatch(setDueTodoItem(sampleList._id, 'item2'))
        .then(() => {
          const newState = store.getState();

          expect(newState.list.list.items.length).toBe(2);
          expect(newState.list.error).toBeTruthy();
        });
    });
  });

  describe('unsetDueTodoItem', () => {
    test('removes due date of to-do item correctly', () => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        const itemId = request.config.url.split('/').reverse()[0];

        const updateIndex = sampleList.items
          .map((item) => item._id)
          .indexOf(itemId);

        let items = [...sampleList.items];
        items[updateIndex].dueDate = null;

        const resObj = {
          ...sampleList,
          items,
        };

        request.respondWith({
          status: 200,
          response: resObj,
        });
      });

      return store
        .dispatch(unsetDueTodoItem(sampleList._id, 'item1'))
        .then(() => {
          const newState = store.getState();

          expect(newState.list.list.items.length).toBe(2);
          expect(newState.list.list.items[1].completedDate).toBeFalsy();
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
        .dispatch(unsetDueTodoItem(sampleList._id, 'item2'))
        .then(() => {
          const newState = store.getState();

          expect(newState.list.list.items.length).toBe(2);
          expect(newState.list.error).toBeTruthy();
        });
    });
  });

  describe('removeTodoItem', () => {
    test('removes to-do item correctly', () => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        const itemId = request.config.url.split('/').reverse()[0];

        let items = sampleList.items.filter((item) => item._id !== itemId);

        const resObj = {
          ...sampleList,
          items,
        };

        request.respondWith({
          status: 200,
          response: resObj,
        });
      });

      return store
        .dispatch(removeTodoItem(sampleList._id, 'item2'))
        .then(() => {
          const newState = store.getState();

          expect(newState.list.list.items.length).toBe(1);
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
        .dispatch(removeTodoItem(sampleList._id, 'item2'))
        .then(() => {
          const newState = store.getState();

          expect(newState.list.list.items.length).toBe(2);
          expect(newState.list.error).toBeTruthy();
        });
    });
  });
});
