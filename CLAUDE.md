# Portfolio

Bun workspaces: `web/` (Astro site) and `studio/` (Sanity Studio, project `1dyyk69c`, dataset `production`).

## Writing Sanity content through the API

The mutate API does not check documents against the schema, so a wrong value type is saved silently and only shows up as "Invalid property value" in the Studio.

- Every `portableText` field is an array of blocks, never a string. That covers `introSection.description`, `pageHeading.description`, `richTextSection.body`, `infoSection.body` and the `body` of `work`, `product` and `post`. One paragraph is:

  ```json
  [{"_type": "block", "_key": "b1", "style": "normal", "markDefs": [],
    "children": [{"_type": "span", "_key": "s1", "text": "…", "marks": []}]}]
  ```

- Check the field types in `studio/schemaTypes` before writing a new kind of document or section.
- After any content write, run `bun run content:check` (export `SANITY_AUTH_TOKEN` from `studio/.env` first) and fix every error it lists before reporting the work done.
