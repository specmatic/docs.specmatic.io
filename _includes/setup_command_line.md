The quickest approach to getting started is through the command line. There are two ways specmatic is distributed for command line usage, one via jar and another via npm package

{% tabs install %}
{% tab install java %}
Download the standalone jar from [here](<https://github.com/znsio/specmatic/releases/download/{{ site.latest_release }}/specmatic.jar>) to a location on your computer

Run specmatic as below to list all the options available
```bash
java -jar specmatic.jar
```
{% endtab %}
{% tab install npm %}

Install specmatic npm package

``` bash
npm install -g specmatic
```

Run specmatic by

``` bash
$ npx specmatic
```
{% endtab %}

{% tab install docker %}

Docker Pull Command for specmatic docker image

``` bash
> docker pull znsio/specmatic
> docker tag znsio/specmatic:latest specmatic
```

Run specmatic by

``` bash
> docker run specmatic
```
{% endtab %}
{% endtabs %}

---
### Tip to run java jar easily

By following below tip running `java -jar specmatic.jar` everytime can be avoided

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
