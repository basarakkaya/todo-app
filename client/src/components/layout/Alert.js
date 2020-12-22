import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Alert = ({ alert }) => {
  return (
    <div data-test='component-alert'>
      <ul>
        {alert.map((item) => (
          <li data-test='alert-item' key={item.id} className={item.alertType}>
            {item.msg}
          </li>
        ))}
      </ul>
    </div>
  );
};

Alert.propTypes = {
  alert: PropTypes.array.isRequired,
};

const mapStateToProps = ({ alert }) => ({
  alert,
});

export default connect(mapStateToProps)(Alert);
