# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Six-operator runtime.** `step`, `observe`, `check`, `rollout`, `traceHash`, and
  `diff` in `src/core/ops.ts`. State is never stored, only projected: `observe` folds the
  log, `step` moves it one event, `rollout` projects it forward under a policy, `diff`
  compares two branches that share a past. The set is closed.
- **Append-only event log with copy-on-write forking.** `bun:sqlite`-backed log in
  `src/core/log.ts`. `fork(name, from, atSeq)` opens a branch that inherits its parent's
  events up to the fork point and writes only its own after it, so a counterfactual costs
  one row, not a copy of history.
- **Reproducibility lattice.** `PINNED` / `STABLE` / `RECORDED` with a `meet` operation,
  in `src/core/hash.ts`. A node is only as reproducible as its weakest input, and a
  seedless derivation is refused `PINNED` however it declares itself. `branchClass`
  answers the same question for a whole branch.
- **Canonical hashing and trace identity.** Sorted-key canonical JSON with decimal number
  encoding, so identical inputs produce identical ids, and `traceHash` turns replay into a
  comparison of two hashes.
- **Conservation-invariant checker.** `check` runs a domain's invariants as pure
  predicates over state and returns violations with the sequence number that caused them.
  Invariants are typed `conservation`, `safety`, or `policy`; conservation invariants are
  the domain-general oracle.
- **Domains as data.** The `TypeRecord` interface — initial state, action surface with
  mandatory units on numeric parameters, transition, invariants — with `storefront` as
  the reference domain and scripted and governed policies in `src/actors/`.
- **`bun run demo`.** A run through the whole surface: run, observe, check, fork, and
  diff, in memory, with no network and no credentials.
- Project scaffolding: Apache-2.0 licence, contribution and security policy, code of
  conduct, issue and pull-request templates, and a CI workflow running lint, tests, and
  the demo on bun.
