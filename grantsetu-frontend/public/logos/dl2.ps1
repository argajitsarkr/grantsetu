$headers = @{'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
$pairs = @(
  @("icmr", "https://icmr.nic.in/sites/default/files/icmr_0.png"),
  @("icmr2", "https://www.icmr.gov.in/images/logo.png"),
  @("ugc", "https://www.ugc.gov.in/images/ugc-logo.png"),
  @("dbt_emblem", "https://dbt.gov.in/mainogo.png"),
  @("ayush", "https://main.ayush.gov.in/sites/default/files/logo.png"),
  @("anrf2", "https://www.anrf.gov.in/assets/images/anrf_logo.png")
)
foreach ($pair in $pairs) {
  $name = $pair[0]
  $url = $pair[1]
  try {
    Invoke-WebRequest -Uri $url -OutFile ($name + ".png") -Headers $headers -TimeoutSec 12
    $sz = (Get-Item ($name + ".png")).Length
    Write-Host ("OK " + $name + " " + $sz + " bytes")
  } catch {
    Write-Host ("FAIL " + $name)
  }
}
Write-Host "Done"
