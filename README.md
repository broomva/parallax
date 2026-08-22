# Parallax

**Track:** Simulations · **Team:** team-5 · Platanus Hack 26 Bogota

A developer platform that produces simulation results you can check.

You point Parallax at a context — a business's data, an agent workspace, or an
arbitrary local directory — and it proposes an ontology built from what is
actually there. You accept that proposal before it becomes active. It then rolls
the accepted model forward under candidate decisions, so you can see what a
change does before you commit to it.

Every answer is typed `observed | simulated`. Nothing in the system can produce
a number without saying how much of it was real.

## Why this is not another simulator

A simulator's output is unfalsifiable by default: it produces confident numbers
about a world that does not exist. The usual response is to claim more fidelity,
which cannot be checked inside a three-minute conversation.

Parallax takes the other route. Determinism is checkable in five seconds, and
reproducibility is a property the system carries, propagates, and withdraws on
its own. The design target is not a simulator that is right. It is a simulator
that cannot lie about being a simulator.

Three things follow from that, and all three are enforced in code:

- **A domain's transition and its invariants are code, never a model.** No model
  computes a ledger and no model judges whether a constraint held.
- **A policy cannot certify its own reproducibility.** `certifyPolicy` runs it
  repeatedly against an identical probe. A policy that cannot reproduce its own
  output under a fixed seed is demoted whatever it declares about itself, and
  the demotion is written onto the branch.
- **An ontology nobody accepted cannot run.** The accept gate is a runtime
  check, not a type-system convention, and it refuses while any blocking
  question is open. Units on numeric quantities are always blocking.

## Run it

Requires [Bun](https://bun.sh).

```bash
bun install
bun run demo     # the runtime on one sample flow: run, observe, check, fork, prove
bun test
bun run lint
```

The demo runs a WhatsApp storefront under an ungoverned sales agent, catches it
overselling stock it does not have, forks the history at the moment before the
damage, replays the same twelve steps with a governor installed, and prints the
difference. It finishes by proving replay is a hash comparison rather than a
claim: the same seed produces an identical trace hash, a different seed
diverges, and an unpinned actor causes the branch to withdraw its own
reproducibility claim.

## The shape of it

A domain arrives as data. The runtime never changes.

| Slot | Supplies | Who computes it |
|---|---|---|
| `state` | typed fields, units mandatory | schema |
| `actions` | name, actor, params | schema |
| `transition` | how an action changes the state | code, never a model |
| `invariants` | what must always hold | code, never a model |
| `initial` | where it starts | data |

Six operators are closed over that record: `step`, `observe`, `check`,
`rollout`, `diff`, `traceHash`. Adding a domain adds a record. Adding a
capability adds an operator, and there are six of those. That asymmetry is what
separates a simulation runtime from a pile of bespoke simulators.

## The agent is a user

Every capability a human can reach is reachable programmatically, and every
failure is a value with a stable machine-readable code rather than a thrown
string a caller has to parse. Error types are per-operation: a plugin failure
inside a rollout carries a partial trajectory, the same failure at registration
carries nothing, and a single error type cannot express that difference.

```ts
const proposal = proposeOntology({ kind: "filesystem", root: "./src" });
if (!proposal.ok) return proposal.error.code; // SOURCE_UNREADABLE | SOURCE_EMPTY | ...

const active = activate(proposal.value, { transition, invariants, answered, acceptedBy, at });
if (!active.ok) return active.error.code;     // BLOCKING_QUESTIONS_OPEN | NO_INVARIANTS | ...
```

## Status

The runtime, the log with copy-on-write forking, the reproducibility lattice,
the conservation-invariant checker, the ontology proposal and its accept gate
all exist and run. The LLM policy adapter, a second domain, the HTTP surface and
the web console are designed and not built. Nothing here has been calibrated
against a real business, because we have no real transcripts — that is the
oldest open item in this project and it cannot be closed by writing code.

We would rather say that than publish an accuracy number we cannot support.

## Team

- Santiago Nicolas Ceron Dimate ([@nicoceron](https://github.com/nicoceron))
- Carlos Escobar ([@broomva](https://github.com/broomva))
- Julian Moreno ([@julianmorenor](https://github.com/julianmorenor))

## Licence

Apache-2.0. See [LICENSE](./LICENSE).
