FROM mcr.microsoft.com/vscode/devcontainers/jekyll:0-2.7-bullseye
WORKDIR /workspace
COPY . /workspace
RUN bundle