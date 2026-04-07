import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    userId: number
    fullName: string
    accessTokenExpiresAt
    error
    accessToken
    refreshToken
    //locationId
    locationIds
    groups
  }
  interface JWT {
    id: number
    fullName: string
    accessToken: string
    refreshToken: string
    accessTokenExpiresAt: number
  }
  interface User {
    accessToken: string
    user: any
    refreshToken: string
    accessTokenExpiresAt: number
  }
}
