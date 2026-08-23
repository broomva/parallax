# AGENTS.md

Parallax is a simulation runtime whose product claim is that it *cannot lie about
being a simulation*. Almost every rule below exists because that claim is
checkable, and a change that makes it approximately true has broken the thing.

Read `README.md` for what Parallax does. This file is what an agent needs in
order to change it without breaking a guarantee that nothing will catch.

## Run the gates. All three. In this order.

```bash
bun install
bun test            # 198 pass
bun run typecheck   # tsc --noEmit
bun run mutants     # 5/5 killed, both controls correct
```

**`bun test` does not typecheck.** This suite once went 175-green with a real
type error present, and a top-level-await module marker slipped through the same
way. `bunx tsc --noEmit` is a separate CI step for that reason. A green `bun test`
is not evidence the code compiles.

**A passing suite is not a testing suite.** `bun run mutants` deletes one
guarantee at a time — the accept brand, idempotent acceptance, answer-value
identity, "the newest acceptance" — and reports which ones nothing notices. It
refuses to run against a dirty tree, requires each anchor to match exactly once,
and carries a control in each polarity. If either control misbehaves the run is
invalid, because a harness that cannot see red and a harness that reports noise
are worth the same.

When you fix a defect, mutate the fix in the same commit and watch it go red. Four
survivors were found the first honest run, and all four were acceptance identity —
including a defect that had already been fixed, and had landed with nothing
testing it.

## The three surfaces are one capability set

`src/tools/handlers.ts` is the single implementation. Three surfaces adapt it:

| Surface | Entry | Notes |
|---|---|---|
| CLI | `bin/parallax.ts` → `src/cli.ts` | `bun link` puts `parallax` on PATH |
| Agent tools | `src/tools/index.ts` | JSON Schema + AI SDK adapters, no `ai`/`zod` dependency |
| HTTP hub | `src/hub/app.ts` | `/health`, `/api/*`, `/r/<id>` |

**The agent is a user, not a client library.** A capability reachable on one
surface is reachable on all of them, with the same codes and the same values. This
is not a convention — `test/tools.test.ts` asserts the correspondence: every tool
has exactly one CLI command, every command has a tool behind it or is declared
CLI-only, and every CLI flag maps to a tool field or to a named divergence.

There are exactly two divergences and both are confinement, not capability:

- **`propose --root`** — an arbitrary root is safe at a terminal because the person
  typing the path is the confinement. It is absent from every tool schema because
  inside a sandboxed session a derived path is **denied**, and a denied read comes
  back as an **empty directory rather than an error**. A wrong path would not fail;
  it would read as "your workspace is empty", which is the failure that does not
  announce itself.
- **`receipt --out`** — writes the page to a path. The tool returns paths only, on
  purpose: a receipt is tens of kilobytes and does not belong in a context window.

Adding a tool without a command, or a flag with nothing behind it, goes red in
`describe("the agent is a user: the capability sets correspond")`. Change the
allow-list there and you are changing a claim the landing page makes.

## Invariants you must not quietly relax

- **A domain's transition and its invariants are code, never a model.** No model
  computes a ledger and no model judges whether a constraint held.
- **An ontology nobody accepted cannot run.** The accept gate is a runtime check,
  not a type-system convention, and it refuses while any blocking question is open.
  Units on numeric quantities are always blocking.
- **A policy cannot certify its own reproducibility.** `certifyPolicy` runs it
  against an identical probe repeatedly and demotes it on the branch whatever it
  declares about itself.
- **An `ActiveOntology` cannot cross a process boundary.** It is branded with a
  module-private symbol checked at runtime and does not survive a JSON round-trip
  on purpose: trust cannot be serialised. A session is a **new OS process every
  turn**, so acceptance round-trips as *data* and the ontology is re-minted
  in-process on every run. A `Map<ontologyId, ActiveOntology>` passes every
  single-process test and evaporates in production. Never add one.
- **Nothing throws to a caller.** Every surface returns `{ok:true,value}` or
  `{ok:false,error:{code,reason,detail?}}`. The `try/catch` in `runTool` and
  `runCli` is a backstop that should never fire, not the error mechanism.
- **Exit codes: 0 success, 2 a typed refusal, 1 an unexpected throw.** 2 and 1 are
  different on purpose. Collapsing them makes every refusal look like a crash,
  which is how a fail-closed system gets described as flaky.

## Traps, each of which has cost someone an hour

1. **`origin` pushes to TWO remotes and is silently partial.** `git push origin main`
   can land on one and not the other. Push each explicitly and verify:
   ```bash
   git push origin main && git push team main
   gh api repos/broomva/parallax/commits/main --jq .sha
   gh api repos/platanus-hack/platanus-hack-26-co-team-5/commits/main --jq .sha
   ```
   The two shas must match. A dashboard is not evidence.
2. **Never read `$?` after a pipe.** `cmd | tail -5; echo $?` reports *tail's*
   status, so a failed build prints `0`. Redirect to a file and capture directly.
3. **`out/` is gitignored.** An artifact anyone else needs — a video, a receipt, a
   screenshot — written there exists on exactly one laptop. `docs/` is tracked.
4. **Verify a deploy with `/health`, never a deploy API.** `/health` reports the
   running **commit**. A deploy-status API reports that a deploy was *accepted*, and
   `version` is a source constant; neither can tell you which code is serving.
   ```bash
   scripts/warm-hub.sh    # deployed commit + how far local HEAD has run ahead
   ```
5. **Render's `autoDeploy` is set and INERT** — the service was created via the API
   against a public URL, so no webhook was ever installed. `.github/workflows/deploy.yml`
   deploys on push and **skips cleanly** until `RENDER_DEPLOY_HOOK_URL` exists. Do not
   set that secret during a demo window: the free plan runs one instance, so a deploy
   is downtime.
6. **Render has no `bun` runtime.** `render.yaml` is `runtime: node` with `bun.lock`
   tracked. Do not "fix" it to bun.
7. **A red CI step masks every step after it.** A job stops at its first failure, so
   "failed on Lint" means Typecheck, Test and the demo smoke test are *unmeasured*.
   Run the rest locally before pushing the fix.
8. **A plan document is not a description of the software.** A brief written before
   the build describes what was *intended*, and nothing marks it stale when the
   build goes elsewhere. Diff any pre-code document against the tree before
   executing it — `docs/demo-script.md` exists because an earlier beat sheet
   scripted a demo of software that was never built.

## Where state lives

`.parallax/` in the working directory — pending proposals, acceptance receipts,
runs, rendered receipt pages. It is per-workspace and it is the authority; the
conversation is not. `parallax status` reads it from disk, which is the correct
first move on any turn that mentions accepting, running, answering, or a previous
proposal. Never infer the state from message history.

## Style

Comments explain **why**, and name the failure the code is preventing — usually one
that actually happened. A comment restating the code is noise. Prose in this repo
states what is true and what is not built; it does not oversell. If you cannot
support a number, say so instead of publishing it.

Formatting is Biome (`bun run lint`), never ESLint or Prettier.
