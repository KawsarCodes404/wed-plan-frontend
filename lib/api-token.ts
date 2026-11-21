import { authClient } from "@/lib/auth-client"

export async function getApiToken() {
  const { data, error } = await authClient.token()
  if (error || !data) return null
  return data.token
}
