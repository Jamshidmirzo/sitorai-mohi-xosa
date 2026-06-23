#!/usr/bin/env bash
#
# One-shot deploy from any developer machine to the production droplet.
# Assumes:
#   - the local branch is committed and pushed to origin/main
#   - SSH access to root@mohixossa.uz (or the droplet IP) via the deploy key
#   - the droplet already has Node, Postgres, Caddy and pm2 installed
#
# Usage:
#   ./deploy.sh                # deploys current origin/main
#   ./deploy.sh --skip-build   # only restart pm2 (use when .env changed)
#   ./deploy.sh --reseed       # also re-run the dissertation seeders (additive, idempotent)
#
set -euo pipefail

DROPLET="${DROPLET_HOST:-root@mohixossa.uz}"
SSH_KEY="${DROPLET_SSH_KEY:-$HOME/.ssh/mohi_hosa_deploy}"
APP_DIR="/var/www/sitorai-mohi-xosa"

SKIP_BUILD=0
RESEED=0
for arg in "$@"; do
  case "$arg" in
    --skip-build) SKIP_BUILD=1 ;;
    --reseed) RESEED=1 ;;
    *) echo "Unknown flag: $arg" >&2; exit 1 ;;
  esac
done

echo "→ Pushing local commits"
git push origin main

echo "→ Deploying to $DROPLET ($APP_DIR)"

ssh -i "$SSH_KEY" -o IdentitiesOnly=yes "$DROPLET" bash <<REMOTE
set -e
export LANG=C.UTF-8
export LC_ALL=C.UTF-8

cd $APP_DIR

echo "  • git pull"
git pull --rebase -q

echo "  • prisma generate"
npx prisma generate >/dev/null

echo "  • prisma db push"
npx prisma db push --accept-data-loss 2>&1 | tail -2

if [ "$RESEED" = "1" ]; then
  for f in prisma/seed-dissertation*.ts; do
    [ -f "\$f" ] || continue
    echo "  • seeding \$f"
    npx tsx "\$f" 2>&1 | tail -5 || true
  done
fi

if [ "$SKIP_BUILD" = "0" ]; then
  echo "  • npm ci"
  npm ci --silent 2>&1 | tail -2 || true
  echo "  • next build"
  NODE_OPTIONS=--max-old-space-size=2048 npm run build 2>&1 | tail -2
fi

echo "  • pm2 restart"
pm2 restart sitorai 2>&1 | tail -1

# Smoke test
sleep 3
echo
echo "  • smoke tests:"
for path in /ru /en /uz /admin/login; do
  code=\$(curl -sS -o /dev/null -w "%{http_code}" --max-time 10 "https://mohixossa.uz\$path")
  printf "    %-15s → %s\n" "\$path" "\$code"
done
REMOTE

echo "✓ Deploy complete: https://mohixossa.uz"
