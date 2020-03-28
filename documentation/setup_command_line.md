---
layout: default
title: Command Line Setup
nav_exclude: true
---
Command Line Setup
------------------

Download the standalone Jar.

[qontract-{{ site.latest_release }}-all.jar](https://github.com/qontract/qontract/releases/download/v{{ site.latest_release }}/qontract-{{ site.latest_release }}-all.jar)

Note: Please refer to latest [releases](/releases)

### Mac / Linux

```
alias qontract='java -jar <basedir>/qontract-{{ site.latest_release }}-all.jar'
```

### Windows

Create a batch file with below content.

```
java -jar <basedir>/qontract-{{ site.latest_release }}-all.jar %*
```

The %* portion tells the batch script to pass all of the parameters it receives to the new command.
