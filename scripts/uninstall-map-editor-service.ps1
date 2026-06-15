param(
    [string]$ServiceName = "WorldOfMyrdaeMapEditor"
)

$ErrorActionPreference = "Stop"

function Test-IsAdministrator {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($identity)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Test-IsAdministrator)) {
    throw "Run this script from an elevated PowerShell window: right-click PowerShell and choose 'Run as administrator'."
}

$serviceRoot = Join-Path $env:ProgramData $ServiceName
$serviceExe = Join-Path $serviceRoot "$ServiceName.exe"

if (Get-Service -Name $ServiceName -ErrorAction SilentlyContinue) {
    Stop-Service -Name $ServiceName -Force -ErrorAction SilentlyContinue
    if (Test-Path $serviceExe) {
        & $serviceExe uninstall
    } else {
        sc.exe delete $ServiceName | Out-Null
    }
}

$startupDir = [Environment]::GetFolderPath("Startup")
$disabledStartup = Join-Path $startupDir "WorldOfMyrdaeMapEditor.cmd.disabled"
if (Test-Path $disabledStartup) {
    Rename-Item -Path $disabledStartup -NewName "WorldOfMyrdaeMapEditor.cmd" -Force
}

Write-Host "Uninstalled $ServiceName."
