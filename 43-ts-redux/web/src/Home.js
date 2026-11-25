import React from 'react';
import { connect } from 'react-redux';
import agent from './agent';
import { HOME_PAGE_LOADED } from './actionTypes';
import ArticlePreview from './ArticlePreview';

const mapStateToProps = (state) => ({ articles: state.articles || [] });

const mapDispatchToProps = (dispatch) => ({
  onLoad: (payload) => dispatch({ type: HOME_PAGE_LOADED, payload }),
});

class Home extends React.Component {
  componentWillMount() {
    this.props.onLoad(agent.Articles.all());
  }

  render() {
    return (
      <div>
        {this.props.articles.map((a) => (
          <ArticlePreview key={a.slug} article={a} />
        ))}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
