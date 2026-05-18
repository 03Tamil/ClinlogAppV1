import { gql, GraphQLClient } from "graphql-request";
import jwt_decode, { JwtPayload } from "jwt-decode";
import AES from "crypto-js/aes";
import { enc } from "crypto-js";

export function getJwtToken() {
  return sessionStorage.getItem("jwt");
}

export function setJwtToken(token) {
  sessionStorage.setItem("jwt", token);
}

export function getRefreshToken() {
  return sessionStorage.getItem("refreshToken");
}

export function setRefreshToken(token) {
  sessionStorage.setItem("refreshToken", token);
}

export function isTokenValidOrUndefined() {
  const token = getJwtToken();

  // If there is no token, the user is not logged in
  // We return true here, because there is no need to refresh the token
  if (!token) return true;

  // Otherwise, we check if the token is expired
  const claims: JwtPayload = jwt_decode(token);
  const expirationTimeInSeconds = claims.exp * 1000;
  const now = new Date();
  const isValid = expirationTimeInSeconds >= now.getTime();

  // Return true if the token is still valid, otherwise false and trigger a token refresh
  return isValid;
}

export async function refreshTokens(router) {
  const refresh = gql`
    mutation RefreshToken($refreshToken: String) {
      refreshToken(refreshToken: $refreshToken) {
        jwt
        jwtExpiresAt
        refreshToken
        refreshTokenExpiresAt
      }
    }
  `;
  const graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_ENDPOINT, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  try {
    const data: any = await graphQLClient.request(refresh, {
      refreshToken: getRefreshToken(),
    });
    if (data?.refreshToken != null) {
      setJwtToken(data.refreshToken.jwt);
      setRefreshToken(data.refreshToken.refreshToken);
    }
  } catch (error) {
    console.log("errors have arrived");
    router.push("/signout");
  }
}

export const encryptId = (str: string | number) => {
  const ciphertext = AES.encrypt(String(str), "VvZGCwjj3EbBaFQJbXW912");
  return encodeURIComponent(ciphertext.toString());
};

export const decryptId = (str: string | number) => {
  const decodedStr = decodeURIComponent(String(str));
  return AES.decrypt(decodedStr, "VvZGCwjj3EbBaFQJbXW912").toString(enc.Utf8);
};
