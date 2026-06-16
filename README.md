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
