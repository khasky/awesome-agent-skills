# Stores, deletion and rights mechanics

The working detail behind Tracks 2, 4, 5, 6 and 7. Every store found in the flow map gets one row, and the same row answers three questions: what it holds, how long, and whether a deletion reaches it.

## The store catalogue

For each store, the evidence is the write call (what puts the data there), the fields it carries, the retention setting or its absence, and the deletion path or its absence.

| Store | What to read | What usually goes wrong |
| --- | --- | --- |
| Primary database | models, migrations, the delete handler | soft-delete flag with no purge job; child tables a cascade does not reach |
| Read replicas and warehouses | replication and export jobs, warehouse load scripts | a nightly copy that keeps rows the primary deleted |
| Caches | cache keys and values written with personal fields, their TTL | a profile cached with no expiry; an email or token used as the cache key |
| Queues and event streams | producer payloads, topic retention, dead-letter queues | full user objects in events; a dead-letter queue with no retention at all |
| Search indexes | the indexing call and the document it builds | indexed on write, never removed on delete |
| Object storage | upload paths, bucket lifecycle rules, signed-URL lifetime | uploads with no lifecycle rule; a personal identifier in the object key |
| Logs | what each log call passes and the log store's retention | personal fields reaching a store kept far longer than the app needs |
| Analytics and telemetry | the identify call, event properties, auto-capture settings | personal properties on events; no use of the vendor's deletion interface |
| Error tracking | user context, breadcrumbs, captured bodies and headers | request bodies and form values captured by default |
| Backups and exports | backup job, retention, encryption, who can restore; export and report generators | backups kept with no stated window; exports written to shared locations |
| Webhooks and outbound APIs | the payload builder for each recipient | the whole record sent where one id would do |
| Email, SMS and push | template variables and the provider call | sensitive values in the message body; provider-side logs never purged |
| Model providers | prompt assembly | user records pasted into context with no minimisation |
| Client storage | cookies and their lifetime, local storage, on-device databases | personal data left on a shared device after logout |
| Non-production | dumps, restore scripts, seeds, fixtures, CI artifacts | production records copied where production controls do not apply |

A third party that receives personal data is a recipient, sometimes called a sub-processor. Record each one with the classes it receives and the call that sends them; whether a contract covers it is outside what code can show, so it goes under NOT ASSESSED.

## Retention

A retention rule counts when the code or config enforces it: a TTL on the key, a lifecycle rule on the bucket, a topic retention setting, a scheduled purge job that runs and deletes by age. A sentence in a document with nothing enforcing it is a gap. Thresholds:

- a store holding personal data with no enforced retention — finding; High when the store holds a Highest-weight class;
- a purge job that exists but is not scheduled, or is scheduled in a config that the deployed environment does not load — finding, same weight as no job;
- retention longer than any stated purpose in the code needs (a session store kept for years) — Medium, cited with the setting;
- transient data (tokens, one-time codes, verification links) with no expiry — High.

## Deletion propagation

Take the store catalogue and walk an account deletion through it. For each store the result is one of: deleted, anonymised (the record stays, the person is gone from it), expires by retention within a stated window, or not reached. "Not reached" is the finding.

- The delete handler, the job it enqueues and every listener on its event are read, not inferred from the endpoint's name.
- Soft-delete counts as deletion only when a purge follows on a schedule; a flag that only hides the row is retention without limit.
- Records that must stay for another reason (an invoice, a security audit trail) are anonymised or kept with the person reduced to a surrogate id; keeping the full profile beside them is the finding.
- Backups are rarely rewritten; the acceptable shape is a stated backup window after which deleted data ages out, and a restore procedure that reapplies deletions made since the snapshot. No window, or a restore that resurrects deleted accounts, is the finding.
- Each third party that received the classes is either sent a deletion through its interface, or the gap is named; silence is not a third outcome.

## Rights mechanics

The audit reports which mechanisms exist in code, not whether they satisfy any regime's deadline or wording. For each, name the route, handler or back-office tool, and what it covers against the store catalogue:

- Access and export — a way to produce a person's data in a machine-readable form. Coverage gap: classes in the inventory the export never includes.
- Correction — a way to change each editable personal field. Coverage gap: a correction that updates the primary row but not the copies (search index, cached profile, a third party).
- Deletion — the propagation walk above.
- Consent withdrawal and objection — a way to turn off each optional processing, as reachable as the way it was turned on, and a send path that reads the new state.
- Restriction — a flag that pauses non-essential processing; record whether any send path reads it.

A mechanism that exists only as a manual instruction in a runbook is recorded as manual, with the runbook cited; an absent one is recorded as absent. Neither is a legal conclusion.

## Consent gating

Consent is checked where it acts, not where it is asked for:

- The order of loading — a tag, SDK, session-replay script or pixel that initialises before the consent state is known, or initialises in a default-on state, sends before anyone agreed. Read the initialisation call and what runs before it. High.
- The gate on each send — every analytics, advertising and optional-telemetry call reads the current consent state, or sits behind one wrapper that does. A second, ungated path to the same vendor (a server-side forward, a direct call in one component) is the finding (High).
- Auto-capture — settings that record all inputs, all clicks or full sessions capture whatever class the user types; High when a form in scope collects a Highest-weight class and the capture does not exclude it.
- Withdrawal — turning consent off stops later sends and, where the vendor offers it, clears identifiers already set.
- Storage of the decision — what was agreed, when, and to which version of the notice, so that a later change can tell who agreed to what. A single boolean overwritten in place cannot (Medium).
- Essential versus optional — functionality the product needs to run does not wait on consent; marketing, advertising and optional analytics do. An optional purpose bundled into an essential one is the finding.

## Blast radius per store

One line per store: the classes it holds, the order of magnitude of records when the code or config reveals it (a seed count, a partition scheme, a quota, a pagination ceiling, a stated user count in docs), who can read it (roles, service accounts, public access), and whether the sensitive classes are encrypted beyond the disk. When no source reveals the size, write "unknown" — a guess presented as a count is worse than none. No cost, fine or penalty figure is computed; those depend on facts and law the code does not contain.
