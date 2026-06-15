param(
    [int]$Port = 4615,
    [int]$CheckIntervalSeconds = 15
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$runtimeDir = Join-Path $repoRoot ".runtime"
$logPath = Join-Path $runtimeDir "map-editor-service.log"
$nodeOutPath = Join-Path $runtimeDir "map-editor-node.out.log"
$nodeErrPath = Join-Path $runtimeDir "map-editor-node.err.log"

New-Item -ItemType Directory -Force -Path $runtimeDir | Out-Null

function Write-ServiceLog {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $logPath -Value "[$timestamp] $Message"
}

function Get-ListeningProcessId {
    $connection = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
        Select-Object -First 1
    if ($connection) {
        return $connection.OwningProcess
    }
    return $null
}

function Start-MapEditor {
    $env:PORT = [string]$Port
    Write-ServiceLog "Starting map editor server on port $Port."
    Start-Process `
        -FilePath "node" `
        -ArgumentList "server.js" `
        -WorkingDirectory $repoRoot `
        -WindowStyle Hidden `
        -RedirectStandardOutput $nodeOutPath `
        -RedirectStandardError $nodeErrPath | Out-Null
}

Write-ServiceLog "Map editor watchdog started."

while ($true) {
    try {
        $listeningPid = Get-ListeningProcessId
        if (-not $listeningPid) {
            Start-MapEditor
        }
    } catch {
        Write-ServiceLog "Watchdog error: $($_.Exception.Message)"
    }

    Start-Sleep -Seconds $CheckIntervalSeconds
}
