<!-- .github/copilot-instructions.md -->

# Copilot / AI agent instructions for Chordy

Purpose: make small, correct edits and add features to this Raycast extension (TypeScript + React). Focus on UI/command code in `src/`, manifest in `package.json`, and assets in `assets/`.

Quick facts

- Project type: Raycast extension using TypeScript + React and the `@raycast/api` / `@raycast/utils` libraries.
- Main command entry: `src/index.tsx` (exports `default function Command()` — this is the UI and handler surface).
- Build & dev: scripts in `package.json` use the Raycast CLI (`ray`):
  - `npm run dev` → `ray develop` (developer mode)
  - `npm run build` → `ray build` (production bundle)
  - `npm run lint` → `ray lint` (eslint using @raycast/eslint-config)
  - `npm run publish` → `npx @raycast/api@latest publish` (publishes to Raycast Store)

What to look for (codebase-specific patterns)

- UI components live in `src/` and use `@raycast/api` components (e.g. `Form`, `ActionPanel`, `Action`, `showToast`). Example: `src/index.tsx` defines a `Form` and a handler `handleSubmit(values: Values)`.
- Form field ids map directly to the submitted values object. Keep them consistent:
  - Example: `type Values = { textfield: string; textarea: string }` => the form must have fields with `id="textfield"` and `id="textarea"` to receive those keys. There are currently extra/mismatched ids (e.g. `id="input"`) — be cautious when renaming fields.
- Each command is configured in `package.json`'s `commands` array (name/title/description). The `name` typically corresponds to the source file (e.g. `index` → `src/index.tsx`). If adding a new command, add its entry here and add a matching `src/<name>.tsx` file that exports a default `Command`.

Conventions and gotchas

- Exports: command files must default-export a React function `Command` (no custom runtime wiring exists in this repo).
- TypeScript: keep `tsconfig.json` settings; this repo uses modern TypeScript and React types (`@types/react`).
- Linting: use `npm run lint` / `npm run fix-lint`. The project uses `@raycast/eslint-config`; follow its rules (prettier-compatible).
- Publishing: do not remove or modify `prepublishOnly` unless intentionally publishing to npm (the script intentionally blocks accidental npm publish). Use `npm run publish` to publish to Raycast Store.

Integration points & files to inspect when changing behavior

- `package.json` — commands, scripts, platform targets (Windows/macOS), Raycast schema reference.
- `src/index.tsx` — the current command UI and submit handler; a good example for new commands.
- `assets/` — icon(s) used by the extension.
- `tsconfig.json`, `eslint.config.js` — IDE/build/lint expectations.
- `README.md` — short project description.

Suggested first edits for new contributors or agent actions

- Small UI tweaks: edit `src/index.tsx` (modify `Form.*` components). Ensure ids map to the `Values` shape and update `handleSubmit` accordingly.
- Add a new command: add entry to `package.json` `commands` and create `src/<name>.tsx` with a default-exported `Command` function.
- Validation: run `npm run dev` to test interactively in Raycast developer mode and `npm run lint` to pass lint rules.

When you are unsure

- If a change touches publishing, ask the human — publishing flows are deliberate (prepublish guard is present).
- Preserve package.json fields like `$schema`, `commands`, and `platforms` unless instructed otherwise.

Files to open first

- `package.json`, `src/index.tsx`, `tsconfig.json`, `README.md`, `eslint.config.js`, and `assets/`.

If anything here is unclear or you need more details (tests, CI, or additional commands), ask for clarification and I will expand the instructions.

Musical tool specifics (domain guidance)

- Purpose: the extension takes a chord string (examples: `C maj`, `cmaj7`, `Am`, `G/B`) and outputs the constituent notes (e.g., `C E G` for C major).
- Where to implement logic: add a small, pure module under `src/lib/` or `src/utils/`, e.g. `src/lib/chords.ts`.
- Recommended public API (contract) for the module:
  - `parseChord(input: string): ChordSpec` — normalize input, return an object with { root: string, quality: string, extensions: string[], bass?: string } or throw a clear ParseError on invalid input.
  - `chordToNotes(spec: ChordSpec): string[]` — return ordered pitch names (no octave). Use `C, C#, D, D#, E, F, F#, G, G#, A, A#, B` or prefer flats where appropriate (B♭ as `Bb`).
  - Keep functions pure and well-typed for easy unit testing.
- Input normalization rules to implement (discoverable from UI expectations):
  - Case-insensitive and tolerant to spaces: `c maj`, `Cmaj`, `cmaj7` → treat the same.
  - Support common shorthand: `m`/`min` → minor, `maj`/`M` → major, `dim`, `aug`, numeric extensions like `7`, `9`, `11`, `13` and alterations like `#11`, `b9`.
  - Slash/inversion handling: `G/B` should return chord notes for `G` and indicate `B` as the bass note.
  - Accidentals: accept `#` and `b` (and optionally `♯`/`♭`).
- Edge cases to watch for (include as tests):
  - Bare root `C` → default to major triad.
  - Unrecognized tokens → throw ParseError with helpful message.
  - Enharmonic choices (C# vs Db) — pick a consistent mapping; document it in the module.
  - Complex chords (compound extensions) — parse but allow graceful degradation (e.g., parse `C13b9` into base + extension tokens).
- UI wiring and ergonomics (where to connect parsing to the command):
  - `src/index.tsx` currently exposes a `Form.TextField` with `id="textfield"` and `id="input"` (the latter seems unintended). Use a single field `id="chord"` and update `type Values = { chord: string }`.
  - In `handleSubmit(values)`, call `parseChord(values.chord)` and `chordToNotes(...)`. Display results using `showToast` for small responses, or render a `Form.Description` or open a new `List`/detail view for richer output.
  - Keep UI code minimal: delegate parsing and business logic to the `src/lib/chords.ts` module.
- Tests and validation:
  - Add unit tests for `parseChord` and `chordToNotes` (happy path + 4-6 edge cases). If you prefer lightweight tooling, add `vitest` as a devDependency and a `test` script. Example tests: `C` -> `["C","E","G"]`, `Am` -> `["A","C","E"]`, `G/B` -> base `["G","B","D"]` with bass `B`.
  - Run the app in dev mode (`npm run dev`) for interactive manual testing in Raycast developer mode.

Suggested first implementation steps for the musical feature

1. Create `src/lib/chords.ts` with the `parseChord` and `chordToNotes` function stubs and JSDoc describing the contract.
2. Replace the form field in `src/index.tsx` with `id="chord"` and update `Values` type.
3. Call the library from `handleSubmit`, display results using `showToast` or a small detail view.
4. Add unit tests for parser and chord-to-notes mapping.

Notes

- Keep the parsing logic small and testable — this repo's UI is intentionally minimal; the real value is the chord parsing module.
- Avoid adding heavy runtime dependencies; implement mapping tables (12-tone circle) and simple rules in TypeScript.

Agent style

- Don't use emogies in generated messages, code comments, or docs. Follow plain text for emphasis and punctuation.
