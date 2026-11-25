# 43-ts-redux — React class components and Redux

A written fixture for veoagents (#383), in the shape of react-redux-realworld-example-app. Its
answers are in `expected.yaml`, written from the code.

| UI action | Shape | Reaches |
| --- | --- | --- |
| Sign up | `onSubmit={this.submitForm(this.props.username)}`, a curried constructor handler; `this.props.onSubmit` from mapDispatchToProps; REGISTER sets `redirectTo: '/'`, which App pushes | POST /api/users, then Home's mount GET /api/articles |
| Type a username | `this.changeUsername` set in the constructor; `onChangeUsername` only dispatches | nothing counted, no Unknown |
| Save settings | `this.props.onSubmitForm`, which the parent class hands on from mapDispatchToProps; SETTINGS_SAVED sets `redirectTo` | PUT /api/user, then GET /api/articles |
| Edit bio | `onChange={this.updateState('bio')}`, curried | nothing counted, no Unknown |
| Favorite | a function component's `props.favorite`, whose mapDispatchToProps function makes the request | POST /api/articles/{slug}/favorite |
