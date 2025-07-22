# 1. Parar tudo
docker-compose down
sudo systemctl stop nginx 2>/dev/null || true
sudo fuser -k 80/tcp 2>/dev/null || true
sudo fuser -k 443/tcp 2>/dev/null || true

# 2. Preparar certificados
sudo mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/dezsaudefarma.com.br/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/dezsaudefarma.com.br/privkey.pem nginx/ssl/
sudo chown root:root nginx/ssl/*.pem
sudo chmod 644 nginx/ssl/fullchain.pem
sudo chmod 600 nginx/ssl/privkey.pem

# 3. Construir aplicação
npm run build

# 4. Iniciar container
docker-compose up -d

# 5. Verificar status
docker ps
curl -I http://localhost