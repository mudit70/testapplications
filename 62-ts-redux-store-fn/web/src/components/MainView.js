import React from 'react';
import { connect } from 'react-redux';
import agent from '../agent';
import ArticleList from './ArticleList';

const YourFeedTab = props => {
  const clickHandler = ev => {
    ev.preventDefault();
    props.onTabClick('feed', agent.Articles.feed, agent.Articles.feed(0));
  };
  return (
    <a href="" onClick={clickHandler}>
      Your Feed
    </a>
  );
};

const GlobalFeedTab = props => {
  const clickHandler = ev => {
    ev.preventDefault();
    props.onTabClick('all', agent.Articles.all, agent.Articles.all(0));
  };
  return (
    <a href="" onClick={clickHandler}>
      Global Feed
    </a>
  );
};

const mapStateToProps = state => ({
  ...state.articleList,
  token: state.common.token,
});

const mapDispatchToProps = dispatch => ({
  onTabClick: (tab, pager, payload) => dispatch({ type: 'CHANGE_TAB', tab, pager, payload }),
});

const MainView = props => (
  <div>
    <YourFeedTab onTabClick={props.onTabClick} />
    <GlobalFeedTab onTabClick={props.onTabClick} />
    <ArticleList pager={props.pager} articles={props.articles} />
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
