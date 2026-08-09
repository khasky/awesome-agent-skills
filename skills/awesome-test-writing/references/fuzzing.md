# Fuzzing, sanitizers, and harness writing

The property/fuzz bullet in the main skill points here. Fuzzing is the tool for code that parses untrusted bytes — file formats, protocol frames, user markup, deserializers — where example-based tests systematically miss the inputs an attacker tries. This file is the depth: which harness to write, which sanitizer catches which bug, and how the corpus becomes regression seeds. It is the suite-level extension of the main skill's step 6 (prove every test can fail).

## When fuzzing pays

- A function takes raw bytes or a string and parses, decodes, or validates it.
- High branch density, clear entry point, security-relevant (a parser, a deserializer, an auth/crypto routine).
- Coverage-based unit tests keep passing but you do not trust the edge cases.

Skip it for pure wiring, I/O glue, or code with no untrusted-input seam — YAGNI applies to fuzzing too.

## The harness is the whole game

The harness is the bridge from the fuzzer's random bytes to your API. A poor harness misses whole subsystems or produces crashes nobody can reproduce. The rules, in priority order:

| Rule | Why |
|------|-----|
| **Handle every input size** | The fuzzer sends empty, tiny, and huge inputs — validate `size` before touching `data`. |
| **Be deterministic** | Same input, same behavior, or crashes are irreproducible. Seed any PRNG from the input; mock time, PID, and `/dev/urandom`. |
| **Never call `exit()`** | It stops the fuzzer process. Let the bug `abort()` in the code under test. |
| **Reset global state** | Singletons and statics cause crashes after N iterations, not on a specific input. Reset per iteration. |
| **Free resources** | A leak in the harness exhausts memory and kills a long campaign. |
| **Be fast** | Aim for hundreds–thousands of exec/sec: no logging, no real I/O, no per-iteration setup you can hoist. |
| **Stay narrow** | One format per harness — don't fuzz PNG and TCP in the same target; their corpora aren't interchangeable. |

For anything beyond a byte array, extract structured input rather than casting by hand: `FuzzedDataProvider` (C++), the `arbitrary` crate (Rust `#[derive(Arbitrary)]`), or a protobuf + `libprotobuf-mutator` intermediate for highly structured formats so the fuzzer mutates content, not the encoding.

## Fuzzers by ecosystem

| Ecosystem | Tool | Harness shape |
|-----------|------|---------------|
| C / C++ | **libFuzzer** | `extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size)`; build `clang++ -fsanitize=fuzzer,address,undefined` |
| C / C++ | **AFL++** | persistent mode `while (__AFL_LOOP(10000))`; build `afl-clang-fast++`, run `afl-fuzz -i seeds/ -o out/` |
| Rust | **cargo-fuzz** | `fuzz_target!(\|data: &[u8]\| { ... })` or `\|input: MyStruct\|` via `arbitrary`; `cargo +nightly fuzz run <t>` |
| Python | **Atheris** | `atheris.Setup(sys.argv, TestOneInput); atheris.Fuzz()`; combine with the native ASan build for C extensions |
| Go | **native** | `func FuzzX(f *testing.F){ f.Fuzz(func(t,*testing.T, b []byte){...}) }`; `go test -fuzz=FuzzX` |
| JVM | **Jazzer** | `fuzzerTestOneInput(FuzzedDataProvider data)` |
| JS / TS | **jazzer.js / jsfuzz**, or property tests via **fast-check** | fuzz target takes a `Buffer`/`Uint8Array` |

## Sanitizers — build with them or the fuzzer finds nothing

A crash is only detected if a sanitizer or an assertion turns the bad state into a signal. Match the sanitizer to the bug class:

| Sanitizer | Catches | Flag |
|-----------|---------|------|
| **ASan** | heap/stack overflow, use-after-free, double-free | `-fsanitize=address` |
| **UBSan** | signed overflow, bad shifts, misaligned access, invalid casts | `-fsanitize=undefined` |
| **MSan** | reads of uninitialized memory | `-fsanitize=memory` (needs an instrumented libc++) |
| **TSan** | data races | `-fsanitize=thread` |
| **LSan** | leaks | on by default with ASan |

ASan + UBSan together is the standard fuzzing build. Keep frame pointers (`-fno-omit-frame-pointer`) so crash stacks walk.

## Corpus, dictionary, and regression seeds

- **Seed the corpus** with real valid inputs (sample files, captured frames); the fuzzer generalizes from them far faster than from empty.
- **Give it a dictionary** of format tokens (magic bytes, keywords, delimiters) so it clears format checks instead of guessing them.
- **Every crash becomes a regression seed.** Commit the crashing input to the repo and add a fast test that replays it — that is the fuzz equivalent of the main skill's "fails without the fix, passes with it." A campaign whose finds are not committed is a campaign you rerun from scratch.

## Coverage as the signal, not the score

Measure whether the harness reaches the target code (`llvm-cov`, `-fsanitize-coverage`, `go test -coverprofile`). Low or plateaued coverage means the harness — not the code — is the problem: it is not reaching the interesting paths, or an input check upstream rejects everything the fuzzer sends. Fix the harness, don't chase a coverage number.

## Crypto: use published test vectors

For cryptographic code, `wycheproof` ships thousands of known-answer and known-attack test vectors (edge-case nonces, malformed signatures, invalid curve points) that hand-written tests never think of. Run the vectors for the primitive before writing bespoke crypto tests — deep crypto misuse review is a separate pass (`awesome-security-audit`).

## Anti-patterns

| Anti-pattern | Instead |
|--------------|---------|
| Harness with no sanitizer build | Build with ASan+UBSan; a silent overflow is not a crash |
| Global state carried between iterations | Reset at the top of the harness |
| Blocking I/O or network in the harness | Mock it; feed in-memory buffers |
| Logging inside the harness | Remove it — it drops exec/sec by orders of magnitude |
| One harness for several formats | One narrow target per format |
| Crash found, input not committed | Commit the reproducer as a regression seed |
