import React from 'react';
import { connect } from 'react-redux';
import agent from './agent';
import { ARTICLE_FAVORITED } from './actionTypes';

// The request is made in the function mapDispatchToProps gives the component.
const mapDispatchToProps = (dispatch) => ({
  favorite: (slug) => dispatch({ type: ARTICLE_FAVORITED, payload: agent.Articles.favorite(slug) }),
});

const ArticlePreview = (props) => {
  const handleClick = (ev) => {
    ev.preventDefault();
    props.favorite(props.article.slug);
  };
  return <button onClick={handleClick}>Favorite</button>;
};

export default connect(() => ({}), mapDispatchToProps)(ArticlePreview);
