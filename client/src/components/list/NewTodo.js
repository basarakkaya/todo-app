import React from 'react';
import PropTypes from 'prop-types';

class NewTodo extends React.Component {
  state = {
    text: '',
    dueDate: '',
  };

  onAdd = (e) => {
    e.preventDefault();

    this.props.addTodoItem(
      this.props.listId,
      this.state.text,
      this.state.dueDate
    );

    this.setState({
      text: '',
      dueDate: '',
    });
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    const { text, dueDate } = this.state;

    return (
      <div data-test='component-new-todo'>
        <form onSubmit={this.onAdd}>
          <input
            data-test='new-todo-text'
            type='text'
            name='text'
            value={text}
            onChange={this.onChange}
          />
          <input
            data-test='new-todo-due-date'
            type='date'
            name='dueDate'
            value={dueDate}
            onChange={this.onChange}
          />
          <button data-test='new-todo-create' onClick={this.onAdd}>
            Create To-do
          </button>
        </form>
      </div>
    );
  }
}

NewTodo.propTypes = {
  addTodoItem: PropTypes.func,
  listId: PropTypes.string,
};

export default NewTodo;
