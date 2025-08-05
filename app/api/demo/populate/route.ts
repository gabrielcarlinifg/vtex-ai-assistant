import { NextRequest, NextResponse } from 'next/server'
import { ticketService } from '../../../../lib/ticket-service'

export async function POST(request: NextRequest) {
  try {
    // Criar alguns tickets de exemplo
    const sampleTickets = [
      {
        clientId: 'client-1',
        title: 'Checkout com erro no PIX',
        description: 'Os clientes não conseguem finalizar as compras usando PIX. O erro aparece na etapa final do checkout, mostrando "Erro interno do servidor". Isso está impactando as vendas desde ontem.',
        category: 'checkout-payment' as const,
        priority: 'critical' as const,
        source: 'email' as const
      },
      {
        clientId: 'client-1', 
        title: 'Produtos não aparecem na busca',
        description: 'Alguns produtos do catálogo não estão aparecendo quando o cliente faz busca. Verificamos que o produto está ativo e com estoque, mas não aparece nos resultados.',
        category: 'products-catalog' as const,
        source: 'portal' as const
      },
      {
        clientId: 'client-2',
        title: 'Site muito lento no mobile',
        description: 'O site está demorando mais de 10 segundos para carregar no celular. Os clientes estão reclamando e abandonando o carrinho. PageSpeed mostra score de 20.',
        category: 'performance' as const,
        priority: 'high' as const,
        source: 'whatsapp' as const
      },
      {
        clientId: 'client-2',
        title: 'Integração com ERP falhando',
        description: 'A sincronização de estoque com nosso ERP parou de funcionar há 2 dias. Os produtos estão ficando sem estoque no site mesmo tendo no depósito.',
        category: 'integrations' as const,
        priority: 'high' as const,
        source: 'portal' as const
      },
      {
        clientId: 'client-1',
        title: 'Dúvida sobre SEO',
        description: 'Gostaria de saber como melhorar o SEO da categoria de eletrônicos. Vocês podem me ajudar com as meta tags e estrutura das páginas?',
        category: 'seo-marketing' as const,
        priority: 'low' as const,
        source: 'email' as const
      }
    ]

    const createdTickets = []
    
    for (const ticketData of sampleTickets) {
      try {
        const ticket = await ticketService.createTicket(ticketData)
        createdTickets.push(ticket)
        
        // Adicionar algumas atualizações de status
        if (createdTickets.length > 2) {
          await ticketService.updateTicket(ticket.id, { 
            status: 'in-progress',
            assignedTo: 'lucas.vtex@agenciafg.com.br'
          })
        }
        
        if (createdTickets.length === 5) {
          await ticketService.updateTicket(ticket.id, { 
            status: 'resolved',
            resolvedAt: new Date()
          })
        }
        
      } catch (error) {
        console.error('Error creating sample ticket:', error)
      }
    }

    return NextResponse.json({
      message: 'Sample data created successfully',
      created: createdTickets.length,
      tickets: createdTickets.map(t => ({ id: t.id, title: t.title }))
    })

  } catch (error) {
    console.error('Error populating demo data:', error)
    return NextResponse.json(
      { error: 'Failed to populate demo data' },
      { status: 500 }
    )
  }
}