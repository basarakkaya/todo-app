import axios from 'axios';

import { ADD_TODO, DELETE_TODO, UPDATE_TODO, TODO_ERROR } from './types';
import { setAlert } from './alert';

export const addTodoItem = (listId, text, dueDate) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/lists/item/${listId}`, {
      text,
      dueDate,
    });

    dispatch({
      type: ADD_TODO,
      payload: res.data,
    });
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((err) => setAlert(err.msg, 'danger'));
    }

    dispatch({
      type: TODO_ERROR,
      payload: {
        msg: 'Add to-do item to a list failed',
      },
    });
  }
};

export const updateTodoText = (listId, itemId, text) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/lists/item/text/${listId}/${itemId}`, {
      text,
    });

    dispatch({
      type: UPDATE_TODO,
      payload: res.data,
    });
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((err) => setAlert(err.msg, 'danger'));
    }

    dispatch({
      type: TODO_ERROR,
      payload: {
        msg: 'Update to-do item text failed',
      },
    });
  }
};

export const completeTodoItem = (listId, itemId) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/lists/item/complete/${listId}/${itemId}`);

    dispatch({
      type: UPDATE_TODO,
      payload: res.data,
    });
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((err) => setAlert(err.msg, 'danger'));
    }

    dispatch({
      type: TODO_ERROR,
      payload: {
        msg: 'Complete to-do item failed',
      },
    });
  }
};

export const incompleteTodoItem = (listId, itemId) => async (dispatch) => {
  try {
    const res = await axios.put(
      `/api/lists/item/incomplete/${listId}/${itemId}`
    );

    dispatch({
      type: UPDATE_TODO,
      payload: res.data,
    });
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((err) => setAlert(err.msg, 'danger'));
    }

    dispatch({
      type: TODO_ERROR,
      payload: {
        msg: 'Incomplete to-do item failed',
      },
    });
  }
};

export const setDueTodoItem = (listId, itemId, dueDate) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/lists/item/due/${listId}/${itemId}`, {
      dueDate,
    });

    dispatch({
      type: UPDATE_TODO,
      payload: res.data,
    });
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((err) => setAlert(err.msg, 'danger'));
    }

    dispatch({
      type: TODO_ERROR,
      payload: {
        msg: 'Set due date of to-do item failed',
      },
    });
  }
};

export const unsetDueTodoItem = (listId, itemId) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/lists/item/undue/${listId}/${itemId}`);

    dispatch({
      type: UPDATE_TODO,
      payload: res.data,
    });
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((err) => setAlert(err.msg, 'danger'));
    }

    dispatch({
      type: TODO_ERROR,
      payload: {
        msg: 'Unset due date of to-do item failed',
      },
    });
  }
};

export const removeTodoItem = (listId, itemId) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/lists/item/${listId}/${itemId}`);

    dispatch({
      type: DELETE_TODO,
      payload: res.data,
    });
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((err) => setAlert(err.msg, 'danger'));
    }

    dispatch({
      type: TODO_ERROR,
      payload: {
        msg: 'Remove to-do item failed',
      },
    });
  }
};
