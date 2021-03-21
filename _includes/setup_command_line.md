Download the standalone Jar.

<https://github.com/znsio/specmatic/releases/download/{{ site.latest_release }}/specmatic.jar>

#### Mac / Linux

```
alias specmatic='java -jar <basedir>/specmatic.jar'
```

#### Windows

Create a batch file with below content.

```
java -jar <basedir>/specmatic.jar %*
```

The %* portion tells the batch script to pass all of the parameters it receives to the new command.
