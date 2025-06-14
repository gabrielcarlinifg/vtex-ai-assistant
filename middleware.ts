import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // Verificar se está nas rotas protegidas
  if (request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/api/chat')) {
    const token = await getToken({ req: request })
    
    // Se não tem token, redirecionar para login
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
    
    // Se tem token mas email não é @agenciafg.com.br, redirecionar para erro
    if (!token.email?.endsWith('@agenciafg.com.br')) {
      return NextResponse.redirect(new URL('/auth/error', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/api/chat/:path*']
}