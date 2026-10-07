# docs.specmatic.io

This repository contains the Specmatic documentation site built with Docusaurus.

## Prerequisites

- Node.js 20 or later
- npm
- Ruby and Bundler if you want to run link verification

## Install dependencies

From the repository root:

```bash
npm install
bundle install
```

## Run the docs site locally

Start the local development server:

```bash
npm run start
```

This starts Docusaurus in development mode. The terminal output will show the local URL, typically:

- `http://localhost:3000`

## Build the site locally

Create a production build:

```bash
npm run build
```

This also runs the redirect fix-up script used by this repository.

## Preview the built site

After a build completes, serve the generated site locally:

```bash
npm run serve
```

## Validate links

To build the site and then run the local link checker:

```bash
npm run build:verified
```

If you only want to run the link checker after an existing build:

```bash
npm run check:links
```

## Helpful notes

- Docs content lives under [docs](/Users/jaydeep/znsio/docs.specmatic.io/docs).
- Static images live under [static](/Users/jaydeep/znsio/docs.specmatic.io/static).
- Sidebar and navigation behavior is controlled through frontmatter and files like [sidebars.js](/Users/jaydeep/znsio/docs.specmatic.io/sidebars.js).

## Validate executable documentation examples

Run the quick-start and contract-testing checks against the latest release of both OSS and Enterprise:

```bash
npm run check:examples
```

Requires Node.js 20+, Bash, and Java 21. The wrapper resolves the latest release
of each edition independently from Maven Central on every run. It reuses
`~/.specmatic/specmatic.jar` for OSS and `~/.specmatic/specmatic-enterprise.jar`
for Enterprise if their reported edition/version matches. Otherwise it downloads
and validates the latest JAR before replacing that edition's file.

Both editions run the same commands and expected outputs through the `specmatic`
command shim. Either failure fails the overall run; local runs still attempt both
editions. CI uses separate OSS and Enterprise jobs with fail-fast disabled.
Enterprise uses your existing license configuration. CI passes the repository's
`SPECMATIC_LICENSE_KEY` secret as `SPECMATIC_LICENSE_CONTENT`; configure that secret
if your Enterprise license requires it (fork PRs do not receive repository secrets).

To run just one edition:

```bash
npm run check:examples -- --edition oss
npm run check:examples -- --edition enterprise
```

For release candidates, set `SPECMATIC_JAR` and `SPECMATIC_VERSION` for OSS, or
`SPECMATIC_ENTERPRISE_JAR` and `SPECMATIC_ENTERPRISE_VERSION` for Enterprise. Local
JAR overrides are checked for the supplied edition/version. Pass additional
example folders after the options to run them with the same provisioning.

The generic runner can also check any folder without provisioning Specmatic:

```bash
node scripts/check-doc-examples.js <folder>
```

It uses the following conventions:

- `<name>.sh`: a Bash command example, discovered alphabetically in the folder.
- `<name>.terminaloutput`: required expected output. Each nonblank trimmed line
  must occur within an actual stdout/stderr line, as in the labs validator.
  Extra lines are allowed; keep expectations to stable excerpts.
- `<name>.exitcode`: optional expected exit code (default `0`), for commands that
  intentionally fail.
- `<name>.verify`: optional Bash verification for a long-running command. The
  runner waits for the expected terminal output, executes the verifier, then stops
  the server. It cannot be combined with `.exitcode`.
- `.setup`: optional Bash setup sourced before each command. Export environment
  variables here and use an EXIT trap to clean up background fixtures.
- Other files: inputs and fixtures copied with the folder into a fresh temporary
  directory for each command. Scenarios are independent; files do not carry over.

Missing pairs, empty expectations, orphan companions, wrong exit codes, output
mismatches, and failed verifiers fail the run. Commands and verifiers have a
120-second timeout, configurable through `DOC_EXAMPLE_TIMEOUT_MS`. The runner
stops process groups and removes temporary files after each scenario. Bash/process
group handling targets macOS and Linux; commands run with `-e -o pipefail`.

The quick-start page includes the shared commands, specification, and response from
`docs/getting_started/includes/cli-quick-start/`. Its `.setup`, provider fixture,
and mock verifiers contain the PetStore-specific behavior; the generic runner has
no knowledge of URLs, ports, schemas, or Specmatic subcommands. The published contract-test
command retains its original public provider URL. Test setup exports a shell
function that redirects that URL to the local provider only during checks. Ports 9000 and 9002 must
be available. Mock verifiers check named example values and generated field types.
Include newly added command/output pairs in the documentation page as well.

CI runs the pilot on PRs, main pushes, nightly, and manually. Configure the check
as required in branch protection to block merging failures. Coverage includes the Java quick-start examples and 15 standalone contract-testing
CLI examples, including the negated filter with its corrected six-test expectation. See
[scripts/doc-example-findings.md](scripts/doc-example-findings.md) for findings,
reproduction commands, and remaining coverage limits. Docker, npm, Windows,
installation and programmatic examples remain uncovered.
The rendered page preserves its original transcripts and syntax highlighting;
the three documented command errors identified in the findings report are corrected.
`*.display.txt` files retain those illustrative transcripts verbatim, including
historical timestamps and placeholder versions. The separate `*.terminaloutput`
files contain stable test assertions rather than full transcript comparisons.
The labs' Python validator is not invoked here.
