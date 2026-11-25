import React from 'react';
import { connect } from 'react-redux';
import agent from './agent';
import { REGISTER, UPDATE_FIELD_AUTH } from './actionTypes';

const mapStateToProps = (state) => ({ ...state.auth });

const mapDispatchToProps = (dispatch) => ({
  onChangeUsername: (value) => dispatch({ type: UPDATE_FIELD_AUTH, key: 'username', value }),
  onSubmit: (username) => {
    const payload = agent.Auth.register(username);
    dispatch({ type: REGISTER, payload });
  },
});

class Register extends React.Component {
  constructor() {
    super();
    this.changeUsername = (ev) => this.props.onChangeUsername(ev.target.value);
    // Curried: the form's handler is what submitForm(username) returns.
    this.submitForm = (username) => (ev) => {
      ev.preventDefault();
      this.props.onSubmit(username);
    };
  }

  render() {
    return (
      <form onSubmit={this.submitForm(this.props.username)}>
        <input value={this.props.username} onChange={this.changeUsername} />
        <button type="submit">Sign up</button>
      </form>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
