import React from 'react';
import { connect } from 'react-redux';
import agent from '../agent';

const mapDispatchToProps = dispatch => ({
  onSetPage: (page, payload) => dispatch({ type: 'SET_PAGE', page, payload }),
});

// The pager is the function the list was loaded with, which the store holds.
const ListPagination = props => {
  const setPage = page => {
    if (props.pager) {
      props.onSetPage(page, props.pager(page));
    } else {
      props.onSetPage(page, agent.Articles.all(page));
    }
  };
  const pages = [0, 1, 2];
  return (
    <ul className="pagination">
      {pages.map(p => {
        const onClick = ev => {
          ev.preventDefault();
          setPage(p);
        };
        return (
          <li key={p} onClick={onClick}>
            {p + 1}
          </li>
        );
      })}
    </ul>
  );
};

export default connect(() => ({}), mapDispatchToProps)(ListPagination);
