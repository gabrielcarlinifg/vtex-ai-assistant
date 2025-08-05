import { 
  Ticket, 
  TicketMessage, 
  Client, 
  TicketPriority, 
  TicketStatus, 
  TicketCategory,
  EcommercePlatform,
  ChannelSource,
  TicketFilters
} from './types'
import { PLATFORM_CONFIGS, CATEGORY_INFO, getPlatformSuggestions } from './platforms'
import { VTEXAIEngine } from './vtex-ai-engine'

// Simulação de banco de dados (em produção usar Supabase/PostgreSQL)
let tickets: Ticket[] = []
let messages: TicketMessage[] = []
let clients: Client[] = []

// Sample data para demonstração
const sampleClients: Client[] = [
  {
    id: 'client-1',
    name: 'João Silva',
    email: 'joao@lojaexemplo.com.br',
    company: 'Loja Exemplo LTDA',
    platform: 'vtex',
    storeUrl: 'https://lojaexemplo.vtexcommercestable.com.br',
    phone: '+5511999999999',
    timezone: 'America/Sao_Paulo',
    plan: 'premium',
    createdAt: new Date('2024-01-15'),
    lastActivity: new Date()
  },
  {
    id: 'client-2', 
    name: 'Maria Santos',
    email: 'maria@modafashion.com.br',
    company: 'Moda Fashion',
    platform: 'shopify',
    storeUrl: 'https://modafashion.myshopify.com',
    timezone: 'America/Sao_Paulo',
    plan: 'basic',
    createdAt: new Date('2024-02-01'),
    lastActivity: new Date()
  }
]

// Inicializar dados de exemplo
clients = [...sampleClients]

export class TicketService {
  private aiEngine: VTEXAIEngine

  constructor() {
    this.aiEngine = new VTEXAIEngine()
  }

  // Criar novo ticket
  async createTicket(data: {
    clientId: string
    title: string
    description: string
    category?: TicketCategory
    priority?: TicketPriority
    source: ChannelSource
    attachments?: File[]
  }): Promise<Ticket> {
    const client = this.getClient(data.clientId)
    if (!client) {
      throw new Error('Cliente não encontrado')
    }

    // Auto-detectar categoria se não fornecida
    const detectedCategory = data.category || await this.detectCategory(data.description, client.platform)
    
    // Auto-calcular prioridade baseada na categoria e conteúdo
    const detectedPriority = data.priority || this.calculatePriority(data.description, detectedCategory)

    // Gerar resposta automática da IA
    const aiResponse = await this.aiEngine.getHybridResponse(
      `${data.title}\n\n${data.description}`,
      { platform: client.platform, category: detectedCategory }
    )

    const ticket: Ticket = {
      id: `TKT-${Date.now()}`,
      clientId: data.clientId,
      title: data.title,
      description: data.description,
      category: detectedCategory,
      priority: detectedPriority,
      status: 'open',
      source: data.source,
      platform: client.platform,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: this.generateTags(data.description, detectedCategory),
      estimatedResolution: CATEGORY_INFO[detectedCategory].estimatedTime,
      attachments: [],
      detectedIssue: aiResponse.response?.substring(0, 200),
      suggestedSolution: aiResponse.response,
      similarTickets: this.findSimilarTickets(data.description, client.platform)
    }

    tickets.push(ticket)

    // Criar mensagem inicial automática
    await this.addMessage({
      ticketId: ticket.id,
      authorId: 'system',
      authorType: 'system',
      content: `🤖 **Ticket criado automaticamente**\n\n**Plataforma:** ${PLATFORM_CONFIGS[client.platform].displayName}\n**Categoria detectada:** ${CATEGORY_INFO[detectedCategory].displayName}\n**Prioridade:** ${detectedPriority.toUpperCase()}\n**Tempo estimado:** ${ticket.estimatedResolution}\n\n---\n\n${aiResponse.response}`,
      isInternal: false
    })

    // Auto-assign baseado na categoria e plataforma
    const suggestedAssignee = this.suggestAssignee(detectedCategory, client.platform)
    if (suggestedAssignee) {
      ticket.assignedTo = suggestedAssignee
      ticket.assignedAt = new Date()
    }

    return ticket
  }

  // Buscar tickets com filtros
  getTickets(filters?: TicketFilters): Ticket[] {
    let filtered = [...tickets]

    if (filters?.status?.length) {
      filtered = filtered.filter(t => filters.status!.includes(t.status))
    }
    
    if (filters?.priority?.length) {
      filtered = filtered.filter(t => filters.priority!.includes(t.priority))
    }
    
    if (filters?.category?.length) {
      filtered = filtered.filter(t => filters.category!.includes(t.category))
    }
    
    if (filters?.platform?.length) {
      filtered = filtered.filter(t => filters.platform!.includes(t.platform))
    }
    
    if (filters?.assignedTo?.length) {
      filtered = filtered.filter(t => t.assignedTo && filters.assignedTo!.includes(t.assignedTo))
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search) ||
        t.tags.some(tag => tag.toLowerCase().includes(search))
      )
    }

    return filtered.sort((a, b) => {
      // Prioridade primeiro
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      
      // Depois por data de criação
      return b.createdAt.getTime() - a.createdAt.getTime()
    })
  }

  // Buscar ticket por ID
  getTicket(id: string): Ticket | null {
    return tickets.find(t => t.id === id) || null
  }

  // Atualizar ticket
  async updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket | null> {
    const ticketIndex = tickets.findIndex(t => t.id === id)
    if (ticketIndex === -1) return null

    tickets[ticketIndex] = {
      ...tickets[ticketIndex],
      ...updates,
      updatedAt: new Date()
    }

    return tickets[ticketIndex]
  }

  // Adicionar mensagem ao ticket
  async addMessage(data: {
    ticketId: string
    authorId: string
    authorType: 'client' | 'agent' | 'system'
    content: string
    isInternal: boolean
    attachments?: File[]
  }): Promise<TicketMessage> {
    const message: TicketMessage = {
      id: `MSG-${Date.now()}`,
      ticketId: data.ticketId,
      authorId: data.authorId,
      authorType: data.authorType,
      content: data.content,
      isInternal: data.isInternal,
      createdAt: new Date(),
      attachments: []
    }

    messages.push(message)

    // Atualizar última atividade do ticket
    await this.updateTicket(data.ticketId, { 
      updatedAt: new Date(),
      status: data.authorType === 'client' ? 'open' : 'in-progress'
    })

    return message
  }

  // Buscar mensagens do ticket
  getTicketMessages(ticketId: string, includeInternal: boolean = false): TicketMessage[] {
    return messages
      .filter(m => m.ticketId === ticketId && (includeInternal || !m.isInternal))
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  }

  // Buscar cliente
  getClient(id: string): Client | null {
    return clients.find(c => c.id === id) || null
  }

  // Buscar cliente por email
  getClientByEmail(email: string): Client | null {
    return clients.find(c => c.email === email) || null
  }

  // Detectar categoria automaticamente
  private async detectCategory(description: string, platform: EcommercePlatform): Promise<TicketCategory> {
    const text = description.toLowerCase()
    
    // Palavras-chave para cada categoria
    if (text.includes('checkout') || text.includes('pagamento') || text.includes('finalizar') || text.includes('carrinho')) {
      return 'checkout-payment'
    }
    if (text.includes('produto') || text.includes('catálogo') || text.includes('não aparece')) {
      return 'products-catalog'
    }
    if (text.includes('estoque') || text.includes('quantidade') || text.includes('disponível')) {
      return 'inventory-stock'
    }
    if (text.includes('lento') || text.includes('performance') || text.includes('carregamento')) {
      return 'performance'
    }
    if (text.includes('integração') || text.includes('api') || text.includes('webhook')) {
      return 'integrations'
    }
    if (text.includes('design') || text.includes('layout') || text.includes('responsivo')) {
      return 'design-frontend'
    }
    if (text.includes('seo') || text.includes('google') || text.includes('marketing')) {
      return 'seo-marketing'
    }
    if (text.includes('segurança') || text.includes('ssl') || text.includes('certificado')) {
      return 'security'
    }

    return 'general'
  }

  // Calcular prioridade automaticamente
  private calculatePriority(description: string, category: TicketCategory): TicketPriority {
    const text = description.toLowerCase()
    
    // Palavras urgentes
    const urgentKeywords = ['parado', 'não funciona', 'erro', 'crítico', 'urgente', 'vendas', 'faturamento']
    const hasUrgentKeywords = urgentKeywords.some(keyword => text.includes(keyword))
    
    if (hasUrgentKeywords || category === 'checkout-payment') {
      return 'critical'
    }
    
    if (category === 'products-catalog' || category === 'performance') {
      return 'high'
    }
    
    if (category === 'inventory-stock' || category === 'integrations') {
      return 'medium'
    }
    
    return 'low'
  }

  // Gerar tags automaticamente
  private generateTags(description: string, category: TicketCategory): string[] {
    const tags: string[] = [category]
    const text = description.toLowerCase()
    
    // Tags específicas por palavras-chave
    if (text.includes('mobile') || text.includes('celular')) tags.push('mobile')
    if (text.includes('desktop')) tags.push('desktop')
    if (text.includes('pix')) tags.push('pix')
    if (text.includes('cartão')) tags.push('cartao-credito')
    if (text.includes('boleto')) tags.push('boleto')
    if (text.includes('frete')) tags.push('frete')
    if (text.includes('desconto')) tags.push('desconto')
    
    return [...new Set(tags)] // Remove duplicatas
  }

  // Encontrar tickets similares
  private findSimilarTickets(description: string, platform: EcommercePlatform): string[] {
    const keywords = description.toLowerCase().split(' ').filter(word => word.length > 3)
    
    return tickets
      .filter(t => t.platform === platform)
      .filter(t => {
        const ticketText = `${t.title} ${t.description}`.toLowerCase()
        return keywords.some(keyword => ticketText.includes(keyword))
      })
      .slice(0, 3)
      .map(t => t.id)
  }

  // Sugerir responsável baseado na categoria e plataforma
  private suggestAssignee(category: TicketCategory, platform: EcommercePlatform): string | null {
    // Em produção, isso viria de uma base de dados de especialistas
    if (platform === 'vtex' && (category === 'checkout-payment' || category === 'products-catalog')) {
      return 'lucas.vtex@agenciafg.com.br' // Especialista VTEX
    }
    
    if (category === 'design-frontend') {
      return 'ana.frontend@agenciafg.com.br' // Designer/Frontend
    }
    
    if (category === 'performance') {
      return 'carlos.devops@agenciafg.com.br' // DevOps/Performance
    }
    
    return null // Irá para fila geral
  }
}

// Instância singleton
export const ticketService = new TicketService()