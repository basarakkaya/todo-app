import React from 'react';
import PropTypes from 'prop-types';

const Surface = ({ children }) => {
  return <div data-test='component-surface'>{children}</div>;
};

Surface.propTypes = {
  children: PropTypes.node,
};

export default Surface;
