import React from 'react';
import agent from '../agent';

const Tags = props => {
  const tags = ['go', 'react'];
  return (
    <div>
      {tags.map(tag => {
        const handleClick = ev => {
          ev.preventDefault();
          props.onClickTag(tag, page => agent.Articles.byTag(tag, page), agent.Articles.byTag(tag, 0));
        };
        return (
          <a href="" key={tag} onClick={handleClick}>
            {tag}
          </a>
        );
      })}
    </div>
  );
};

export default Tags;
