import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div data-test='component-not-found'>
      <h1 data-test='not-found-error-message'>Page is not found</h1>
      <Link data-test='not-found-homepage-link' to='/'>
        Return to homepage
      </Link>
    </div>
  );
};

export default NotFound;
