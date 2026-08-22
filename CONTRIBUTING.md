# Contributing to Parallax

Parallax rolls a model of a context forward under candidate decisions and types every
answer it gives back as `observed` or `simulated`. The runtime is small on purpose. Most
contributions should add data — a domain, a policy, a seed template — rather than
platform code.

The repository directory is still named `simulacro`. That is history, not a second
product name. Do not rename it.

## Setup

Parallax runs on [bun](https://bun.sh). There is no npm or yarn path; the SQLite layer is
`bun:sqlite`, so another runtime will not start it.

```sh
bun install
bun run demo    # end-to-end walkthrough, in-memory, no network, no keys
bun test
bun run lint    # biome check .
```

`bun run demo` is also the smoke test in CI. If your change breaks it, CI goes red before
any test does.

## Conventions

- **bun** for install, run, and test. Never npm, yarn, or pnpm — and never commit a
  lockfile from one of them.
- **Biome** for linting and formatting. Never ESLint, never Prettier. Config is
  `biome.json`: two-space indent, 100-column lines. `bunx biome check --write .` applies
  what `bun run lint` complains about.
- **TypeScript strict**, including `noUncheckedIndexedAccess`. Prefer narrowing over
  casts; a cast in core is a review question.
- Comments explain why, not what. If a function needs a comment to say what it does, the
  name is wrong.

## Commit style

[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>(<optional scope>): <imperative subject>
```

Types in use: `feat`, `fix`, `docs`, `refactor`, `test`, `perf`, `build`, `ci`, `chore`.
Scope is usually the area touched — `core`, `worlds`, `actors`, `ci`.

```
feat(worlds): add a subscription-billing domain
fix(core): keep seedless derivations out of PINNED
docs: describe the reproducibility lattice
```

Subject in the imperative, no trailing full stop, under about 72 characters. Breaking
changes take a `!` after the type and a `BREAKING CHANGE:` footer.

## Adding a domain

A domain is **data**, not platform code. It is one `TypeRecord` — see
`src/core/types.ts` — with five slots:

| Slot | What it is |
| --- | --- |
| `slug`, `title` | identity |
| `initial` | the state the log folds onto |
| `actions` | the action surface, with a declared unit for every numeric parameter |
| `transition` | how one event moves state |
| `invariants` | predicates that say whether state is still legal |

`transition` and `invariants` are written as functions, and that is deliberate: a model
never computes a ledger and never rules on whether an invariant held. Being expressed in
code does not make them runtime — they are still the domain's data, and they belong in
`src/worlds/`, not `src/core/`.

Practical notes when adding one:

- Model it against `src/worlds/storefront.ts`. It is the reference shape.
- Every numeric parameter needs a unit in `units`. Materialisation fails closed without
  one, so an omitted unit is a runtime error, not a lint nit.
- Include at least one `kind: "conservation"` invariant. Conservation invariants are the
  cheap oracle — domain-general, and hard to satisfy by accident.
- Add a test that runs the domain forward and asserts on the invariants it should trip,
  not only on the ones it should hold.
- Adding a domain should touch zero files under `src/core/`. If it cannot, say so in the
  PR, because that is a runtime gap and worth discussing on its own.

## The six operators are a closed set

`src/core/ops.ts` exports six operators, and only six:

`step` · `observe` · `check` · `rollout` · `traceHash` · `diff`

Everything else in Parallax is a composition of those. The closure is the point: each one
carries a defined meaning for the `observed | simulated` typing and for the
reproducibility lattice, and a seventh operator has to answer for both.

So a PR that adds an operator needs a design discussion first. Open an issue before
writing the code, and cover:

1. The signature, and why the behaviour cannot be composed from the existing six.
2. What class of answer it returns, and how the lattice class of its output is derived
   from its inputs.
3. What it does to `traceHash` — whether two branches that agree under the current six
   can disagree under yours.

A PR that adds a seventh operator without that discussion will be asked for it, whatever
the code looks like.

## Pull requests

- Branch from `main`, keep the change to one concern.
- `bun run lint`, `bun test`, and `bun run demo` all clean locally before you push.
- Fill in the PR template. In particular say whether the change is domain data or core
  runtime — the two get read very differently.
- New behaviour comes with a test. A fix comes with the test that would have caught it.

## Reporting problems

Bugs and feature requests go through the issue templates. Security vulnerabilities do
not — see [SECURITY.md](SECURITY.md).
