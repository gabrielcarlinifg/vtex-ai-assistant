import OpenAI from 'openai'

// Configuração OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Base de conhecimento local (resposta rápida)
export const vtexKnowledgeBase = {
  'produto-nao-aparece': {
    keywords: ['produto', 'não aparece', 'sumiu', 'invisível', 'não mostra', 'não está', 'não encontro'],
    category: 'Catálogo',
    priority: 'Alta',
    quickResponse: `🔍 **Produto não aparece no site**

**Verificações imediatas:**
1. Admin VTEX → Catálogo → Produtos e SKUs
2. Verificar se produto está "Ativo"
3. Estoque & Entrega → Gerenciar Inventário (qty > 0)
4. Preços → Lista de Preços (preço ativo)
5. Forçar reindexação se necessário

**APIs para diagnóstico:**
\`GET /api/catalog/pvt/product/{id}\`
\`GET /api/logistics/pvt/inventory/skus/{skuId}\`
\`GET /api/pricing/prices/{skuId}\`

**Tempo estimado:** 15-30 minutos`,
    documentationLinks: [
      'https://help.vtex.com/pt/faq/por-que-o-produto-nao-aparece-no-site',
      'https://developers.vtex.com/docs/guides/catalog-api-overview'
    ]
  },

  'erro-401': {
    keywords: ['401', 'unauthorized', 'não autorizado', 'autenticação', 'forbidden', '403'],
    category: 'APIs & Autenticação',
    priority: 'Alta',
    quickResponse: `🔐 **Erro 401/403 - Problemas de Autenticação**

**Verificações imediatas:**
1. Headers corretos:
   \`X-VTEX-API-AppKey: {seu-app-key}\`
   \`X-VTEX-API-AppToken: {seu-app-token}\`

2. Teste básico:
   \`GET /api/license-manager/pvt/accounts\`

3. Verificar permissões:
   Admin → Configurações → Perfis de acesso

4. Recriar credenciais:
   Configurações → Gerenciamento de usuários

**Tempo estimado:** 10-20 minutos`,
    documentationLinks: [
      'https://developers.vtex.com/docs/guides/api-authentication-using-application-keys'
    ]
  },

  'checkout-problemas': {
    keywords: ['checkout', 'pagamento', 'finalizar', 'compra', 'carrinho', 'payment'],
    category: 'Checkout & Pagamentos',
    priority: 'Crítica',
    quickResponse: `💳 **Problemas no Checkout - PRIORIDADE CRÍTICA**

**Verificações urgentes:**
1. Admin → Pedidos → Transações
2. Localizar transação com erro
3. Analisar logs detalhados
4. Configurações → Pagamentos
5. Testar meios de pagamento
6. Simular compra completa

**APIs para análise:**
\`GET /api/checkout/pub/orders/{orderId}\`
\`GET /api/payments/pvt/transactions/{transactionId}\`

**Resolver IMEDIATAMENTE - impacta vendas!**`,
    documentationLinks: [
      'https://help.vtex.com/pt/tutorial/verificar-erros-ou-problemas-em-uma-transacao',
      'https://developers.vtex.com/docs/guides/checkout-api-overview'
    ]
  },

  'estoque-problemas': {
    keywords: ['estoque', 'inventory', 'disponibilidade', 'quantidade', 'warehouse'],
    category: 'Estoque & Logística',
    priority: 'Média',
    quickResponse: `📦 **Problemas de Estoque**

**Checklist rápido:**
1. Estoque & Entrega → Gerenciar Inventário
2. Buscar SKU específico
3. Verificar quantidade disponível
4. Status do warehouse (ativo/inativo)
5. Analisar movimentações recentes
6. Verificar reservas em andamento

**Tempo estimado:** 10-15 minutos`,
    documentationLinks: [
      'https://help.vtex.com/pt/tutorial/gerenciar-inventario'
    ]
  }
}

// Sistema híbrido de respostas
export class VTEXAIEngine {
  
  // Busca rápida na base local
  findQuickMatch(query: string): any | null {
    const lowerQuery = query.toLowerCase()
    
    for (const [key, knowledge] of Object.entries(vtexKnowledgeBase)) {
      for (const keyword of knowledge.keywords) {
        if (lowerQuery.includes(keyword.toLowerCase())) {
          return {
            type: 'quick',
            confidence: this.calculateConfidence(lowerQuery, knowledge.keywords),
            knowledge,
            source: 'base_local'
          }
        }
      }
    }
    
    return null
  }

  // Calcular confiança da resposta
  calculateConfidence(query: string, keywords: string[]): number {
    const queryWords = query.toLowerCase().split(' ')
    const matchedKeywords = keywords.filter(keyword =>
      queryWords.some(word => word.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(word))
    )
    
    return Math.min(matchedKeywords.length / keywords.length + 0.2, 1.0)
  }

  // Resposta híbrida: base local + IA
  async getHybridResponse(query: string, userContext?: any) {
    // 1. Primeiro tenta resposta rápida (base local)
    const quickMatch = this.findQuickMatch(query)
    
    if (quickMatch && quickMatch.confidence > 0.7) {
      // Enriquecer resposta local com IA se necessário
      const enhancedResponse = await this.enhanceWithAI(query, quickMatch.knowledge)
      
      return {
        response: enhancedResponse,
        source: 'hybrid',
        confidence: quickMatch.confidence,
        category: quickMatch.knowledge.category,
        priority: quickMatch.knowledge.priority,
        documentation: quickMatch.knowledge.documentationLinks,
        processingTime: 'Resposta rápida (< 1s)'
      }
    }
    
    // 2. Se não encontrou match local, usar IA completa
    return await this.getAIResponse(query, userContext)
  }

  // Enriquecer resposta local com IA
  async enhanceWithAI(query: string, baseKnowledge: any): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Mais barato e rápido
        messages: [
          {
            role: "system",
            content: `Você é um especialista em VTEX. Use a base de conhecimento fornecida como fundação e enriqueça com detalhes específicos para a pergunta do usuário.

Base de conhecimento:
${baseKnowledge.quickResponse}

Instruções:
- Mantenha a estrutura da resposta base
- Adicione detalhes específicos para a situação
- Seja prático e objetivo
- Use emojis e formatação markdown
- Inclua tempo estimado de resolução
- Máximo 300 palavras`
          },
          {
            role: "user", 
            content: query
          }
        ],
        max_tokens: 400,
        temperature: 0.3,
      })

      return completion.choices[0]?.message?.content || baseKnowledge.quickResponse
    } catch (error) {
      console.error('Erro ao enriquecer com IA:', error)
      // Fallback para resposta base
      return baseKnowledge.quickResponse
    }
  }

  // Resposta completa da IA (para casos complexos)
  async getAIResponse(query: string, userContext?: any) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Você é um assistente especializado em VTEX com acesso completo à documentação oficial.

Contexto: Agência FG - empresa de implementação VTEX prestando suporte técnico e evolução.

Base de conhecimento principal:
- developers.vtex.com (APIs, integrações, desenvolvimento)
- help.vtex.com/pt (tutoriais, troubleshooting, configurações)
- Experiência prática com problemas comuns

Estilo de resposta:
- Estruturado com títulos e subtítulos
- Checklists práticos quando aplicável
- APIs relevantes com exemplos
- Tempo estimado de resolução
- Links para documentação oficial
- Emojis para melhor legibilidade
- Máximo 500 palavras

Categorias principais:
🛍️ Produtos e Catálogo
📦 Estoque e Logística  
💳 Checkout e Pagamentos
🔧 APIs e Integrações
🎨 Storefront e Frontend
⚙️ Configurações Gerais

Se não souber algo específico, seja honesto e direcione para documentação oficial.`
          },
          {
            role: "user",
            content: query
          }
        ],
        max_tokens: 600,
        temperature: 0.3,
      })

      const aiResponse = completion.choices[0]?.message?.content

      return {
        response: aiResponse || "Desculpe, não consegui processar sua consulta no momento.",
        source: 'openai',
        confidence: 0.8,
        category: 'Geral',
        priority: 'Média',
        documentation: ['https://developers.vtex.com', 'https://help.vtex.com/pt'],
        processingTime: 'Resposta IA (2-5s)'
      }
    } catch (error) {
      console.error('Erro na API OpenAI:', error)
      
      return {
        response: `❌ **Erro temporário na IA**
        
Não foi possível acessar a inteligência artificial no momento. 

**Enquanto isso, você pode:**
- Consultar diretamente: [developers.vtex.com](https://developers.vtex.com)
- Buscar tutoriais: [help.vtex.com/pt](https://help.vtex.com/pt)  
- Entrar em contato com suporte VTEX
- Tentar novamente em alguns minutos

**Erro:** ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        source: 'error',
        confidence: 0,
        category: 'Sistema',
        priority: 'Baixa',
        documentation: ['https://developers.vtex.com', 'https://help.vtex.com/pt'],
        processingTime: 'Erro na requisição'
      }
    }
  }

  // Analytics simples
  logQuery(query: string, response: any, userInfo?: any) {
    console.log('VTEX AI Query:', {
      timestamp: new Date().toISOString(),
      query: query.substring(0, 100),
      source: response.source,
      confidence: response.confidence,
      category: response.category,
      user: userInfo?.email || 'anonymous'
    })
  }
}