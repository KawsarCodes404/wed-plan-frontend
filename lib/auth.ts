import { betterAuth } from "better-auth"
import { jwt } from "better-auth/plugins"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { getOAuthState } from "better-auth/api"

const MONGODB_HOSTS =
  "ac-tfbmyvt-shard-00-00.drmhua0.mongodb.net:27017,ac-tfbmyvt-shard-00-01.drmhua0.mongodb.net:27017,ac-tfbmyvt-shard-00-02.drmhua0.mongodb.net:27017"
const MONGODB_REPLICA_SET = "atlas-ggve46-shard-0"

// MongoClient validates its URI during module evaluation. Next.js imports this
// module while collecting route data, when deployment-only env vars may not be
// available yet. Keep the client constructible during the build; deployments
// must still provide BETTER_AUTH_DB_URI for database-backed auth requests.
function getDatabaseUri() {
  const { DB_USER, DB_PASSWORD } = process.env

  if (DB_USER && DB_PASSWORD) {
    return `mongodb://${encodeURIComponent(DB_USER)}:${encodeURIComponent(DB_PASSWORD)}@${MONGODB_HOSTS}/?ssl=true&replicaSet=${encodeURIComponent(MONGODB_REPLICA_SET)}&authSource=admin`
  }

  return process.env.BETTER_AUTH_DB_URI ?? "mongodb://127.0.0.1:27017"
}

const mongoGlobal = globalThis as typeof globalThis & {
  mongoClient?: MongoClient
}
const client = mongoGlobal.mongoClient ?? new MongoClient(getDatabaseUri())
mongoGlobal.mongoClient = client
export const db = client.db("wed-plan")

export async function connectAuthDatabase() {
  await client.connect()
}

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

export async function getAuthSession(headers: Headers) {
  await connectAuthDatabase()
  return auth.api.getSession({ headers })
}

export async function getAuthToken(headers: Headers) {
  await connectAuthDatabase()
  return auth.api.getToken({ headers })
}
