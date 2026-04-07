// @ts-nocheck
import { gql, GraphQLClient } from "graphql-request";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt_decode from "jwt-decode";
import { getCookie, setCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import moize from "moize";
import { logger } from "utils/logger";
import { userIdByemailQuery } from "helpers/queries";
const graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_ENDPOINT, {
  headers: {
    "Content-Type": "application/json",
  },
});
const graphQLClientForLog = new GraphQLClient(
  process.env.NEXT_PUBLIC_ENDPOINT,
  {
    headers: {
      Authorization: process.env.NEXT_PUBLIC_TOKEN,
    },
  },
);
const logInMutation = gql`
  mutation Authenticate($email: String!, $password: String!) {
    authenticate(email: $email, password: $password) {
      jwt
      jwtExpiresAt
      refreshToken
      refreshTokenExpiresAt
      user {
        id
        fullName
      }
    }
  }
`;

const sendMagicLink = gql`
  mutation SendMagicLink($email: String!, $password: String!) {
    sendMagicLink(email: $email, password: $password)
  }
`;

const magicLinkLogIn = gql`
  mutation VerifyMagicCode($email: String!, $code: Int!) {
    verifyMagicCode(code: $code, email: $email) {
      jwt
      jwtExpiresAt
      refreshToken
      refreshTokenExpiresAt
      user {
        id
        fullName
        email
      }
    }
  }
`;
const logInMutation2 = gql`
  mutation Authenticate2($email: Int!) {
    authenticateWithId(altId: $email) {
      jwt
      jwtExpiresAt
      refreshToken
      refreshTokenExpiresAt
      user {
        id
        fullName
      }
    }
  }
`;

const refreshMutation = gql`
  mutation RefreshToken($refreshToken: String) {
    refreshToken(refreshToken: $refreshToken) {
      jwt
      jwtExpiresAt
      refreshToken
      refreshTokenExpiresAt
    }
  }
`;

export const refreshTokenAPI = moize(
  async (token) => {
    try {
      process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
      // Get a new set of tokens with a refreshToken
      const tokenResponse: any = await graphQLClient.request(refreshMutation, {
        refreshToken: token.refreshToken,
      });
      process.env.NODE_ENV === "development" && console.log(tokenResponse);
      return {
        ...token,
        accessToken: tokenResponse.refreshToken.jwt,
        accessTokenExpiresAt: tokenResponse.refreshToken.jwtExpiresAt,
        refreshToken: tokenResponse.refreshToken.refreshToken,
      };
    } catch (error) {
      process.env.NODE_ENV === "development" && console.log(error);
      return {
        ...token,
        error: "Error",
      };
    }
  },
  {
    maxAge: 1000 * 8,
    matchesKey: (cachedKey: any[], key: any[]) => {
      if (!!cachedKey?.[0]?.user?.id && !!key?.[0]?.user?.id) {
        if (cachedKey?.[0]?.user?.id === key?.[0]?.user?.id) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    },
  },
);

type userAuth = {
  jwt: string;
  jwtExpiresAt: any;
  refreshToken: string;
  refreshTokenExpiresAt: any;
  user: any;
};

const nextAuthOptions = (req, res) => {
  return {
    pages: {
      signIn: "/",
    },
    providers: [
      CredentialsProvider({
        id: "credentials",
        name: "Credentials",
        //@ts-ignore
        async authorize(credentials: any) {
          // return user
          process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
          if (credentials.kinda === "impersonate") {
            if (credentials.groups.includes("Admin")) {
              const graphQLClient2 = new GraphQLClient(
                process.env.NEXT_PUBLIC_ENDPOINT,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `JWT ${credentials.accessToken}`,
                  },
                },
              );
              // try {
              //   const user = await graphQLClient2.request(logInMutation2, {
              //     email: Number(credentials.email),
              //   })
              // } catch (err) {
              //   console.log(err)
              // }
              // const user = await graphQLClient2.request(logInMutation2, {
              //   email: Number(credentials.email),
              // })
              let user;
              const adminData: {
                iss: string;
                iat: any;
                exp: any;
                sub: string;
              } = jwt_decode(credentials.accessToken as string);
              const adminId = adminData?.sub;
              try {
                user = await graphQLClient2.request(logInMutation2, {
                  email: Number(credentials.email),
                });
              } catch (err) {
                logger(
                  adminId,
                  "ERROR",
                  "sc-admin-action",
                  `${adminId} attempted to log in as user with invalid user id  ${credentials.email}.`,
                );
              }
              const userData = user.authenticateWithId;
              if (user) {
                logger(
                  adminId,
                  "INFO",
                  "sc-admin-action",
                  `${adminId} logged in as user ${userData?.user?.id} for testing purpose.`,
                );

                return {
                  accessToken: userData.jwt,
                  user: userData.user,
                  refreshToken: userData.refreshToken,
                  accessTokenExpiresAt: userData.jwtExpiresAt,
                };
              }
              res.status(200).json({ message: "sent magic link to email" });
              return null;
            }
          }
          let user;
          let isVerified = false;
          let secondBlock =
            credentials.type === "magicLinkSignIn" ? true : false;
          const twoFactorSucessExists = getCookie("random-key", { req, res });

          try {
            const { email } = jwt.verify(
              twoFactorSucessExists,
              `rcrcRh2+CeJEtPS59GO5JCVfDPHQ/8ovadEc6VqFDfQ=`,
            );
            if (email === credentials.email) {
              isVerified = true;
            }
          } catch (err) {}
          if (!secondBlock) {
            try {
              user = await graphQLClient.request(logInMutation, {
                email: credentials.email,
                password: credentials.password,
              });
              const userData = user.authenticate;
              const decodedData: {
                locationId: number;
                locationIds: number[];
                groups: string[];
              } = jwt_decode(userData.jwt as string);
              if (
                !isVerified &&
                //add more user groups here to enable 2fa for them, who has it
                decodedData?.groups?.some((role) =>
                  [
                    "Admin",
                    "Overseer",
                    "Receptionist",
                    "Treatment Coordinator",
                  ].includes(role),
                )
              ) {
                secondBlock = true;
              } else {
                if (user) {
                  logger(
                    userData?.user?.id,
                    "INFO",
                    "sc-user-login",
                    "SmileConnect - User login successful.",
                  );
                  return {
                    accessToken: userData.jwt,
                    user: userData.user,
                    refreshToken: userData.refreshToken,
                    accessTokenExpiresAt: userData.jwtExpiresAt,
                  };
                }
              }
              // return null
            } catch (err) {
              const fullVariables = { email: credentials.email };
              const user: any = await graphQLClientForLog.request(
                userIdByemailQuery,
                fullVariables,
              );
              if (user?.user?.id) {
                logger(
                  user?.user?.id,
                  "ERROR",
                  "sc-login-failure",
                  `Failed login attempt for user ${user?.user?.id} - Incorrect password.`,
                );
              } else {
                logger(
                  0,
                  "ERROR",
                  "sc-login-failure",
                  `Failed login attempt for user - Incorrect username.`,
                );
              }
            }
          }
          if (secondBlock) {
            //if cookie does exist log in regular log in else send magic link, and then auto login
            try {
              if (credentials.type === "magicLinkSignIn") {
                user = await graphQLClient.request(magicLinkLogIn, {
                  email: credentials.email,
                  // password: credentials.password,
                  code: Number(credentials.password),
                });
                const userData = user.verifyMagicCode;

                const sessionToken = jwt.sign(
                  { email: userData.user.email },
                  "rcrcRh2+CeJEtPS59GO5JCVfDPHQ/8ovadEc6VqFDfQ=",
                  {
                    expiresIn: "7 days",
                  },
                );
                setCookie("random-key", sessionToken, {
                  secure: true,
                  httpOnly: true,
                  sameSite: "strict",
                  req,
                  res,
                  maxAge: 60 * 60 * 24 * 7,
                });

                if (user) {
                  logger(
                    userData?.user?.id,
                    "INFO",
                    "sc-user-login",
                    "SmileConnect- User login successful.",
                  );
                  return {
                    accessToken: userData.jwt,
                    user: userData.user,
                    refreshToken: userData.refreshToken,
                    accessTokenExpiresAt: userData.jwtExpiresAt,
                  };
                }
              } else if (credentials.type === "ignore") {
                try {
                  user = await graphQLClient.request(logInMutation, {
                    email: credentials.email,
                    password: credentials.password,
                  });

                  const userData = user.authenticate;
                  if (user) {
                    logger(
                      userData?.user?.id,
                      "INFO",
                      "sc-user-login",
                      "SmileConnect- User login successful.",
                    );
                    return {
                      accessToken: userData.jwt,
                      user: userData.user,
                      refreshToken: userData.refreshToken,
                      accessTokenExpiresAt: userData.jwtExpiresAt,
                    };
                  }
                } catch (err) {
                  const fullVariables = { email: credentials.email };
                  const user: any = await graphQLClientForLog.request(
                    userIdByemailQuery,
                    fullVariables,
                  );
                  if (user?.user?.id) {
                    logger(
                      user?.user?.id,
                      "ERROR",
                      "sc-login-failure",
                      `Failed login attempt for user ${user?.user?.id} - Incorrect password.`,
                    );
                  } else {
                    logger(
                      0,
                      "ERROR",
                      "sc-login-failure",
                      `Failed login attempt for user - Incorrect username.`,
                    );
                  }
                  throw new Error(err.message);
                }
              } else {
                try {
                  user = await graphQLClient.request(sendMagicLink, {
                    email: credentials.email,
                    password: credentials.password,
                  });

                  throw new Error(
                    `sent magic link to email id=${user?.sendMagicLink}`,
                  ); // This one
                } catch (err) {
                  throw new Error(err);
                }
              }
            } catch (err) {
              throw new Error(err.message);
            }
          }

          // try {
          //   user = await graphQLClient.request(magicLinkLogIn, {
          //     email: credentials.email,
          //     // password: credentials.password,
          //     code: Number(credentials.password),
          //   })
          // } catch (err) {}

          // try {
          // user = await graphQLClient.request(logInMutation, {
          //   email: credentials.email,
          //   password: credentials.password,
          // })
          // } catch (err) {}
          // user = await graphQLClient.request(logInMutation, {
          //   email: credentials.email,
          //   // password: credentials.password,
          //   code: Number(credentials.password),
          // })
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user, account, profile }) {
        if (user) {
          token.accessToken = user.accessToken;
          token.user = user.user;
          token.refreshToken = user.refreshToken;
          token.accessTokenExpiresAt = user.accessTokenExpiresAt;
        }

        const shouldRefreshTime = Math.round(
          (token.accessTokenExpiresAt as number) - Date.now() - 1000 * 60 * 30,
        );
        // If the token is still valid, just return it.
        if (shouldRefreshTime > 0) {
          return Promise.resolve(token);
        }

        async function refreshAccessToken(tokenObject) {
          let retryCount = 0;
          try {
            process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
            // Get a new set of tokens with a refreshToken
            const tokenResponse: any = await graphQLClient.request(
              refreshMutation,
              {
                refreshToken: token.refreshToken,
              },
            );
            // process.env.NODE_ENV === "development" && console.log(tokenResponse)
            return {
              ...tokenObject,
              accessToken: tokenResponse.refreshToken.jwt,
              accessTokenExpiresAt: tokenResponse.refreshToken.jwtExpiresAt,
              refreshToken: tokenResponse.refreshToken.refreshToken,
            };
          } catch (error) {
            process.env.NODE_ENV === "development" && console.log(error);
            return {
              ...tokenObject,
              error: "RefreshAccessTokenError",
            };
          }
        }
        // If the call arrives after 23 hours have passed, we allow to refresh the token.
        // const refreshToken = await refreshAccessToken(token)
        const refreshToken = await refreshTokenAPI(token);
        if (!!refreshToken) {
          if (!!refreshToken?.user?.id && !!token?.user?.id) {
            if (refreshToken?.user?.id === token?.user?.id) {
              token = refreshToken;
            } else {
              token = token;
            }
          }
          token = token;
        }
        return Promise.resolve(token);
      },

      async session({ session, token }) {
        const decodedData: {
          locationId: number;
          locationIds: number[];
          groups: string[];
        } = jwt_decode(token.accessToken as string);

        session.groups = decodedData.groups?.length ? decodedData.groups : [];
        session.accessTokenExpiresAt = token.accessTokenExpiresAt;
        //session.locationId = decodedData.locationId
        session.locationIds = decodedData.locationIds;
        session.accessToken = token.accessToken;
        session.userId = Number(token.user["id"]);
        session.fullName = token.user["fullName"];
        session.error = token.error;

        return session;
      },
    },
    secret: "rcrcRh2+CeJEtPS59GO5JCVfDPHQ/8ovadEc6VqFDfQ=",
    session: {
      strategy: "jwt",
      maxAge: 60 * 60,
    },
  };
};

export default (req, res) => {
  //@ts-ignore
  return NextAuth(req, res, nextAuthOptions(req, res));
};
