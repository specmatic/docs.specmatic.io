---
layout: default
title: Telemetry
parent: Configuration
grand_parent: References
nav_order: 12
---

# Telemetry

Specmatic offers users insights into the [usage](https://insights.specmatic.io/dashboard/settings/usage) of its features. But it goes beyond usage.
[Specmatic Insights](/enterprise_onboarding/insights.html) provides reports on coverage, service dependency graphs, adoption by providers and consumers etc.

## Typical Payload

## Opt-Out of Telemetry
Trial and other free-tier users may choose to opt-out of Telemetry with the following top-level configuration in specmatic.yml file.
```yaml
disable_telemetry = true
```
In case of docker images, you'll need to mount a local folder (e.g. $HOME/.specmatic) so that Specmatic has a place to maintain state.
