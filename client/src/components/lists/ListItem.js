import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ListItem = ({ list: { _id, name, description } }) => {
  return (
    <Link data-test='component-list-item' to={`/list/${_id}`}>
      <p data-test='list-item-name'>{name}</p>
      {description && <p data-test='list-item-description'>{description}</p>}
    </Link>
  );
};

ListItem.propTypes = {
  list: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
};

export default ListItem;
