import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Middleware funcionando
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return token?.email?.endsWith('@agenciafg.com.br') ?? false
      },
    },
  }
)

export const config = {
  matcher: ['/', '/api/chat/:path*']
}