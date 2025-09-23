param(
    [string]$DownloadDir = "$HOME\.specmatic"
)

function Write-Info { Write-Host "💡 [INFO] $args" -ForegroundColor Cyan }
function Write-Warn { Write-Host "⚠️ [WARN] $args" -ForegroundColor Yellow }
function Write-Error { Write-Host "❌ [ERROR] $args" -ForegroundColor Red }

$toolVersion = "{{ include.tool_version }}"
$downloadTarget = "{{ include.download_target }}"
$downloadUrls = @({{ download_urls | strip }})
$toolName = "{{ include.tool_name | strip }}"

if (-not $downloadUrls -or $downloadUrls.Count -eq 0) {
    Write-Error "Download URLs list is empty or not defined. Exiting."
    exit 1
}

$argsList = @($args)
while ($argsList.Count -gt 0) {
    $arg = $argsList[0]
    switch -Regex ($arg) {
        '^(-h|--help)$' {
            Write-Host "Usage: install-specmatic-tool.ps1 [--download-dir=<dir>]"
            Write-Host "  --download-dir: Directory where $downloadTarget.jar will be downloaded (default: $DownloadDir)"
            exit 0
        }
        '^--download-dir=(.+)$' {
            $DownloadDir = $matches[1]
        }
        default {
            Write-Host "Unknown argument: $arg"
            Write-Host "Usage: install-specmatic-tool.ps1 [--download-dir=<dir>]"
            exit 1
        }
    }
    
    if ($argsList.Count -gt 1) {
        $argsList = $argsList[1..($argsList.Count - 1)]
    } else {
        $argsList = @()
    }
}


Write-Info "Using download directory $DownloadDir"
if (-not (Test-Path -Path $DownloadDir)) {
    try {
        New-Item -ItemType Directory -Path $DownloadDir -Force | Out-Null
        Write-Info "Created directory $DownloadDir"
    } catch {
        Write-Error "Failed to create directory $DownloadDir"
        exit 1
    }
} else {
    Write-Info "Using existing directory $DownloadDir"
}

$jarPath = Join-Path $DownloadDir $downloadTarget
if (Test-Path -Path $jarPath) {
    Remove-Item -Path $jarPath -Force
    Write-Info "Removed existing $downloadTarget"
}


$downloadSuccess = $false
foreach ($url in $downloadUrls) {
    Write-Info "Downloading $toolName from $url..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $jarPath -UseBasicParsing
        if (Test-Path $jarPath) {
            Write-Info "Downloaded $toolName to $jarPath"
            $downloadSuccess = $true
            break
        }
    }
    catch {
        Write-Warn "Failed to download from $url"
    }
}

if (-not $downloadSuccess) {
    Write-Error "All download attempts failed. Exiting."
    exit 1
}


if (-not (Get-Command java -ErrorAction SilentlyContinue)) {
    Write-Warn @"
========================================================================
⚠️ Java is not installed or not found in your PATH.

💡 You can download and install a JRE from one of the following sources:

  🔗 AdoptOpenJDK (Eclipse Temurin): [https://adoptium.net/](https://adoptium.net/)
  🔗 Oracle JDK: [https://www.oracle.com/java/technologies/downloads/](https://www.oracle.com/java/technologies/downloads/)
  📦 SDKMAN: [https://sdkman.io/jdks](https://sdkman.io/jdks)

After installation, ensure 'java' is available in your PATH.
"@
}

$sanitizedToolName = $toolName -replace '\s', ''
$funcDef = "function $sanitizedToolName { java -jar `"$jarPath`" `$args }"
Write-Host @"
==================================================================
👍 $toolName $toolVersion installed successfully!

📁 Directory: $DownloadDir
📦 JAR file: $jarPath

Usage:
Run the tool with:
    java -jar `"$jarPath`"

To use $toolName conveniently:

1. Add alias for the current session:
    function $sanitizedToolName { java -jar `"$jarPath`" `$args }

2. To persist alias add to your PowerShell profile file ($PROFILE):
    Add-Content -Path $PROFILE -Value 'function $sanitizedToolName { java -jar `"$jarPath`" `$args }'

3. Restart PowerShell or run:
    . $PROFILE

You can then run $sanitizedToolName directly with arguments, e.g. $sanitizedToolName --help
==================================================================
"@ -ForegroundColor Green
