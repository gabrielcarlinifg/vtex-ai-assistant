'use client'

import { useState } from 'react'
import { X, Send, AlertCircle, HelpCircle } from 'lucide-react'
import { Client, TicketCategory, TicketPriority, Ticket } from '../../lib/types'
import { PLATFORM_CONFIGS, CATEGORY_INFO } from '../../lib/platforms'

interface CreateTicketModalProps {
  client: Client
  isOpen: boolean
  onClose: () => void
  onTicketCreated: (ticket: Ticket) => void
}

export function CreateTicketModal({ client, isOpen, onClose, onTicketCreated }: CreateTicketModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as TicketCategory | '',
    priority: '' as TicketPriority | ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const platformConfig = PLATFORM_CONFIGS[client.platform]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Título e descrição são obrigatórios')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: client.id,
          title: formData.title,
          description: formData.description,
          category: formData.category || undefined,
          priority: formData.priority || undefined,
          source: 'portal'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar chamado')
      }

      onTicketCreated(data.ticket)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: ''
      })
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
              style={{ backgroundColor: platformConfig.color + '20', color: platformConfig.color }}
            >
              {platformConfig.icon}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Novo Chamado</h2>
              <p className="text-sm text-gray-600">{platformConfig.displayName} • {client.company}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Erro ao criar chamado</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título do Problema *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Checkout não está funcionando"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
              required
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria (Opcional)
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as TicketCategory }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="">🤖 Deixar IA detectar automaticamente</option>
              {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                <option key={key} value={key}>
                  {info.icon} {info.displayName}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Nossa IA irá detectar automaticamente a categoria se você não selecionar
            </p>
          </div>

          {/* Prioridade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prioridade (Opcional)
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as TicketPriority }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="">🤖 Deixar IA determinar automaticamente</option>
              <option value="low">🟢 Baixa - Dúvidas, melhorias</option>
              <option value="medium">🟡 Média - Problemas que não afetam vendas</option>
              <option value="high">🟠 Alta - Problemas que podem afetar vendas</option>
              <option value="critical">🔴 Crítica - Site parado, sem vendas</option>
            </select>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição Detalhada *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o problema em detalhes:&#10;&#10;• O que estava fazendo quando o problema ocorreu?&#10;• Qual erro ou comportamento inesperado você observou?&#10;• Em qual página/seção do site isso acontece?&#10;• O problema afeta todos os usuários ou apenas alguns?&#10;• Há alguma mensagem de erro específica?"
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={loading}
              required
            />
          </div>

          {/* Problemas comuns da plataforma */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">
                  Problemas comuns no {platformConfig.displayName}
                </h3>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  {platformConfig.commonIssues.map((issue) => (
                    <li key={issue} className="flex items-center space-x-2">
                      <span className="text-xs">•</span>
                      <span>{CATEGORY_INFO[issue].displayName}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !formData.title.trim() || !formData.description.trim()}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Criando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Criar Chamado
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}