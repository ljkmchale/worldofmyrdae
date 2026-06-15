param(
    [int]$Port = 4615
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot

$existing = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if ($existing) {
    exit 0
}

$env:PORT = [string]$Port
Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory $repoRoot -WindowStyle Hidden
