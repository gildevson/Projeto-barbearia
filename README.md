# Rafa Barbershop — Frontend

Site oficial da **Rafa Barbershop**, desenvolvido em Angular 19 com deploy na Hostinger e CDN Cloudflare.

> Desenvolvido por [gildevson.com](https://gildevson.com)

---

## Visão Geral

Aplicação SPA (Single Page Application) 100% frontend para apresentação e agendamento de serviços da Rafa Barbershop, localizada em Curitiba/PR.

**Site ao vivo:** `https://skyblue-magpie-765225.hostingersite.com`

---

## Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| Angular | 19 | Framework principal |
| TypeScript | 5.x | Linguagem |
| SCSS | — | Estilização |
| Angular CLI | 21.x | Build e scaffolding |
| Hostinger | — | Hospedagem estática |
| Cloudflare | — | CDN e segurança |
| Google Apps Script | — | Criação de eventos no Google Calendar |

---

## Estrutura de Pastas

```
barbearia-frontend/
├── public/                  # Imagens e assets estáticos
│   ├── logo.png
│   ├── RafaCortandoBarba.png
│   ├── MulherCortandoCabelo.png
│   └── ...
└── src/
    ├── index.html           # Entry point HTML
    ├── main.ts              # Bootstrap Angular
    ├── styles.scss          # Estilos globais + variáveis CSS
    └── app/
        ├── app.ts           # Root component
        ├── app.routes.ts    # Rotas com lazy loading
        ├── app.config.ts    # Configuração da aplicação
        ├── route-animations.ts
        ├── pages/
        │   ├── home/        # Página inicial (hero, portfólio, avaliações, mapa)
        │   ├── servicos/    # Tabela de serviços e preços
        │   ├── agendamento/ # Formulário de agendamento via WhatsApp
        │   ├── admin/       # Dashboard administrativo
        │   └── privacidade/ # Política de privacidade
        └── shared/
            ├── navbar/      # Barra de navegação (desktop + mobile hamburguer)
            └── footer/      # Rodapé com contato, horários e selos
```

---

## Páginas e Rotas

| Rota | Componente | Descrição |
|---|---|---|
| `/` | — | Redireciona para `/home` |
| `/home` | `Home` | Landing page completa |
| `/servicos` | `Servicos` | Lista de serviços e preços |
| `/agendamento` | `Agendamento` | Formulário de agendamento |
| `/admin` | `Dashboard` | Painel administrativo |
| `/privacidade` | `Privacidade` | Política de privacidade |
| `/**` | — | Redireciona para `/home` |

Todas as rotas usam **lazy loading** via `loadComponent`.

---

## Funcionalidades Principais

### Agendamento
- Seleção múltipla de serviços com duração acumulada
- Filtro por profissional (Rafaele Schneider / Adriana — Unhas)
- Bloqueio de datas passadas e domingos
- Horários de 15 em 15 minutos (08:00 — 21:00)
- Horários passados filtrados automaticamente para o dia atual
- Modal de confirmação com prévia da mensagem
- Envio direto via **WhatsApp** (`wa.me`)
- Link de evento pré-preenchido no **Google Calendar** (`action=TEMPLATE`)

### Navbar Mobile
- Menu hamburguer com animação de abertura/fechamento
- Imagem de fundo no menu mobile (`RagaHamburger.jpg`)
- Overlay escuro com 86% de opacidade

### SEO e Performance
- Cloudflare CDN para entrega rápida de assets
- Selo "Secured by Cloudflare" no footer
- Lazy loading de componentes por rota
- Imagens otimizadas com `object-fit: cover`

---

## Variáveis CSS Globais

Definidas em `src/styles.scss`:

```scss
--cor-dourado:       #c9a84c   /* dourado principal */
--cor-texto:         #e8e8e8   /* texto padrão */
--cor-texto-suave:   #888888   /* texto secundário */
--cor-fundo:         #0a0a0a   /* fundo principal */
--cor-fundo-card:    #111111   /* fundo de cards */
--cor-fundo-section: #0f0f0f   /* fundo de seções alternadas */
--cor-borda:         rgba(255,255,255,.08)
--navbar-altura:     80px
--raio:              10px
```

---

## Horários de Atendimento

| Dia | Horário |
|---|---|
| Segunda — Sexta | 08:00 — 21:00 |
| Sábado | 08:00 — 19:00 |
| Domingo | Fechado |

---

## Contatos

| Profissional | WhatsApp | Serviços |
|---|---|---|
| Rafaele Schneider | (41) 99538-4543 | Cortes, barba, feminino |
| Adriana | (41) 99868-5659 | Unhas e estética |

---

## Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- Angular CLI 21+

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento
ng serve

# Acessar em
http://localhost:4200
```

---

## Build para Produção

```bash
ng build
```

Os arquivos gerados ficam em `dist/barbearia-frontend/browser/`. Faça o upload desse conteúdo para a Hostinger via FTP ou painel.

---

## Deploy na Hostinger

1. Execute `ng build`
2. Acesse o **Painel Hostinger** → File Manager
3. Navegue até `public_html/`
4. Faça upload do conteúdo de `dist/barbearia-frontend/browser/`
5. Certifique-se de que o arquivo `index.html` está na raiz

> O Cloudflare cuida do cache — após o deploy, limpe o cache no painel Cloudflare se necessário.

---

## Integrações Externas

### WhatsApp
Agendamentos são enviados via link `wa.me` com a mensagem pré-formatada em texto puro (sem emojis, pois corrompem a URL).

### Google Calendar
O link `action=TEMPLATE` pré-preenche um novo evento no Google Calendar com título, data, horário, duração e detalhes do cliente.

### Google Apps Script (opcional)
Arquivo `apps-script/agenda.gs` — cria eventos `[PENDENTE]` automaticamente no Google Calendar via `doPost`. Para ativar:
1. Acesse [script.google.com](https://script.google.com)
2. Cole o conteúdo de `agenda.gs`
3. Publique como **Web App** (acesso: qualquer pessoa)
4. Copie a URL gerada e substitua `COLE_A_URL_DO_APPS_SCRIPT_AQUI` em `agendamento.ts`

---

## Repositório

[github.com/gildevson/Projeto-barbearia](https://github.com/gildevson/Projeto-barbearia)
