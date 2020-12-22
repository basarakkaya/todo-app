import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { logout } from '../../actions/auth';

const Navbar = ({ logout, auth: { isAuthenticated, loading } }) => {
  const guestLinks = [
    { slug: '/register', text: 'Register' },
    { slug: '/login', text: 'Login' },
  ];

  const authLinks = [
    { slug: '/lists', text: 'Lists' },
    { slug: '/#!', text: 'Logout', onclick: logout },
  ];

  const links = (linksList) => (
    <Fragment>
      {linksList.map((link, index) => (
        <li key={index}>
          <Link
            to={link.slug}
            {...(link.onclick ? { onClick: link.onclick } : {})}
          >
            {link.text}
          </Link>
        </li>
      ))}
    </Fragment>
  );

  return (
    <nav data-test='component-navbar'>
      <Link data-test='navbar-brand' to='/'>
        TodoApp
      </Link>
      <ul
        data-test={isAuthenticated ? 'navbar-auth-links' : 'navbar-guest-links'}
      >
        {!loading && links(isAuthenticated ? authLinks : guestLinks)}
      </ul>
    </nav>
  );
};

Navbar.propTypes = {
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.bool,
    loading: PropTypes.bool.isRequired,
  }).isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
