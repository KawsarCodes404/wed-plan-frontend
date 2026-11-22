import { auth, connectAuthDatabase } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js";

const authHandlers = toNextJsHandler(auth)

export async function GET(request: Request) {
  await connectAuthDatabase()
  return authHandlers.GET(request)
}

export async function POST(request: Request) {
  await connectAuthDatabase()
  return authHandlers.POST(request)
}
