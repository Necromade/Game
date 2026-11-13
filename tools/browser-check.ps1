param([string]$Url='file:///C:/Users/user/Documents/game%20made/tests/governor.html',[string]$Output='tests/governor-result',[int]$Port=9237,[string]$Expression='',[int]$Width=1280,[int]$Height=900)
$ErrorActionPreference='Stop'
$tabs=(Invoke-WebRequest -UseBasicParsing "http://localhost:$Port/json/list").Content | ConvertFrom-Json
$tab=$tabs | Where-Object type -eq 'page' | Select-Object -First 1
$ws=New-Object System.Net.WebSockets.ClientWebSocket
[void]$ws.ConnectAsync([Uri]$tab.webSocketDebuggerUrl,[Threading.CancellationToken]::None).GetAwaiter().GetResult()
$script:requestId=0
function Request($method,$parameters){
 $script:requestId++
 $message=@{id=$script:requestId;method=$method;params=$parameters}|ConvertTo-Json -Depth 15 -Compress
 $bytes=[Text.Encoding]::UTF8.GetBytes($message)
 [void]$ws.SendAsync([ArraySegment[byte]]::new($bytes),[Net.WebSockets.WebSocketMessageType]::Text,$true,[Threading.CancellationToken]::None).GetAwaiter().GetResult()
 do{
  $buffer=New-Object byte[] 1048576
  $builder=New-Object Text.StringBuilder
  do{$received=$ws.ReceiveAsync([ArraySegment[byte]]::new($buffer),[Threading.CancellationToken]::None).GetAwaiter().GetResult();[void]$builder.Append([Text.Encoding]::UTF8.GetString($buffer,0,$received.Count))}while(!$received.EndOfMessage)
  $reply=$builder.ToString()|ConvertFrom-Json
 }while($reply.id -ne $script:requestId)
 if($reply.error){throw ($reply.error|ConvertTo-Json)}
 return $reply.result
}
Request 'Emulation.setDeviceMetricsOverride' @{width=$Width;height=$Height;deviceScaleFactor=1;mobile=$false} | Out-Null
if($Url){Request 'Page.navigate' @{url=$Url} | Out-Null}
$expr='new Promise(resolve=>{let n=0;const t=setInterval(()=>{const o=document.querySelector("#results");if(o&&o.textContent&&!/^(RUNNING|Running\.\.\.)$/.test(o.textContent)){clearInterval(t);resolve(o.textContent)}else if(n++>1800){clearInterval(t);resolve("TIMEOUT "+document.body.innerText)}},100)})'
if($Expression){$expr=$Expression}
$r=Request 'Runtime.evaluate' @{expression=$expr;awaitPromise=$true;returnByValue=$true}
if($r.exceptionDetails){throw ($r.exceptionDetails|ConvertTo-Json -Depth 5)}
$r.result.value | Set-Content -Encoding UTF8 "$Output.txt"
Write-Output $r.result.value
$r=Request 'Page.captureScreenshot' @{format='png';captureBeyondViewport=$true}
[IO.File]::WriteAllBytes((Join-Path $pwd "$Output.png"),[Convert]::FromBase64String($r.data))
$ws.Dispose()
