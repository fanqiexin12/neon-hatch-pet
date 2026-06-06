#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
APP_NAME="${APP_NAME:-Neon Hatch Pet}"
BUNDLE_ID="${BUNDLE_ID:-com.neonhatch.pet}"
VERSION="$(node -e "process.stdout.write(require('./package.json').version)")"
ARCH="$(uname -m)"
ELECTRON_APP="$ROOT_DIR/node_modules/electron/dist/Electron.app"
RELEASE_DIR="$ROOT_DIR/release"
OUT_DIR="$RELEASE_DIR/mac-$ARCH"
APP_DIR="$OUT_DIR/$APP_NAME.app"
ZIP_FILE="$RELEASE_DIR/neon-hatch-pet-v$VERSION-mac-$ARCH.zip"

if [ ! -d "$ELECTRON_APP" ]; then
  echo "Electron runtime not found. Run npm install first."
  exit 1
fi

rm -rf "$OUT_DIR" "$ZIP_FILE"
mkdir -p "$OUT_DIR"
cp -R "$ELECTRON_APP" "$APP_DIR"

APP_RESOURCES="$APP_DIR/Contents/Resources/app"
rm -rf "$APP_RESOURCES"
mkdir -p "$APP_RESOURCES"

cp "$ROOT_DIR/package.json" "$APP_RESOURCES/"
cp "$ROOT_DIR/README.md" "$APP_RESOURCES/"
cp "$ROOT_DIR/CHANGELOG.md" "$APP_RESOURCES/"
cp "$ROOT_DIR/main.js" "$APP_RESOURCES/"
cp "$ROOT_DIR/preload.js" "$APP_RESOURCES/"
cp "$ROOT_DIR/desktop.html" "$APP_RESOURCES/"
cp "$ROOT_DIR/desktop.css" "$APP_RESOURCES/"
cp "$ROOT_DIR/desktop-pet.js" "$APP_RESOURCES/"
cp "$ROOT_DIR/index.html" "$APP_RESOURCES/"
cp "$ROOT_DIR/styles.css" "$APP_RESOURCES/"
cp "$ROOT_DIR/app.js" "$APP_RESOURCES/"

PLIST="$APP_DIR/Contents/Info.plist"
if command -v /usr/libexec/PlistBuddy >/dev/null 2>&1; then
  /usr/libexec/PlistBuddy -c "Set :CFBundleName $APP_NAME" "$PLIST"
  /usr/libexec/PlistBuddy -c "Set :CFBundleDisplayName $APP_NAME" "$PLIST"
  /usr/libexec/PlistBuddy -c "Set :CFBundleIdentifier $BUNDLE_ID" "$PLIST"
  /usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString $VERSION" "$PLIST"
  /usr/libexec/PlistBuddy -c "Set :CFBundleVersion $VERSION" "$PLIST"
fi

if command -v xattr >/dev/null 2>&1; then
  xattr -cr "$APP_DIR"
fi

if command -v codesign >/dev/null 2>&1; then
  codesign --force --deep --sign - "$APP_DIR" >/dev/null
fi

mkdir -p "$RELEASE_DIR"
ditto -c -k --sequesterRsrc --keepParent "$APP_DIR" "$ZIP_FILE"

echo "Packaged app:"
echo "  $APP_DIR"
echo "Zip archive:"
echo "  $ZIP_FILE"
