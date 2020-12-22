import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
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

export default Landing;
