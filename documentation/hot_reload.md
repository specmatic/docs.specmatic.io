---
layout: default
title: Hot-Reload Configuration
parent: Documentation
nav_order: 30
---

# Hot-Reload Configuration
{: .no_toc }

- TOC
{:toc}

## Overview

Specmatic stub server includes a hot-reload feature that automatically restarts the server when specification files or examples change. This documentation explains how to configure and disable this feature when needed.

## What is Hot-Reload?

Hot-reload is a feature in Specmatic stub server that monitors your specification files and examples for changes. When a file is modified, the stub server automatically restarts to reflect the changes without requiring manual intervention.

By default, hot-reload is **enabled** in Specmatic stub server.

## When to Disable Hot-Reload

You might want to disable hot-reload in the following scenarios:

### inotify/max_user_watches Issue

In some Linux environments, the number of files being watched may exceed the system limit defined by `/proc/sys/fs/inotify/max_user_watches`. This can cause the following issues:

- File watching may fail
- The stub server may not start properly
- System performance may degrade

If you don't have access to modify the system configuration to increase the `max_user_watches` limit, disabling hot-reload provides a pragmatic workaround.

### Other Scenarios

- **Production environments**: Where you want stability and don't expect specification changes
- **CI/CD pipelines**: Where specifications are static during test execution
- **Resource-constrained environments**: Where file watching overhead is undesirable

## Configuration Options

Specmatic provides two ways to disable hot-reload:

### 1. Command Line Switch

Use the `--hot-reload=disabled` flag when starting the stub server:

```bash
specmatic stub --hot-reload=disabled
```

**Complete example:**
```bash
specmatic stub --port=8080 --hot-reload=disabled my-contract.yaml
```

### 2. Configuration File (specmatic.json)

Add the hot-reload configuration to your `specmatic.json` file:

```json
{
  "stub": {
    "hotReload": "disabled"
  }
}
```

**Complete example:**
```json
{
  "sources": [
    {
      "provider": "git",
      "repository": "https://github.com/my-org/my-contracts.git",
      "provides": ["my-contract.yaml"]
    }
  ],
  "stub": {
    "hotReload": "disabled",
    "port": 8080
  }
}
```

## How-To Guides

### Disable Hot-Reload via Command Line

1. **Basic usage:**
   ```bash
   specmatic stub --hot-reload=disabled my-contract.yaml
   ```

2. **With additional options:**
   ```bash
   specmatic stub --port=8080 --host=0.0.0.0 --hot-reload=disabled my-contract.yaml
   ```

3. **Using environment variables:**
   ```bash
   export SPECMATIC_STUB_PORT=8080
   specmatic stub --hot-reload=disabled my-contract.yaml
   ```

### Disable Hot-Reload via Configuration File

1. **Create or edit your `specmatic.json` file:**
   ```json
   {
     "stub": {
       "hotReload": "disabled"
     }
   }
   ```

2. **Start the stub server:**
   ```bash
   specmatic stub
   ```

3. **Verify the configuration:**
   When hot-reload is disabled, you'll see a warning message:
   ```
   WARNING: Hot reload has been disabled. Specmatic will not restart the stub server automatically when the specifications or examples change.
   ```

## Configuration Priority

When both command line and configuration file options are provided, the priority order is:

1. **Command line argument** (`--hot-reload=disabled`) - highest priority
2. **Configuration file** (`specmatic.json`) - medium priority  
3. **Default behavior** (hot-reload enabled) - lowest priority

## Behavior When Hot-Reload is Disabled

- The stub server will **not** automatically restart when specification files change
- You must manually restart the server to pick up any changes
- The server will continue to run indefinitely until manually stopped
- A warning message will be displayed when starting the server

## Re-enabling Hot-Reload

To re-enable hot-reload:

### Via Command Line
Remove the `--hot-reload=disabled` flag or use `--hot-reload=enabled`:
```bash
specmatic stub my-contract.yaml
# or explicitly
specmatic stub --hot-reload=enabled my-contract.yaml
```

### Via Configuration File
Remove the `hotReload` property from your `specmatic.json` or set it to `enabled`:
```json
{
  "stub": {
    "hotReload": "enabled"
  }
}
```

## Troubleshooting

### Common Issues

**Problem**: "Too many open files" error
- **Solution**: Disable hot-reload using `--hot-reload=disabled`

**Problem**: Stub server not restarting automatically
- **Check**: Verify hot-reload is enabled (default behavior)
- **Check**: Ensure you're not using `--hot-reload=disabled`

**Problem**: High CPU usage due to file watching
- **Solution**: Consider disabling hot-reload in resource-constrained environments

### Verification

To verify if hot-reload is enabled or disabled:
1. Check the server startup logs for the warning message
2. Make a change to your specification file
3. Observe if the server restarts automatically

## Reference

This feature was implemented in [PR #1968](https://github.com/specmatic/specmatic/pull/1968) to provide a solution for environments where file watching limits are exceeded.

**Implementation details:**
- Introduces a new `Switch` enum with `enabled` and `disabled` values
- Adds command line option `--hot-reload`
- Adds configuration support in `specmatic.json` under `stub.hotReload`
- Displays warning message when hot-reload is disabled

For more information about Specmatic configuration, see the [Configuration Guide](configuration.md).
