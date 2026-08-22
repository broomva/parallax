# Security Policy

## Supported versions

Parallax is pre-1.0. Only the current `main` branch receives fixes. There are no
backports to earlier tags.

## Reporting a vulnerability

**Do not open a public issue, discussion, or pull request for a vulnerability.**

Report privately, either way:

- GitHub → the repository's **Security** tab → **Report a vulnerability** (private
  advisory), or
- email **security@broomva.tech**.

Useful in a report:

- what an attacker gains, and what access they need to start;
- affected commit or version, and the runtime you saw it on;
- a minimal reproduction — a domain `TypeRecord`, an event sequence, or a script is
  ideal;
- any log, trace hash, or stack that shows the failure.

We aim to acknowledge a report within three working days and to tell you our assessment
and a rough fix timeline within ten. If you have not heard back, send a reminder to the
same address rather than escalating in public.

Please give us a reasonable window to ship a fix before disclosing. We will credit you in
the advisory and the changelog unless you would rather we did not.

## Scope notes

Two things worth knowing before you file, because they are design, not defect:

- **A domain is executable.** A `TypeRecord` carries `transition` and `invariants` as
  functions, so loading a domain from an untrusted source runs that source's code with
  the privileges of the host process. Treat third-party domains and plugin models the way
  you would treat any dependency. "An untrusted domain can run arbitrary code" is
  expected; a path that runs domain code *without* the operator loading it is not, and we
  want to hear about it.
- **The log is append-only, not confidential.** Events, parameters, and derivation
  records are stored as written. Keeping secrets out of action parameters is the caller's
  job.

Anything that lets one branch read or mutate another's events, that lets a `simulated`
answer be returned typed as `observed`, or that makes a derivation's reproducibility
class stronger than its inputs warrant, is in scope and is treated as a serious bug.
