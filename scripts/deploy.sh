#!/bin/bash

echo "🚀 DEPLOY DEZ SAÚDE FARMA"
echo "========================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para executar comandos com verificação
run_command() {
    echo -e "${BLUE}Executando: $1${NC}"
    eval "$1"
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Sucesso${NC}"
    else
        echo -e "${RED}❌ Falha${NC}"
        return 1
    fi
}

echo -e "\n${BLUE}1. PREPARAÇÃO${NC}"
echo "---------------"

# Parar serviços existentes
echo -e "\n🛑 Parando serviços..."
run_command "sudo systemctl stop nginx 2>/dev/null || true"
run_command "docker-compose down 2>/dev/null || true"
run_command "sudo fuser -k 80/tcp 2>/dev/null || true"
run_command "sudo fuser -k 443/tcp 2>/dev/null || true"

echo -e "\n${BLUE}2. PREPARANDO CERTIFICADOS${NC}"
echo "--------------------------------"

# Usar o certificado do certbot (dezsaudefarma.com.br)
echo -e "\n📁 Copiando certificados do certbot..."
run_command "sudo mkdir -p nginx/ssl"
run_command "sudo cp /etc/letsencrypt/live/dezsaudefarma.com.br/fullchain.pem nginx/ssl/"
run_command "sudo cp /etc/letsencrypt/live/dezsaudefarma.com.br/privkey.pem nginx/ssl/"
run_command "sudo chown root:root nginx/ssl/*.pem"
run_command "sudo chmod 644 nginx/ssl/fullchain.pem"
run_command "sudo chmod 600 nginx/ssl/privkey.pem"

echo -e "\n${BLUE}3. CONSTRUINDO APLICAÇÃO${NC}"
echo "--------------------------------"

# Construir aplicação com Vite
echo -e "\n🔨 Construindo aplicação..."
npm run build

# Verificar se o build foi bem-sucedido
if [ $? -eq 0 ] && [ -f "dist/index.html" ]; then
    echo -e "${GREEN}✅ Build concluído com sucesso${NC}"
else
    echo -e "${RED}❌ Build falhou - dist/index.html não encontrado${NC}"
    exit 1
fi

# Adicionar script do RD Station se não estiver presente
if ! grep -q "d335luupugsy2.cloudfront.net" dist/index.html; then
    echo -e "\n📊 Adicionando RD Station..."
    sed -i '/<script type="module" crossorigin src="\/assets\/index-/i\    <!-- RD Station - Monitoramento -->\n    <script type="text/javascript" async src="https://d335luupugsy2.cloudfront.net/js/loader-scripts/5f18d4ed-17ca-48fa-b83c-0a5b5f85e6b6-loader.js"></script>\n' dist/index.html
fi

echo -e "${GREEN}✅ Aplicação construída${NC}"

echo -e "\n${BLUE}4. INICIANDO SERVIÇOS${NC}"
echo "----------------------------"

# Iniciar containers
echo -e "\n🚀 Iniciando containers..."
run_command "docker-compose up -d"

echo -e "\n${BLUE}5. VERIFICANDO STATUS${NC}"
echo "---------------------------"

# Aguardar inicialização
sleep 5

# Verificar se o container está rodando
if docker ps | grep -q dezsaudefarma-nginx; then
    echo -e "${GREEN}✅ Container está rodando${NC}"
else
    echo -e "${RED}❌ Container não está rodando${NC}"
    echo "📋 Logs do container:"
    docker-compose logs nginx
    exit 1
fi

# Testar conectividade
echo -e "\n🌐 Testando conectividade..."

# Teste local
echo -e "\n📡 Teste local (localhost):"
if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "301"; then
    echo -e "${GREEN}✅ Localhost HTTP está redirecionando para HTTPS${NC}"
else
    echo -e "${YELLOW}⚠️  Localhost HTTP pode não estar redirecionando${NC}"
fi

# Teste externo
echo -e "\n🌍 Teste externo (dezsaudefarma.com.br):"
if curl -s -o /dev/null -w "%{http_code}" http://dezsaudefarma.com.br | grep -q "301"; then
    echo -e "${GREEN}✅ HTTP está redirecionando para HTTPS${NC}"
else
    echo -e "${RED}❌ HTTP não está redirecionando corretamente${NC}"
fi

if curl -s -o /dev/null -w "%{http_code}" https://dezsaudefarma.com.br | grep -q "200"; then
    echo -e "${GREEN}✅ HTTPS está funcionando${NC}"
else
    echo -e "${YELLOW}⚠️  HTTPS pode não estar funcionando corretamente${NC}"
fi

echo -e "\n${GREEN}✅ Deploy concluído!${NC}"
echo -e "\n📋 RESUMO:"
echo "   - HTTP (porta 80): Redirecionando para HTTPS"
echo "   - HTTPS (porta 443): Servindo aplicação"
echo "   - Certificado: /etc/letsencrypt/live/dezsaudefarma.com.br/"
echo -e "\n🌐 Acesse: https://dezsaudefarma.com.br" 