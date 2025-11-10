To run the latest version:
```bash
docker run -it --rm {{ include.image_name }} --help
```

To mount the license file when using Docker, use the `-v` option to map the host directory containing the license file to `/root/.specmatic` in the container.

{% if include.shell == "Powershell" %}
If running in Powershell, use the following command:
```bash
docker run -it --rm -v "${env:USERPROFILE}/.specmatic:/root/.specmatic" {{ include.image_name }} --help
```
{% elsif include.shell == "Cmd" %}
If running in Command Prompt, use the following command:
```bash
docker run -it --rm -v %HOME%/.license:/root/.specmatic {{ include.image_name }} --help
```
{% else %}
```bash
docker run -it --rm -v $HOME/.license:/root/.specmatic {{ include.image_name }} --help
```
{% endif %}

For older versions, replace `VERSION` with the desired version number from the [Docker Hub](https://hub.docker.com/r/{{ include.image_name }}/tags) page
```bash
docker run -it --rm {{ include.image_name }}:VERSION --help
```
