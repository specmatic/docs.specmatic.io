Specmatic can be used as a standalone executable and also included [programmatically](https://specmatic.in/documentation/service_virtualization_tutorial.html#programmatically-starting-stub-server-within-tests) as part of your test suite.

For getting started quickly, let us use Specmatic standalone executable within our command line.

The Specmatic standalone executable is accessible through various prominent distribution channels.

{% tabs install %}
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

{% tab install docker %}

Docker Pull Command for specmatic docker image

``` bash
docker pull znsio/specmatic
```

Run specmatic by

``` bash
docker run znsio/specmatic
```

**Important**: If you're using a machine with an Apple Silicon chip, you'll need to enable Rosetta for accelerated x86/amd64 binary emulation.

Please follow these steps to do so:

1. Update your Docker Desktop application to the latest version.
2. Navigate to 'Settings', then 'General Settings'.
3. Ensure the `Use Rosetta for x86/amd64 emulation on Apple Silicon` option is checked.
4. Save your settings and restart Docker Desktop for the changes to take effect.


{% endtab %}
{% endtabs %}

---
### Tip to run java jar easily

By following below tip running `java -jar specmatic.jar` every time can be avoided

{% tabs hint-java %}
{% tab hint-java mac/linux %}

Add this to the startup script of your shell like `~/.bashrc` or `~/.zshrc`

``` bash
alias specmatic='java -jar <path-to-jar>/specmatic.jar'
```

Run specmatic by

``` bash
$ specmatic <options>
```
{% endtab %}
{% tab hint-java windows %}
Create a batch file (`specmatic.bat`) with below content and add it your system path.

```  bash
java -jar <path-to-jar>/specmatic.jar %*
```
The %* portion at the end tells the batch script to pass all of the parameters it receives to the new command.

Run specmatic by

``` bash
C:\> specmatic.bat <options>
```
{% endtab %}
{% endtabs %}
