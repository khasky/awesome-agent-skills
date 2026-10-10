# Data classes and where they hide

The inventory (Track 1) sorts every personal field into one of the classes below. The class decides the rest of the audit: how strictly its stores are judged, which exposure is Critical, and which flows need a reason to exist. A field belongs to the most sensitive class it can reach, alone or in combination.

## The classes

| Class | Shape of the field | Weight |
| --- | --- | --- |
| Credentials | password or its hash, session or refresh token, recovery code, one-time-password seed, API key issued to a user | Highest — one leak is an account takeover |
| Special category | health, diagnosis, medication, disability, biometric template, genetic data, sexual life, religious or political belief, union membership, ethnic origin, criminal record | Highest — harm is irreversible and most regimes single it out |
| Children | any record of a user below the age the product's own age gate or terms name, and any field that is only collected for minors (guardian contact, school, grade) | Highest — most regimes add consent and default-setting duties |
| Government identifiers | national id, tax id, passport, driving licence number, social-insurance number | High — reused across every service the person has |
| Financial | card number or its fragments, bank account, income, balance, credit score, transaction history | High |
| Precise location | coordinates, street address, a location track over time | High — a track reveals home, work and routine |
| Contact | email, phone, postal address, messaging handle | Medium |
| Identifiers | name, username, account id, device id, advertising id, IP address, cookie id, hashed email used as a join key | Medium — low alone, the join key for everything else |
| Behavioural and telemetry | page views, clicks, search queries, session replays, purchase history, feature usage, crash context, user agent and device fingerprint | Medium, rising with volume and with how directly it is keyed to a person |
| Content | messages, uploads, notes, support tickets — whatever the user wrote or sent | Varies — judge by what the product invites people to put in it |

A field that is only an internal surrogate key with no external join is not personal on its own; a field that joins to one of the rows above is.

## Combinations

Fields that are each Medium become High together, and the inventory records the combination as its own row when one record or one payload carries all of it:

- name with date of birth, or name with street address — enough to reconstruct an identity;
- an identifier with timestamps and locations — a movement profile;
- an email or account id with behavioural events — a profile the person never filled in;
- any identifier with a special-category flag, even a coarse one (a plan named after a condition, a segment tag) — the special-category weight carries over.

"Pseudonymised" is a combination question too: a hashed email is still the same person's key wherever the same hash is computed, and an id with its lookup table in the same database is not separated from the person at all.

## Where to look

Read each of these, not only the schema:

- Schemas, migrations and ORM models — columns, embedded documents, JSON blobs whose keys are personal.
- API contracts — request and response types, GraphQL types, serializers, OpenAPI documents. A response field the client never renders is still disclosed.
- Forms and client input — every input the UI collects, including optional ones and hidden fields.
- Client storage — cookies, local and session storage, IndexedDB, mobile key-value stores, on-device databases, cached responses.
- Analytics and telemetry calls — the event names, the properties passed, the identify or user-context call, automatic capture settings (all clicks, all inputs, session replay).
- Error and crash reporting — the user context attached, breadcrumbs, captured request bodies and headers, local variables in stack frames.
- Logs — what the log calls actually pass; the rules for how a log should be written belong to awesome-logging-standards, the fact that a class reaches the log store belongs here.
- Prompts — user data placed into a model's context leaves for the model provider.
- Free-text fields — a "notes" or "reason" box collects whatever class the user types; record it as Content and name what the product invites.

## Signals that a field is personal

Field and key names are leads, never verdicts: `email`, `phone`, `dob`, `birth`, `address`, `lat`/`lng`, `ip`, `device`, `ssn`/`national`/`tax`, `iban`/`card`, `diagnosis`/`health`, `age`, `gender`, `token`, `session`. Confirm each by reading what writes it. A column called `address` in a mail-routing table may hold a server address; a column called `meta` may hold a full profile. Values in fixtures, seeds and test data with realistic shapes (a plausible name beside a plausible email) are a lead for Track 2's production-data check.

## Evidence per inventory row

Each row carries: the class, the field or key, the `file:line` that defines it, the `file:line` that first writes it, and whether anything ever reads it (Track 3 uses that). A class seen only in a payload with no definition — an analytics property, a free-text field — cites the call site instead.
