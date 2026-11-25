# 41-ts-context-values — context values, form-field handlers and the app's own host

A written fixture for veoagents: its answers are in `expected.yaml`, written from the code
(veoagents #389, from full-stack-fastapi-template's sidebar, openstatus's status form and
realworld's front end).

| UI action (`web/src/components/Shelf.tsx`) | How it is wired | Requests |
| --- | --- | --- |
| Refresh | `const { refetch } = useItems()`, where `useItems()` returns `useContext(ItemsContext)` after a null check, and the provider's value gives `refetch` | GET /api/items |
| Add | `const shelf = useItems(); shelf.add("book")`: the context's value held whole | POST /api/items, GET /api/items |
| Remove | `removeItem("1")`, to `https://api.shelf.example/api/items/1` | DELETE /api/items/{id} |
| Profile | `me()`, to `https://api.shelf.example/api/me` | GET /api/me |
| Status (`Select.tsx`) | the app's own `<Select onValueChange={field.onChange}>` inside react-hook-form's `Controller`: it only moves form state | none |

The web app calls its own API (`api/`) by its public address, so every request is the API's,
and none of them reaches an outside service.
