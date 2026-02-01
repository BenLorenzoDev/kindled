import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./db"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session({ session, token }) {
      // Add user ID to session for database queries
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      if (session.user && token.email) {
        session.user.email = token.email
      }
      return session
    },
    async jwt({ token, user }) {
      // Persist user info in the token
      if (user?.id) {
        token.sub = user.id
      }
      if (user?.email) {
        token.email = user.email
      }
      return token
    },
  },
})
