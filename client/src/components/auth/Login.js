import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { login } from '../../actions/auth';

export class UnconnectedLogin extends React.Component {
  state = {
    email: '',
    password: '',
  };

  onLogin = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    this.props.login({ email, password });
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    const { email, password } = this.state;

    if (this.props.isAuthenticated && !this.props.loading) {
      return <Redirect data-test='login-redirect' to='/' />;
    }

    return (
      <div data-test='component-login'>
        {this.props.loading && <h6>loading...</h6>}
        <form onSubmit={this.onLogin}>
          <input
            data-test='login-email'
            type='text'
            value={email}
            name='email'
            onChange={this.onChange}
          />
          <input
            data-test='login-password'
            type='password'
            value={password}
            name='password'
            onChange={this.onChange}
          />
          <button data-test='login-button' type='submit' onClick={this.onLogin}>
            Login
          </button>
        </form>
      </div>
    );
  }
}

UnconnectedLogin.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  loading: PropTypes.bool,
};

export default connect(
  ({ auth: { isAuthenticated, loading } }) => ({ isAuthenticated, loading }),
  { login }
)(UnconnectedLogin);
