import React from 'react';
import ListPagination from './ListPagination';

const ArticleList = props => {
  if (!props.articles) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {props.articles.map(a => (
        <div key={a.slug}>{a.slug}</div>
      ))}
      <ListPagination pager={props.pager} />
    </div>
  );
};

export default ArticleList;
