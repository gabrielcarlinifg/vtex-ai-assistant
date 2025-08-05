import { NextRequest, NextResponse } from 'next/server'
import { ticketService } from '../../../../../lib/ticket-service'

// GET /api/tickets/[id]/messages - Buscar mensagens do ticket
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const includeInternal = searchParams.get('includeInternal') === 'true'
    
    const messages = ticketService.getTicketMessages(params.id, includeInternal)
    
    return NextResponse.json({
      messages,
      total: messages.length
    })
    
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// POST /api/tickets/[id]/messages - Adicionar nova mensagem
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Validações
    if (!body.content || !body.authorId || !body.authorType) {
      return NextResponse.json(
        { error: 'Missing required fields: content, authorId, authorType' },
        { status: 400 }
      )
    }
    
    const message = await ticketService.addMessage({
      ticketId: params.id,
      authorId: body.authorId,
      authorType: body.authorType,
      content: body.content,
      isInternal: body.isInternal || false
    })
    
    return NextResponse.json({
      message,
      success: true
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error adding message:', error)
    return NextResponse.json(
      { error: 'Failed to add message' },
      { status: 500 }
    )
  }
}