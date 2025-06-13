import { NextRequest, NextResponse } from 'next/server'
import { VTEXAIEngine } from '../../../lib/vtex-ai-engine'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const aiEngine = new VTEXAIEngine()
    const response = await aiEngine.getHybridResponse(message)
    
    // Log da consulta
    aiEngine.logQuery(message, response)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error',
      response: 'Desculpe, ocorreu um erro interno. Tente novamente em alguns instantes.',
      source: 'error'
    }, { status: 500 })
  }
}