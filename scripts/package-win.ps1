$ErrorActionPreference = "Stop"

$RootDir = Resolve-Path (Join-Path $PSScriptRoot "..")
$AppName = if ($env:APP_NAME) { $env:APP_NAME } else { "Neon Hatch Pet" }
$PackageJson = Get-Content (Join-Path $RootDir "package.json") -Raw | ConvertFrom-Json
$Version = $PackageJson.version
$Arch = (& node -e "process.stdout.write(process.arch)")
$ElectronDist = Join-Path $RootDir "node_modules/electron/dist"
$ElectronExe = Join-Path $ElectronDist "electron.exe"
$ReleaseDir = Join-Path $RootDir "release"
$OutDir = Join-Path $ReleaseDir "win-$Arch"
$AppDir = Join-Path $OutDir $AppName
$ZipFile = Join-Path $ReleaseDir "neon-hatch-pet-v$Version-win-$Arch.zip"

if (!(Test-Path $ElectronExe)) {
  Write-Error "Electron runtime not found. Run npm install on Windows first."
}

if (Test-Path $OutDir) {
  Remove-Item $OutDir -Recurse -Force
}
if (Test-Path $ZipFile) {
  Remove-Item $ZipFile -Force
}

New-Item -ItemType Directory -Force -Path $AppDir | Out-Null
Copy-Item (Join-Path $ElectronDist "*") $AppDir -Recurse -Force

$OriginalExe = Join-Path $AppDir "electron.exe"
$RenamedExe = Join-Path $AppDir "$AppName.exe"
if (Test-Path $RenamedExe) {
  Remove-Item $RenamedExe -Force
}
Rename-Item $OriginalExe "$AppName.exe"

$ResourcesDir = Join-Path $AppDir "resources"
$DefaultApp = Join-Path $ResourcesDir "default_app.asar"
if (Test-Path $DefaultApp) {
  Remove-Item $DefaultApp -Force
}

$AppResources = Join-Path $ResourcesDir "app"
if (Test-Path $AppResources) {
  Remove-Item $AppResources -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $AppResources | Out-Null

$AppFiles = @(
  "package.json",
  "README.md",
  "CHANGELOG.md",
  "main.js",
  "preload.js",
  "desktop.html",
  "desktop.css",
  "desktop-pet.js",
  "index.html",
  "styles.css",
  "app.js"
)

foreach ($File in $AppFiles) {
  Copy-Item (Join-Path $RootDir $File) $AppResources -Force
}

New-Item -ItemType Directory -Force -Path $ReleaseDir | Out-Null
Compress-Archive -Path $AppDir -DestinationPath $ZipFile -Force

Write-Host "Packaged app:"
Write-Host "  $AppDir"
Write-Host "Zip archive:"
Write-Host "  $ZipFile"
