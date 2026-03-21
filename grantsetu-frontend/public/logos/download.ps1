$headers = @{'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

$items = @(
  "dst|https://dst.gov.in/sites/all/modules/customs/cmf_content/assets/images/dst-logo1.jpg",
  "birac|https://birac.nic.in/images/Birac_logo.png",
  "csir|https://www.csir.res.in/themes/csir/img/csir-logo.png",
  "anrf|https://anrf.gov.in/assets/images/anrf_logo.png"
)

foreach ($entry in $items) {
  $parts = $entry -split "\|"
  $name = $parts[0]
  $url = $parts[1]
  try {
    Invoke-WebRequest -Uri $url -OutFile "$name.png" -Headers $headers -TimeoutSec 15
    Write-Host "Downloaded $name"
  } catch {
    Write-Host "Failed $name"
  }
}
Write-Host "Done"
