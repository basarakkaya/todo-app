import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const TodoItem = ({ item: { text, completedDate = null, dueDate = null } }) => {
  return (
    <div data-test='component-todo-item'>
      <p data-test='todo-item-text'>{text}</p>
      {completedDate && (
        <p data-test='todo-item-completed-date'>
          Completed at: <Moment format='DD.MM.YY'>{completedDate}</Moment>
        </p>
      )}
      {dueDate && (
        <p data-test='todo-item-due-date'>
          Due to: <Moment format='DD.MM.YY'>{dueDate}</Moment>
        </p>
      )}
    </div>
  );
};

TodoItem.propTypes = {
  item: PropTypes.object.isRequired,
};

export default TodoItem;
