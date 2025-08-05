# 🚀 Deploy no Vercel - VTEX AI Assistant

## Pré-requisitos

1. **Conta no Vercel** conectada ao GitHub
2. **OpenAI API Key** (obrigatório)
3. **Google OAuth credentials** (para autenticação da equipe)
4. **Domínio personalizado** (opcional)

## Passos para Deploy

### 1. Variáveis de Ambiente

Configure as seguintes variáveis no painel do Vercel:

```bash
# Obrigatórias
OPENAI_API_KEY=sk-...
NEXTAUTH_SECRET=abc123... (gere com: openssl rand -base64 32)
NEXTAUTH_URL=https://seu-dominio.vercel.app

# Google OAuth (para autenticação da equipe @agenciafg.com.br)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Produção
NODE_ENV=production
```

### 2. Configurar Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione existente
3. Ative a **Google+ API**
4. Em **Credenciais**, crie **OAuth 2.0 Client ID**
5. Adicione URLs autorizadas:
   - `https://seu-dominio.vercel.app`
   - `https://seu-dominio.vercel.app/api/auth/callback/google`

### 3. Deploy Automático

1. **Push para GitHub:**
   ```bash
   git add .
   git commit -m "feat: sistema completo de tickets multi-plataforma"
   git push
   ```

2. **Conectar no Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Import do repositório GitHub
   - Configure as variáveis de ambiente
   - Deploy automático!

## URLs do Sistema

- **Portal Cliente:** `https://seu-dominio.vercel.app/portal`
- **Chat Interno:** `https://seu-dominio.vercel.app/` (requer @agenciafg.com.br)
- **API Tickets:** `https://seu-dominio.vercel.app/api/tickets`

## Funcionalidades em Produção

✅ **Portal do Cliente**
- Criação de tickets multi-plataforma
- Dashboard com métricas
- IA contextual por plataforma

✅ **Sistema Interno**
- Chat especializado VTEX
- Base de conhecimento expandida
- Autenticação restrita equipe FG

✅ **APIs Públicas**
- Endpoints para integrações
- Webhooks para automação
- Dados demo para testes

## Monitoramento

- **Vercel Analytics:** Automático
- **Error Tracking:** Console do Vercel
- **Performance:** Web Vitals integrado

## Personalizações

### Domínio Customizado
- Configure no painel Vercel: `suporte.agenciafg.com.br`

### Branding
- Logo: `/public/logo.png`
- Cores: `/app/globals.css`
- Título: `/app/layout.tsx`

## Segurança

- ✅ Autenticação NextAuth
- ✅ API Keys via environment
- ✅ CORS configurado
- ✅ Rate limiting via Vercel

## Suporte

Para dúvidas sobre o deploy:
1. Verificar logs no painel Vercel
2. Testar APIs com dados demo
3. Validar variáveis de ambiente