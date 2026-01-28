# Warframe Companion Pro - Versão Web

Uma aplicação web completa para jogadores de Warframe, oferecendo ferramentas essenciais para gerenciar tarefas diárias, rastrear itens, monitorar eventos e acompanhar preços de mercado.

## 🚀 Características

- **Dashboard Intuitivo** - Visão geral de tarefas diárias e progresso
- **Checklist de Tarefas** - Rastreamento de tarefas diárias e semanais
- **Rastreador de Itens** - Gerenciamento de Warframes, armas e companheiros
- **Estado do Mundo** - Monitoramento em tempo real de eventos, fissuras e invasões
- **Configurações Personalizáveis** - Tema, idioma, plataforma e notificações
- **Design Responsivo** - Funciona perfeitamente em desktop e tablet
- **Integração com APIs** - Dados em tempo real de WarframeStat.us e Warframe.market

## 📋 Pré-requisitos

- Node.js 16+ 
- npm ou pnpm

## 🛠️ Instalação

```bash
# Clonar o repositório
cd warframe-companion-web

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Compilar para produção
npm run build
```

## 📁 Estrutura do Projeto

```
warframe-companion-web/
├── src/
│   ├── pages/
│   │   ├── Dashboard.tsx      # Página inicial
│   │   ├── Checklist.tsx      # Tarefas diárias/semanais
│   │   ├── Items.tsx          # Rastreador de itens
│   │   ├── Worldstate.tsx     # Eventos em tempo real
│   │   └── Settings.tsx       # Configurações
│   ├── styles/
│   │   ├── pages.css          # Estilos das páginas
│   ├── App.tsx                # Componente principal
│   ├── App.css                # Estilos da aplicação
│   ├── index.css              # Estilos globais
│   └── main.tsx               # Ponto de entrada
├── index.html                 # HTML principal
├── vite.config.ts            # Configuração do Vite
├── tsconfig.json             # Configuração do TypeScript
└── package.json              # Dependências
```

## 🎨 Páginas

### Dashboard
Visão geral com resumo de tarefas, progresso diário e atalhos rápidos para as principais funcionalidades.

### Tarefas (Checklist)
Gerenciamento completo de tarefas diárias e semanais com:
- Abas para filtrar por tipo
- Cálculo automático de progresso
- Informações de recompensas
- Horários de expiração

### Itens
Rastreador de Warframes, armas e companheiros com:
- Filtros por tipo e status
- Busca por nome
- Cálculo de XP total
- Informações de raridade e preço

### Eventos
Monitoramento em tempo real de:
- Alertas
- Fissuras de Void
- Invasões
- Eventos especiais
- Baro Ki'Teer

### Definições
Configurações personalizáveis:
- Tema (claro/escuro/automático)
- Plataforma de jogo
- Idioma
- Notificações por tipo de evento

## 🔌 Integração com APIs

A aplicação integra-se com:

- **WarframeStat.us API** - Dados em tempo real do worldstate
- **Warframe.market API** - Preços de platina e estatísticas

Nenhuma chave de API é necessária - ambas as APIs são públicas e gratuitas.

## 🎯 Tecnologias

- **React 19** - Framework UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool rápido
- **CSS3** - Estilos responsivos
- **Axios** - Cliente HTTP

## 📱 Responsividade

A aplicação é totalmente responsiva e adapta-se a:
- Desktops (1920px+)
- Tablets (768px - 1024px)
- Dispositivos móveis (< 768px)

## 🌐 Plataformas Suportadas

- PC
- PlayStation 4
- Xbox
- Nintendo Switch

## 🌍 Idiomas Suportados

- Português
- English
- Español
- Français
- Deutsch

## 📊 Dados Fornecidos Por

- [WarframeStat.us](https://warframestat.us/) - Dados do worldstate
- [Warframe.market](https://warframe.market/) - Preços e estatísticas

## 📝 Licença

MIT

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se livre para abrir issues ou pull requests.

## 📧 Contato

Para questões ou sugestões, entre em contato através do repositório.

---

**Versão:** 2.0.0  
**Última atualização:** Janeiro 2026
