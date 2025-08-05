'use client'

import { Clock, MessageCircle, User, AlertCircle, CheckCircle, Eye } from 'lucide-react'
import { Ticket, Client } from '../../lib/types'
import { PLATFORM_CONFIGS, CATEGORY_INFO } from '../../lib/platforms'

interface TicketCardProps {
  ticket: Ticket
  client: Client
}

export function TicketCard({ ticket, client }: TicketCardProps) {
  const categoryInfo = CATEGORY_INFO[ticket.category]
  const platformConfig = PLATFORM_CONFIGS[client.platform]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800'
      case 'in-progress': return 'bg-purple-100 text-purple-800'
      case 'waiting-client': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Aberto'
      case 'in-progress': return 'Em Andamento'
      case 'waiting-client': return 'Aguardando Cliente'
      case 'resolved': return 'Resolvido'
      case 'closed': return 'Fechado'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4" />
      case 'in-progress': return <Clock className="w-4 h-4" />
      case 'waiting-client': return <User className="w-4 h-4" />
      case 'resolved': 
      case 'closed': return <CheckCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  const timeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Agora mesmo'
    if (diffInHours < 24) return `${diffInHours}h atrás`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d atrás`
    
    return formatDate(date)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <span className="text-lg">{categoryInfo.icon}</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {ticket.title}
                </h3>
                <p className="text-sm text-gray-600">#{ticket.id}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority.toUpperCase()}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(ticket.status)}`}>
                {getStatusIcon(ticket.status)}
                {getStatusText(ticket.status)}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-sm mb-4 line-clamp-2">
            {ticket.description}
          </p>

          {/* Metadata */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center gap-1">
                <span className="text-base">{categoryInfo.icon}</span>
                {categoryInfo.displayName}
              </span>
              
              {ticket.estimatedResolution && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {ticket.estimatedResolution}
                </span>
              )}
              
              {ticket.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  {ticket.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                  {ticket.tags.length > 2 && (
                    <span className="text-xs text-gray-400">+{ticket.tags.length - 2}</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {ticket.assignedTo && (
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Atribuído
                </span>
              )}
              
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                0 respostas
              </span>
              
              <span title={formatDate(ticket.createdAt)}>
                {timeAgo(ticket.createdAt)}
              </span>
            </div>
          </div>

          {/* AI Suggestion Preview */}
          {ticket.suggestedSolution && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">🤖</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-800 mb-1">
                    Sugestão Automática da IA
                  </p>
                  <p className="text-sm text-blue-700 line-clamp-2">
                    {ticket.suggestedSolution.substring(0, 150)}...
                  </p>
                  <button className="text-xs text-blue-600 hover:text-blue-800 mt-1 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Ver resposta completa
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}