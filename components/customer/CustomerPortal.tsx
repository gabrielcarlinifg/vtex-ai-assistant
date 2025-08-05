'use client'

import { useState, useEffect } from 'react'
import { Plus, Ticket, Clock, AlertCircle, CheckCircle, User, Building, Globe } from 'lucide-react'
import { CreateTicketModal } from './CreateTicketModal'
import { TicketCard } from './TicketCard'
import { Ticket as TicketType, Client } from '../../lib/types'
import { PLATFORM_CONFIGS } from '../../lib/platforms'

// Simulação de cliente logado (em produção vem da sessão)
const mockClient: Client = {
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
}

export function CustomerPortal() {
  const [tickets, setTickets] = useState<TicketType[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'resolved'>('all')

  const client = mockClient
  const platformConfig = PLATFORM_CONFIGS[client.platform]

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      // Em produção: filtrar por clientId
      const response = await fetch('/api/tickets')
      const data = await response.json()
      setTickets(data.tickets || [])
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTicketCreated = (newTicket: TicketType) => {
    setTickets(prev => [newTicket, ...prev])
    setIsCreateModalOpen(false)
  }

  const filteredTickets = tickets.filter(ticket => {
    if (activeTab === 'open') return ['open', 'in-progress', 'waiting-client'].includes(ticket.status)
    if (activeTab === 'resolved') return ['resolved', 'closed'].includes(ticket.status)
    return true
  })

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => ['open', 'in-progress', 'waiting-client'].includes(t.status)).length,
    resolved: tickets.filter(t => ['resolved', 'closed'].includes(t.status)).length,
    critical: tickets.filter(t => t.priority === 'critical' && !['resolved', 'closed'].includes(t.status)).length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando portal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Building className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Portal de Suporte</h1>
                  <p className="text-sm text-gray-600">Agência FG - Suporte Técnico</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{client.name}</p>
                <p className="text-sm text-gray-600">{client.company}</p>
              </div>
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Client Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div 
                className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl"
                style={{ backgroundColor: platformConfig.color + '20', color: platformConfig.color }}
              >
                {platformConfig.icon}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{client.company}</h2>
                <p className="text-gray-600 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  {platformConfig.displayName} • {client.plan.toUpperCase()}
                </p>
                <p className="text-sm text-gray-500">{client.storeUrl}</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Novo Chamado
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total de Chamados</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
              <Ticket className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Em Aberto</p>
                <p className="text-2xl font-semibold text-yellow-600">{stats.open}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Críticos</p>
                <p className="text-2xl font-semibold text-red-600">{stats.critical}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Resolvidos</p>
                <p className="text-2xl font-semibold text-green-600">{stats.resolved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'all', name: 'Todos', count: stats.total },
                { id: 'open', name: 'Em Aberto', count: stats.open },
                { id: 'resolved', name: 'Resolvidos', count: stats.resolved }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                >
                  {tab.name}
                  <span className={`${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900'
                  } inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tickets List */}
          <div className="p-6">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12">
                <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === 'all' ? 'Nenhum chamado encontrado' : 
                   activeTab === 'open' ? 'Nenhum chamado em aberto' : 
                   'Nenhum chamado resolvido'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === 'all' ? 'Clique no botão acima para criar seu primeiro chamado.' : 
                   'Chamados aparecerão aqui conforme forem criados.'}
                </p>
                {activeTab === 'all' && (
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Criar Primeiro Chamado
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <TicketCard 
                    key={ticket.id} 
                    ticket={ticket}
                    client={client}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {isCreateModalOpen && (
        <CreateTicketModal
          client={client}
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onTicketCreated={handleTicketCreated}
        />
      )}
    </div>
  )
}