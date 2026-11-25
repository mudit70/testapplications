import React from 'react';
import { connect } from 'react-redux';
import agent from './agent';
import { SETTINGS_SAVED } from './actionTypes';

class SettingsForm extends React.Component {
  constructor() {
    super();
    this.state = { bio: '' };
    // A field's handler, made per field: client state only.
    this.updateState = (field) => (ev) => {
      this.setState({ ...this.state, [field]: ev.target.value });
    };
    this.submitForm = (ev) => {
      ev.preventDefault();
      this.props.onSubmitForm({ ...this.state });
    };
  }

  render() {
    return (
      <form onSubmit={this.submitForm}>
        <textarea value={this.state.bio} onChange={this.updateState('bio')} />
        <button type="submit">Update</button>
      </form>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  onSubmitForm: (user) => dispatch({ type: SETTINGS_SAVED, payload: agent.Auth.save(user) }),
});

// Hands the store's onSubmitForm on to the form.
class Settings extends React.Component {
  render() {
    return <SettingsForm onSubmitForm={this.props.onSubmitForm} />;
  }
}

export default connect(() => ({}), mapDispatchToProps)(Settings);
