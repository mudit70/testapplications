export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, currentPage: action.page };
    case 'APPLY_TAG_FILTER':
      return { ...state, pager: action.pager, tag: action.tag, currentPage: 0 };
    case 'HOME_PAGE_LOADED':
    case 'CHANGE_TAB':
      return { ...state, pager: action.pager, tab: action.tab, currentPage: 0 };
    case 'HOME_PAGE_UNLOADED':
      return {};
    default:
      return state;
  }
};
