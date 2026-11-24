#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
exec 9>.deploy.lock
flock -n 9 || { echo "Belot deployment already running"; exit 1; }
if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo "Commit or resolve tracked changes before deploying"; exit 1
fi
git pull --ff-only
sudo docker compose config --quiet
sudo docker compose build
python3 scripts/deploy-belot.py
