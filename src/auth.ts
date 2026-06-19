import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { db } from '@/lib/db'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
    }
  }
}

const ALLOWED_EMAILS = process.env.ALLOWED_EMAILS?.split(',').map((e) => e.trim()) ?? []

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false
      if (ALLOWED_EMAILS.length > 0 && !ALLOWED_EMAILS.includes(user.email)) return false

      await db
        .insertInto('users')
        .values({
          email: user.email,
          name: user.name ?? null,
          image: user.image ?? null,
        })
        .onConflict((oc) =>
          oc.column('email').doUpdateSet({
            name: user.name ?? null,
            image: user.image ?? null,
          })
        )
        .execute()

      return true
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await db
          .selectFrom('users')
          .where('email', '=', user.email)
          .select(['id'])
          .executeTakeFirst()
        token.dbUserId = dbUser?.id
      }
      return token
    },
    async session({ session, token }) {
      if (token.dbUserId) {
        session.user.id = token.dbUserId as string
      }
      return session
    },
  },
})
