import { v4 } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

/**
 * @ReduxAction
 * @description Dipslays an alert of selected type, for an amount of time
 * @param {string} msg Message to be shown in alert
 * @param {string} alertType Alert type - CSS Class of alert.
 * Can be one of `primary`, `light`, `dark`, `danger`, `success`, `white`
 * @param {number} timeout When to remove the alert automatically - Defaults to 5000ms
 */
export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
  const id = v4();

  dispatch({
    type: SET_ALERT,
    payload: {
      msg,
      alertType,
      id,
    },
  });

  setTimeout(() => {
    dispatch({ type: REMOVE_ALERT, payload: id });
  }, timeout);
};
