#!/usr/bin/env bash
# Copy the built site + generator source into the PLI_Campaign repo clone.
set -euo pipefail
P="$1"; R="$2"
find "$R" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -a "$P/out/site/." "$R/"
cp "$P/README_REPO.md" "$R/README.md"
mkdir -p "$R/source"
for d in src tools config content fonts; do cp -a "$P/$d" "$R/source/"; done
mkdir -p "$R/source/assets" "$R/source/cache"
cp -a "$P/assets/logos" "$P/assets/photos" "$R/source/assets/"
cp -a "$P/cache/tts" "$R/source/cache/"
cp "$P/PLI_Marketing_Plan.md" "$P/package.json" "$R/source/"
[ -f "$P/package-lock.json" ] && cp "$P/package-lock.json" "$R/source/"
printf 'node_modules/\nout/\nassets/music/bed.wav\n' > "$R/source/.gitignore"
du -sh "$R" --exclude=.git
