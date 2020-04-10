Download the standalone Jar.

<https://github.com/qontract/qontract/releases/download/{{ site.latest_release }}/qontract-{{ site.latest_release }}-all.jar>

#### Mac / Linux

```
alias qontract='java -jar <basedir>/qontract-{{ site.latest_release }}-all.jar'
```

#### Windows

Create a batch file with below content.

```
java -jar <basedir>/qontract-{{ site.latest_release }}-all.jar %*
```

The %* portion tells the batch script to pass all of the parameters it receives to the new command.
