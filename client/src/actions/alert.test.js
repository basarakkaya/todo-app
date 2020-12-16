import { storeFactory } from '../../test/testUtils';

import { setAlert } from './alert';

describe('setAlert', () => {
  let store;
  const alertObj = {
    alertType: 'danger',
    msg: 'Test msg',
  };

  beforeEach(() => {
    store = storeFactory();
    jest.useFakeTimers();
    store.dispatch(setAlert(alertObj.msg, alertObj.alertType));
  });

  test('adds alert to state', () => {
    const newState = store.getState();

    expect(newState.alert[0].msg).toBe(alertObj.msg);
    expect(newState.alert[0].alertType).toBe(alertObj.alertType);
  });

  test('removes alert after timeout', () => {
    jest.runOnlyPendingTimers();
    const newState = store.getState();
    expect(newState.alert.length).toBe(0);
  });
});
