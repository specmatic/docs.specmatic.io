---
layout: none
---
#!/usr/bin/env bash

specmatic_version={{ site.specmatic-core-version }}
download_target="specmatic.jar"
download_urls=(
  "https://repo1.maven.org/maven2/io/specmatic/specmatic-executable-all/$specmatic_version/specmatic-executable-all-$specmatic_version.jar"
  "https://github.com/specmatic/specmatic/releases/download/$specmatic_version/specmatic.jar"
  "https://repo.specmatic.io/releases/io/specmatic/specmatic-executable-all/$specmatic_version/specmatic-executable-all-$specmatic_version.jar"
)

# usage:
# curl -s {{site.url}}/{{ page.name }} | bash -s -- [--download-dir=<dir>] [--shell=bash|zsh]

info() {
  echo -e "💡 \033[1;34m[INFO]\033[0m $*"
}
warn() {
  echo -e "⚠️  \033[1;33m[WARN]\033[0m $*"
}
error() {
  echo -e "❌ \033[1;31m[ERROR]\033[0m $*"
}

# Improved argument parsing with --download-dir
DOWNLOAD_DIR="$HOME/.specmatic"

while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help)
      echo "Usage: {{ page.name }} [--download-dir=<dir>] [--shell=bash|zsh]"
      echo "  --download-dir: Directory to download $download_target (default: ~/.specmatic/)"
      exit 0
      ;;
    --download-dir=*)
      DOWNLOAD_DIR="${1#*=}"
      ;;
    *)
      echo "Unknown argument: $1"
      echo "Usage: {{ page.name }} [--download-dir=<dir>] [--shell=bash|zsh]"
      exit 1
      ;;
  esac
  shift
done

info "Download directory: $DOWNLOAD_DIR"

JAR_PATH="$DOWNLOAD_DIR/$download_target"

# Detect available download tool and set args
if command -v wget >/dev/null 2>&1; then
  DOWNLOADER="wget"
  DOWNLOADER_ARGS=( --show-progress -qO )
elif command -v curl >/dev/null 2>&1; then
  DOWNLOADER="curl"
  DOWNLOADER_ARGS=( --progress-bar -fLo )
else
  error "Neither curl nor wget is available. Please install one to proceed."
  exit 1
fi

info "Using downloader: $DOWNLOADER"

mkdir -p "$DOWNLOAD_DIR"

download_success=0
for url in "${download_urls[@]}"; do
  info "Attempting to download Specmatic from $url"
  if "$DOWNLOADER" "${DOWNLOADER_ARGS[@]}" "$JAR_PATH" "$url"; then
    info "Downloaded Specmatic to $JAR_PATH"
    download_success=1
    break
  else
    warn "Failed to download from $url"
  fi
done

if [ "$download_success" -eq 0 ]; then
  error "All download attempts failed."
  exit 1
fi

# Generate shell completion script using picocli's AutoComplete
info "Generating shell completion script..."
java -cp $JAR_PATH picocli.AutoComplete -n specmatic --force -o "$DOWNLOAD_DIR/specmatic-completion.sh" application.SpecmaticCommand

# Detect shell profile file
case "$SHELL" in
  */bash)
    SHELL_PROFILE="~/.bashrc"
    ;;
  */zsh)
    SHELL_PROFILE="~/.zshrc"
    ;;
  */fish)
    SHELL_PROFILE="~/.config/fish/config.fish"
    ;;
  *)
    SHELL_PROFILE="~/.profile"
    ;;
esac


# Check if Java is installed
if ! command -v java >/dev/null 2>&1; then
  cat <<EOF
========================================================================
⚠️ Java is not installed or not found in your PATH.

💡 You can download and install a JRE from one of the following sources:

  🔗 AdoptOpenJDK (Eclipse Temurin): https://adoptium.net/
  🔗 Oracle JDK: https://www.oracle.com/java/technologies/downloads/
  🍎 Homebrew (macOS): brew install openjdk@17
  📦 SDKMAN: https://sdkman.io/jdks
  🐧 Linux (Debian/Ubuntu): sudo apt-get install openjdk-17-jre
  🐧 Linux (Fedora): sudo dnf install java-17-openjdk

After installation, ensure 'java' is available in your PATH.
EOF
fi

cat <<EOF
========================================================================
✅ Specmatic version $specmatic_version installed successfully in:
  $JAR_PATH

🔗 To use Specmatic, add the following to your shell profile ($SHELL_PROFILE):

  echo "alias specmatic='java -jar $JAR_PATH'" >> $SHELL_PROFILE
  echo "source $DOWNLOAD_DIR/specmatic-completion.sh" >> $SHELL_PROFILE

🔄 Restart your terminal or run:
  source $SHELL_PROFILE

🚀 You're ready to use Specmatic!
========================================================================
EOF
