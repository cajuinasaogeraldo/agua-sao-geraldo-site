#!/bin/bash

SOURCE="${1:-../cajuina-site}"
DEST="${2:-.}"

RSYNC_SOURCE="$SOURCE" RSYNC_DEST="$DEST" \
rsync -avn --delete --itemize-changes \
  --exclude='src/data/' \
  --exclude-from='scripts/site-specifities.txt' \
  --include='src/' \
  --include='src/layouts/***' \
  --include='src/components/***' \
  --include='src/utils/***' \
  --include='vendor/***' \
  --include='public/***' \
  --exclude='*' \
  "$SOURCE/" \
  "$DEST/" \
  | scripts/pretty-rsync.sh
