import { useEffect } from "react"
import { useRouter } from "next/router"
import { QueryCache, QueryClient, useQueryClient } from "@tanstack/react-query"
import { signOut } from "next-auth/react"
import FullscreenLoadingSpinner from "components/FullscreenLoadingSpinner"
import { gql, GraphQLClient } from "graphql-request"

function SignOut() {
  const router = useRouter()
  const queryClient = useQueryClient()
  useEffect(() => {
    signOut({ redirect: false })
    // Finally, redirect the user to the home page
    queryClient.removeQueries()
    queryClient.clear()
    localStorage.removeItem("dashboardTabPage")
    router.push("/pagesv2/")
  }, [router])

  return <FullscreenLoadingSpinner />
}

export default SignOut
