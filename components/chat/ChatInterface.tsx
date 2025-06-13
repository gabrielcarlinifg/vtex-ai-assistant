'use client'

import { useState } from 'react'
import { Send, Bot, User } from 'lucide-react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setLoading(true)

    try {
      // Chamar API híbrida (local + IA)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput })
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || 'Desculpe, não consegui processar sua consulta.',
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '❌ Erro de conexão. Verifique sua internet e tente novamente.',
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Assistente IA VTEX</h1>
            <p className="text-blue-100">FG IA Lab - Suporte Técnico IA Vtex</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-700">Assistente IA VTEX Híbrido</h2>
            <p className="text-lg mb-6">Base local + Inteligência Artificial real</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto text-sm">
              <div className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
                <strong>🛍️ Produtos</strong><br />
                &quot;Produto não aparece no site&quot;
              </div>
              <div className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
                <strong>🔐 APIs</strong><br />
                &quot;Erro 401 unauthorized&quot;
              </div>
              <div className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
                <strong>💳 Checkout</strong><br />
               &quot;Problemas no pagamento&quot;
              </div>
              <div className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
                <strong>📦 Estoque</strong><br />
                &quot;Como configurar inventory&quot;
              </div>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-4 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-6 h-6 text-white" />
              </div>
            )}
            
            <div
              className={`max-w-3xl p-4 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white rounded-br-md'
                  : 'bg-white text-gray-900 shadow-sm border rounded-bl-md'
              }`}
            >
              <div className={`prose prose-sm max-w-none ${
                message.role === 'user' ? 'prose-invert' : ''
              }`}>
                {message.content.split('\n').map((line, index) => (
                  <div key={index}>
                    {line.startsWith('**') && line.endsWith('**') ? (
                      <h3 className="font-bold text-lg mb-2 mt-3">{line.slice(2, -2)}</h3>
                    ) : line.startsWith('•') ? (
                      <li className="ml-4">{line.slice(2)}</li>
                    ) : line.startsWith('`') && line.endsWith('`') ? (
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {line.slice(1, -1)}
                      </code>
                    ) : line.trim() ? (
                      <p className="mb-2">{line}</p>
                    ) : (
                      <br />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>

            {message.role === 'user' && (
              <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-bl-md p-4 border shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t bg-white p-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Digite sua pergunta sobre VTEX..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            <Send className="w-5 h-5" />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">
          🤖 IA Híbrida: Base local rápida + OpenAI • Baseado em developers.vtex.com + help.vtex.com
        </div>
      </div>
    </div>
  )
}