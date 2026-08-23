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

## Office-hours pass — what it changed

Run against the six forcing questions. Only the answers that changed the script are here.

**Demand reality — we do not have it, and the pitch must not imply we do.** No user, no payment,
nobody who would be inconvenienced if this vanished tonight. That is already said on every surface
and it stays said. What changes is that the absence becomes the *ask*: the close asks for the one
thing that would close it, rather than trailing off.

**Desperate specificity — the weakest point, and it is fixable in one sentence.** "El dueño de una
empresa con varias sedes" is a category. You cannot email a category. There is, however, a nameable
person for what is actually on screen: whoever owns an agent that touches stock, money or a
customer promise and has to answer *would a governor have caught it?* That person is in the room.

**Narrowest wedge — the finding that reorders the demo.** Ask what someone would pay for this week,
not after the platform, and it is not the restaurant twin: that needs data we do not have and a
calibration we have refused to fake. It is *point it at your agent's workspace, replay the run it
already did, and tell me which steps a constraint would have refused.* No integration, no schema
agreed in advance, no business data. **That is already exactly what the demo shows.** The
restaurant is the ambition; the governor is the wedge; the demo is the wedge. Say them in that
order and nothing has to be oversold.

**Future-fit.** As more operations run through agents, the number of consequential decisions taken
without a reviewable model goes up, and the value of a gate that refuses to run an unaccepted model
goes up with it. That is a claim about a specific change, not a rising tide every competitor can
also stand on.

**The one missing sentence.** The old sheet jumped from "there is no staging environment for a
business" straight to `/health`, leaving the judge to work out on their own why a repository, a
governor and a trace hash are the same machine as a restaurant. The bridge beat below does that
work, and it doubles as the answer to the thing a judge is most likely to misread on screen — the
proposed ontology is over *this repo*, so it says `node_modules`, not `sedes`.

## Beat sheet

Three minutes, hard stop 3:01. The shape follows the organisers' own: problema ~20s ·
solución/impacto/ambición ~25s · demo ~135s. The load-bearing lines are given in Spanish because
that is what will be said; the rest is direction.

| Time | Beat | What you say |
|---|---|---|
| **0:00** | **Problema.** No slides. | "No existe un ambiente de pruebas para la forma en que opera un negocio. Cambias un precio, un turno, un umbral de escalamiento — y te enteras de lo que pasó cuando ya pasó, normalmente porque te lo dijo un cliente." |
| **0:20** | **Solución y ambición.** The twin in one breath, then the loop, then the step that is the product. | "Un gemelo operativo: reconstruye cómo funciona el negocio desde lo que ya existe, corre hacia adelante la decisión que estás considerando, y te dice cuánto de esa respuesta fue real. Observar → proponer → **aceptar** → bifurcar → recomendar → medir. El tercer paso no es un trámite: es el producto." |
| **0:45** | **The bridge.** Do not skip this — it is what makes the next two minutes legible, and it pre-empts the one thing a judge will misread. | "Lo que voy a mostrar no es un restaurante. Es la misma máquina apuntada a lo más difícil de modelar que teníamos a mano: nuestro propio repositorio, que nunca había visto. Si funciona sin saber nada de antemano, funciona con un export de POS." |
| **0:57** | Run it. Opens on `/health`, prints a commit SHA. | "Antes de mostrarles nada: éste es el commit que el servidor está corriendo. No un `version`, que es una constante que alguien escribió. No el dashboard de deploy, que reporta intención. El commit es lo único en esa respuesta que una imagen vieja no puede falsificar." |
| **1:12** | A message arrives; the hub reads the context and proposes. **Let it sit.** | "Nada ha corrido. Está pidiendo permiso. Y miren las preguntas bloqueantes: no se activa sin una unidad en una cantidad numérica. Falla cerrado. No adivina." |
| **1:35** | The human answers and accepts. Then 12 steps, **0 violations** against an ungoverned **9**. | "El humano acepta, desde el teléfono. Ahora corre el modelo hacia adelante bajo la decisión que estás considerando. Doce pasos: nueve cosas se rompen sin gobernador, cero con él." |
| **1:55** | The receipt. It GETs it and prints `HTTP 200` *before* naming the URL. | "Acaba de pedir ese recibo y ver que un servidor lo sirviera antes de poner el enlace en pantalla. No imprimimos enlaces que no hemos verificado." |
| **2:10** | Open it. Point at `observed` vs `simulated`, and at the trace hash. | "Cada valor dice si fue observado o simulado, y la marca se propaga. Un valor derivado de algo simulado es simulado, por mucho dato real que haya entrado al lado." |
| **2:25** | **Falsification + generality.** The heaviest 20 seconds on the rubric — aspecto técnico is 25%. | "Misma semilla, hash idéntico. Semilla más uno, diverge — o sea que puede fallar, y lo pueden comprobar. Y una política no puede certificarse a sí misma. Hay un segundo dominio, un consultorio, con su propia transición y su propia ley de conservación: **el runtime no cambió para aceptarlo.**" |
| **2:45** | **Honest, then the line, then the ask.** | "Nada está calibrado contra un negocio real y lo decimos en el README — no tenemos transcripciones todavía. Lo que buscamos es exactamente eso: un operador multi-sede que nos deje sus datos. Porque la meta nunca fue un simulador que acierte. Es **un simulador que no puede mentir sobre ser un simulador.**" |

**If you are running long at 2:25**, cut the falsification sentence and keep the clinic. Generality
is the harder claim and the one nobody else in the track can make.

**If you are running short**, the extra beat is the wedge, stated plainly: "si tienen un agente que
toca inventario o plata, apúntenlo a su propio workspace y les dice qué pasos habría rechazado un
gobernador."

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
