#!/usr/bin/env bash
set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════╗"
echo "║     Bem-vindo ao Dev Container!          ║"
echo "╚══════════════════════════════════════════╝"
echo -e "${NC}"

# ─── Instala dependências conforme a linguagem ─────────────────
if [ -f /workspace/package.json ]; then
  echo -e "${GREEN}[Node.js]${NC} Instalando dependências npm..."
  cd /workspace && npm install --loglevel=error 2>/dev/null || true
fi

if [ -f /workspace/requirements.txt ]; then
  echo -e "${GREEN}[Python]${NC} Instalando dependências pip..."
  pip install -r /workspace/requirements.txt --quiet 2>/dev/null || true
fi

if [ -f /workspace/Pipfile ]; then
  cd /workspace && pipenv install --dev 2>/dev/null || true
fi

if [ -f /workspace/pyproject.toml ]; then
  pip install -e /workspace --quiet 2>/dev/null || true
fi

if [ -f /workspace/go.mod ]; then
  cd /workspace && go mod download 2>/dev/null || true
fi

if [ -f /workspace/composer.json ]; then
  cd /workspace && composer install --no-interaction 2>/dev/null || true
fi

if [ -f /workspace/Gemfile ]; then
  cd /workspace && bundle install --quiet 2>/dev/null || true
fi

if [ -f /workspace/CMakeLists.txt ]; then
  mkdir -p /workspace/build && cd /workspace/build && cmake .. 2>/dev/null || true
fi

# ─── Claude Code + opencode ─────────────────────────────────────
(
  if ! command -v node &>/dev/null; then
    echo -e "${CYAN}[AI Tools]${NC} Instalando Node.js..."
    sudo apt-get update -qq && sudo apt-get install -y --no-install-recommends nodejs npm -qq 2>/dev/null \
      && echo -e "${GREEN}[AI Tools]${NC} Node.js instalado!" \
      || echo -e "${RED}[AI Tools]${NC} Falha ao instalar Node.js"
  else
    echo -e "${GREEN}[AI Tools]${NC} Node.js já disponível"
  fi

  if command -v npm &>/dev/null; then
    echo ""
    echo -e "${CYAN}[AI Tools]${NC} Instalando Claude Code..."
    npm config set prefix ~/.npm-global
    export PATH="$HOME/.npm-global/bin:$PATH"
    npm install -g @anthropic-ai/claude-code 2>/dev/null && {
      echo -e "${GREEN}[AI Tools]${NC} Claude Code instalado!"
      sudo ln -sf "$HOME/.npm-global/bin/claude" /usr/local/bin/claude
    } || {
      echo -e "${YELLOW}[AI Tools]${NC} Falha com npm user, tentando sudo..."
      sudo npm install -g @anthropic-ai/claude-code 2>/dev/null || echo -e "${RED}[AI Tools]${NC} Falha ao instalar Claude Code"
    }
  else
    echo -e "${RED}[AI Tools]${NC} npm NAO ENCONTRADO - Claude Code nao instalado"
  fi

  echo ""
  echo -e "${CYAN}[AI Tools]${NC} Instalando opencode..."
  npm install -g opencode-ai 2>/dev/null && {
    sudo ln -sf "$HOME/.npm-global/bin/opencode" /usr/local/bin/opencode
    echo -e "${GREEN}[AI Tools]${NC} opencode instalado!"
  } || echo -e "${RED}[AI Tools]${NC} Falha ao instalar opencode"
) || true

# ─── MCP: Obsidian ─────────────────────────────────────────────
echo ""
echo -e "${CYAN}[MCP]${NC} Configurando Obsidian MCP..."
if npm install -g obsidian-local-rest-mcp --quiet 2>/dev/null; then
  node -e "
const fs = require('fs');
const p = process.env.HOME + '/.claude.json';
let d = {};
try { d = JSON.parse(fs.readFileSync(p, 'utf8')); } catch(e) {}
if (!d.mcpServers) d.mcpServers = {};
d.mcpServers.obsidian = {
  command: 'obsidian-local-rest-mcp',
  env: {
    OBSIDIAN_API_KEY: process.env.OBSIDIAN_API_KEY || '',
    OBSIDIAN_BASE_URL: process.env.OBSIDIAN_BASE_URL || 'http://127.0.0.1:27123',
    MCP_TRANSPORT: 'stdio'
  }
};
fs.writeFileSync(p, JSON.stringify(d, null, 4));
"
  echo -e "${GREEN}[MCP]${NC} Obsidian MCP configurado em ~/.claude.json"
else
  echo -e "${RED}[MCP]${NC} Falha ao instalar obsidian-local-rest-mcp"
fi

# ─── MCP: ai-memory ────────────────────────────────────────────
if [[ -n "${AI_MEMORY_API_KEY:-}" ]]; then
  echo -e "${CYAN}[MCP]${NC} Configurando ai-memory MCP..."

  # Claude Code
  node -e "
const fs = require('fs');
const p = process.env.HOME + '/.claude.json';
let d = {};
try { d = JSON.parse(fs.readFileSync(p, 'utf8')); } catch(e) {}
if (!d.mcpServers) d.mcpServers = {};
d.mcpServers['ai-memory'] = {
  type: 'http',
  url: 'http://localhost:49374/mcp',
  headers: { Authorization: 'Bearer ' + process.env.AI_MEMORY_API_KEY }
};
fs.writeFileSync(p, JSON.stringify(d, null, 4));
"
  echo -e "${GREEN}[MCP]${NC} ai-memory configurado no Claude Code"
fi

# ─── opencode config (sempre gerado) ───────────────────────────
mkdir -p "$HOME/.config/opencode"
node -e "
const fs = require('fs');
const p = process.env.HOME + '/.config/opencode/opencode.json';
const key = process.env.AI_MEMORY_API_KEY;
const d = {
  '\$schema': 'https://opencode.ai/config.json',
  model: 'anthropic/claude-sonnet-4-6',
  ...(key ? { mcp: { 'ai-memory': {
    type: 'remote',
    url: 'http://localhost:49374/mcp',
    enabled: true,
    headers: { Authorization: 'Bearer ' + key }
  }}} : {})
};
fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n');
"
echo -e "${GREEN}[MCP]${NC} opencode config gerado"

echo ""
echo -e "${GREEN}[AI Tools]${NC} Resumo:"
echo "  Claude Code:  claude login"
echo "  opencode:     config gerado em ~/.config/opencode/config.json"
echo "  MCP Obsidian: http://127.0.0.1:27123"
echo "  MCP ai-memory: http://localhost:49374/mcp"

echo ""
echo -e "${GREEN}✔ Container pronto!${NC}"
echo "  Dica: use 'code .' para reabrir no VS Code Desktop."
