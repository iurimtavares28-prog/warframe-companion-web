# Warframe Companion Pro - Guia de Deployment

## 🚀 URL Recomendada

**`warframe-companion.vercel.app`**

Esta é a URL sugerida para o deployment da aplicação, oferecendo:
- Domínio profissional e memorável
- Suporte automático para HTTPS
- CDN global para melhor performance
- Certificado SSL gratuito

## 📋 Opções de Deployment

### 1. Vercel (Recomendado) ⭐

Vercel é a plataforma ideal para aplicações Vite/React com suporte automático para PWA.

#### Pré-requisitos
- Conta Vercel (gratuita em https://vercel.com)
- Git (GitHub, GitLab ou Bitbucket)

#### Passos

1. **Fazer push do código para GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/seu-usuario/warframe-companion-web.git
   git push -u origin main
   ```

2. **Conectar ao Vercel**
   - Ir para https://vercel.com/new
   - Selecionar "Import Git Repository"
   - Escolher o repositório `warframe-companion-web`
   - Vercel detectará automaticamente Vite

3. **Configurar Domínio Personalizado**
   - Ir para Project Settings → Domains
   - Adicionar `warframe-companion.vercel.app`
   - Ou usar domínio personalizado (ex: `warframe-companion.com`)

4. **Deploy**
   - Clicar em "Deploy"
   - Vercel fará build automático e deployment

#### Variáveis de Ambiente (Vercel)
```
VITE_API_BASE_URL=https://api.warframestat.us
VITE_MARKET_API_URL=https://api.warframe.market/v1
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

URL: `warframe-companion.netlify.app`

### 3. GitHub Pages

```bash
# Atualizar package.json
"homepage": "https://seu-usuario.github.io/warframe-companion-web"

# Build
npm run build

# Deploy
npm install --save-dev gh-pages
npm run deploy
```

URL: `seu-usuario.github.io/warframe-companion-web`

### 4. Docker + Servidor Linux

#### Dockerfile
```dockerfile
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /sw.js {
        add_header Cache-Control "public, max-age=0, must-revalidate";
    }

    location /manifest.webmanifest {
        add_header Content-Type "application/manifest+json";
    }
}
```

Build e deploy:
```bash
docker build -t warframe-companion .
docker run -p 80:80 warframe-companion
```

## 🔐 Configuração de Segurança

### Headers Recomendados
```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### CORS
As APIs utilizadas (WarframeStat.us e Warframe.market) suportam CORS, portanto não há necessidade de configuração especial.

## 📊 Monitoramento

### Sentry (Error Tracking)
```bash
npm install @sentry/react
```

### Google Analytics
```bash
npm install react-ga4
```

### Datadog (Performance)
```bash
npm install @datadog/browser-rum
```

## ⚡ Otimizações de Performance

### Lighthouse Targets
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### Estratégias
1. **Code Splitting** - Já implementado com Vite
2. **Lazy Loading** - Componentes carregados sob demanda
3. **Image Optimization** - Usar formatos modernos (WebP)
4. **Caching** - Service Worker com estratégia CacheFirst
5. **Compression** - Gzip/Brotli automático

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 📱 PWA Configuration

A aplicação está totalmente configurada como PWA:

- ✅ Service Worker (Workbox)
- ✅ Web App Manifest
- ✅ Ícones adaptáveis
- ✅ Splash screens
- ✅ Offline support
- ✅ Install prompt

### Testar PWA Localmente
```bash
npm run build
npm run preview
```

Abrir DevTools → Application → Service Workers para verificar.

## 🌐 Domínio Personalizado

### Registrar Domínio
- Namecheap: https://www.namecheap.com
- GoDaddy: https://www.godaddy.com
- Google Domains: https://domains.google

### Configurar DNS
Para Vercel:
```
A Record: 76.76.19.132
CNAME: cname.vercel-dns.com
```

## 📈 Escalabilidade

### Limites Vercel (Plano Gratuito)
- Builds: 24/dia
- Deployments: Ilimitados
- Bandwidth: 100GB/mês
- Serverless Functions: 12 por projeto

### Upgrade para Pro
- Builds: Ilimitados
- Bandwidth: 1TB/mês
- Priority support
- Custom domains ilimitados

## 🆘 Troubleshooting

### Build falha
```bash
rm -rf node_modules dist
npm install
npm run build
```

### PWA não funciona offline
- Verificar Service Worker em DevTools
- Limpar cache: Ctrl+Shift+Delete
- Recarregar página

### APIs retornam erro
- Verificar status em https://warframestat.us
- Verificar CORS headers
- Usar proxy reverso se necessário

## 📞 Suporte

- Vercel Docs: https://vercel.com/docs
- Vite Docs: https://vitejs.dev
- PWA Docs: https://web.dev/progressive-web-apps/

---

**Versão:** 2.0.0  
**Última atualização:** Janeiro 2026
