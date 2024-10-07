import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { JWT } from "next-auth/jwt";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number; // Menambahkan tipe untuk properti exp
}

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}login`,
            {
              username: credentials?.username,
              password: credentials?.password,
            }
          );

          const user = res.data;

          if (user) {
            return user;
          } else {
            console.error("Login gagal: pengguna tidak ditemukan");
            return null;
          }
        } catch (error) {
          console.error("Error saat login:", error);
          return null;
        }
      },
    }),
  ],
  debug: true,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.accessToken = user.access_token;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      session.accessToken = token.accessToken;
      const decodedToken = jwtDecode<DecodedToken>(String(token.accessToken));

      if (decodedToken.exp) {
        const expiresAt = new Date(decodedToken.exp * 1000).getTime();
        const currentTime = new Date().getTime();

        if (expiresAt < currentTime) {
          session.accessToken = null;
          session.expires = null;
          session.isAuthenticated = false;
        } else {
          session.expires = expiresAt.toString();
          session.isAuthenticated = true;
        }
      } else {
        session.isAuthenticated = false;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
