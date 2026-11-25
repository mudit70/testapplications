import { combineReducers } from 'redux';
import articleList from './reducers/articleList';
import common from './reducers/common';

export default combineReducers({ articleList, common });
