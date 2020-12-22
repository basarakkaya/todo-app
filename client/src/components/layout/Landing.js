import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect data-test='landing-redirect' to='/lists' />;
  }

  return (
    <div data-test='component-landing'>
      <h1>Welcome!</h1>
      <Link data-test='landing-login-link' to='/login'>
        Login
      </Link>
      <Link data-test='landing-register-link' to='/register'>
        Register
      </Link>
    </div>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
};

export default connect(({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
}))(Landing);
