# Parallax — the three-minute demo

**Read this on a phone at 09:55.** Hacking stops Sun 2026-08-23 **09:15** COT; presentations 10:00–13:00.

> The beat sheet in `2026-08-22-simulacro-hackathon-brief.html` §06 is **stale**. It scripts 300
> synthetic customers, a wall of streaming conversations, and a 62%→84% close rate. That product
> was never built. This is the beat sheet for the product that exists.

## What the organisers actually specified

From the official *cómo hacer un buen demo* deck, because two of these were assumed wrong
earlier in this arc:

- **3 minutes, and the hard stop is 3:01.** Then 2 min of questions, then 1:30 while the judges
  score. The beat sheet below is already 3 minutes. Do not stretch it.
- **Stop hacking 09:15**, demos 10:00, evaluation ends 13:00. (An earlier handoff said 09:30.)
- **Judged on five weighted axes:** aspecto técnico **25%** · ambición **20%** · ejecución **20%** ·
  impacto **20%** · originalidad **15%**. Technical is the single heaviest, and ambición+impacto
  together are 40% -- so the honest-status beat and the generality claim are not modesty, they are
  the two heaviest categories being answered directly.
- **Suggested shape:** problema ~20s · solución/impacto/ambición ~20-30s · demo ~125-140s.
- **Dark mode**, explicitly so it survives the restream. Titles must carry a message rather than
  name a section.
- **The demo is recorded and published during the week.** What is said on stage outlives the room.

## The companion surface

`https://broomva.github.io/parallax/demo/` is the pitch page: the whole idea as scroll cinema,
then the four guarantees, then what is built against what is not. It is linked from the landing
nav. **It is not the demo** -- the demo is the terminal, live, against the deployed hub. Use the
page for the QR/link at the end and for anyone who asks "where can I see this again", and if the
venue network dies before `demo:live` runs, it is a better fallback than talking over a dead
terminal because every frame of it is served from Pages rather than from the hub.

## Before you walk up

```bash
cd ~/broomva/apps/parallax
scripts/warm-hub.sh             # or: curl -s https://parallax-hub.onrender.com/health
```

A cron on the always-on VPS (`srv1692698`) already pings `/health` every 10 minutes from
**08:00–13:50 COT today**, so the hub should be warm when you arrive whether or not anyone's laptop
is open. It is pinned to 23 Aug and stops firing by itself. Remove early with:
`ssh agent@100.82.195.109 "crontab -l | grep -v parallax-demo-warm | crontab -"`. Run `warm-hub.sh`
anyway — it is the check that tells you the deployed commit.

If it prints **`local HEAD is N commit(s) ahead of what is deployed`**, the opening beat gets weaker
— you would be saying "this is the code in the repo" while showing an older commit. Either redeploy
(`./scripts/deploy-render.sh --deploy`, about three minutes, wait for `health check 200`) or say
plainly that the hub is running the last deployed commit. Do not skip the line and hope. The backup
video shows the commit that was deployed when it was recorded, so a mismatch there is expected and
harmless.

Render's free tier spins down after 15 minutes idle. Measured cold start: **12.4s**. Warm: **0.22s**.
Warm it within 10 minutes of going on stage, and again while the team before you is presenting.

Have open, in this order: a terminal, and `docs/backup-demo.mp4` minimised behind it.

## The command

```bash
PARALLAX_PACE=1.4 bun run demo:live
```

`PARALLAX_PACE` dials the whole thing: `1` runs 12.5s, `1.8` runs 21.5s. `--fast` is for CI, not stage.

---

## Beat sheet

| Time | Beat | What you say |
|---|---|---|
| **0:00** | Cold open, no slides | "There is no staging environment for the way a business actually operates. You change a price, a return policy, an escalation threshold — and you find out what happened after it happened, usually because a customer told you." |
| **0:20** | Run the command. It opens on `/health` and prints a commit SHA. | "Before I show you anything: this is the commit the server is running. Not a version string — that is a constant somebody typed. Not the deploy dashboard — that reports intent. The commit is the only field on that response a stale image cannot fake. What you are about to see is the code in the repo." |
| **0:40** | A WhatsApp message arrives. The hub reads the context and proposes an ontology. | "A message comes in on WhatsApp, because that is where LatAm already operates. The runtime reads the context it was pointed at and proposes a model built from **what is actually there** — these things exist, these actions are possible, these are the facts that can never stop being true." |
| **1:00** | **Let the proposal sit.** This is the read-beat; the script pauses 3.2s here on purpose. | "Nothing has run. Read what it is doing: it is asking permission. And look at the blocking questions — it will not activate without a unit on a numeric quantity. It fails closed. It does not guess. An ontology nobody reviewed should not be able to produce numbers that look authoritative." |
| **1:20** | The human answers the numbered questions and says *sí, dale*. | "The human accepts, on their phone. That step is not paperwork. That step is the product." |
| **1:35** | It runs. 12 steps, **0 violations** governed against an ungoverned baseline of **9**. | "Now it rolls the model forward under the decision you are considering. Twelve steps. Nine things broke ungoverned; zero with the governor installed. And every value comes back typed — `observed` or `simulated`. A number derived from anything simulated is simulated, no matter how much real data went in beside it." |
| **2:00** | The receipt. The script GETs it and prints `HTTP 200, 9937 bytes` *before* naming the URL. | "It just fetched that receipt and watched a server serve it before it put the link on screen. We do not print links we have not checked." |
| **2:15** | Open the receipt. Point at `observed` vs `simulated`, and at the trace hash. | "Everything it claims, with the hash that re-runs it." |
| **2:30** | The falsification, from `bun run demo` if there is time, or say it. | "Same seed, identical trace hash. Seed plus one, it diverges — so it can fail, and you can check. And a policy cannot certify itself: we run it against its own claim, and if it cannot reproduce its own result we downgrade it in code regardless of what it declared." |
| **2:45** | The ask. | "The goal was never a simulator that is right. It is **a simulator that cannot lie about being a simulator.**" |

---

## The line

> **Simula el cambio antes de aplicarlo. Y te decimos cuánto de eso fue real.**

---

## Q&A — the question the track will get asked

**"How do you know any of this is real?"** — the brief predicts six other teams have no answer.

- **The transition and the invariants are code, never a model.** No model computes a ledger and no
  model decides whether a constraint held.
- **A policy cannot certify itself.** Declared class vs demonstrated class, and the demotion is
  written into the branch.
- **Determinism on demand.** Same seed → byte-identical trace hash. Change one variable → it diverges.
- **Every value is typed `observed | simulated`,** and the taint propagates.

**"Is it calibrated against a real business?"** — **No, and we say so in the README and in the
Spanish description.** We have no real transcripts yet. We would rather say that than publish an
accuracy percentage we cannot support. *Do not improvise a number here.*

**"Does this only work for your one toy storefront?"** — No, and this is the strongest
architectural claim, so do not skip it. There is a **second domain**: a clinic appointment desk
(`src/worlds/clinic.ts`, 229 lines, 14 tests). Different transition, different conservation law,
**the runtime did not change to accept it**. A domain arrives as a record — state, actions,
transition, invariants, initial. Adding a domain adds a record; adding a capability adds an
operator, and there are six of those. That asymmetry is what separates a simulation runtime from a
pile of bespoke simulators.

**"What is not built?"** — the LLM adapter (today's actors are seeded and pure), a *third* domain,
a domain supplied by someone outside the team, and the web console. The runtime, the copy-on-write
forking log, the reproducibility lattice, the conservation checker, the accept gate, the CLI, the
HTTP hub, the agent tool surface and the clinic domain all exist and run.

---

## When it breaks

| Failure | What you do |
|---|---|
| **Venue wifi is down** | Play `docs/backup-demo.mp4`. Say "this is a recording, the live one needs the network" — do not pretend. |
| **Someone pushes to main mid-demo** | Nothing deploys automatically today — `RENDER_DEPLOY_HOOK_URL` is unset, so `.github/workflows/deploy.yml` skips. Do **not** set that secret before the presentation: the free plan is single-instance, so a deploy is downtime. |
| **Hub is cold / slow** | It still works, it just takes ~12s on the first call. Talk over it: that beat is the trust opener anyway. |
| **Hub is unreachable** | `bun run demo:whatsapp` — the same flow, no network. Say the hosted one is on a free tier. |
| **The receipt 404s** | The script will refuse to name the link and exit. That is the guard working. Fall back to `demo:whatsapp`, which writes a self-contained receipt to `out/`. |

## Links

- Landing (the judged `deploy-url`) — https://broomva.github.io/parallax/
- Hub — https://parallax-hub.onrender.com
- Judged repo — https://github.com/platanus-hack/platanus-hack-26-co-team-5
