import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
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
      // Ensure user email is available in session for whitelist checking
      if (session.user && token.email) {
        session.user.email = token.email
      }
      return session
    },
    async jwt({ token, user }) {
      // Persist user email in the token
      if (user?.email) {
        token.email = user.email
      }
      return token
    },
  },
})
