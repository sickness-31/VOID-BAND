<#
  VO!D - IMAGE SHRINK
  tools/shrink.ps1

  Resizes every JPG/PNG in a folder to web size, IN PLACE, keeping the
  photographer (Authors) metadata so credits still work.

  RUN (from the folder that contains index.html):

      powershell -ExecutionPolicy Bypass -File tools\shrink.ps1 assets\shows\2026-03-06
      powershell -ExecutionPolicy Bypass -File tools\shrink.ps1 assets\images

  Options:
      -MaxEdge 2000    longest side in pixels (default 2000)
      -Quality 85      JPEG quality 1-100 (default 85)

  Then re-bake the credits:   python tools\credits.py

  Uses Windows' built-in imaging (System.Drawing) - nothing to install.
  Do NOT run it on assets\press\ - those are the full-resolution
  originals for the EPK download links.
#>
param(
  [Parameter(Mandatory = $true, Position = 0)][string]$Folder,
  [int]$MaxEdge = 2000,
  [long]$Quality = 85
)
Add-Type -AssemblyName System.Drawing

if (-not (Test-Path $Folder)) { Write-Error "No such folder: $Folder"; exit 1 }
if ((Resolve-Path $Folder).Path -match '\\assets\\press($|\\)') { Write-Error "Refusing to shrink assets\press (full-res originals)."; exit 1 }

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)

# EXIF tags carried across: Artist, XPAuthor, Copyright, XPTitle, XPComment, ImageDescription
$keepTags = @(0x013B, 0x9C9E, 0x8298, 0x9C9B, 0x9C9C, 0x010E)

$before = 0; $after = 0
Get-ChildItem $Folder -File | Where-Object { $_.Extension -match '^\.(jpg|jpeg|png)$' } | ForEach-Object {
  $path = $_.FullName; $sizeBefore = $_.Length; $before += $sizeBefore
  $ms = New-Object System.IO.MemoryStream(,[System.IO.File]::ReadAllBytes($path))
  $src = [System.Drawing.Image]::FromStream($ms)
  $w = $src.Width; $h = $src.Height
  $scale = [Math]::Min(1.0, $MaxEdge / [Math]::Max($w, $h))
  $nw = [int][Math]::Round($w * $scale); $nh = [int][Math]::Round($h * $scale)
  $isPng = $_.Extension -ieq '.png'
  $fmt = if ($isPng) { [System.Drawing.Imaging.PixelFormat]::Format32bppArgb } else { [System.Drawing.Imaging.PixelFormat]::Format24bppRgb }
  $dst = New-Object System.Drawing.Bitmap($nw, $nh, $fmt)
  $g = [System.Drawing.Graphics]::FromImage($dst)
  $g.InterpolationMode = 'HighQualityBicubic'; $g.SmoothingMode = 'HighQuality'
  $g.PixelOffsetMode = 'HighQuality'; $g.CompositingQuality = 'HighQuality'
  if (-not $isPng) { $g.Clear([System.Drawing.Color]::White) }
  $g.DrawImage($src, 0, 0, $nw, $nh); $g.Dispose()
  $kept = @()
  if (-not $isPng) {
    foreach ($pi in $src.PropertyItems) { if ($keepTags -contains $pi.Id) { $dst.SetPropertyItem($pi); $kept += $pi.Id } }
  }
  $src.Dispose(); $ms.Dispose()
  if ($isPng) { $dst.Save($path, [System.Drawing.Imaging.ImageFormat]::Png) }
  else        { $dst.Save($path, $jpegCodec, $encParams) }
  $dst.Dispose()
  $sizeAfter = (Get-Item $path).Length; $after += $sizeAfter
  $credit = if ($kept -contains 0x013B -or $kept -contains 0x9C9E) { 'credit kept' } elseif ($isPng) { '' } else { 'NO AUTHORS SET' }
  "{0,-22} {1}x{2} -> {3}x{4}  {5,6:N2} MB -> {6,5:N2} MB  {7}" -f $_.Name, $w, $h, $nw, $nh, ($sizeBefore/1MB), ($sizeAfter/1MB), $credit
}
"TOTAL {0:N1} MB -> {1:N1} MB" -f ($before/1MB), ($after/1MB)
"Next: python tools\credits.py"
