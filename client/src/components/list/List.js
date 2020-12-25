import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import NewTodo from './NewTodo';
import TodoItem from './TodoItem';

import { getList } from '../../actions/list';

export const UnconnectedList = ({
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
      <NewTodo data-test='list-new-todo' listId={listId} />
      {loading && <div data-test='list-loader'></div>}
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

export default connect(mapStateToProps, { getList })(UnconnectedList);
