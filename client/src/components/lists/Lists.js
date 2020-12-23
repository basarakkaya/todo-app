import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import NewList from './NewList';
import ListItem from './ListItem';

import { getLists } from '../../actions/list';

export const UnconnectedLists = ({
  loggedIn,
  lists = [],
  loading,
  getLists,
}) => {
  React.useEffect(() => {
    if (!loggedIn) return;

    getLists();
  }, [getLists, loggedIn]);

  return (
    <div data-test='component-lists'>
      <NewList data-test='lists-new-list' />
      {loading && <div data-test='lists-loader'>Loading lists...</div>}
      <div data-test='lists-list-container'>
        {lists.length > 0
          ? lists.map((list) => {
              return (
                <ListItem data-test='lists-list' key={list._id} list={list} />
              );
            })
          : 'You do not have any lists'}
      </div>
    </div>
  );
};

UnconnectedLists.propTypes = {
  loggedIn: PropTypes.bool,
  lists: PropTypes.array,
  loading: PropTypes.bool,
  getLists: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth, list: { lists, loading } }) => ({
  loggedIn: !auth.loading && auth.isAuthenticated && Boolean(auth.user),
  lists,
  loading,
});

export default connect(mapStateToProps, {
  getLists,
})(UnconnectedLists);
