import { SET_ALERT, REMOVE_ALERT } from '../actions/types';
import alertReducer from './alert';

const alertObj = {
  msg: 'test',
  alertType: 'info',
  id: 1,
};

test('returns an alert array of length 1 upon calling SET_ALERT', () => {
  const newState = alertReducer(undefined, {
    type: SET_ALERT,
    payload: alertObj,
  });

  expect(newState.length).toBe(1);
  expect(newState[0]).toBe(alertObj);
});

test('returns an empty array upon calling REMOVE_ALERT', () => {
  alertReducer(undefined, {
    type: SET_ALERT,
    payload: alertObj,
  });

  const newState = alertReducer(undefined, {
    type: REMOVE_ALERT,
    payload: alertObj.id,
  });

  expect(newState.length).toBe(0);
});
