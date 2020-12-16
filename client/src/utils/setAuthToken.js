import axios from 'axios';

/**
 * @description Sets or removes `x-auth-token` header of `Axios` commons
 * @param {string} token Authorization Token
 */
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
