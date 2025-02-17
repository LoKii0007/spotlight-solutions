import { PrismaAdapter } from "@auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth/next"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials):Promise<any> {
        try {
          if (!credentials?.email || !credentials?.password) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

          }
  
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          });
  
          if (!user || !user?.password) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
          }
  
          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
  
          if (!isCorrectPassword) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
          }

          if(!user.emailVerified){
            return NextResponse.json({ error: "Please verify your email" }, { status: 401 });
          }
  
          return user
        } catch (error) {
          console.log(error)
          return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }
      }
    })

  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.emailVerified = user.emailVerified
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 