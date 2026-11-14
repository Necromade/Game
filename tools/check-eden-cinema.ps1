$ErrorActionPreference='Stop'
$expression=[IO.File]::ReadAllText((Join-Path $PSScriptRoot '../tests/eden-cinema-app.js'))
& (Join-Path $PSScriptRoot 'browser-check.ps1') -Url 'file:///C:/Users/user/Documents/game%20made/index.html' -Output tests/eden-cinema-app-result -Expression $expression
