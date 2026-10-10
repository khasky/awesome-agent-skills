# Simplification lenses

Each lens is a pattern of over-engineering that shows up in written plans, especially ones revised many times. Each comes with the question that exposes it, the evidence that confirms it, and the usual replacement. A lens is a lead, not a verdict. A finding still needs the evidence named here, read in the plan or the code.

## Duplicate enforcement

**Pattern.** The same property is checked twice, at two layers, by two mechanisms. A typical case is a token claim that duplicates a database lookup the request makes anyway, or a signature over a value that a uniqueness constraint already protects.

**Question.** If this check were deleted, which other check would still reject the bad input?

**Evidence.** The plan's own description of the second check, or the code that performs it.

**Usual replacement.** Keep the check that sits on the path every request already takes, and delete the other with its error code, its tests and its documentation.

## A guard against a harmless outcome

**Pattern.** A mechanism exists to stop something that another section of the plan calls harmless, accepted or impossible.

**Question.** What exactly does the attacker or the failure gain without this guard?

**Evidence.** The sentence elsewhere that names the outcome as harmless, or a walk through the attack showing it ends at a constraint that already exists.

**Usual replacement.** Delete the guard. Record the contradiction too, because one of the two sections is wrong.

## Convention dressed as a boundary

**Pattern.** Extra roles, permission splits, separate credentials or separate access applications, where one person holds every credential and every one of them sits in the same secret store.

**Question.** Who is stopped by this boundary who is not already stopped by something else?

**Evidence.** Where the credentials live, and who can read them. Also any decision record in which the owner already called a similar split "a convention, not a boundary".

**Usual replacement.** One identity. The defaults it needs, such as timeouts and limits, are set where they apply: per database, per connection or per route. This is usually the owner's decision, so the protection given up is stated explicitly.

## Short lifetime, frequent renewal

**Pattern.** A short token or cache lifetime with a renewal mechanism around it. The renewal brings clock handling, retries and load profiles, while revocation is already checked on every sensitive request.

**Question.** What does the short lifetime protect that the per-request check does not?

**Evidence.** The request path that already reads the revocation state. Also the lifetime the current system uses, and whether anyone has complained about it.

**Usual replacement.** A longer lifetime, with renewal kept only for expiry and key rotation. Present the lifetime choice with its trade-offs, because it is a judgement call.

## Data with no reader

**Pattern.** A column, field, header, file or metric that something writes and nothing reads. A common variant is a value carried through an intermediate store only to fill a column nobody queries.

**Question.** Name the reader. Which query, screen, job or person consumes this value?

**Evidence.** A search of the plan and the code for the name, with zero consumers found.

**Usual replacement.** Stop writing it. When a pipeline exists only to carry the value, write the data directly at the source.

## Unmeasured optimization with its own failure mode

**Pattern.** A mechanism that saves cost nobody has measured, and adds a failure path of its own along with an alert, a test and a recovery step for that path. Scan windows, skip lists, custom caches and batching heuristics are typical.

**Question.** Was the cost this saves measured? What breaks if the mechanism misbehaves?

**Evidence.** No measurement in the plan, and the plan's own description of the failure the mechanism introduces.

**Usual replacement.** The plain approach now. Bring the optimization back if a named load test shows the plain approach is too slow.

## A second store or channel for one edge case

**Pattern.** A new service, background object, external channel or message store added for one rare situation that an existing store could serve with a key and an expiry.

**Question.** Which existing store already has the needed property: durability, consistency, retention or availability?

**Evidence.** The existing store's role elsewhere in the plan, and the edge case's actual volume.

**Usual replacement.** A key, a prefix or a row in the existing store, with a lifecycle rule.

## Two mechanisms for one caller

**Pattern.** Two authentication or authorization mechanisms for the same family of callers, for example a static service token for some internal routes and a federated token for others, all called from the same automation.

**Question.** Who calls each route? Could the mechanism already built for one of them serve all of them?

**Evidence.** The list of callers for each route.

**Usual replacement.** One mechanism, with the human fallback going through an access path that already exists.

## Tables sharing a key

**Pattern.** Two or more tables with the same primary key, the same lifecycle and the same reader, split because they were designed at different times.

**Question.** Do they share a key, a retention rule and the code path that reads them?

**Evidence.** The schema, the cleanup rule and the read path.

**Usual replacement.** One table, which means one read and one cleanup branch.

## State assembled from several sources

**Pattern.** A status computed from a column, the presence of a row in another table and the absence of a third value, read with a subquery on a hot path.

**Question.** Could the writer that changes the status set one column in the same transaction?

**Evidence.** The transaction that creates the second-source row.

**Usual replacement.** One status column, updated in that transaction.

## Integrity machinery on a hot row

**Pattern.** Foreign keys, triggers or shared locks on the row every request touches. They add contention or lock bookkeeping, sometimes enough to need their own monitoring, while integrity is already enforced by explicit, tested deletion steps.

**Question.** What does the constraint catch that the explicit steps do not, and what does it cost on the hot path?

**Evidence.** The plan's own reasons for dropping the same constraint elsewhere, and the monitoring item that exists only because of it.

**Usual replacement.** No constraint. Make the cleanup step explicit, and remove the monitoring item.

## Compatibility windows with no users

**Pattern.** Old routes, fields or behaviors kept "until the next release" while every consumer ships on the same day, or while the old version has no users.

**Question.** Who calls the old path during the window?

**Evidence.** The deploy order and the user count.

**Usual replacement.** Cut over in one deploy.

## A watch on an event that cannot happen

**Pattern.** A scheduled check, alert or reminder that guards against a condition the system's own activity already prevents. An example is a check that an inactive schedule was disabled, on a repository that receives commits every few minutes.

**Question.** Under what circumstances does this condition become true?

**Evidence.** The platform rule and the activity that keeps it false. When the platform rule is not certain, mark it unverified and say what check settles it.

**Usual replacement.** Remove the watch, or keep it narrowed to the cases where the condition can actually occur.

## Configuration values duplicated across files

**Pattern.** The same constant, such as an instance count, a limit or a host name, written in two places that must agree.

**Question.** Can one place derive it from the other, or can the platform supply it?

**Evidence.** Both occurrences.

**Usual replacement.** One source.

## What is not a lens

- **Essential complexity.** A mechanism that is complex because the problem is complex, and whose reason is stated in the plan, is not a finding. Removing it would be wrong, not simpler.
- **The irreversible core.** Formats, signatures and public contracts get a separate, flagged finding, or none.
- **Taste.** "I would structure it differently" with nothing countable disappearing goes to the minor-items list labelled as taste, or nowhere.
