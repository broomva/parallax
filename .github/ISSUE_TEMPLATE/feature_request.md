---
name: Feature request
about: Propose a capability, a domain, or a change to the interface
title: ""
labels: enhancement
assignees: ""
---

## The problem

<!-- What you are trying to do, and where the current interface stops you. -->

## What you would like

<!-- The shape of the thing. Types or a call signature beat prose. -->

## Alternatives you considered

<!-- Including doing it outside Parallax. Say why that is worse. -->

## Scope

- [ ] This is domain data (a `TypeRecord`, a policy, a seed template)
- [ ] This changes the core runtime
- [ ] This adds or changes an operator

If it adds or changes an operator, this issue is the design discussion. Please cover:

1. The signature, and why it cannot be composed from `step`, `observe`, `check`,
   `rollout`, `traceHash`, and `diff`.
2. What class of answer it returns, and how its output's lattice class follows from its
   inputs.
3. What it means for `traceHash` — whether two branches that agree today could disagree
   under it.

## Anything else
