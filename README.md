# Dez Saúde Farma

Aplicação web para gerenciamento de farmácias e telemedicina.

## 🚀 Deploy na VPS

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose
- Certbot (para SSL)

### Deploy Rápido

1. **Fazer pull do código:**
```bash
cd ~/dezsaudefarma
git pull origin main
```

2. **Executar deploy:**
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

3. **Verificar status:**
```bash
chmod +x scripts/status.sh
./scripts/status.sh
```

### Comandos Úteis

```bash
# Ver logs
docker-compose logs nginx

# Reiniciar
docker-compose restart

# Parar
docker-compose down

# Status dos containers
docker ps

# Verificar conectividade
curl -I http://dezsaudefarma.com.br
```

## 🔧 Configuração

### SSL/Certificados
- Usa o certificado do Certbot: `/etc/letsencrypt/live/dezsaudefarma.com.br/`
- HTTP redireciona para HTTPS (padrão recomendado)
- Certificado válido por 89 dias (renovação automática)

### Nginx
- Configurado para servir a aplicação React
- Headers de segurança configurados
- Cache para arquivos estáticos
- Health check em `/health`

### Docker
- Container Nginx Alpine
- Portas 80 (HTTP) e 443 (HTTPS)
- Volumes mapeados para configurações e build

## 📊 Monitoramento

### RD Station
- Script de monitoramento integrado no `index.html`
- Hook personalizado `useRDStation` para eventos
- Tracking de conversões e page views

### Logs
- Logs de acesso: `/var/log/nginx/dezsaudefarma.com.br.access.log`
- Logs de erro: `/var/log/nginx/dezsaudefarma.com.br.error.log`

## 🌐 URLs

- **HTTP:** http://dezsaudefarma.com.br (redireciona para HTTPS)
- **HTTPS:** https://dezsaudefarma.com.br

## 🔍 Troubleshooting

### Problemas Comuns

1. **Porta 80 em uso:**
```bash
sudo fuser -k 80/tcp
sudo systemctl stop nginx
```

2. **Container não inicia:**
```bash
docker-compose logs nginx
docker-compose down && docker-compose up -d
```

3. **Certificado não encontrado:**
```bash
sudo certbot certificates
sudo certbot install --cert-name dezsaudefarma.com.br-0001
```

4. **Build falha:**
```bash
npm install
npm run build
```

### Verificação Completa
```bash
./scripts/status.sh
```

## 📝 Estrutura do Projeto

```
dezsaudefarma/
├── src/                    # Código fonte React
├── nginx/                  # Configurações Nginx
│   ├── conf.d/            # Configurações de sites
│   ├── ssl/               # Certificados SSL
│   └── logs/              # Logs do Nginx
├── scripts/               # Scripts de deploy
├── dist/                  # Build da aplicação
├── docker-compose.yml     # Configuração Docker
└── package.json           # Dependências Node.js
```

## 🔄 Atualizações

Para atualizar a aplicação:

1. Fazer pull das mudanças
2. Executar o script de deploy
3. Verificar o status

```bash
git pull origin main
./scripts/deploy.sh
./scripts/status.sh
```

# DezSaude Farma - Configuração Super Simples

## 🎯 **Configuração Super Simples - APENAS HTTP**

Sistema configurado para funcionar **apenas com HTTP** na porta 80, sem SSL, sem certificados, sem complexidade.

### ✅ **Como Funciona:**

- **HTTP**: `http://dezsaudefarma.com.br` → Aplicação React
- **Qualquer domínio**: → Redireciona para HTTP
- **Sem HTTPS**: Configuração máxima simplicidade

### 🚀 **Deploy Super Rápido (VPS):**

```bash
# 1. Clonar e entrar no projeto
git clone https://github.com/DaniloDeivson/dezsaudefarma.git
cd dezsaudefarma

# 2. Executar configuração automática
bash scripts/setup-simple-http.sh

# 3. Se houver problemas, usar emergência
bash scripts/emergency-fix.sh
```

### 🔧 **Estrutura Super Simples:**

```
dezsaudefarma/
├── docker-compose.yml          # Apenas porta 80
├── nginx/
│   ├── nginx.conf             # Configuração básica
│   ├── conf.d/
│   │   ├── dezsaudefarma.com.br.conf  # Apenas HTTP
│   │   └── default.conf       # Redireciona tudo
│   └── html/                  # Aplicação React
└── scripts/
    ├── setup-simple-http.sh   # Configuração automática
    └── emergency-fix.sh       # Correção de emergência
```

### 🌐 **Configuração de Rede:**

```nginx
# HTTP - Aplicação principal
server {
    listen 80;
    server_name dezsaudefarma.com.br www.dezsaudefarma.com.br;
    # Serve aplicação React
}

# Default - Redireciona tudo
server {
    listen 80 default_server;
    # return 301 http://dezsaudefarma.com.br$request_uri;
}
```

### 🧪 **Testes:**

```bash
# Testar HTTP
curl http://localhost/health
curl http://dezsaudefarma.com.br

# Ver logs
docker-compose logs -f nginx
```

### 🔍 **Troubleshooting:**

```bash
# Se não funcionar, execute:
bash scripts/emergency-fix.sh

# Verificar status
docker ps
docker-compose logs nginx

# Reiniciar
docker-compose restart
```

### 📊 **Status:**

- ✅ **HTTP**: Funcionando na porta 80
- ❌ **HTTPS**: Desabilitado (sem SSL)
- ✅ **Certificados**: Não necessários
- ✅ **Docker**: Apenas Nginx Alpine
- ✅ **Simplicidade**: Máxima

### 🎯 **Resultado:**

- **Apenas HTTP** → `http://dezsaudefarma.com.br`
- **Aplicação React** carrega normalmente
- **Sem complexidade** de SSL/HTTPS
- **Fácil manutenção** e debug
- **Sem loops de restart**

### 🚨 **Para HTTPS no Futuro:**

- Configure no seu provedor de hospedagem
- Ou use um proxy reverso externo
- Ou configure no DNS
- Ou use Cloudflare/CloudFront

---

**Status**: ✅ **Configuração Super Simples - APENAS HTTP** 