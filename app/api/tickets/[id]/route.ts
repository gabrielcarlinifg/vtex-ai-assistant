import { NextRequest, NextResponse } from 'next/server'
import { ticketService } from '../../../../lib/ticket-service'

// GET /api/tickets/[id] - Buscar ticket específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticket = ticketService.getTicket(params.id)
    
    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      )
    }
    
    // Buscar mensagens do ticket
    const messages = ticketService.getTicketMessages(params.id, false)
    
    // Buscar dados do cliente
    const client = ticketService.getClient(ticket.clientId)
    
    return NextResponse.json({
      ticket,
      messages,
      client
    })
    
  } catch (error) {
    console.error('Error fetching ticket:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ticket' },
      { status: 500 }
    )
  }
}

// PUT /api/tickets/[id] - Atualizar ticket
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const updatedTicket = await ticketService.updateTicket(params.id, body)
    
    if (!updatedTicket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      ticket: updatedTicket,
      message: 'Ticket updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating ticket:', error)
    return NextResponse.json(
      { error: 'Failed to update ticket' },
      { status: 500 }
    )
  }
}