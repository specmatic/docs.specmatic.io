---
layout: default
title: Configuration
parent: References
nav_order: 1
has_children: true
redirect_from:
  - /documentation/configuration.html
  - /documentation/specmatic_json.html
  - /documentation/references/configuration.html
---

<span style="color:gray;">Update Date: 14/02/2025</span>

# Configuration

Specmatic uses a configuration file to manage API specifications, test settings, stub configurations, and more. This section provides comprehensive guidance on configuring Specmatic for your needs.

Note: Version 2 is the latest as of 14/02/2025. If you are looking for an older version of the configs, refer to [older configuration versions](/references/older_configuration_versions.html) page.

## Configuration Topics

- [Getting Started](getting-started.html) - Basic setup and configuration upgrade
- [Contract Management](contract-management.html) - Managing contracts from Git or filesystem
- [Test Configuration](test-configuration.html) - Contract testing settings
- [Stub Configuration](stub-configuration.html) - Service virtualization settings
- [Authentication](authentication.html) - Source control and pipeline authentication
- [Reports](reports.html) - Report generation and formatters
- [Environments](environments.html) - Environment-specific configuration
- [Hooks](hooks.html) - Custom commands and integrations
- [Complete Examples](complete-examples.html) - Full configuration examples

## Quick Start

We often have to pass more than one API Specification file to Specmatic to stub or test. While it is possible to send all the files as command line options, there is a better way.

Also, if your contracts are stored in a source control system like Git, we need to provide details about the repository so that Specmatic can pull your specifications directly from your version control.

See the [Getting Started](getting-started.html) guide for detailed setup instructions.
