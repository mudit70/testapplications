# 48-ts-store-callbacks

A Vue + Pinia front end (`web`) and its Express API (`api`), for veoagents #371 (filebrowser's
confirmation prompts).

- An opener (`views/Shares.vue`, `views/User.vue`) calls
  `layoutStore.showHover({ prompt: "share-delete", confirm: () => … })`. The action pushes
  `{ prompt: value.prompt, confirm: value?.confirm }` into `state.prompts`, and the
  `currentPrompt` getter returns the last record.
- A prompt's button runs `currentPrompt.confirm()`: from a method through `mapState`
  (`ShareDelete.vue`), named in the template (`DeleteUser.vue`:
  `@click="layoutStore.currentPrompt?.confirm"`), or through `const { currentPrompt } =
  layoutStore` (`CurrentPassword.vue`).
- `prompts/Prompts.vue` maps each prompt name to its component, so each prompt runs only the
  callbacks its openers stored under its name. The openers request nothing themselves.

Answers are in `expected.yaml`, written from the code.
