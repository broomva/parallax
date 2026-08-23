/**
 * Every `file.ts:123` in a spec is a claim about code that moves underneath it.
 *
 * A spec written before the change it describes becomes a false description of
 * the tree with nothing marking it stale -- the citation still LOOKS precise
 * long after the line it names has shifted. Writing the UI-layer spec produced
 * two of these in one sitting (`handlers.ts:874` when the fork is at 880,
 * `hub.test.ts:205` when the assertion is at 206), and both read as
 * authoritative. Precision is not accuracy, and only one of them is checkable.
 *
 * So: resolve every cited line and require the file to still have one.
 *
 * The rule that keeps this from being noise -- ONLY `path:line` forms are
 * checked. A bare path with no line is a PROPOSAL (`src/view/frame.ts`, a file
 * the spec argues should exist), and demanding those resolve would make it
 * impossible to spec anything not yet written. A line number is the thing that
 * asserts present-tense content, so a line number is the thing that is gated.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const SPEC_DIR = "docs/specs";
const CITE = /([A-Za-z0-9_\-./]+\.(?:ts|tsx|css|md)):(\d+)(?:-(\d+))?/g;
const SKIP_DIRS = new Set(["node_modules", ".git", ".next", "out", "dist"]);

/** Index basename -> paths, so `handlers.ts:802` resolves without a full path. */
function indexRepo(dir: string, acc: Map<string, string[]>): Map<string, string[]> {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name) || name.startsWith(".")) continue;
    const full = join(dir, name);
    let s: ReturnType<typeof statSync>;
    try {
      s = statSync(full);
    } catch {
      continue;
    }
    if (s.isDirectory()) indexRepo(full, acc);
    else if ([".ts", ".tsx", ".css", ".md"].includes(extname(name))) {
      acc.set(name, [...(acc.get(name) ?? []), full]);
    }
  }
  return acc;
}

interface Failure {
  readonly spec: string;
  readonly cite: string;
  readonly reason: string;
}

export function checkSpecCitations(root = "."): Failure[] {
  const specDir = join(root, SPEC_DIR);
  if (!existsSync(specDir)) return [];
  const byName = indexRepo(root, new Map());
  const failures: Failure[] = [];

  for (const spec of readdirSync(specDir).filter((f) => f.endsWith(".html"))) {
    const text = readFileSync(join(specDir, spec), "utf8");
    for (const m of text.matchAll(CITE)) {
      const cite = m[0];
      const path = m[1];
      const lo = m[2];
      const hi = m[3];
      if (path === undefined || lo === undefined) continue;

      const candidates = path.includes("/")
        ? existsSync(join(root, path))
          ? [join(root, path)]
          : []
        : (byName.get(path) ?? []);

      if (candidates.length === 0) {
        failures.push({ spec, cite, reason: "cites a line in a file that does not exist" });
        continue;
      }
      // An ambiguous basename is not a failure of the spec; it is a limit of
      // this check, and reporting it as a defect would train people to ignore it.
      const target = candidates.length === 1 ? candidates[0] : undefined;
      if (target === undefined) continue;

      const lines = readFileSync(target, "utf8").split("\n").length;
      const last = Number(hi ?? lo);
      if (last > lines) {
        failures.push({ spec, cite, reason: `cites line ${last} but ${target} has ${lines}` });
      }
    }
  }
  return failures;
}

if (import.meta.main) {
  const failures = checkSpecCitations();
  for (const f of failures) console.error(`${f.spec}: ${f.cite} -- ${f.reason}`);
  console.log(
    failures.length === 0
      ? "spec citations: every cited line resolves"
      : `spec citations: ${failures.length} broken`,
  );
  process.exit(failures.length === 0 ? 0 : 1);
}
