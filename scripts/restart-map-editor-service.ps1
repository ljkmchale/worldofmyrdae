$ErrorActionPreference = 'Stop'
$serviceName = 'WorldOfMyrdaeMapEditor'
$principal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdministrator = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdministrator) {
    Write-Host 'Administrator permission is required. Opening an elevated PowerShell prompt...'
    Start-Process powershell.exe -Verb RunAs -ArgumentList @(
        '-NoProfile',
        '-ExecutionPolicy', 'Bypass',
        '-File', "`"$PSCommandPath`""
    )
    exit 0
}

Restart-Service -Name $serviceName -Force
$service = Get-Service -Name $serviceName
$service.WaitForStatus('Running', [TimeSpan]::FromSeconds(20))
Write-Host "$serviceName is running with the latest server code."
Write-Host 'Editor: http://localhost:4615/editor.html'
