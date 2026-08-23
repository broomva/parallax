# Parallax — moved

**This repository is archived and read-only.** Parallax is now the ontology
simulation layer of the [bstack](https://github.com/broomva/skills), and
development continues there.

| | |
|---|---|
| **The layer** | [`broomva/skills` → `skills/simulation/parallax/`](https://github.com/broomva/skills/tree/main/skills/simulation/parallax) |
| **Install** | `npx skills add broomva/skills --skill parallax` |
| **The site's source** | [`broomva/skills` → `parallax-web/`](https://github.com/broomva/skills/tree/main/parallax-web) |

The runtime now ships *inside* the skill, at `skills/simulation/parallax/runtime/`.
Installing the skill installs the layer — which it did not do while the two lived
in separate repositories.

## What Parallax is

A simulation runtime built so that it **cannot lie about being a simulation**.

You point it at a context — a directory, an agent workspace, a table list — and it
proposes an ontology built from what is actually there. A human accepts that
proposal before it can run. It then rolls the accepted model forward under
candidate decisions, so you can see what a change does before you commit to it.

Every answer is typed `observed | simulated`, and the typing happens at birth:
there is no path that adds provenance to a value afterwards, because the
information needed to do it was discarded when the value was created.

Three properties are enforced in code rather than promised in prose:

- **A domain's transition and its invariants are code, never a model.** No model
  computes a ledger and no model judges whether a constraint held.
- **A policy cannot certify its own reproducibility.** `certifyPolicy` runs it
  repeatedly against an identical probe, and demotes a policy that cannot
  reproduce its own output under a fixed seed — whatever it declares about itself.
- **An ontology nobody accepted cannot run.** The accept gate is a runtime check,
  not a type-system convention, and it refuses while any blocking question is open.

## Running the code in this tree

The runtime is still here, and still works — this is the last state it was in
before the move. From a checkout of this repository, with [Bun](https://bun.sh):

```bash
bun install
bun test
bun run demo            # the runtime on one sample flow: run, observe, check, fork, prove
bun link                # then `parallax` anywhere
```

```bash
parallax propose        # reads the directory you are standing in
parallax answer --answer 1=pieces
parallax accept --proposal <ref> --by <who> --acknowledge-unmapped
parallax run --horizon 12 --seed 42
```

For anything other than reading history, use the monorepo copy instead — it is
the one that receives fixes.

## What is still served from here

Nothing in this repository is maintained, but two things it published stay up:

- **The landing page**, <https://broomva.github.io/parallax/> — an archived
  repository keeps serving its GitHub Pages site, so this URL still resolves. It
  is **frozen** at the last build made here. The source moved to `parallax-web/`
  in the monorepo and is not republished from there yet.
- **The hub**, <https://parallax-hub.onrender.com> — still running the last image
  built from this repository. `GET /health` reports the commit it is actually
  running, which is the only field on it a stale image cannot fake.

Rehoming both is tracked separately. Neither is broken; neither can be updated
from here.

## Git history

The full history of the work is preserved in this repository and is not being
rewritten. The move into the monorepo was made as a clean copy rather than a
subtree graft, so the commit log lives here and only here.

## Licence

Apache-2.0. See [LICENSE](./LICENSE). The licence travels with the code to its
new home.
