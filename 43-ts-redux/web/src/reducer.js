import { REDIRECT, REGISTER, SETTINGS_SAVED } from './actionTypes';

// Where App sends the user next: set by the actions that finish a page.
export default (state = {}, action) => {
  switch (action.type) {
    case REGISTER:
    case SETTINGS_SAVED:
      return { ...state, redirectTo: action.error ? null : '/' };
    case REDIRECT:
      return { ...state, redirectTo: null };
    default:
      return state;
  }
};
