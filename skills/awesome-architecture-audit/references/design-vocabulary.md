# Design vocabulary

The shared words for talking about a module's *shape*. One vocabulary, so an architecture audit, a cleanup report and a review of the same code mean the same thing by the same word. Distilled from John Ousterhout's _A Philosophy of Software Design_ (deep modules) and Michael Feathers' _Working Effectively with Legacy Code_ (seams).

Use these terms exactly. Do not substitute "component", "service", "unit" for **module**; "API" or "signature" for **interface**; "boundary" for **seam** — boundary is already taken by bounded contexts and the collision costs a paragraph of clarification every time.

| Term | Meaning |
|---|---|
| **Module** | Anything with an interface and an implementation. Deliberately scale-agnostic: a function, a class, a package, a tier-spanning slice. |
| **Interface** | Everything a caller must know to use the module correctly — the type signature, but also invariants, ordering constraints, error modes, required configuration, performance characteristics. Wider than the signature. |
| **Implementation** | What is inside the module. Distinct from adapter: a module can be a small adapter with a large implementation (a Postgres repository) or a large adapter with a small one (an in-memory fake). |
| **Depth** | Leverage at the interface: how much behaviour a caller or a test can exercise per unit of interface it has to learn. **Deep** = a lot of behaviour behind a small interface. **Shallow** = an interface nearly as complex as the implementation. |
| **Seam** | A place where behaviour can be changed without editing in that place — the *location* where a module's interface lives. Where to put it is a separate decision from what goes behind it. |
| **Adapter** | A concrete thing satisfying an interface at a seam. Names a role (which slot it fills), not a substance (what is inside it). |
| **Leverage** | What callers get from depth: more capability per unit of interface learned. One implementation paying back across N call sites and M tests. |
| **Locality** | What maintainers get from depth: change, bugs, knowledge and verification concentrate in one place instead of spreading across callers. Fix once, fixed everywhere. |

## The tests that use these words

- **The deletion test.** Imagine deleting the module. If complexity vanishes, it was a pass-through. If the complexity reappears across N callers, it was earning its keep. "Concentrates" is the signal to keep or to merge into; "scatters" is the signal to delete.
- **The interface is the test surface.** Callers and tests cross the same seam. Wanting to test *past* the interface means the module is the wrong shape, not that the test needs an escape hatch.
- **One adapter means a hypothetical seam; two means a real one.** Do not introduce a port until something actually varies across it — production and test count as two, speculation does not.
- **Depth is a property of the interface, not the implementation.** A deep module may be composed internally of small swappable parts; they are simply not part of its interface. Internal seams (private, used by its own tests) are legitimate and stay unexposed.

## Dependency categories

When judging whether a cluster *can* be deepened, classify what it depends on — the category decides how the deepened module is tested across its seam:

| Category | Example | Consequence |
|---|---|---|
| **In-process** | Pure computation, in-memory state | Always deepenable; merge and test through the new interface, no adapter needed |
| **Local-substitutable** | A database with a local stand-in, an in-memory filesystem | Deepenable where the stand-in exists; the seam stays internal |
| **Remote but owned** | Your own service across a network | Define a port at the seam: in-memory adapter in tests, transport adapter in production |
| **True external** | A third-party payment or messaging provider | Injected port, mock adapter in tests; never reach the real one from a test |

When the deepened module lands, **replace the tests, do not layer them**: old unit tests on the shallow parts become waste once tests exist at the new interface. Assert observable outcomes through the interface so the tests survive internal refactors.

## Design it twice

Before committing to one interface for a non-trivial module, sketch two or three *radically different* ones — minimal entry points, maximal flexibility, optimized for the most common caller, ports-and-adapters — and compare them on depth, locality and where the seam falls. Then pick one or hybridize, with a stated reason. The first shape that comes to mind is rarely the best one, and the comparison is cheap while it is still a sketch.

## Rejected framings

- **Depth as a ratio of implementation lines to interface lines** — rewards padding the implementation. Depth here is leverage, not line count.
- **"Interface" as the language keyword or a class's public methods** — too narrow; the interface includes every fact a caller must know.
- **"Boundary" as a synonym for seam** — overloaded with bounded contexts. Say seam, or say interface.
