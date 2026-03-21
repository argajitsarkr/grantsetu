# Rename downloaded files to consistent lowercase names
$renames = @(
  @("icmr2.png", "icmr.png"),
  @("dbt_emblem.png", "dbt_emblem_orig.png")
)
foreach ($pair in $renames) {
  $src = $pair[0]; $dst = $pair[1]
  if ((Test-Path $src) -and !(Test-Path $dst)) {
    Rename-Item $src $dst
    Write-Host ("Renamed " + $src + " -> " + $dst)
  }
}
# List final files
Get-ChildItem | Where-Object { !$_.PSIsContainer -and ($_.Extension -eq ".png" -or $_.Extension -eq ".svg") } | Select-Object Name, @{N='Size(KB)';E={[math]::Round($_.Length/1KB,1)}} | Format-Table
