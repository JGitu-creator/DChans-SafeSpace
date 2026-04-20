import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const WHITELISTED_EMAILS = [
  "chanhadassah@gmail.com",
  "chantalhadassah22@gmail.com",
  "phidotaxis@gmail.com" // Adding yours so you can test it too
];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: any }) {
      if (WHITELISTED_EMAILS.includes(user.email)) {
        return true;
      }
      return false; // Access Denied for everyone else
    },
  },
  pages: {
    signIn: '/', // Custom sign-in page
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
