import { NextRequest, NextResponse } from 'next/server'
import { ticketService } from '../../../lib/ticket-service'
import { TicketFilters } from '../../../lib/types'

// GET /api/tickets - Listar tickets com filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Construir filtros a partir dos query params
    const filters: TicketFilters = {}
    
    if (searchParams.get('status')) {
      filters.status = searchParams.get('status')!.split(',') as any[]
    }
    
    if (searchParams.get('priority')) {
      filters.priority = searchParams.get('priority')!.split(',') as any[]
    }
    
    if (searchParams.get('category')) {
      filters.category = searchParams.get('category')!.split(',') as any[]
    }
    
    if (searchParams.get('platform')) {
      filters.platform = searchParams.get('platform')!.split(',') as any[]
    }
    
    if (searchParams.get('assignedTo')) {
      filters.assignedTo = searchParams.get('assignedTo')!.split(',')
    }
    
    if (searchParams.get('search')) {
      filters.search = searchParams.get('search')!
    }
    
    // Filtros de data
    if (searchParams.get('startDate') && searchParams.get('endDate')) {
      filters.dateRange = {
        start: new Date(searchParams.get('startDate')!),
        end: new Date(searchParams.get('endDate')!)
      }
    }
    
    const tickets = ticketService.getTickets(filters)
    
    return NextResponse.json({
      tickets,
      total: tickets.length,
      filters: filters
    })
    
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    )
  }
}

// POST /api/tickets - Criar novo ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validações básicas
    if (!body.title || !body.description || !body.clientId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, clientId' },
        { status: 400 }
      )
    }
    
    const ticket = await ticketService.createTicket({
      clientId: body.clientId,
      title: body.title,
      description: body.description,
      category: body.category,
      priority: body.priority,
      source: body.source || 'portal'
    })
    
    return NextResponse.json({
      ticket,
      message: 'Ticket created successfully'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating ticket:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to create ticket'
      },
      { status: 500 }
    )
  }
}