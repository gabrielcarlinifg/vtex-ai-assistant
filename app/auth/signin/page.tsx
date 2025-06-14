'use client'

import { signIn } from 'next-auth/react'
import { Bot, Shield, Users, Zap } from 'lucide-react'

export default function SignIn() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Assistente IA VTEX
          </h1>
          <p className="text-gray-600">
            FG Solutions - Suporte Técnico Especializado
          </p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Acesso Restrito
            </h2>
            <p className="text-gray-600 text-sm">
              Faça login com sua conta da Agência FG
            </p>
          </div>

          {/* Botão de Login Fixo */}
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full bg-white border-2 border-gray-200 rounded-xl px-6 py-4 flex items-center justify-center space-x-3 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-medium text-gray-700 group-hover:text-blue-700">
              Continuar com Google
            </span>
          </button>

          {/* Informações de Segurança */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center mb-4">
              Acesso restrito à equipe da Agência FG
            </p>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <Shield className="w-4 h-4 text-blue-500 mb-1" />
                <span className="text-xs text-gray-600">Seguro</span>
              </div>
              <div className="flex flex-col items-center">
                <Users className="w-4 h-4 text-green-500 mb-1" />
                <span className="text-xs text-gray-600">Equipe FG</span>
              </div>
              <div className="flex flex-col items-center">
                <Zap className="w-4 h-4 text-yellow-500 mb-1" />
                <span className="text-xs text-gray-600">IA Híbrida</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Assistente especializado em VTEX • Baseado em developers.vtex.com + help.vtex.com
          </p>
        </div>
      </div>
    </div>
  )
}