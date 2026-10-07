# Documentation examples

These instructions apply to documentation changes throughout this repository.
Use `docs/getting_started/cli_quick_start.mdx` and its
`docs/getting_started/includes/cli-quick-start/` folder as the reference implementation.
See `README.md` for runner usage and current coverage limits.

## Keep published examples and tests aligned

- When adding or changing runnable CLI instructions, put commands, specifications,
  configurations, and deterministic example responses in shared files under an
  `includes/<page-or-scenario>/` folder next to the page.
- Include those files in MDX with the existing `?raw` loader and `CodeBlock`.
  Tests must consume the same command/input files, not separately maintained copies.
- Keep explanations in the page. Keep test-only fixtures and environment setup in
  the example folder; do not expose testing machinery in customer instructions.
- Do not parse page headings, tabs, or MDX to discover runnable commands.

Example include:

```mdx
<CodeBlock language="shell">{require('./includes/my-example/run.sh?raw').trimEnd()}</CodeBlock>
```

## Folder convention

The generic runner discovers all `.sh` files directly in the supplied folder in
alphabetical order. Each script runs with Bash `-e -o pipefail` in a fresh temporary
copy of that folder. Scenarios must be independent; they cannot rely on files or
services left by an earlier script.

- `<name>.sh`: the published command, or a self-contained runnable command sequence.
- `<name>.terminaloutput`: required, nonempty expected stdout/stderr excerpts.
- `<name>.exitcode`: optional expected exit code, default `0`. Use it for intentional
  failures; matching output alone does not permit an unexpected nonzero exit.
- `<name>.verify`: optional Bash assertions for a long-running server. The runner
  waits for the expected output, runs this verifier, and stops the process group.
  Do not combine it with `.exitcode`.
- `.setup`: optional Bash setup sourced before each command. Export test environment
  variables here. Clean up background fixtures with an EXIT trap.
- Other files: fixture inputs or helper programs. Do not give helper scripts a `.sh`
  suffix unless they are runnable examples with their own output pair.

Adding or renaming a command/output pair must not require hard-coding its filename
in `scripts/check-doc-examples.js`. Keep that runner independent of products,
subcommands, ports, URLs, schemas, and page-specific fixtures. Put additional
behavior in setup, fixtures, and verifiers instead.

## Expected output

- Follow the labs' `terminaloutput` convention: every nonblank, trimmed expected
  line must occur within an actual output line. Extra log lines are allowed.
- Matching is literal substring matching, not regex matching. Do not put wildcard
  markers, placeholder versions, timestamps, temporary paths, or generated random
  values in expected-output files.
- Assert meaningful user-visible outcomes, not just a startup banner. Use `.verify`
  for response contents, generated field types, or other behavior that terminal
  excerpts cannot establish. Verifiers must exit nonzero when assertions fail.
- For new pages, display shared expected excerpts using a terminal-output block,
  for example `CodeBlock language="terminaloutput"` with the `.terminaloutput` include.
- Existing illustrative transcripts may contain historical or variable output.
  Preserve them verbatim in `*.display.txt` files when necessary to keep the page
  unchanged, and maintain stable assertions in the paired `.terminaloutput` file.
  Do not present illustrative transcripts as fully validated output.
- Investigate failures against the latest release. Do not weaken assertions or pin
  an older version merely to make a stale instruction pass.

## Preserve the reader's experience

When externalizing existing examples or adding testing infrastructure, preserve the
rendered page: prose, displayed commands, complete transcripts, links, tab labels,
code languages, syntax highlighting, and copyable code contents. Do not shorten
transcripts, add output sections, or introduce test environment substitutions into
the displayed commands as part of a testing-only change.

Compare the original and updated production builds' rendered article/main HTML.
Source-level similarity is not sufficient. Product documentation corrections can
change rendered content when that is the requested scope; identify them explicitly.

Test-only redirects to local providers belong in `.setup`. They must preserve
command names, flags, and user-facing behavior; do not silently drop or translate
unsupported flags to make checks pass. Never print or commit license contents.

## Validation and CI

For each changed or new example folder, run:

```bash
npm run check:examples -- docs/path/includes/my-example
npm run build
```

The wrapper runs the same examples and assertions against the latest OSS and
Enterprise releases independently. Both must pass for shared functionality. It
caches the JARs at `~/.specmatic/specmatic.jar` and
`~/.specmatic/specmatic-enterprise.jar`. Use the artifact coordinates documented in
`docs/download.mdx`; keep product provisioning in `scripts/run-doc-examples.js`.
Do not introduce downloads or edition logic into the generic runner.

For generic shell examples without Specmatic provisioning, use:

```bash
node scripts/check-doc-examples.js docs/path/includes/my-example
```

New folders are not automatically added to CI. Update
`.github/workflows/check-doc-examples.yml` to pass all covered folders explicitly
for both matrix editions, retaining the existing quick-start and contract-testing
folders. Supplying
folder arguments replaces the wrapper's default folders; it does not append to it.
Retain separate edition results and `fail-fast: false`.

If changing runner behavior, run `node --test scripts/check-doc-examples.test.js`
and add focused coverage for the affected convention or failure mode. No new runner
tests are needed merely to add an example pair.

Report the folders, resolved edition/version numbers, and checks that passed.
State missing prerequisites, unavailable licenses, or untested platform/edition
paths explicitly; do not silently skip them or claim coverage beyond what ran.
