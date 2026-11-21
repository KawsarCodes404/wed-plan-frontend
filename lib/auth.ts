import { betterAuth } from "better-auth"
import { jwt } from "better-auth/plugins"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { getOAuthState } from "better-auth/api"

const client = new MongoClient(process.env.BETTER_AUTH_DB_URI as string)
export const db = client.db("wed-plan")

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  user: {
    additionalFields: {
      role: {
        type: ["admin", "customer", "vendor"],
        input: true,
        defaultValue: "customer",
        returned: true,
      },
      // Read-only compatibility for users created before role-based sign-up.
      accountType: {
        type: "string",
        required: false,
        input: false,
        returned: true,
      },
      businessName: {
        type: "string",
        required: false,
        input: false,
        returned: true,
      },
      location: {
        type: "string",
        required: false,
        input: false,
        returned: true,
      },
      bio: { type: "string", required: false, input: false, returned: true },
      subscriptionPlan: {
        type: "string",
        required: false,
        input: false,
        returned: true,
        defaultValue: "Free",
      },
      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
        returned: true,
      },
      isBlocked: {
        type: "boolean",
        required: false,
        input: false,
        returned: true,
        defaultValue: false,
      },
    },
  },
  // The public sign-up form may choose customer or vendor, never admin.
  // Enforce that rule here as well as in the UI so a forged request cannot
  // create an administrator account.
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const oauthState = await getOAuthState()
          return {
            data: {
              ...user,
              role:
                user.role === "vendor" || oauthState?.role === "vendor"
                  ? "vendor"
                  : "customer",
            },
          }
        },
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
  plugins: [
    jwt({
      jwt: {
        definePayload: ({ user }) => ({
          role: user.role,
        }),
      },
    }),
  ],
})
