import { h, meet, type Klass } from "./hash";
import type { EventLog } from "./log";
import type { Event, State, TypeRecord, Violation } from "./types";

/** A policy proposes the next action. LLM-backed or scripted -- the runtime does not care. */
export interface Policy {
  name: string;
  klass: Klass;
  propose(state: State, seq: number, seed: number): Promise<Omit<Event, "seq" | "branch"> | null>;
}

/** step -- f. Pure. Never an LLM. */
export function step(world: TypeRecord, state: State, e: Event): State {
  return world.transition(state, e);
}

/** observe -- h. Fold the log into the present. Deterministic by construction. */
export function observe(world: TypeRecord, log: EventLog, branch: string): State {
  return log.read(branch).reduce((s, e) => step(world, s, e), structuredClone(world.initial));
}

/** check -- the verifier. Pure predicates over state. Never an LLM. */
export function check(world: TypeRecord, state: State, seq: number): Violation[] {
  return world.invariants
    .map((inv) => {
      const message = inv.check(state);
      return message === null ? null : { invariant: inv.name, message, seq };
    })
    .filter((v): v is Violation => v !== null);
}

/** rollout -- project the log forward under a policy. The counterfactual engine. */
export async function rollout(
  world: TypeRecord,
  log: EventLog,
  branch: string,
  policy: Policy,
  horizon: number,
  seed: number,
): Promise<{ violations: Violation[]; state: State }> {
  let state = observe(world, log, branch);
  const violations: Violation[] = [];
  for (let i = 0; i < horizon; i++) {
    const proposed = await policy.propose(state, i, seed + i);
    if (proposed === null) break;
    const e = log.append({ ...proposed, branch, klass: meet(proposed.klass, policy.klass) });
    state = step(world, state, e);
    violations.push(...check(world, state, e.seq));
  }
  return { violations, state };
}

/** A branch's identity: same events in, same hash out. Replay becomes a comparison. */
export function traceHash(log: EventLog, branch: string): string {
  return h(
    log.read(branch).map((e) => ({ a: e.actor, n: e.action, p: e.params, d: e.derivation })),
  );
}

/** diff -- what changed between two worlds that shared a past. */
export function diff(a: State, b: State): Array<{ key: string; from: unknown; to: unknown }> {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  return [...keys]
    .filter((k) => h(a[k] ?? null) !== h(b[k] ?? null))
    .map((k) => ({ key: k, from: a[k], to: b[k] }));
}
