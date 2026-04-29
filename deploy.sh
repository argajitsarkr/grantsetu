#!/bin/bash
# ════════════════════════════════════════════════════════════════════
#  GrantSetu — Deploy / Update script (GitHub + Docker)
#
#  First time:   bash deploy.sh
#  After push:   bash deploy.sh update
#  Logs:         bash deploy.sh logs
#  Status:       bash deploy.sh status
# ════════════════════════════════════════════════════════════════════
set -e

ACTION=${1:-"up"}
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "══════════════════════════════════════════"
echo "  GrantSetu Deploy — action: $ACTION"
echo "══════════════════════════════════════════"
echo ""

cd "$PROJECT_DIR"

# ── Pre-flight checks ──────────────────────────────────────────────
if [ ! -f ".env" ]; then
  echo "❌  .env file not found!"
  echo "    Run:  cp .env.production.example .env"
  echo "    Then fill in your values."
  exit 1
fi

case "$ACTION" in

  # ── First-time build ──────────────────────────────────────────────
  up)
    echo "🔨  Building and starting all containers..."
    docker compose --env-file .env up -d --build
    echo ""
    echo "✅  All services started!"
    docker compose ps
    ;;

  # ── Pull from GitHub & rebuild ────────────────────────────────────
  update)
    echo "📥  Pulling latest code from GitHub..."
    git pull origin main

    echo "🔨  Rebuilding changed containers..."
    docker compose --env-file .env build frontend api

    echo "♻️   Restarting services..."
    docker compose --env-file .env up -d

    echo ""
    echo "✅  Update complete!"
    docker compose ps
    ;;

  # ── View logs ─────────────────────────────────────────────────────
  logs)
    docker compose logs -f --tail=50
    ;;

  # ── Check status ──────────────────────────────────────────────────
  status)
    docker compose ps
    echo ""
    echo "📊  Resource usage:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" $(docker compose ps -q)
    ;;

  # ── Stop everything ──────────────────────────────────────────────
  down)
    echo "🛑  Stopping all services..."
    docker compose down
    echo "✅  All services stopped."
    ;;

  *)
    echo "Usage: bash deploy.sh [up|update|logs|status|down]"
    ;;
esac
