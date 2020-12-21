import axios from 'axios';

import {
  GET_LISTS,
  GET_LIST,
  ADD_LIST,
  DELETE_LIST,
  UPDATE_LIST,
  LIST_ERROR,
} from './types';
import { setAlert } from './alert';

export const getLists = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/lists');
    dispatch({
      type: GET_LISTS,
      payload: res.data,
    });
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((err) => setAlert(err.msg, 'danger'));
    }

    dispatch({
      type: LIST_ERROR,
      payload: {
        msg: 'Get lists failed',
      },
    });
  }
};

export const getList = (listId) => async (dispatch) => {
  if (!listId) {
    setAlert('List ID not specified', 'danger');

    dispatch({
      type: LIST_ERROR,
      payload: {
        msg: 'Get list failed',
      },
    });

    return;
  }

  try {
    const res = await axios.get(`/api/lists/${listId}`);
    dispatch({
      type: GET_LIST,
      payload: res.data,
    });
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((err) => setAlert(err.msg, 'danger'));
    }

    dispatch({
      type: LIST_ERROR,
      payload: {
        msg: 'Get list failed',
      },
    });
  }
};

export const addList = (name, description) => async (dispatch) => {
  try {
    const reqBody = {
      ...(name ? { name } : {}),
      ...(description ? { description } : {}),
    };
    const res = await axios.post(`/api/lists`, reqBody);
    dispatch({
      type: ADD_LIST,
      payload: res.data,
    });
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((err) => setAlert(err.msg, 'danger'));
    }

    dispatch({
      type: LIST_ERROR,
      payload: {
        msg: 'Add list failed',
      },
    });
  }
};

export const removeList = (listId) => async (dispatch) => {
  if (!listId) {
    setAlert('List ID not specified', 'danger');

    dispatch({
      type: LIST_ERROR,
      payload: {
        msg: 'Remove list failed',
      },
    });

    return;
  }

  try {
    await axios.delete(`/api/lists/${listId}`);

    dispatch({
      type: DELETE_LIST,
      payload: listId,
    });
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((err) => setAlert(err.msg, 'danger'));
    }

    dispatch({
      type: LIST_ERROR,
      payload: {
        msg: 'Remove list failed',
      },
    });
  }
};

export const updateListDescription = (listId, description = '') => async (
  dispatch
) => {
  try {
    const res = await axios.put(`/api/lists/desc/${listId}`, {
      description,
    });

    dispatch({
      type: UPDATE_LIST,
      payload: res.data,
    });
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((err) => setAlert(err.msg, 'danger'));
    }

    dispatch({
      type: LIST_ERROR,
      payload: {
        msg: 'Update list description failed',
      },
    });
  }
};

export const updateListArrangement = (listId, items) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/lists/rearrange/${listId}`, {
      items,
    });

    dispatch({
      type: UPDATE_LIST,
      payload: res.data,
    });
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((err) => setAlert(err.msg, 'danger'));
    }

    dispatch({
      type: LIST_ERROR,
      payload: {
        msg: 'Update list arrangement failed',
      },
    });
  }
};

export const addUserToList = (listId, email) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/lists/users/${listId}`, {
      email,
    });

    dispatch({
      type: UPDATE_LIST,
      payload: res.data,
    });
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((err) => setAlert(err.msg, 'danger'));
    }

    dispatch({
      type: LIST_ERROR,
      payload: {
        msg: 'Add user to list failed',
      },
    });
  }
};

export const removeUserFromList = (listId, userId) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/lists/users/${listId}/${userId}`);

    dispatch({
      type: UPDATE_LIST,
      payload: res.data,
    });
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((err) => setAlert(err.msg, 'danger'));
    }

    dispatch({
      type: LIST_ERROR,
      payload: {
        msg: 'Remove user from list failed',
      },
    });
  }
};
