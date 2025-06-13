import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Só permitir emails @fg.com.br
      if (user.email?.endsWith('@agenciafg.com.br')) {
        console.log(`Login autorizado: ${user.email}`)
        return true
      }
      console.log(`Login negado: ${user.email}`)
      return false
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: getUserRole(session.user?.email || ''),
        }
      }
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  }
})

function getUserRole(email: string): 'admin' | 'developer' | 'support' {
  if (email.includes('admin') || email.includes('gerente')) return 'admin'
  if (email.includes('dev') || email.includes('developer')) return 'developer'
  return 'support'
}

export { handler as GET, handler as POST }