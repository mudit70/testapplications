import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { push } from 'react-router-redux';
import { REDIRECT } from './actionTypes';
import Home from './Home';
import Register from './Register';
import Settings from './Settings';
import { store } from './store';

const mapStateToProps = (state) => ({ redirectTo: state.redirectTo });

const mapDispatchToProps = (dispatch) => ({
  onRedirect: () => dispatch({ type: REDIRECT }),
});

// Around every page: when an action sets redirectTo, the app goes there.
class App extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.redirectTo) {
      store.dispatch(push(nextProps.redirectTo));
      this.props.onRedirect();
    }
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/register" component={Register} />
        <Route path="/settings" component={Settings} />
      </Switch>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
