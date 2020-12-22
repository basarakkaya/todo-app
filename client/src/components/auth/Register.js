import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { register } from '../../actions/auth';

export class UnconnectedRegister extends React.Component {
  state = {
    name: '',
    email: '',
    password: '',
  };

  onRegister = (e) => {
    e.preventDefault();
    const { name, email, password } = this.state;
    this.props.register({ name, email, password });
  };

  render() {
    const { name, email, password } = this.state;

    if (this.props.isAuthenticated && !this.props.loading) {
      return <Redirect data-test='register-redirect' to='/' />;
    }

    return (
      <div data-test='component-register'>
        {this.props.loading && <h6>loading...</h6>}
        <form>
          <input
            data-test='register-name'
            type='text'
            value={name}
            onChange={(e) => this.setState({ name: e.target.value })}
          />
          <input
            data-test='register-email'
            type='text'
            value={email}
            onChange={(e) => this.setState({ email: e.target.value })}
          />
          <input
            data-test='register-password'
            type='password'
            value={password}
            onChange={(e) => this.setState({ password: e.target.value })}
          />
          <button
            data-test='register-button'
            type='submit'
            onClick={this.onRegister}
          >
            Register
          </button>
        </form>
      </div>
    );
  }
}

UnconnectedRegister.propTypes = {
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  loading: PropTypes.bool,
};

export default connect(
  ({ auth: { isAuthenticated, loading } }) => ({ isAuthenticated, loading }),
  { register }
)(UnconnectedRegister);
