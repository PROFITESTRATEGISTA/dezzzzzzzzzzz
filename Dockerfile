FROM nginx:alpine

# Instalar dependências adicionais
RUN apk add --no-cache \
    curl \
    openssl \
    certbot \
    certbot-nginx

# Criar diretórios necessários
RUN mkdir -p /var/log/nginx \
    && mkdir -p /etc/nginx/ssl \
    && mkdir -p /etc/nginx/conf.d

# Copiar configurações
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/conf.d/ /etc/nginx/conf.d/

# Expor portas
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Comando padrão
CMD ["nginx", "-g", "daemon off;"] 