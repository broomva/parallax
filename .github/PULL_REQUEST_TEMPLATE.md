## What this changes

<!-- One or two sentences. What is different after this lands? -->

## Why

<!-- The problem, or a link to the issue. If it is a fix, what was the failure? -->

## Kind of change

- [ ] Domain data (a `TypeRecord`, a policy, a seed template)
- [ ] Core runtime (`src/core/`)
- [ ] Tooling, CI, or docs
- [ ] Adds or changes an operator — link the design discussion issue

## Checks

- [ ] `bun run lint` clean
- [ ] `bun test` passing
- [ ] `bun run demo` runs end to end
- [ ] The six operators are unchanged, or the design discussion is linked above
- [ ] Numeric action parameters declare a unit
- [ ] Commits follow Conventional Commits

## Evidence

<!--
What you actually ran, and what it printed. Paste output rather than describing it.
For a behaviour change, the test that fails without the fix is the best evidence.
-->

## Notes for the reviewer

<!-- Anything you want looked at closely, or decided differently. Delete if none. -->
