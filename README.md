# Specmatic Documentation

Documentation for [Specmatic](//specmatic.in)

Dev Setup
* Install Ruby > 2.7 - Preferably with rbenv
* Run ```bundle``` to install dependencies
* Run ```bundle exec jekyll serve``` to start server on localhost:4000

Dev Containers (Recommended Approach)
* Pre-requisites - Docker Desktop
* Visual Studio Code 3
* Open Project in VSCode
* VSCode will ask you install necessary extensions and open in dev container. If not install "Visual Studio Code Remote - Containers" - https://code.visualstudio.com/docs/remote/containers
* The Terminal inside VSCode is mapped to Docker Container. Run below commands in that terminal.
  * ```bundle``` to install dependencies
  * ```bundle exec jekyll serve``` to start server
    * Click on the "localhost:4000" link in terminal to launch it in browser at the ephemeral port
    * On my machine it is forwarded to localhost:4001
  * You can even push to GitHub inside this terminal because Dockerfile maps your keys

Reference - How to DevContainers for the first time for Jekyll Projects
  * Cmd + Shift + P and run ```Remote-Containers: Add Development Container Configuration Files...```
  * Search for Jekyll and Choose bullseye
  * This will add the .devcontainers folder with necessary configs, re-open project in container

