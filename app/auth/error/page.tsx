'use client'

import { AlertTriangle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AuthError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Acesso Negado
        </h1>
        
        <p className="text-gray-600 mb-6">
          Apenas colaboradores da Agência FG com email <strong>@agenciafg.com.br</strong> podem acessar este sistema.
        </p>
        
        <Link 
          href="/auth/signin"
          className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tentar Novamente</span>
        </Link>
      </div>
    </div>
  )
}