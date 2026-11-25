# 62-ts-redux-store-fn — a function prop read from the Redux store (React + Redux + Express)

A written fixture for veoagents (#415): its answers are in `expected.yaml`, written from the code.
Shaped like react-redux-realworld-example-app's ListPagination. `props.pager` comes down from
MainView, whose `mapStateToProps` spreads `state.articleList`. The articleList reducer sets
`pager` to the function each list-loading action carries: `Articles.feed` and `Articles.all`
from the tabs and Home's mount, or the tag link's closure over `Articles.byTag`.

| UI action | Requests |
| --- | --- |
| a page link | GET /api/articles, /api/articles/feed or /api/articles/tagged/{tag}: the list's pager, else Articles.all |
| Your Feed | GET /api/articles/feed |
| Global Feed | GET /api/articles |
| a tag | GET /api/articles/tagged/{tag} |
