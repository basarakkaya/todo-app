import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import NewTodo from './NewTodo';
import TodoItem from './TodoItem';

import { getList } from '../../actions/list';
import { addTodoItem } from '../../actions/todo';

// TODO: In order to rearrange the list, below should be done:
// * create a state for list items
// * when the list is fetched from remote, fill this state with list items
// * pass the setter of this state to ReactSortable element as `setList` prop
// * create a function such as `onRearrange` and pass that to ReactSortable element as `onEnd` prop
// * call `updateListArrangement` redux action within that `onRearrange` function

export const UnconnectedList = ({
  addTodoItem,
  getList,
  match: {
    params: { id: listId },
  },
  loggedIn,
  list = {},
  loading,
}) => {
  React.useEffect(() => {
    if (!loggedIn) return;

    getList(listId);
  }, [getList, loggedIn, listId]);

  return (
    <div data-test='component-list'>
      <NewTodo
        data-test='list-new-todo'
        addTodoItem={addTodoItem}
        listId={listId}
      />
      {loading && <div data-test='list-loader'>Loading...</div>}
      <div data-test='list-todo-container'>
        {list && list.items && list.items.length > 0
          ? list.items.map((item) => (
              <TodoItem data-test='list-todo-item' key={item._id} item={item} />
            ))
          : 'You do not have any to-do items'}
      </div>
    </div>
  );
};

UnconnectedList.propTypes = {
  addTodoItem: PropTypes.func,
  getList: PropTypes.func,
  match: PropTypes.object,
  loggedIn: PropTypes.bool,
  list: PropTypes.object,
  loading: PropTypes.bool,
};

const mapStateToProps = ({ auth, list: { list, loading } }) => ({
  loggedIn: !auth.loading && auth.isAuthenticated && Boolean(auth.user),
  list,
  loading,
});

export default connect(mapStateToProps, { addTodoItem, getList })(
  UnconnectedList
);
