$ErrorActionPreference='Stop'
$expression=[IO.File]::ReadAllText((Join-Path $PSScriptRoot '../tests/colossus-app-smoke.js'))
& (Join-Path $PSScriptRoot 'browser-check.ps1') -Url 'file:///C:/Users/user/Documents/game%20made/index.html' -Output tests/colossus-app-result -Expression $expression
