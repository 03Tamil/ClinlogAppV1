import { Flex } from "@chakra-ui/react"
import { useV2Router } from "componentsv2/Dashboard/Helpers/routerHelpers"
import React, { useEffect } from "react"
import sha256 from "crypto-js/sha256"
import Base64 from "crypto-js/enc-base64"

const code_verifier = process.env.CODE_VERIFIER
const clientId = process.env.CLIENT_ID
const redirectUrl = process.env.REDIRECT_URL

export default function Connection() {
  const router = useV2Router()
  const { code, state } = router.query

  useEffect(() => {
    const getInvoices = async () => {
      let details = {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUrl,
        client_id: clientId,
        code_verifier: code_verifier,
      }
      let formBody = []
      for (let property in details) {
        let encodedKey = encodeURIComponent(property)
        let encodedValue = encodeURIComponent(details[property])
        formBody.push(encodedKey + "=" + encodedValue)
      }
      //@ts-ignore
      formBody = formBody.join("&")
      const foundToken = await fetch(
        "https://identity.xero.com/connect/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          //@ts-ignore
          body: formBody,
        }
      )
      const tokenSet = await foundToken.json()
      //authCode

      const result2 = await fetch("/api/xero/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tokenSet: tokenSet,
        }),
      })
      const result3 = await result2.json()
    }

    if (code) {
      try {
        // const authCodeArgument = getTokenSet()
        getInvoices()
      } catch (err) {
        console.log(err)
      }
    }
  }, [code])
  return <Flex h="90vh">You have logged in you can close this tab now</Flex>
}

Connection.auth = {
  role: "Business Manager",
}
