# Guia de Deployment - Warframe Companion Pro Web

## Opções de Deployment

### 1. Vercel (Recomendado)

Vercel oferece deploy gratuito com suporte automático para React e Vite.

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 2. Netlify

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### 3. GitHub Pages

```bash
# Adicionar ao package.json
"homepage": "https://seu-usuario.github.io/warframe-companion-web",

# Build
npm run build

# Deploy
npm install --save-dev gh-pages
npx gh-pages -d dist
```

### 4. Docker

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build e run:
```bash
docker build -t warframe-companion-web .
docker run -p 80:80 warframe-companion-web
```

### 5. Servidor Linux (nginx)

```bash
# Build
npm run build

# Copiar arquivos
sudo cp -r dist/* /var/www/html/

# Configurar nginx
sudo nano /etc/nginx/sites-available/default
```

Configuração nginx:
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache estático
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Reiniciar nginx:
```bash
sudo systemctl restart nginx
```

## Variáveis de Ambiente

Criar arquivo `.env.production`:

```env
VITE_API_BASE_URL=https://api.warframestat.us
VITE_MARKET_API_URL=https://api.warframe.market/v1
VITE_CACHE_DURATION=300000
```

## Otimizações de Performance

1. **Compressão Gzip**
   ```bash
   npm install --save-dev vite-plugin-compression
   ```

2. **Lazy Loading de Páginas**
   ```typescript
   import { lazy, Suspense } from 'react'
   const Dashboard = lazy(() => import('./pages/Dashboard'))
   ```

3. **Service Worker (PWA)**
   ```bash
   npm install --save-dev workbox-webpack-plugin
   ```

## Monitoramento

- **Sentry** para error tracking
- **Google Analytics** para analytics
- **Datadog** para performance monitoring

## Checklist de Deployment

- [ ] Testar build localmente: `npm run build`
- [ ] Verificar TypeScript: `npm run type-check`
- [ ] Testar preview: `npm run preview`
- [ ] Verificar variáveis de ambiente
- [ ] Testar em navegadores diferentes
- [ ] Verificar responsividade mobile
- [ ] Configurar HTTPS/SSL
- [ ] Adicionar domínio personalizado
- [ ] Configurar redirects (se necessário)
- [ ] Testar APIs externas em produção
- [ ] Monitorar performance
- [ ] Configurar backups automáticos

## Troubleshooting

### Build falha
```bash
# Limpar cache
rm -rf node_modules dist
npm install
npm run build
```

### Páginas não carregam após deploy
Verificar configuração de rewrite para SPA:
- Vercel: automático
- Netlify: adicionar `_redirects`
- GitHub Pages: usar `hash` router

### APIs retornam CORS error
As APIs utilizadas (WarframeStat.us e Warframe.market) suportam CORS, mas se houver problemas:
- Usar proxy reverso
- Implementar backend intermediário

## Performance Targets

- Lighthouse Score: > 90
- First Contentful Paint: < 2s
- Time to Interactive: < 3s
- Cumulative Layout Shift: < 0.1

## Suporte

Para questões sobre deployment, consulte:
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Deployment Guide](https://react.dev/learn/start-a-new-react-project#production-grade-react-frameworks)
