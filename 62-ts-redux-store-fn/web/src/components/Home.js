import React from 'react';
import { connect } from 'react-redux';
import agent from '../agent';
import MainView from './MainView';
import Tags from './Tags';

const mapStateToProps = state => ({
  token: state.common.token,
});

const mapDispatchToProps = dispatch => ({
  onClickTag: (tag, pager, payload) => dispatch({ type: 'APPLY_TAG_FILTER', tag, pager, payload }),
  onLoad: (tab, pager, payload) => dispatch({ type: 'HOME_PAGE_LOADED', tab, pager, payload }),
  onUnload: () => dispatch({ type: 'HOME_PAGE_UNLOADED' }),
});

class Home extends React.Component {
  componentWillMount() {
    const tab = this.props.token ? 'feed' : 'all';
    const articlesPromise = this.props.token ? agent.Articles.feed : agent.Articles.all;
    this.props.onLoad(tab, articlesPromise, articlesPromise(0));
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <div>
        <MainView />
        <Tags onClickTag={this.props.onClickTag} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
