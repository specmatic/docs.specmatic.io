Specmatic can be used as a standalone executable and also included [programmatically](https://specmatic.in/documentation/service_virtualization_tutorial.html#programmatically-starting-stub-server-within-tests) as part of your test suite.

For getting started quickly, let us use Specmatic standalone executable within our command line.

The Specmatic standalone executable is accessible through various prominent distribution channels.

{% tabs install %}
{% tab install docker %}

You can run Specmatic using the following command:

``` bash
docker run znsio/specmatic
```

{% endtab %}

{% tab install java %}
Download the standalone jar from our [Github releases](<https://github.com/znsio/specmatic/releases/download/{{ site.latest_release }}/specmatic.jar>) or [Maven Central](https://repo1.maven.org/maven2/io/specmatic/specmatic-executable/{{ site.latest_release }}/specmatic-executable-{{ site.latest_release }}-all.jar).

If you have downloaded the standalone jar from Maven Central, you may want to rename it as shown below for convenience.

```bash
mv specmatic-executable-{{ site.latest_release }}-all.jar specmatic.jar
```

Run specmatic as below to list all the options available
```bash
java -jar specmatic.jar
```

Follow the quick tips below to setup commands for easily running `java -jar specmatic.jar`.

#### Command-line alias on MacOS / Linux

Add this to the startup script of your shell like `~/.bashrc` or `~/.zshrc`

``` bash
alias specmatic='java -jar <path-to-jar>/specmatic.jar'
```

You can now run specmatic using:

``` bash
$ specmatic <options>
```

#### Batch script on Windows

Create a batch file (`specmatic.bat`) with below content and add it your system path.

```  bash
java -jar <path-to-jar>/specmatic.jar %*
```
The %* portion at the end tells the batch script to pass all of the parameters it receives to the new command.

You can now run specmatic using:

``` bash
C:\> specmatic.bat <options>
```

{% endtab %}
{% tab install npm %}

Install specmatic npm package globally 

``` bash
npm install -g specmatic
```

Or you can run specmatic without installing it as below 

``` bash
npx specmatic
```
{% endtab %}
{% endtabs %}
