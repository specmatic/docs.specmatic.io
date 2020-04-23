Download the standalone Jar.

<https://github.com/qontract/qontract/releases/download/{{ site.latest_release }}/qontract.jar>

#### Mac / Linux

```
alias qontract='java -jar <basedir>/qontract.jar'
```

#### Windows

Create a batch file with below content.

```
java -jar <basedir>/qontract.jar %*
```

The %* portion tells the batch script to pass all of the parameters it receives to the new command.
