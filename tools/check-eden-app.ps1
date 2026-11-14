param([int]$Width=1280,[int]$Height=900,[string]$Output='tests/eden-app-result')
$ErrorActionPreference='Stop'
$expression=[IO.File]::ReadAllText((Join-Path $PSScriptRoot '../tests/eden-app-smoke.js'))
& (Join-Path $PSScriptRoot 'browser-check.ps1') -Url 'file:///C:/Users/user/Documents/game%20made/index.html' -Output $Output -Expression $expression -Width $Width -Height $Height
