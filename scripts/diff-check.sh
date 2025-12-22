rsync -avn --delete --itemize-changes \
  --include='src/' \
  --include='src/layouts/***' \
  --include='src/components/***' \
  --include='src/utils/***' \
  --include='vendor/***' \
  --include='public/***' \
  --exclude='src/data/' \
  --exclude='*' \
  /home/psousaj/projects/cajuina-site/ \
  /home/psousaj/projects/agua-sao-geraldo-site/ \
  | ./scripts/pretty-rsync.sh