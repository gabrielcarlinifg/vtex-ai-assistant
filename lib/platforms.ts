import { EcommercePlatform, PlatformInfo, TicketCategory } from './types'

export const PLATFORM_CONFIGS: Record<EcommercePlatform, PlatformInfo> = {
  'vtex': {
    platform: 'vtex',
    displayName: 'VTEX',
    color: '#FF006E',
    icon: '🏪',
    commonIssues: ['checkout-payment', 'products-catalog', 'inventory-stock', 'integrations'],
    apis: [
      'https://developers.vtex.com/docs/api-reference',
      'https://developers.vtex.com/docs/guides/catalog-api-overview',
      'https://developers.vtex.com/docs/guides/checkout-api-overview'
    ],
    documentation: [
      'https://help.vtex.com/pt',
      'https://developers.vtex.com'
    ]
  },
  
  'wake': {
    platform: 'wake',
    displayName: 'Wake Commerce',
    color: '#00D4FF',
    icon: '⚡',
    commonIssues: ['checkout-payment', 'performance', 'design-frontend', 'integrations'],
    documentation: [
      'https://wake.com.br/ajuda',
      'https://developers.wake.com.br'
    ]
  },
  
  'linx-commerce': {
    platform: 'linx-commerce',
    displayName: 'Linx Commerce',
    color: '#FF8C00',
    icon: '🔗',
    commonIssues: ['products-catalog', 'integrations', 'inventory-stock', 'performance'],
    documentation: [
      'https://ajuda.linxcommerce.com.br',
      'https://developers.linxcommerce.com.br'
    ]
  },
  
  'shopify': {
    platform: 'shopify',
    displayName: 'Shopify',
    color: '#96BF48',
    icon: '🛒',
    commonIssues: ['design-frontend', 'checkout-payment', 'integrations', 'seo-marketing'],
    apis: [
      'https://shopify.dev/docs/api',
      'https://shopify.dev/docs/admin-api/rest/reference'
    ],
    documentation: [
      'https://help.shopify.com',
      'https://shopify.dev'
    ]
  },
  
  'uappi': {
    platform: 'uappi',
    displayName: 'Uappi',
    color: '#7B68EE',
    icon: '📱',
    commonIssues: ['checkout-payment', 'integrations', 'performance', 'design-frontend'],
    documentation: [
      'https://uappi.com.br/ajuda'
    ]
  },
  
  'nuvemshop': {
    platform: 'nuvemshop',
    displayName: 'Nuvemshop',
    color: '#4ECDC4',
    icon: '☁️',
    commonIssues: ['design-frontend', 'checkout-payment', 'products-catalog', 'seo-marketing'],
    apis: [
      'https://developers.nuvemshop.com.br/docs/api'
    ],
    documentation: [
      'https://ajuda.nuvemshop.com.br',
      'https://developers.nuvemshop.com.br'
    ]
  },
  
  'loja-integrada': {
    platform: 'loja-integrada',
    displayName: 'Loja Integrada',
    color: '#FF6B6B',
    icon: '🎯',
    commonIssues: ['products-catalog', 'integrations', 'checkout-payment', 'inventory-stock'],
    apis: [
      'https://developers.lojaintegrada.com.br'
    ],
    documentation: [
      'https://ajuda.lojaintegrada.com.br',
      'https://developers.lojaintegrada.com.br'
    ]
  },
  
  'wordpress': {
    platform: 'wordpress',
    displayName: 'WordPress/WooCommerce',
    color: '#21759B',
    icon: '📝',
    commonIssues: ['security', 'performance', 'design-frontend', 'integrations'],
    documentation: [
      'https://woocommerce.com/documentation/',
      'https://developer.wordpress.org'
    ]
  }
}

export const CATEGORY_INFO: Record<TicketCategory, {
  displayName: string
  icon: string
  description: string
  typicalSeverity: 'low' | 'medium' | 'high' | 'critical'
  estimatedTime: string
}> = {
  'checkout-payment': {
    displayName: 'Checkout & Pagamentos',
    icon: '💳',
    description: 'Problemas que impedem finalização de compras',
    typicalSeverity: 'critical',
    estimatedTime: '1-4 horas'
  },
  'products-catalog': {
    displayName: 'Produtos & Catálogo',
    icon: '📦',
    description: 'Produtos não aparecem, informações incorretas',
    typicalSeverity: 'high',
    estimatedTime: '2-6 horas'
  },
  'inventory-stock': {
    displayName: 'Estoque & Inventário',
    icon: '📊',
    description: 'Problemas de quantidade, disponibilidade',
    typicalSeverity: 'medium',
    estimatedTime: '1-3 horas'
  },
  'performance': {
    displayName: 'Performance',
    icon: '⚡',
    description: 'Site lento, tempo de carregamento',
    typicalSeverity: 'high',
    estimatedTime: '4-8 horas'
  },
  'integrations': {
    displayName: 'Integrações',
    icon: '🔗',
    description: 'APIs, webhooks, sistemas externos',
    typicalSeverity: 'medium',
    estimatedTime: '2-12 horas'
  },
  'design-frontend': {
    displayName: 'Design & Frontend',
    icon: '🎨',
    description: 'Layout, aparência, responsividade',
    typicalSeverity: 'medium',
    estimatedTime: '4-16 horas'
  },
  'seo-marketing': {
    displayName: 'SEO & Marketing',
    icon: '📈',
    description: 'Otimizações, analytics, campanhas',
    typicalSeverity: 'low',
    estimatedTime: '2-8 horas'
  },
  'security': {
    displayName: 'Segurança',
    icon: '🔒',
    description: 'Vulnerabilidades, certificados, LGPD',
    typicalSeverity: 'high',
    estimatedTime: '1-6 horas'
  },
  'general': {
    displayName: 'Geral',
    icon: '❓',
    description: 'Dúvidas, configurações, outros',
    typicalSeverity: 'low',
    estimatedTime: '30min-2 horas'
  }
}

// Detector automático de plataforma baseado na URL
export function detectPlatform(storeUrl: string): EcommercePlatform | null {
  const url = storeUrl.toLowerCase()
  
  // VTEX
  if (url.includes('.vtexcommercestable.com') || url.includes('.vtexassets.com')) {
    return 'vtex'
  }
  
  // Wake
  if (url.includes('.wakecommerce.') || url.includes('wake.com.br')) {
    return 'wake'
  }
  
  // Shopify
  if (url.includes('.myshopify.com') || url.includes('shopifypreview.com')) {
    return 'shopify'
  }
  
  // Nuvemshop
  if (url.includes('.mitiendanube.com') || url.includes('.nuvemshop.com.br')) {
    return 'nuvemshop'
  }
  
  // Loja Integrada
  if (url.includes('.lojaintegrada.com.br')) {
    return 'loja-integrada'
  }
  
  // WordPress (detectar via padrões comuns)
  if (url.includes('/wp-content/') || url.includes('/wp-admin/')) {
    return 'wordpress'
  }
  
  return null
}

// Sugestões específicas por plataforma
export function getPlatformSuggestions(platform: EcommercePlatform, category: TicketCategory): string[] {
  const config = PLATFORM_CONFIGS[platform]
  const suggestions: string[] = []
  
  if (platform === 'vtex') {
    switch (category) {
      case 'checkout-payment':
        suggestions.push(
          'Verificar configurações de pagamento no Admin VTEX',
          'Testar checkout em modo de desenvolvimento',
          'Analisar logs de transações'
        )
        break
      case 'products-catalog':
        suggestions.push(
          'Verificar indexação do produto',
          'Confirmar preço e estoque ativos',
          'Validar categoria e especificações'
        )
        break
    }
  }
  
  if (platform === 'shopify') {
    switch (category) {
      case 'design-frontend':
        suggestions.push(
          'Verificar tema atual e customizações',
          'Testar responsividade em dispositivos',
          'Revisar código Liquid personalizado'
        )
        break
    }
  }
  
  return suggestions
}