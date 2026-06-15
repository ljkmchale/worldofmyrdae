param(
    [int]$Port = 4615,
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

$repoRoot = Split-Path -Parent $PSScriptRoot
$serviceRoot = Join-Path $env:ProgramData $ServiceName
$serviceExe = Join-Path $serviceRoot "$ServiceName.exe"
$serviceConfig = Join-Path $serviceRoot "$ServiceName.xml"
$logsDir = Join-Path $serviceRoot "logs"
$nodeExe = (Get-Command node.exe -ErrorAction Stop).Source

New-Item -ItemType Directory -Force -Path $serviceRoot, $logsDir | Out-Null

if (-not (Test-Path $serviceExe)) {
    $winswUrl = "https://github.com/winsw/winsw/releases/latest/download/WinSW-x64.exe"
    Write-Host "Downloading WinSW service wrapper..."
    Invoke-WebRequest -Uri $winswUrl -OutFile $serviceExe
}

$escapedNode = [Security.SecurityElement]::Escape($nodeExe)
$escapedRepo = [Security.SecurityElement]::Escape($repoRoot)
$escapedLogs = [Security.SecurityElement]::Escape($logsDir)

$xml = @"
<service>
  <id>$ServiceName</id>
  <name>World of Myrdae Map Editor</name>
  <description>Runs the World of Myrdae map editor Node server for the Cloudflare tunnel.</description>
  <executable>$escapedNode</executable>
  <arguments>server.js</arguments>
  <workingdirectory>$escapedRepo</workingdirectory>
  <env name="PORT" value="$Port" />
  <startmode>Automatic</startmode>
  <onfailure action="restart" delay="10 sec" />
  <onfailure action="restart" delay="30 sec" />
  <onfailure action="restart" delay="60 sec" />
  <logpath>$escapedLogs</logpath>
  <log mode="roll-by-size">
    <sizeThreshold>10485760</sizeThreshold>
    <keepFiles>5</keepFiles>
  </log>
</service>
"@

Set-Content -Path $serviceConfig -Value $xml -Encoding UTF8

$existing = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
if (-not $existing) {
    & $serviceExe install
}

Get-Service -Name $ServiceName -ErrorAction SilentlyContinue | Stop-Service -Force -ErrorAction SilentlyContinue

Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | ForEach-Object {
    Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
}

Start-Service -Name $ServiceName
Start-Sleep -Seconds 5

$startupFile = Join-Path ([Environment]::GetFolderPath("Startup")) "WorldOfMyrdaeMapEditor.cmd"
if (Test-Path $startupFile) {
    Rename-Item -Path $startupFile -NewName "WorldOfMyrdaeMapEditor.cmd.disabled" -Force
}

$listener = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $listener) {
    throw "Service installed, but no listener was found on port $Port. Check $logsDir."
}

Write-Host "Installed and started $ServiceName on port $Port."
