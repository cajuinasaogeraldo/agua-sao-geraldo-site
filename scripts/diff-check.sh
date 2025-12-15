rsync -av --delete --itemize-changes \
  --filter='+ src/' \
  --filter='+ src/layouts/**' \
  --filter='+ src/components/**' \
  --filter='+ src/utils/**' \
  --filter='+ vendor/**' \
  --filter='+ public/**' \
  --filter='- src/data/' \
  --filter='- *' \
  /home/psousaj/projects/cajuina-site/ /home/psousaj/projects/agua-sao-geraldo-site/
