// Sistema de tipos para suporte multi-plataforma
export type EcommercePlatform = 
  | 'vtex'
  | 'wake' 
  | 'linx-commerce'
  | 'shopify'
  | 'uappi'
  | 'nuvemshop'
  | 'loja-integrada'
  | 'wordpress'

export type TicketPriority = 'critical' | 'high' | 'medium' | 'low'
export type TicketStatus = 'open' | 'in-progress' | 'waiting-client' | 'resolved' | 'closed'
export type TicketCategory = 
  | 'checkout-payment'
  | 'products-catalog' 
  | 'inventory-stock'
  | 'performance'
  | 'integrations'
  | 'design-frontend'
  | 'seo-marketing'
  | 'security'
  | 'general'

export type ChannelSource = 'portal' | 'email' | 'whatsapp' | 'widget' | 'phone'

export interface Client {
  id: string
  name: string
  email: string
  company: string
  platform: EcommercePlatform
  storeUrl: string
  phone?: string
  timezone: string
  plan: 'basic' | 'premium' | 'enterprise'
  createdAt: Date
  lastActivity: Date
}

export interface Ticket {
  id: string
  clientId: string
  title: string
  description: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  source: ChannelSource
  platform: EcommercePlatform
  
  // Assignee
  assignedTo?: string
  assignedAt?: Date
  
  // Timing
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
  
  // Metadata
  tags: string[]
  estimatedResolution?: string
  actualResolution?: string
  
  // Attachments
  attachments: TicketAttachment[]
  
  // Auto-detection
  detectedIssue?: string
  suggestedSolution?: string
  similarTickets?: string[]
}

export interface TicketAttachment {
  id: string
  filename: string
  url: string
  size: number
  type: string
  uploadedAt: Date
}

export interface TicketMessage {
  id: string
  ticketId: string
  authorId: string
  authorType: 'client' | 'agent' | 'system'
  content: string
  isInternal: boolean
  createdAt: Date
  attachments?: TicketAttachment[]
}

export interface PlatformInfo {
  platform: EcommercePlatform
  displayName: string
  color: string
  icon: string
  commonIssues: TicketCategory[]
  apis?: string[]
  documentation?: string[]
}

export interface TicketFilters {
  status?: TicketStatus[]
  priority?: TicketPriority[]
  category?: TicketCategory[]
  platform?: EcommercePlatform[]
  assignedTo?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  search?: string
}

export interface DashboardMetrics {
  totalTickets: number
  openTickets: number
  criticalTickets: number
  avgResolutionTime: number
  clientSatisfaction: number
  byPlatform: Record<EcommercePlatform, number>
  byCategory: Record<TicketCategory, number>
  recentActivity: TicketMessage[]
}