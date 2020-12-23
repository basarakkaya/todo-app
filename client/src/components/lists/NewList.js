import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { addList } from '../../actions/list';

export class UnconnectedNewList extends React.Component {
  state = {
    name: '',
    description: '',
  };

  onAdd = (e) => {
    e.preventDefault();

    this.props.addList(this.state.name, this.state.description);

    this.setState({
      name: '',
      description: '',
    });
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    const { name, description } = this.state;

    return (
      <div data-test='component-new-list'>
        <form onSubmit={this.onAdd}>
          <input
            data-test='new-list-name'
            name='name'
            placeholder='list name'
            value={name}
            onChange={this.onChange}
          />
          <input
            data-test='new-list-description'
            name='description'
            placeholder='list description'
            value={description}
            onChange={this.onChange}
          />
          <button data-test='new-list-create' onClick={this.onAdd}>
            Create List
          </button>
        </form>
      </div>
    );
  }
}

UnconnectedNewList.propTypes = {
  addList: PropTypes.func.isRequired,
};

export default connect(null, { addList })(UnconnectedNewList);
